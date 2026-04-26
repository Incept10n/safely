package services

import (
	"net/http"
	"safelyBackend/internal/database"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleGetChatsuserId(db *gorm.DB, c *gin.Context) {
	userID, _ := c.Get("user_id")

	var chats []database.PersonalChat

	result := db.Where("user1 = ? OR user2 = ?", userID, userID).Find(&chats)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"chats":  mapPersonalChatsToResponse(chats),
	})
}

func mapPersonalChatsToResponse(chats []database.PersonalChat) []map[string]interface{} {
	var response []map[string]interface{}

	for _, chat := range chats {
		response = append(response, map[string]interface{}{
			"ID":       chat.ID,
			"User1":    chat.User1,
			"User2":    chat.User2,
			"Messages": chat.Messages,
		})
	}

	return response
}
