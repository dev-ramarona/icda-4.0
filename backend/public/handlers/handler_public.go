package handlerPublic

import (
	modelUser "backend/main/user/models"
	utlUsrconf "backend/main/user/utils"
	"fmt"
	"net/http"
	"os"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

var Client *mongo.Client
var MongoDomain string
var MongoDBName string
var PortActive string
var IntApiKey string
var JWTaccess string
var JWTrefresh string

// Gett all env
func GetAllenv() {
	MongoDomain = os.Getenv("MONGO_DOMAIN")
	MongoDBName = os.Getenv("MONGO_DB_NAME")
	PortActive = os.Getenv("PORT")
	IntApiKey = os.Getenv("INTERNAL_API_KEY")
	JWTaccess = os.Getenv("JWT_ACCESS_SECRET")
	JWTrefresh = os.Getenv("JWT_REFRESH_SECRET")
}

// Header key compare
func InternalOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		got := c.GetHeader("X-Internal-Api-Key")
		if got == "" || got != IntApiKey {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		c.Next()
	}
}

// JWTAuth memvalidasi access token pada header Authorization: Bearer <token>.
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token tidak ada"})
			return
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		claims, err := utlUsrconf.ParseToken(tokenStr, []byte(JWTaccess))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token tidak valid atau kadaluarsa"})
			return
		}
		c.Set("claims", claims)
		c.Next()
	}
}

// Memastikan user punya permission spesifik
func RequirePermit(required string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claimsRaw, exists := c.Get("claims")
		claimFmt := claimsRaw.(*modelUser.UserJWT)
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "akses ditolak"})
			return
		}

		// Cek on permits
		if slices.Contains(claimFmt.PermitKey, required) ||
			slices.Contains(claimFmt.PermitKey, "SUPER") {
			c.Next()
			return
		}

		// Return error
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error": fmt.Sprintf("tidak punya izin: %s", required),
		})
	}
}
