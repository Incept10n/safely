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

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: false,
	}))

	global.DB = database.Connect()

	r.GET("/health", httpHandler.HealthCheck)
	r.POST("/api/register", httpHandler.Register)
	r.POST("/api/login", httpHandler.Login)

	r.GET("/api/ws", httpHandler.WebsocketConnection)

	err := global.DB.AutoMigrate(&database.User{}, &database.PersonalChat{})
	if err != nil {
		panic("failed to migrate database")
	}

	authorized := r.Group("/api")
	authorized.Use(tools.AuthMiddleware())
	{
		authorized.GET("/chats", httpHandler.GetChatsuserId)
		authorized.POST("/createchat", httpHandler.CreateChat)
		authorized.GET("/chat/:chatid", httpHandler.GetChatMessages)
		authorized.GET("/:userid", httpHandler.GetuserId)
	}

	if err := r.Run(); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
