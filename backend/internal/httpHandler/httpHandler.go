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

func Login(c *gin.Context) {
	var reqBodyJson services.LoginStruct

	if err := c.ShouldBindJSON(&reqBodyJson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "not ok", "error": err.Error()})
		return
	}

	services.HandleLogin(reqBodyJson, global.DB, c)

}

func GetuserId(c *gin.Context) {

	services.HandleGetuserId(global.DB, c)
}

func GetChatsuserId(c *gin.Context) {

	services.HandleGetChatsuserId(global.DB, c)
}

func CreateChat(c *gin.Context) {
	var reqBodyJson services.CreateChatStruct

	if err := c.ShouldBindJSON(&reqBodyJson); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "not ok", "error": err.Error()})
		return
	}

	services.HandleCreateChat(reqBodyJson, global.DB, c)
}
