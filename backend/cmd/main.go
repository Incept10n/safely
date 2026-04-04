package main

import (
	"log"
	"safelyBackend/internal/database"
	"safelyBackend/internal/global"
	"safelyBackend/internal/httpHandler"
	"safelyBackend/tools"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	global.DB = database.Connect()

	r.GET("/health", httpHandler.HealthCheck)
	r.POST("/api/register", httpHandler.Register)
	r.POST("/api/login", httpHandler.Login)

	err := global.DB.AutoMigrate(&database.User{}, &database.PersonalChat{})
	if err != nil {
		panic("failed to migrate database")
	}

	authorized := r.Group("/")
	authorized.Use(tools.AuthMiddleware())
	{
		authorized.GET("/api/chats", httpHandler.GetChatsuserId)
		authorized.POST("/api/create-chat", httpHandler.CreateChat)
		authorized.GET("/api/chat/:chatid", httpHandler.GetChatMessages)
		authorized.GET("/api/:userid", httpHandler.GetuserId)
		authorized.GET("/api/ws", httpHandler.WebsocketConnection)
	}

	if err := r.Run(); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
