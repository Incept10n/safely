package database

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Name     string `gorm:"size:255;not null"`
	Password string `gorm:"size:255;not null"`
	Nonce    string `gorm:"size:255;not null"`
}

type PersonalChat struct {
	ID       uint   `gorm:"primaryKey"`
	User1    uint   `gorm:"not null;index"`
	User2    uint   `gorm:"not null;index"`
	Messages string `gorm:"type:text"`

	User1Info User `gorm:"foreignKey:User1;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	User2Info User `gorm:"foreignKey:User2;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
