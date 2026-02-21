package services

type RegisterStruct struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginStruct struct {
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required"`
}
