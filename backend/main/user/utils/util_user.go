package utilUser

import (
	mdlUsrconf "backend/main/user/models"
	"errors"
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// RateLimitLogin membatasi percobaan login per-IP untuk mitigasi brute force
func RateLimitLogin() gin.HandlerFunc {

	// Maximal token dan waktu refill tiap 12 detik
	var mute sync.Mutex
	const maxTokens = 5
	const refillRate = 12 * time.Second
	type pool struct {
		tokens   float64
		lastSeen time.Time
	}

	// Manage pool active per IP
	var ippools = make(map[string]*pool)
	allowfn := func(ip string) bool {
		mute.Lock()
		defer mute.Unlock()
		now := time.Now()
		pip, exists := ippools[ip]
		if !exists {
			pip = &pool{tokens: maxTokens, lastSeen: now}
			ippools[ip] = pip
		}

		// refill token berdasarkan waktu yang berlalu
		diftime := now.Sub(pip.lastSeen)
		pip.tokens += diftime.Seconds() / refillRate.Seconds()
		if pip.tokens > maxTokens {
			pip.tokens = maxTokens
		}
		pip.lastSeen = now

		// Return resopnse if isset token or emtpy
		if pip.tokens < 1 {
			return false
		}
		pip.tokens--
		return true
	}

	// Return json error or next
	return func(c *gin.Context) {
		ip := c.ClientIP()
		if !allowfn(ip) {
			ginError := gin.H{"error": "terlalu banyak percobaan, coba lagi nanti"}
			c.AbortWithStatusJSON(http.StatusTooManyRequests, ginError)
			return
		}
		c.Next()
	}
}

// Generate JWT Access
func GenerateJWTAccess(user mdlUsrconf.UserAccounts, role mdlUsrconf.UserRoles, screen []mdlUsrconf.UserScreens, tokenTTL time.Duration, secret string) (string, error) {
	claims := mdlUsrconf.UserJWT{
		Username:  user.Username,
		NameFull:  user.NameFull,
		FormatKey: role.Formats,
		PermitKey: role.Permits,
		Screens:   screen,
		Role:      user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now())}}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return jwtToken.SignedString([]byte(secret))
}

// Generate JWT Access
func GenerateJWTRefresh(user mdlUsrconf.UserAccounts, role mdlUsrconf.UserRoles, screen []mdlUsrconf.UserScreens, tokenTTL time.Duration, secret string) (string, error) {
	claims := mdlUsrconf.UserJWT{
		Username: user.Username,
		NameFull: user.NameFull,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now())}}
	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return jwtToken.SignedString([]byte(secret))
}

// Compare hash password
func CompareHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Parse token
func ParseToken(tokenStr string, secret []byte) (*mdlUsrconf.UserJWT, error) {
	claims := &mdlUsrconf.UserJWT{}
	token, err := jwt.ParseWithClaims(tokenStr, claims,
		func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("metode signing tidak valid")
			}
			return secret, nil
		})
	if err != nil || !token.Valid {
		return nil, errors.New("token tidak valid")
	}
	return claims, nil
}
