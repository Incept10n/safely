package services

import (
	"context"
	"encoding/base64"
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
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer func() {
		// Удаляем соединение при закрытии
		conn.Close()
	}()
	defer conn.Close()

	// Получаем userID из запроса (например, через query параметр)
	userId := c.Query("userid")
	if userId == "" {
		conn.WriteMessage(websocket.TextMessage, []byte("userID required"))
		return
	}

	ctx := context.Background()

	authHeader := c.GetHeader("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	partsJWT := strings.Split(tokenString, ".")
	payload := partsJWT[1]
	decodedPayload, err := base64.StdEncoding.DecodeString(payload)

	if err != nil {
		fmt.Errorf("failed to decode payload: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "not ok", "error": err})
		return
	}

	partsPayload := strings.Split(string(decodedPayload), `"`)
	userIdJwt := partsPayload[6]
	userIdJwtFormated := userIdJwt[1 : len(userIdJwt)-1]
	if userIdJwtFormated != userId {
		c.JSON(http.StatusForbidden, gin.H{"status": "not ok", "error": "wrong userid"})
		return
	}

	chats, err := gorm.G[database.PersonalChat](db).Where("user1 = ? OR user2 = ?", userId, userId).Find(ctx)

	// 2. Подписываем пользователя на чаты (добавляем в комнаты)
	for _, chat := range chats {
		chatRooms[chat.ID] = append(chatRooms[chat.ID], conn)
		log.Printf("User connected to chat %d", chat.ID)
	}

	// Просто держим соединение открытым
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		log.Printf("Received: %s", msg)
	}
}
