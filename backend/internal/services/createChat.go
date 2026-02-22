package services

import (
	"context"
	"net/http"
	"safelyBackend/internal/database"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func HandleCreateChat(reqBodyJson CreateChatStruct, db *gorm.DB, c *gin.Context) {
	nonce := reqBodyJson.Nonce
	senderIdNotUint := reqBodyJson.SenderId
	senderId, err := strconv.ParseUint(senderIdNotUint, 10, 64)

	ctx := context.Background()

	nonceUser, err_1 := gorm.G[database.User](db).Where("nonce = ?", nonce).First(ctx)
	if err_1 != nil {
		c.JSON(http.StatusConflict, gin.H{"status": "user with provided nonce does not exist", "error": err_1})
		return

	}

	idByNonce := nonceUser.ID

	_, err_2 := gorm.G[database.PersonalChat](db).Where("(user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)", senderId, idByNonce, idByNonce, senderId).First(ctx)
	if err_2 == nil {
		c.JSON(http.StatusConflict, gin.H{"status": "chat already registered"})
		return
	}

	chatToCreate := database.PersonalChat{User1: uint(senderId), User2: idByNonce, Messages: ""}

	if err_3 := gorm.G[database.PersonalChat](db).Create(ctx, &chatToCreate); err_3 != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "internal server error, could not create a chat", "err": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
