package services

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"safelyBackend/internal/database"
	"safelyBackend/tools"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleRegister(reqBodyJson RegisterStruct, db *gorm.DB, c *gin.Context) {
	login := reqBodyJson.Login
	password := reqBodyJson.Password
	hashedPassword, _ := tools.HashPassword(password)

	ctx := context.Background()

	nonce := fmt.Sprintf("%010d", rand.Intn(10000000000))

	user := database.User{Name: login, Password: hashedPassword, Nonce: nonce}

	result := gorm.WithResult()

	_, err := gorm.G[database.User](db).Where("name = ?", login).First(ctx)

	if err == nil {
		fmt.Printf("The user with name %s exist\n", login)
		c.JSON(http.StatusConflict, gin.H{"status": "the user already exists"})
		return
	}

	if err := gorm.G[database.User](db, result).Create(ctx, &user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "internal server error, could not create a user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
