package main

import (
	handlerFlight "backend/main/flight_data/handlers"
	handleUser "backend/main/user/handlers"
	utlUsrconf "backend/main/user/utils"
	handlerPublic "backend/public/handlers"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	// Initial env file
	if err := godotenv.Load(); err != nil {
		fmt.Println("Info: file .env tidak ditemukan, pakai env var sistem")
	}
	handlerPublic.GetAllenv()
	handlerPublic.ConnectDB()
	r := gin.Default()
	vOne := r.Group("/icda/v1")
	vOne.Use(handlerPublic.InternalOnly())

	// User handler management
	user := vOne.Group("/user")
	user.POST("/login", utlUsrconf.RateLimitLogin(), handleUser.Login)
	user.POST("/refresh", handleUser.Refresh)
	user.Use(handlerPublic.JWTAuth())
	{
		user.GET("/info", handleUser.Info)
		user.GET("/accounts", handlerPublic.RequirePermit("PMT_USER_GET_ACCOUNTS_VIEW"), handleUser.Accounts)
		user.GET("/roles", handlerPublic.RequirePermit("PMT_USER_GET_ROLES_VIEW"), handleUser.Roles)
		user.GET("/formats", handlerPublic.RequirePermit("PMT_USER_GET_FORMATS_VIEW"), handleUser.Formats)
		user.GET("/permits", handlerPublic.RequirePermit("PMT_USER_GET_PERMITS_VIEW"), handleUser.Permits)
		user.GET("/keyroles", handlerPublic.RequirePermit("PMT_USER_GET_ROLES_KEY"), handleUser.KeyRoles)
		user.GET("/keyformats", handlerPublic.RequirePermit("PMT_USER_GET_FORMATS_KEY"), handleUser.KeyFormats)
		user.GET("/keypermits", handlerPublic.RequirePermit("PMT_USER_GET_PERMITS_KEY"), handleUser.KeyPermits)
		user.POST("/create/:db", handlerPublic.RequirePermit("PMT_USER_POST_ACTION_CREATE"), handleUser.Create)
		user.PATCH("/update/:db", handlerPublic.RequirePermit("PMT_USER_PATCH_ACTION_UPDATE"), handleUser.Update)
		// user.PATCH("/account/:user/:action", handlerPublic.RequirePermit("PMT_USER_PATCH_UPDATE"), handleUser.Account)
		// user.GET("/permits", handlerPublic.RequirePermit(""), handleUser.Permits)
		// user.PATCH("/password", handleUser.Login)
		// user.PATCH("/reset", handlerPublic.RequirePermit(""), handleUser.Login)
		// user.PATCH("/update/:db", handlerPublic.RequirePermit(""), handleUser.Login)
		// user.POST("/create/:db", handlerPublic.RequirePermit(""), handleUser.Login)
	}

	// User flight data
	flight := vOne.Group("/flight")
	flight.Use(handlerPublic.JWTAuth())
	{
		flight.GET("/initials", handlerPublic.RequirePermit("PMT_FLIGHT_GET_INSIGHT_VIEW"), handlerFlight.Initials)
		flight.GET("/insight", handlerPublic.RequirePermit("PMT_FLIGHT_GET_INSIGHT_VIEW"), handlerFlight.Insight)
		// flight.GET("/insight", handlerPublic.RequirePermit("PMT_FLIGHT_GET_INSIGHT_VIEW"), handlerFlight.Insight)
		flight.GET("/agregates", handlerPublic.RequirePermit("PMT_FLIGHT_GET_AGREGATES_VIEW"), handlerFlight.Agregates)
	}

	// Run server
	r.Run("0.0.0.0:" + handlerPublic.PortActive)
}
