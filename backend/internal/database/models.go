package database

type User struct {
	ID       uint
	Name     string
	Password string
	Nonce    string
}

type PersonalChat struct {
	ID       uint
	User1    string
	User2    string
	Messages string
}
