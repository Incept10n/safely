package services

import (
	"errors"
	"net/http"
	"safelyBackend/internal/database"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleCreateChat(reqBodyJson CreateChatStruct, db *gorm.DB, c *gin.Context) {
	userIDValue, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "error", "error": "Unauthorized"})
		return
	}

	senderId := userIDValue.(uint)

	nonce := reqBodyJson.Nonce

	var nonceUser database.User
	result := db.Where("nonce = ?", nonce).First(&nonceUser)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"status": "error", "error": "User with provided nonce does not exist"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "error": "Database error"})
		}
		return
	}

	var existingChat database.PersonalChat
	result = db.Where("(user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)",
		senderId, nonceUser.ID, nonceUser.ID, senderId).
		First(&existingChat)

	if result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"status": "error", "error": "Chat already exists"})
		return
	}

	chatToCreate := database.PersonalChat{
		User1:    senderId,
		User2:    nonceUser.ID,
		Messages: "[]",
	}

	result = db.Create(&chatToCreate)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "error": "Could not create chat"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success", "chat_id": chatToCreate.ID})
}
