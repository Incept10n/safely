package services

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"safelyBackend/internal/database"
	"strings"

	"github.com/gorilla/websocket"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Для тестирования
		},
	}
	chatRooms   = make(map[uint][]*websocket.Conn) // map[chatID][]connections
	connections = make(map[*websocket.Conn]string) // map[connection]userID для отслеживания соединений
)

type IncomingMessage struct {
	ChatID   uint   `json:"chatId"`
	Content  string `json:"content"`
	SenderID string `json:"senderId"`
}

type OutgoingMessage struct {
	ChatID   uint   `json:"chatId"`
	Content  string `json:"content"`
	SenderID string `json:"senderId"`
}

func HandleWebsocketConnection(db *gorm.DB, c *gin.Context) {
	conn, err_1 := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err_1 != nil {
		log.Println("WebSocket upgrade error:", err_1)
		return
	}
	defer func() {
		// Удаляем соединение при закрытии
		removeConnection(conn)
		conn.Close()
		fmt.Println("Websocket connection closed")
	}()

	// Получаем userID из запроса
	userId := c.Query("userid")
	if userId == "" {
		conn.WriteMessage(websocket.TextMessage, []byte("userID required"))
		return
	}

	ctx := context.Background()

	// Проверка JWT токена
	authHeader := c.GetHeader("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	partsJWT := strings.Split(tokenString, ".")
	payload := partsJWT[1]
	var decodedPayload []byte
	var err_2 error
	for i := 0; i < 3; i++ {
		decodedPayload, err_2 = base64.StdEncoding.DecodeString(payload)
		if err_2 != nil {
			payload += "="
			continue
		}
		break
	}

	if err_2 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "not ok", "error": err_2.Error()})
		return
	}

	partsPayload := strings.Split(string(decodedPayload), `"`)
	userIdJwt := partsPayload[6]
	userIdJwtFormated := userIdJwt[1 : len(userIdJwt)-1]
	if userIdJwtFormated != userId {
		conn.WriteMessage(websocket.TextMessage, []byte("error: wrong userid"))
		return
	}

	connections[conn] = userId
	chats, _ := gorm.G[database.PersonalChat](db).Where("user1 = ? OR user2 = ?", userId, userId).Find(ctx)

	// 2. Подписываем пользователя на чаты (добавляем в комнаты)
	for _, chat := range chats {
		chatRooms[chat.ID] = append(chatRooms[chat.ID], conn)
		log.Printf("User %s connected to chat %d", userId, chat.ID)
	}

	// Обрабатываем входящие сообщения
	for {
		_, msgBytes, err_3 := conn.ReadMessage()
		if err_3 != nil {
			log.Println("Read error:", err_3)
			break
		}

		var incomingMsg IncomingMessage
		if err_4 := json.Unmarshal(msgBytes, &incomingMsg); err_4 != nil {
			log.Printf("Error unmarshaling message: %v", err_4)
			conn.WriteMessage(websocket.TextMessage, []byte("Invalid message format"))
			continue
		}

		// Проверяем валидность сообщения
		if err_5 := validateAndProcessMessage(db, ctx, conn, incomingMsg, userId); err_5 != nil {
			conn.WriteMessage(websocket.TextMessage, []byte(err_5.Error()))
			continue
		}
	}
}

func validateAndProcessMessage(db *gorm.DB, ctx context.Context, conn *websocket.Conn, msg IncomingMessage, userId string) error {
	// Проверяем, что отправитель - текущий пользователь
	if msg.SenderID != userId {
		return fmt.Errorf("sender ID mismatch")
	}

	// Проверяем существование чата
	var chat database.PersonalChat
	if err_6 := db.Where("id = ? AND (user1 = ? OR user2 = ?)", msg.ChatID, userId, userId).First(&chat).Error; err_6 != nil {
		return fmt.Errorf("chat not found or access denied")
	}

	// Сохраняем сообщение в базу данных
	messageInDb := chat.Messages
	if len(messageInDb) >= 2 {
		messageInDbCut := messageInDb[1 : len(messageInDb)-1]
		fmt.Println(messageInDbCut)
	}

	// Подготавливаем сообщение для отправки
	outgoingMsg := OutgoingMessage{
		ChatID:   msg.ChatID,
		Content:  msg.Content,
		SenderID: msg.SenderID,
	}

	// message := ChatMessage{
	// 	Sender:    msg.SenderID,
	// 	Message:   messageInDbCut + "," + outgoingMsg,
	// 	Timestamp: time.Now().UTC(),
	// }
	// if err := db.Create(&message).Error; err != nil {
	// 	return fmt.Errorf("failed to save message: %v", err)
	// }

	// Отправляем сообщение всем подписчикам чата
	broadcastMessage(msg.ChatID, outgoingMsg)

	return nil
}

func broadcastMessage(chatID uint, msg OutgoingMessage) {
	connectionsToSend := chatRooms[chatID]

	msgBytes, err_6 := json.Marshal(msg)
	if err_6 != nil {
		log.Printf("Error marshaling message: %v", err_6)
		return
	}

	// Отправляем сообщение всем подключенным клиентам в комнате
	for _, conn := range connectionsToSend {
		err_7 := conn.WriteMessage(websocket.TextMessage, msgBytes)
		if err_7 != nil {
			log.Printf("Error sending message to client: %v", err_7)
			// Удаляем "мертвые" соединения
			removeConnection(conn)
		}
	}
}

func removeConnection(conn *websocket.Conn) {
	// Удаляем соединение из всех комнат
	for chatID, connections := range chatRooms {
		for i, c := range connections {
			if c == conn {
				// Удаляем соединение из слайса
				chatRooms[chatID] = append(connections[:i], connections[i+1:]...)
				break
			}
		}
	}

	// Удаляем из общего списка соединений
	delete(connections, conn)
}
