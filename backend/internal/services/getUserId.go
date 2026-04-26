package services

import (
	"errors"
	"net/http"
	"safelyBackend/internal/database"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleGetuserId(db *gorm.DB, c *gin.Context) {
	userIdStr := c.Param("userid")

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Invalid user ID format",
		})
		return
	}

	var user database.User
	result := db.Where("id = ?", uint(userId)).First(&user)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "User not found",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "Database error occurred",
				"error":   result.Error.Error(),
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"nonce":   user.Nonce,
		"user_id": user.ID,
		"name":    user.Name,
	})
}
