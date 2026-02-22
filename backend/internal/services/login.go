package services

import (
	"context"
	"fmt"
	"net/http"
	"safelyBackend/internal/database"
	"safelyBackend/tools"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleLogin(reqBodyJson LoginStruct, db *gorm.DB, c *gin.Context) {
	login := reqBodyJson.Login
	password := reqBodyJson.Password

	ctx := context.Background()

	user, err := gorm.G[database.User](db).Where("name = ?", login).First(ctx)

	if err != nil {
		fmt.Printf("The user with name %s not found\n", login)
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"status": "user not found"})
		return
	}

	if !tools.CheckPasswordHash(password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"status": "incorrect user or password"})
		return
	}

	token, err := tools.GenerateJWT(user.Name, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"token":  token,
		"user": gin.H{
			"id":   user.ID,
			"name": user.Name,
		},
	})
}
