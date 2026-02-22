package main

import (
	"log"
	"safelyBackend/internal/database"
	"safelyBackend/internal/global"
	"safelyBackend/internal/httpHandler"
	"safelyBackend/tools"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	global.DB = database.Connect()

	r.GET("/health", httpHandler.HealthCheck)
	r.POST("/api/register", httpHandler.Register)
	r.POST("/api/login", httpHandler.Login)
	// r.GET("/api/userid", httpHandler.GetuserId)

	authorized := r.Group("/")
	authorized.Use(tools.AuthMiddleware())
	{
		//authorized.GET("/api/userid", httpHandler.GetuserId)
	}

	if err := r.Run(); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
