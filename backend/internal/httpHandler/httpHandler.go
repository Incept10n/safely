package httpHandler

import (
	"net/http"
	"safelyBackend/internal/global"
	"safelyBackend/internal/services"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func Register(c *gin.Context) {
	var reqBodyJson services.RegisterStruct

	if err := c.ShouldBindJSON(&reqBodyJson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "not ok", "error": err.Error()})
		return
	}

	services.HandleRegister(reqBodyJson, global.DB, c)
}

// func Login(c *gin.Context) {
// 	var reqBodyJson services.Login

// 	if err := c.ShouldBindJSON(&reqBodyJson); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"status": "not ok", "error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"status": "ok"})
// }

// func GetuserId(c *gin.Context) {
// 	// TODO: Extract user ID from JWT token or session
// 	// This is a placeholder implementation
// 	userId := "12345" // Replace with actual user ID retrieval logic

// 	c.JSON(http.StatusOK, gin.H{"userid": userId})
// }
