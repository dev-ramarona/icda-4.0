package handlerUser

import (
	mdlUsrconf "backend/main/user/models"
	utlUsrconf "backend/main/user/utils"
	handler "backend/public/handlers"
	"net/http"
	"slices"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"golang.org/x/crypto/bcrypt"
)

// Login
func Login(c *gin.Context) {
	var input mdlUsrconf.UserLogin
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input tidak valid"})
		return
	}

	// Get Accounts
	findAccount := bson.M{"username": input.Username, "status": bson.M{"$in": []string{"active", "passive"}}}
	accounts, errAccounts := GetAccounts(findAccount, nil, 1, 1)
	if errAccounts != nil {
		if errAccounts.Error() == "data not found" {
			dummyHash, _ := bcrypt.GenerateFromPassword([]byte("dummy"), bcrypt.DefaultCost)
			utlUsrconf.CompareHash(input.Password, string(dummyHash))
			c.JSON(http.StatusUnauthorized, gin.H{"error": "username atau password salah"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server not available"})
		return
	}

	// Compare hash password
	user := accounts.Data[0]
	if !utlUsrconf.CompareHash(input.Password, user.HashPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "username atau password salah"})
		return
	}

	// Get spesific database role
	findRole := bson.M{"rolekey": user.Role}
	roles, err := GetRoles(findRole, nil, 1, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "role not available"})
		return
	}
	role := roles.Data[0]

	// If super format
	if slices.Contains(role.Formats, "SUPER") {
		Formats, err := GetKeyFormats(bson.M{}, bson.D{{Key: "formatkey", Value: -1}}, 0, 0)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
			return
		}
		role.Formats = Formats
	}

	// If super Permits
	if slices.Contains(role.Permits, "SUPER") {
		Permits, err := GetKeyPermits(bson.M{}, bson.D{{Key: "permitkey", Value: -1}}, 0, 0)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Permit not available"})
			return
		}
		role.Permits = Permits
	}

	// Get screen
	findScreens := bson.M{"screenkey": bson.M{"$in": role.Screens}}
	if slices.Contains(role.Screens, "SUPER") {
		findScreens = bson.M{}
	}
	Screens, err := GetScreens(findScreens, bson.D{{Key: "sequence", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Screen not available"})
		return
	}

	// Generate Access Token
	const accessTokenTTL = 15 * time.Minute
	accessToken, err := utlUsrconf.GenerateJWTAccess(user, role, Screens.Data, accessTokenTTL, handler.JWTaccess)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal membuat token"})
		return
	}

	// Generate Refresh Token
	const refreshTokenTTL = 7 * 24 * time.Hour
	refreshToken, err := utlUsrconf.GenerateJWTRefresh(user, role, Screens.Data, refreshTokenTTL, handler.JWTrefresh)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal membuat token"})
		return
	}

	// Return final token
	c.JSON(http.StatusOK, mdlUsrconf.UserToken{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int(accessTokenTTL.Seconds()),
	})
}

// Refresh
func Refresh(c *gin.Context) {
	var input mdlUsrconf.UserRefresh
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "input tidak valid"})
		return
	}

	// Claim token
	claim, err := utlUsrconf.ParseToken(input.RefreshToken, []byte(handler.JWTrefresh))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "refresh token tidak valid"})
		return
	}

	// Cek Accounts
	findAccount := bson.M{"username": claim.Username, "status": bson.M{"$in": []string{"active", "passive"}}}
	accounts, err := GetAccounts(findAccount, nil, 1, 1)
	if err != nil || len(accounts.Data) == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not available"})
		return
	}
	user := accounts.Data[0]

	// Get spesific database role
	findRoles := bson.M{"rolekey": user.Role}
	roles, err := GetRoles(findRoles, nil, 1, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "role not available"})
		return
	}
	role := roles.Data[0]

	// If super format
	if slices.Contains(role.Formats, "SUPER") {
		Formats, err := GetKeyFormats(bson.M{}, bson.D{{Key: "formatkey", Value: -1}}, 0, 0)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
			return
		}
		role.Formats = Formats
	}

	// If super Permits
	if slices.Contains(role.Permits, "SUPER") {
		Permits, err := GetKeyPermits(bson.M{}, bson.D{{Key: "permitkey", Value: -1}}, 0, 0)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Permit not available"})
			return
		}
		role.Permits = Permits
	}

	// Get screen
	findScreens := bson.M{"screenkey": bson.M{"$in": role.Screens}}
	if slices.Contains(role.Screens, "SUPER") {
		findScreens = bson.M{}
	}
	Screens, err := GetScreens(findScreens, bson.D{{Key: "sequence", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Screen not available"})
		return
	}

	// Generate Access Token
	const accessTokenTTL = 15 * time.Minute
	accessToken, err := utlUsrconf.GenerateJWTAccess(user, role, Screens.Data, accessTokenTTL, handler.JWTaccess)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal membuat token"})
		return
	}

	// Generate Refresh Token
	const refreshTokenTTL = 7 * 24 * time.Hour
	refreshToken, err := utlUsrconf.GenerateJWTRefresh(user, role, Screens.Data, refreshTokenTTL, handler.JWTrefresh)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "gagal membuat token"})
		return
	}

	// Return final token
	c.JSON(http.StatusOK, mdlUsrconf.UserToken{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresIn:    int(accessTokenTTL.Seconds()),
	})
}

// User information
func Info(c *gin.Context) {
	claimRaw, exists := c.Get("claims")
	if !exists {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "akses token ditolak"})
		return
	}
	claimFmt, ok := claimRaw.(*mdlUsrconf.UserJWT)
	if !ok {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "akses token ditolak"})
	}

	// Get role
	finalResp := mdlUsrconf.UserCaps{Role: claimFmt.Role}

	// Get permits
	findPermits := bson.M{"permitkey": bson.M{"$in": claimFmt.PermitKey}}
	if slices.Contains(claimFmt.PermitKey, "SUPER") {
		findPermits = bson.M{}
	}
	Permits, err := GetPermits(findPermits, bson.D{{Key: "permitkey", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Permit not available"})
		return
	}
	finalResp.Permits = Permits.Data

	// Get Formats
	findFormats := bson.M{"formatkey": bson.M{"$in": claimFmt.FormatKey}}
	if slices.Contains(claimFmt.FormatKey, "SUPER") {
		findFormats = bson.M{}
	}
	formats, err := GetFormats(findFormats, bson.D{{Key: "formatkey", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "format not available"})
		return
	}
	finalResp.Formats = formats.Data

	// Get Filters
	findRoles := bson.M{"rolekey": claimFmt.Role}
	roles, err := GetRoles(findRoles, nil, 1, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "role not available"})
		return
	}
	role := roles.Data[0]
	finalResp.Filters = role.Filters
	if len(role.Filters) == 0 {
		finalResp.Filters = []mdlUsrconf.UserRolesFilter{{Field: "All", Operator: "", Value: []string{""}}}
	}

	// Return success response
	c.JSON(http.StatusOK, gin.H{"caps": finalResp})

}

// Get users
func Accounts(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.DefaultQuery("search", "")
	slcAccounts, err := GetAccounts(bson.M{
		"$or": []bson.M{
			{"username": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"email": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"namefull": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"rolekey": bson.Regex{
				Pattern: search,
				Options: "i"}}},
	}, bson.D{{Key: "username", Value: -1}}, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"accounts": slcAccounts})
}

// Get users
func Roles(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.DefaultQuery("search", "")
	slcRoles, err := GetRoles(bson.M{
		"$or": []bson.M{
			{"rolekey": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"status": bson.Regex{
				Pattern: search,
				Options: "i"}}},
	}, bson.D{{Key: "rolekey", Value: -1}}, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"roles": slcRoles})
}

// Get key roles
func KeyRoles(c *gin.Context) {
	slcKeyRoles, err := GetKeyRoles(bson.M{}, bson.D{{Key: "rolekey", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"keyroles": slcKeyRoles})
}

// Get formats
func Formats(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.DefaultQuery("search", "")
	slcFormats, err := GetFormats(bson.M{
		"$or": []bson.M{
			{"formatkey": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"formatttl": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"status": bson.Regex{
				Pattern: search,
				Options: "i"}}},
	}, bson.D{{Key: "formatkey", Value: -1}}, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"formats": slcFormats})
}

// Get key formats
func KeyFormats(c *gin.Context) {
	slcKeyFormats, err := GetKeyFormats(bson.M{}, bson.D{{Key: "formatkey", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"keyformats": slcKeyFormats})
}

// Get permits
func Permits(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	search := c.DefaultQuery("search", "")
	slcPermits, err := GetPermits(bson.M{
		"$or": []bson.M{
			{"formatkey": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"endpoint": bson.Regex{
				Pattern: search,
				Options: "i"}},
			{"status": bson.Regex{
				Pattern: search,
				Options: "i"}}},
	}, bson.D{{Key: "permitkey", Value: -1}}, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Permit not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"permits": slcPermits})
}

// Get key permits
func KeyPermits(c *gin.Context) {
	slcKeyPermits, err := GetKeyPermits(bson.M{}, bson.D{{Key: "permitkey", Value: -1}}, 0, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "permit not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"keypermits": slcKeyPermits})
}

// Post Create user
func Create(c *gin.Context) {
	db := c.Param("db")
	rawTime := time.Now()
	intTime, _ := strconv.Atoi(rawTime.Format("200601021504"))

	// Get database from URL parameter
	switch c.Param("db") {
	case "account":

		// Bind JSON input
		var jsonInput = mdlUsrconf.UserAccounts{Status: "passive"}
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Get Accounts
		findFmt := bson.M{"username": jsonInput.Username}
		_, errFind := GetAccounts(findFmt, nil, 1, 1)
		if errFind == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Username exist"})
			return
		}

		// hash password
		hashed, err := bcrypt.GenerateFromPassword([]byte(jsonInput.HashPassword), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Password failed"})
			return
		}
		jsonInput.HashPassword = string(hashed)

		// Created and updated Time
		jsonInput.Created = int64(intTime)
		jsonInput.Updated = int64(intTime)

		// Push db
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"username": jsonInput.Username})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	case "role":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserRoles
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Get Role
		findRoles := bson.M{"rolekey": jsonInput.RoleKey}
		_, errFind := GetRoles(findRoles, nil, 1, 1)
		if errFind == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Role exist"})
			return
		}

		// Get Permits for screen
		if slices.Contains(jsonInput.Permits, "SUPER") {
			jsonInput.Screens = []string{"SUPER"}
		} else {
			findPermits := bson.M{"permitkey": bson.M{"$in": jsonInput.Permits}}
			permits, errPermits := GetPermits(findPermits, bson.D{{Key: "permitkey", Value: -1}}, 0, 0)
			if errPermits != nil {
				c.JSON(http.StatusConflict, gin.H{"error": "Permit not exist"})
				return
			}
			for _, permit := range permits.Data {
				if !slices.Contains(jsonInput.Screens, permit.Screen) {
					jsonInput.Screens = append(jsonInput.Screens, permit.Screen)
				}
			}
		}

		// Created and updated Time
		jsonInput.Created = int64(intTime)
		jsonInput.Updated = int64(intTime)

		// Push db
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"rolekey": jsonInput.RoleKey})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	case "format":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserFormats
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Get formats
		findFormats := bson.M{"formatkey": jsonInput.FormatKey}
		_, errFind := GetFormats(findFormats, nil, 1, 1)
		if errFind == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Format exist"})
			return
		}

		// Created and updated Time
		jsonInput.Created = int64(intTime)
		jsonInput.Updated = int64(intTime)

		// Push account
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"formatkey": jsonInput.FormatKey})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	case "permit":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserPermits
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Get permitss
		findPermits := bson.M{"permitkey": jsonInput.PermitKey}
		_, errFind := GetPermits(findPermits, nil, 1, 1)
		if errFind == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Permit exist"})
			return
		}

		// Created and updated Time
		jsonInput.Created = int64(intTime)
		jsonInput.Updated = int64(intTime)

		// Push account
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"permitkey": jsonInput.PermitKey})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no database found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": "Success"})
}

// Post Create user
func Update(c *gin.Context) {
	rawTime := time.Now()
	intTime, _ := strconv.Atoi(rawTime.Format("200601021504"))

	// Get database from URL parameter
	db := c.Param("db")
	switch db {
	case "account":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserAccounts
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// hash password
		if jsonInput.HashPassword != "" {
			hashed, err := bcrypt.GenerateFromPassword([]byte(jsonInput.HashPassword), bcrypt.DefaultCost)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Password failed"})
				return
			}
			jsonInput.HashPassword = string(hashed)
		}

		// Created and updated Time
		jsonInput.Updated = int64(intTime)

		// Push db
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"username": jsonInput.Username})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	case "role":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserRoles
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Get Permits for screen
		if slices.Contains(jsonInput.Permits, "SUPER") {
			jsonInput.Screens = []string{"SUPER"}
		} else {
			findPermits := bson.M{"permitkey": bson.M{"$in": jsonInput.Permits}}
			permits, errPermits := GetPermits(findPermits, bson.D{{Key: "permitkey", Value: -1}}, 0, 0)
			if errPermits != nil {
				c.JSON(http.StatusConflict, gin.H{"error": "Permit not exist"})
				return
			}
			for _, permit := range permits.Data {
				if !slices.Contains(jsonInput.Screens, permit.Screen) {
					jsonInput.Screens = append(jsonInput.Screens, permit.Screen)
				}
			}
		}

		// Created and updated Time
		jsonInput.Updated = int64(intTime)

		// Push db
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"rolekey": jsonInput.RoleKey})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	case "format":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserFormats
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Created and updated Time
		jsonInput.Updated = int64(intTime)

		// Push account
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"formatkey": jsonInput.FormatKey})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	case "permit":

		// Bind JSON input
		var jsonInput mdlUsrconf.UserPermits
		if err := c.ShouldBindJSON(&jsonInput); err != nil {
			c.JSON(http.StatusBadRequest, "Invalid payload")
			return
		}

		// Created and updated Time
		jsonInput.Updated = int64(intTime)

		// Push account
		errPush := handler.PushDB(jsonInput, "user_"+db, bson.M{"permitkey": jsonInput.PermitKey})
		if errPush != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": errPush.Error()})
			return
		}

	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no database found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"ok": "Success"})
}
