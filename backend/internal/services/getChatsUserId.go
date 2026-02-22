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

func HandleGetChatsuserId(db *gorm.DB, c *gin.Context) {

	userId := c.Query("userid")

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

	chats, err := gorm.G[database.PersonalChat](db).Where("user1 = ? OR user2 = ?", userId, userId).First(ctx)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"status":   "success",
			"chat_id":  chats.ID,
			"user1":    chats.User1,
			"user2":    chats.User2,
			"messages": chats.Messages,
		})
		return
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "database error occurred",
			"error":   err.Error(),
		})
		return
	}
}
