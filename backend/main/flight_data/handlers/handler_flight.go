package handlerFlight

import (
	modelFlight "backend/main/flight_data/models"
	modelUser "backend/main/user/models"
	handlerPublic "backend/public/handlers"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Initial data flight
func Initials(c *gin.Context) {

	// Get spesific database role
	claimsRaw, exists := c.Get("claims")
	claimFmt := claimsRaw.(*modelUser.UserJWT)
	if !exists {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "akses ditolak"})
		return
	}

	// get roles
	pipeline := mongo.Pipeline{{{Key: "$match", Value: bson.M{"rolekey": claimFmt.Role}}}}
	roles, err := handlerPublic.GetPagedata[modelUser.UserRoles]("user_role", pipeline, 1, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "role not available"})
		return
	}
	role := roles.Data[0]

	// Filter
	findBsonm := bson.M{}
	for _, v := range role.Filters {
		if v.Field != "all" {
			findBsonm[v.Field] = bson.M{"$in": v.Value}
			if v.Operator == "out" {
				findBsonm[v.Field] = bson.M{"$nin": v.Value}
			}
		}
	}

	// get initial
	slcInitials, err := GetInitial(findBsonm, bson.D{{Key: "primary_key", Value: -1}}, 1, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	slcAirlines := []string{}
	for _, val := range slcInitials.Data[0].Airlines {
		slcAirlines = append(slcAirlines, val.ID)
	}
	slcRegions := []string{}
	if len(findBsonm) == 0 {
		slcRegions = append(slcRegions, "All Region")
	}
	for _, val := range slcInitials.Data[0].Regions {
		slcRegions = append(slcRegions, val.ID)
	}
	slcDatesOfTravel := []int32{}
	for _, val := range slcInitials.Data[0].Dates {
		slcDatesOfTravel = append(slcDatesOfTravel, val.ID)
	}
	c.JSON(http.StatusOK, gin.H{"airlines": slcAirlines, "regions": slcRegions, "dates": slcDatesOfTravel})
}

// Initial data flight
func Insight(c *gin.Context) {

	// Get spesific database role
	claimsRaw, exists := c.Get("claims")
	claimFmt := claimsRaw.(*modelUser.UserJWT)
	if !exists {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "akses ditolak"})
		return
	}

	// get roles
	pipeline := mongo.Pipeline{{{Key: "$match", Value: bson.M{"rolekey": claimFmt.Role}}}}
	roles, err := handlerPublic.GetPagedata[modelUser.UserRoles]("user_role", pipeline, 1, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "role not available"})
		return
	}
	role := roles.Data[0]

	// Get query
	dateOfTravel := c.Query("date_operating")
	if dateOfTravel == "" {
		dateOfTravel = time.Now().Format("2006-01-02")
	}
	rawDateOfTravel, _ := time.Parse("2006-01-02", dateOfTravel)
	nowDateOfTravel, _ := strconv.Atoi(rawDateOfTravel.Format("060102"))
	minDateOfTravel := rawDateOfTravel.AddDate(0, 0, -31).Format("060102")
	prvDateOfTravel, _ := strconv.Atoi(minDateOfTravel)

	// Spesific date and rev
	findSpesific := bson.M{}
	findDate := bson.M{"date_operating": bson.D{
		{Key: "$gt", Value: int32(prvDateOfTravel)},
		{Key: "$lte", Value: int32(nowDateOfTravel)}}}
	findDate["total_revenue"] = bson.D{{Key: "$gt", Value: 0}}
	findSpesific["find_date"] = findDate
	findSpesific["find_last_date"] = bson.D{{Key: "$eq",
		Value: bson.A{"$date_operating", int32(nowDateOfTravel)}}}

	// Spesific Top and bottom
	topbot := c.Query("topbot")        // "top" (default) | "bottom"
	period := c.Query("topbot_period") // "monthly" (default) | "daily"
	value := c.Query("topbot_value")   // "score" (default) | "rph"

	// whitelist, supaya input aneh tidak jadi nama field
	if topbot != "bottom" {
		topbot = "top"
	}
	suffix := "monthly"
	if period == "daily" {
		suffix = "daily" // field di pipeline memakai suffix _today
	}
	if value != "rph" {
		value = "score"
	}

	var rankField string
	sortDir := -1 // top = terbesar dulu

	switch value {
	case "rph":
		rankField = "rph_" + suffix
		if topbot == "bottom" {
			sortDir = 1 // bottom = rph terkecil dulu
		}
	default: // score
		if topbot == "bottom" {
			rankField = "loss_score_" + suffix
		} else {
			rankField = "profit_score_" + suffix
		}
		// score: top maupun bottom sama-sama urut terbesar (loss_score makin besar = makin buruk)
	}

	// filter: rute harus terbang di periode tsb.
	matchCond := bson.D{{Key: "flight_" + suffix, Value: bson.D{{Key: "$gt", Value: 0}}}}
	if value == "score" {
		matchCond = append(matchCond, bson.E{Key: rankField, Value: bson.D{{Key: "$gt", Value: 0}}})
	}

	findSpesific["find_topbot"] = bson.D{{Key: "$match", Value: matchCond}}
	findSpesific["sort_topbot"] = bson.D{{Key: "$sort", Value: bson.D{
		{Key: rankField, Value: sortDir},
		{Key: "flh_" + suffix, Value: -1}, // tie-breaker
	}}}

	// Filter general
	findGeneral := bson.M{}
	if getQuery := c.Query("airline"); getQuery != "" {
		findGeneral["airline_operating"] = getQuery
	}
	if getQuery := c.Query("region"); getQuery != "" && getQuery != "All Region" {
		findGeneral["region"] = getQuery
	}
	for _, v := range role.Filters {
		if v.Field != "all" {
			findGeneral[v.Field] = bson.M{"$in": v.Value}
			if v.Operator == "out" {
				findGeneral[v.Field] = bson.M{"$nin": v.Value}
			}
		}
	}

	// get insight
	slices, err := GetInsight(findGeneral, findSpesific, bson.D{}, 1, 0)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		fmt.Println(err)
		return
	}

	// Trend insight and KPI insight
	kpiInsight := modelFlight.FlightInsightKpi{}
	kpiInsightPrev := modelFlight.FlightInsightKpiPrev{}
	trendInsight := []modelFlight.FlightInsightTrend{}
	for idx, trend := range slices.Data[0].Trend {
		parseDate, _ := time.Parse("060102", strconv.Itoa(int(trend.Date)))
		dot := parseDate.Format("02-Jan")
		trend.Dot = dot
		trend.Lf = math.Round(trend.Lf*1000) / 10
		trend.Flh = math.Round(trend.Flh*100) / 100
		trend.ProfitPrstnc = math.Round(trend.ProfitPrstnc*1000) / 10
		trendInsight = append(trendInsight, trend)

		// Kpi now
		if idx+1 == len(slices.Data[0].Trend) {
			kpiInsight = modelFlight.FlightInsightKpi{
				Rph:    trend.Rph,
				Rphprv: kpiInsightPrev.Rev / kpiInsightPrev.Flh,
				Rpp:    trend.Rpp,
				Rppprv: kpiInsightPrev.Rev / float64(kpiInsightPrev.Pax),
				Pax:    trend.Pax,
				Paxprv: int32(int(kpiInsightPrev.Pax) / (idx)),
				Lf:     trend.Lf,
				Lfprv:  int32(float64(kpiInsightPrev.Pax)/float64(kpiInsightPrev.Seat)*1000) / 10,
				Flh:    trend.Flh,
				Flhprv: kpiInsightPrev.Flh / float64(idx),
			}
			break
		}

		// Summaries prev data
		kpiInsightPrev.Pax += trend.Pax
		kpiInsightPrev.Seat += trend.Seat
		kpiInsightPrev.Flh += trend.Flh
		kpiInsightPrev.Rev += trend.Rev
	}

	// Trend Top bottom
	topbotInsight := []modelFlight.FlightInsightTopbot{}
	fmt.Println(findSpesific["find_topbot"])
	fmt.Println(findSpesific["sort_topbot"])
	for _, topbot := range slices.Data[0].Topbot {
		fmt.Println(topbot)
		topbot.LfMonthly = math.Round(topbot.LfMonthly*1000) / 10
		topbot.LfDaily = math.Round(topbot.LfDaily*1000) / 10
		topbot.ProfitPrstncMonthly = math.Round(topbot.ProfitPrstncMonthly*1000) / 10
		topbot.ProfitPrstncDaily = math.Round(topbot.ProfitPrstncDaily*1000) / 10
		topbot.LossPrstncMonthly = math.Round(topbot.LossPrstncMonthly*1000) / 10
		topbot.LossPrstncDaily = math.Round(topbot.LossPrstncDaily*1000) / 10
		topbotInsight = append(topbotInsight, topbot)
	}

	// Trend Top bottom
	tbucketInsight := []modelFlight.FlightInsightTbucket{}
	for _, tbucket := range slices.Data[0].Tbucket {
		tbucket.ProfitPrstncMonthly = math.Round(tbucket.ProfitPrstncMonthly*1000) / 10
		tbucket.ProfitPrstncDaily = math.Round(tbucket.ProfitPrstncDaily*1000) / 10
		tbucket.LfMonthly = math.Round(tbucket.LfMonthly*1000) / 10
		tbucket.LfDaily = math.Round(tbucket.LfDaily*1000) / 10
		tbucketInsight = append(tbucketInsight, tbucket)
	}

	// Result
	c.JSON(http.StatusOK, gin.H{
		"card_kpi":    kpiInsight,
		"trend_revph": trendInsight,
		"top_bottom":  topbotInsight,
		"time_bucket": tbucketInsight})
}

// Get Agregates view
func Agregates(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	findBsonm := bson.M{}
	dateOfTravel := c.Query("date_operating")
	if dateOfTravel != "" {
		findBsonm["date_operating"] = dateOfTravel
	}
	airline := c.Query("airline")
	if airline != "" {
		findBsonm["airline"] = airline
	}
	flightNumber := c.Query("flight_number")
	if flightNumber != "" {
		findBsonm["flight_number"] = flightNumber
	}
	departure := c.Query("departure")
	if departure != "" {
		findBsonm["departure"] = departure
	}
	pnrCode := c.Query("pnr_code")
	if pnrCode != "" {
		findBsonm["pnr_code"] = pnrCode
	}
	ticketNumber := c.Query("ticket_number")
	if ticketNumber != "" {
		findBsonm["ticket_number"] = ticketNumber
	}
	slcAgregates, err := GetAgregates(findBsonm, bson.D{{Key: "primary_key", Value: -1}}, page, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"agregates": slcAgregates})
}

// // Get Insight view
// func Insight(c *gin.Context) {

// 	// Get spesific database role
// 	claimsRaw, exists := c.Get("claims")
// 	claimFmt := claimsRaw.(*modelUser.UserJWT)
// 	if !exists {
// 		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "akses ditolak"})
// 		return
// 	}

// 	// roles, err := handlerUser.GetRoles(findRole, nil, 1, 1)
// 	pipeline := mongo.Pipeline{{{Key: "$match", Value: bson.M{"rolekey": claimFmt.Role}}}}
// 	roles, err := handlerPublic.GetPagedata[modelUser.UserRoles]("user_role", pipeline, 1, 1)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "role not available"})
// 		return
// 	}
// 	role := roles.Data[0]

// 	// Filter
// 	findBsonm := bson.M{}
// 	dateOfTravel := c.Query("date_operating")
// 	if dateOfTravel != "" {
// 		findBsonm["date_operating"] = dateOfTravel
// 	}
// 	for _, v := range role.Filters {
// 		if v.Field != "all" {
// 			findBsonm[v.Field] = bson.M{"$in": v.Value}
// 			if v.Operator == "out" {
// 				findBsonm[v.Field] = bson.M{"$nin": v.Value}
// 			}
// 		}
// 	}
// 	airline := c.Query("airline")
// 	if airline != "" {
// 		findBsonm["airline"] = airline
// 	}
// 	flightNumber := c.Query("flight_number")
// 	if flightNumber != "" {
// 		findBsonm["flight_number"] = flightNumber
// 	}
// 	departure := c.Query("departure")
// 	if departure != "" {
// 		findBsonm["departure"] = departure
// 	}
// 	pnrCode := c.Query("pnr_code")
// 	if pnrCode != "" {
// 		findBsonm["pnr_code"] = pnrCode
// 	}
// 	ticketNumber := c.Query("ticket_number")
// 	if ticketNumber != "" {
// 		findBsonm["ticket_number"] = ticketNumber
// 	}

// 	// Agreagates
// 	slcAgregates, err := GetAgregates(findBsonm, bson.D{{Key: "primary_key", Value: -1}}, 1, 0)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Format not available"})
// 		return
// 	}
// 	fmt.Println(slcAgregates)
// 	c.JSON(http.StatusOK, gin.H{"agregates": slcAgregates})
// }
