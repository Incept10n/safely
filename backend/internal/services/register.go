package services

import (
	"context"
	"fmt"
	"safelyBackend/internal/database"

	"gorm.io/gorm"
)

func HandleRegister(reqBodyJson RegisterStruct, db *gorm.DB) {
	login := reqBodyJson.Login
	password := reqBodyJson.Password

	ctx := context.Background()

	// need to implement hashing and put hashed pass into db
	// need to implement nonce creation
	// return not 200 when error adding user

	nonce := "12345"

	user := database.User{Name: login, Password: password, Nonce: nonce}

	result := gorm.WithResult()
	if err := gorm.G[database.User](db, result).Create(ctx, &user); err != nil {
		fmt.Println("Error creating user:", err)
	}
}
