package modelUser

import "github.com/golang-jwt/jwt/v5"

// User accounts
type UserAccounts struct {
	Username     string `bson:"username,omitempty" json:"username,omitempty"`
	HashPassword string `bson:"password,omitempty" json:"password,omitempty"` // simpan dalam bentuk hash (bcrypt, dsb), jangan plain text
	Email        string `bson:"email,omitempty" json:"email,omitempty"`
	NameFull     string `bson:"namefull,omitempty" json:"namefull,omitempty"`
	Role         string `bson:"role,omitempty" json:"role,omitempty"` // referensi ke UserRole.RoleKey, bisa lebih dari satu
	Status       string `bson:"status,omitempty" json:"status,omitempty"`
	Created      int64  `bson:"created,omitempty" json:"created,omitempty"`
	Updated      int64  `bson:"updated,omitempty" json:"updated,omitempty"`
}

// User role
type UserRoles struct {
	RoleKey string            `bson:"rolekey" json:"rolekey"`
	Filters []UserRolesFilter `bson:"filters" json:"filters"`
	Formats []string          `bson:"formats" json:"formats"`
	Screens []string          `bson:"screens" json:"screens"`
	Permits []string          `bson:"permits" json:"permits"`
	Status  string            `bson:"status,omitempty" json:"status,omitempty"`
	Created int64             `bson:"created,omitempty" json:"created,omitempty"`
	Updated int64             `bson:"updated,omitempty" json:"updated,omitempty"`
}
type UserRolesFilter struct {
	Field    string   `bson:"field" json:"field"`
	Operator string   `bson:"operator" json:"operator"`
	Value    []string `bson:"value,omitempty" json:"value,omitempty"`
}

// User Format
type UserFormats struct {
	FormatKey string   `bson:"formatkey,omitempty" json:"formatkey,omitempty"`
	FormatTtl string   `bson:"formatttl,omitempty" json:"formatttl,omitempty"`
	Fields    []string `bson:"fields,omitempty" json:"fields,omitempty"`
	Status    string   `bson:"status,omitempty" json:"status,omitempty"`
	Created   int64    `bson:"created,omitempty" json:"created,omitempty"`
	Updated   int64    `bson:"updated,omitempty" json:"updated,omitempty"`
}

// User screen
type UserScreens struct {
	ScreenKey   string `bson:"screenkey" json:"screenkey"`
	App         string `bson:"app" json:"app"`
	Title       string `bson:"title" json:"title"`
	Detail      string `bson:"detail" json:"detail"`
	Description string `bson:"description" json:"description"`
	Sequence    int32  `bson:"sequence" json:"sequence"`
}

// User permits
type UserPermits struct {
	PermitKey string `bson:"permitkey,omitempty" json:"permitkey,omitempty"`
	Endpoint  string `bson:"endpoint,omitempty" json:"endpoint,omitempty"`
	Method    string `bson:"method,omitempty" json:"method,omitempty"`
	Screen    string `bson:"screen,omitempty" json:"screen,omitempty"`
	Status    string `bson:"status,omitempty" json:"status,omitempty"`
	Created   int64  `bson:"created,omitempty" json:"created,omitempty"`
	Updated   int64  `bson:"updated,omitempty" json:"updated,omitempty"`
}

// User to frontend
type UserLogin struct {
	Username string `bson:"username" json:"username"`
	Password string `bson:"password" json:"password"`
}
type UserToken struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
}
type UserRefresh struct {
	RefreshToken string `bson:"refresh_token" json:"refresh_token"`
}
type UserJWT struct {
	Username  string        `json:"username"`
	NameFull  string        `json:"namefull"`
	FormatKey []string      `json:"formatkey"`
	PermitKey []string      `json:"permitkey"`
	Screens   []UserScreens `json:"screens"`
	Role      string        `json:"role"`
	jwt.RegisteredClaims
}
type UserCaps struct {
	Role    string            `bson:"role" json:"role"`
	Permits []UserPermits     `bson:"permits" json:"permits"`
	Formats []UserFormats     `bson:"formats" json:"formats"`
	Filters []UserRolesFilter `bson:"filters" json:"filters"`
}

// // Role list database
// type UserRolesDB struct {
// 	Role    string        `bson:"role" json:"role"`
// 	Formats []string      `bson:"formats" json:"formats"`
// 	Action  string        `bson:"action" json:"action"`
// 	Filters []FiltersRole `bson:"filters" json:"filters"`
// }
// type FiltersRole struct {
// 	Field  string   `bson:"field" json:"field"`
// 	Values []string `bson:"values" json:"values"`
// }

// // Permission list database
// type UserPermitsDB struct {
// 	Permit string `bson:"permit" json:"permit"`
// 	Page   string `bson:"page" json:"page"`
// }
// type UserPermits struct {
// 	Permit []string `bson:"permit" json:"permit"`
// 	Page   string   `bson:"page" json:"page"`
// }

// // Formats list database
// type UserFormatsDB struct {
// 	Format string   `bson:"format" json:"format"`
// 	Fields []string `bson:"fields" json:"fields"`
// }

// // User list database
// type UserListDB struct {
// 	Username     string   `bson:"username" json:"username"`
// 	HashPassword string   `bson:"password" json:"password"`
// 	Email        string   `bson:"email" json:"email"`
// 	Surename     string   `bson:"surename" json:"surename"`
// 	Roles        []string `bson:"roles" json:"roles"`
// 	Permits      []string `bson:"permits" json:"permits"`
// }
// type UserRegis struct {
// 	Username string   `bson:"username" json:"username"`
// 	Password string   `bson:"password" json:"password"`
// 	Email    string   `bson:"email" json:"email"`
// 	Surename string   `bson:"surename" json:"surename"`
// 	Roles    []string `bson:"roles" json:"roles"`
// 	Permits  []string `bson:"permits" json:"permits"`
// }
// type UserRefresh struct {
// 	RefreshToken string `bson:"refresh_token" json:"refresh_token"`
// }
// type UserLogin struct {
// 	Username string `bson:"username" json:"username"`
// 	Password string `bson:"password" json:"password"`
// }
// type UserJWT struct {
// 	Username string   `json:"username"`
// 	Surename string   `json:"surename"`
// 	Password string   `json:"password"`
// 	Roles    []string `json:"roles"`
// 	Permits  []string `json:"permits"`
// 	jwt.RegisteredClaims
// }
// type UserToken struct {
// 	AccessToken  string `json:"access_token"`
// 	RefreshToken string `json:"refresh_token"`
// 	ExpiresIn    int    `json:"expires_in"`
// }

// // App list database
// type UserAppstDB struct {
// 	App         string `bson:"app" json:"app"`
// 	Title       string `bson:"title" json:"title"`
// 	Detail      string `bson:"detail" json:"detail"`
// 	Description string `bson:"description" json:"description"`
// }

// // Retur format user view access
// type UserCaps struct {
// 	Permits []string            `bson:"permits" json:"permits"`
// 	Roles   []string            `bson:"roles" json:"roles"`
// 	Formats []string            `bson:"formats" json:"formats"`
// 	Filters map[string][]string `bson:"filters" json:"filters"`
// }
