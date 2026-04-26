package services

import (
	"errors"
	"net/http"
	"safelyBackend/internal/database"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleGetChatMessages(db *gorm.DB, c *gin.Context) {
	userID, _ := c.Get("user_id")

	chatID := c.Param("chatid")

	chatIDUint, err := strconv.ParseUint(chatID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid chat ID",
		})
		return
	}

	var chat database.PersonalChat
	result := db.Where("id = ? AND (user1 = ? OR user2 = ?)",
		uint(chatIDUint), userID, userID).
		First(&chat)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "Chat not found or you don't have access",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Database error occurred",
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"chat_id":  chat.ID,
		"user1":    chat.User1,
		"user2":    chat.User2,
		"messages": chat.Messages,
	})
}
