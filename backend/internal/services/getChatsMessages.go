package services

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"safelyBackend/internal/database"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleGetChatMessages(db *gorm.DB, c *gin.Context) {

	chatid := c.Param("chatid")
	fmt.Println(chatid)
	fmt.Println("////////////")

	ctx := context.Background()

	authHeader := c.GetHeader("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	partsJWT := strings.Split(tokenString, ".")
	payload := partsJWT[1]
	decodedPayload, err_1 := base64.StdEncoding.DecodeString(payload)

	if err_1 != nil {
		fmt.Errorf("failed to decode payload: %v", err_1)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "not ok", "error": err_1})
		return
	}

	partsPayload := strings.Split(string(decodedPayload), `"`)
	userIdJwt := partsPayload[6]
	userIdJwtFormated := userIdJwt[1 : len(userIdJwt)-1]

	chat, err_2 := gorm.G[database.PersonalChat](db).Where("(id = ? AND user1 = ?) OR (id = ? AND user2 = ?)", chatid, userIdJwtFormated, chatid, userIdJwtFormated).First(ctx)

	if err_2 == nil {
		c.JSON(http.StatusOK, gin.H{
			"status":   "success",
			"chat_id":  chat.ID,
			"user1":    chat.User1,
			"user2":    chat.User2,
			"messages": chat.Messages,
		})
		return
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "database error occurred",
			"error":   err_2.Error(),
		})
		return
	}
}
