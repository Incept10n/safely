package tools

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"safelyBackend/internal/global"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	Username string `json:"username"`
	UserID   uint   `json:"user_id"`
	jwt.RegisteredClaims
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateJWT(username string, userID uint) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)

	claims := &Claims{
		Username: username,
		UserID:   userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(global.JWT_SECRET)
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return global.JWT_SECRET, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("username", claims.Username)
		c.Set("user_id", claims.UserID)

		c.Next()
	}
}

func MakePartJsonMessage(sender string, message string) string {
	type Message struct {
		Sender    string `json:"sender"`
		Message   string `json:"message"`
		Timestamp string `json:"timestamp"`
	}

	unixTime := time.Now().Unix()
	timestamp := fmt.Sprintf("%d", unixTime)

	msg := Message{
		Sender:    sender,
		Message:   message,
		Timestamp: timestamp,
	}

	jsonMsgBytes, err_makePartJson := json.Marshal(msg)

	if err_makePartJson != nil {
		fmt.Println("error:", err_makePartJson)
		log.Fatal(err_makePartJson)
	}

	return string(jsonMsgBytes)
}
