package global

import (
	"os"

	"gorm.io/gorm"
)

var DB *gorm.DB

var JWT_SECRET = []byte(os.Getenv("JWT_SECRET"))
