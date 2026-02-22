package services

import (
	"context"
	"errors"
	"net/http"
	"safelyBackend/internal/database"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleGetuserId(db *gorm.DB, c *gin.Context) {

	userId := c.Param("userid")

	ctx := context.Background()

	user, err := gorm.G[database.User](db).Where("id = ?", userId).First(ctx)

	if err == nil {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"nonce":   user.Nonce,
			"user_id": user.ID,
		})
		return
	} else {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"status":  "error",
				"message": "user not found",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"status":  "error",
				"message": "database error occurred",
				"error":   err.Error(),
			})
		}
	}
}
