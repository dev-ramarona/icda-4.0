package handlerFlight

import (
	modelFlight "backend/main/flight_data/models"
	handlerPublic "backend/public/handlers"
	modelPublic "backend/public/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Get Initial
func GetInitial(find bson.M, sort bson.D, page, limit int) (
	modelPublic.PublicPagedata[modelFlight.FlightInitials], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	pipeline = append(pipeline, bson.D{{Key: "$facet", Value: bson.M{
		"airlines": bson.A{
			bson.M{"$group": bson.M{"_id": "$airline_operating"}},
			bson.M{"$sort": bson.M{"_id": 1}}},
		"regions": bson.A{
			bson.M{"$group": bson.M{"_id": "$region"}},
			bson.M{"$sort": bson.M{"_id": 1}}},
		"dates": bson.A{
			bson.M{"$group": bson.M{"_id": "$date_operating"}},
			bson.M{"$sort": bson.M{"_id": 1}}},
	}}})
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelFlight.FlightInitials]("flight_agregate", pipeline, page, limit)
}

// Get Insight
func GetInsight(findGeneral, findSpesific bson.M, sort bson.D, page, limit int) (
	modelPublic.PublicPagedata[modelFlight.FlightInsight], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: findGeneral}}}
	pipeline = append(pipeline, bson.D{{Key: "$facet", Value: bson.M{

		// Trend rev per hour
		"trend_revph": bson.A{
			bson.M{"$match": findSpesific["find_date"]},

			// agregasi per route
			bson.M{"$group": bson.D{
				{Key: "_id", Value: "$date_operating"},
				{Key: "day", Value: bson.D{{Key: "$first", Value: "$day_operating"}}},

				// each day
				{Key: "flight", Value: bson.D{{Key: "$sum", Value: 1}}},
				{Key: "seat", Value: bson.D{{Key: "$sum", Value: "$total_seat_configuration"}}},
				{Key: "pax", Value: bson.D{{Key: "$sum", Value: "$total_passenger"}}},
				{Key: "flh", Value: bson.D{{Key: "$sum", Value: "$flight_hour"}}},
				{Key: "rev", Value: bson.D{{Key: "$sum", Value: "$total_revenue"}}},
				{Key: "cost", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$multiply", Value: bson.A{"$cost_perhour", "$flight_hour"}}}}}},
				{Key: "profit_flight", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$gte", Value: bson.A{
						"$revenue_perhour", "$cost_perhour"}}}, 1, 0}}}}}},
			}},

			// metrik turunan (pakai field hasil $group)
			bson.M{"$addFields": bson.D{
				{Key: "date", Value: "$_id"},
				{Key: "cph", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$cost", "$flh"}}}, 0}}}},

				// each day
				{Key: "lf", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$seat", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$pax", "$seat"}}}, 0}}}},
				{Key: "rph", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev", "$flh"}}}, 0}}}},
				{Key: "rpp", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$pax", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev", "$pax"}}}, 0}}}},
				{Key: "profit", Value: bson.D{{Key: "$subtract", Value: bson.A{"$rev", "$cost"}}}},
				{Key: "profit_prstnc", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$profit_flight", "$flight"}}}, 0}}}},
			}},

			// filter sort limit data
			bson.M{"$sort": bson.M{"date": 1}},
			bson.M{"$project": bson.M{"_id": 0}},
		},

		// Top and bottom
		"top_bottom": bson.A{
			bson.M{"$match": findSpesific["find_date"]},

			// agregasi per route
			bson.M{"$group": bson.D{
				{Key: "_id", Value: "$route_operating"},

				// Monthly
				{Key: "flight_monthly", Value: bson.D{{Key: "$sum", Value: 1}}},
				{Key: "seat_monthly", Value: bson.D{{Key: "$sum", Value: "$total_seat_configuration"}}},
				{Key: "pax_monthly", Value: bson.D{{Key: "$sum", Value: "$total_passenger"}}},
				{Key: "flh_monthly", Value: bson.D{{Key: "$sum", Value: "$flight_hour"}}},
				{Key: "rev_monthly", Value: bson.D{{Key: "$sum", Value: "$total_revenue"}}},
				{Key: "cost_monthly", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$multiply", Value: bson.A{"$cost_perhour", "$flight_hour"}}}}}},
				{Key: "profit_flight_monthly", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$gte", Value: bson.A{
						"$revenue_perhour", "$cost_perhour"}}}, 1, 0}}}}}},
				{Key: "loss_flight_monthly", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$lt", Value: bson.A{
						"$revenue_perhour", "$cost_perhour"}}}, 1, 0}}}}}},

				// Today
				{Key: "flight_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], 1, 0}}}}}},
				{Key: "seat_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_seat_configuration", 0}}}}}},
				{Key: "pax_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_passenger", 0}}}}}},
				{Key: "flh_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$flight_hour", 0}}}}}},
				{Key: "rev_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_revenue", 0}}}}}},
				{Key: "cost_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_cost", 0}}}}}},
				{Key: "profit_flight_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$and", Value: bson.A{
						findSpesific["find_last_date"],
						bson.D{{Key: "$gte", Value: bson.A{"$revenue_perhour", "$cost_perhour"}}},
					}}}, 1, 0}}}}}},
				{Key: "loss_flight_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$and", Value: bson.A{
						findSpesific["find_last_date"],
						bson.D{{Key: "$lt", Value: bson.A{"$revenue_perhour", "$cost_perhour"}}},
					}}}, 1, 0}}}}}},
			}},

			// metrik turunan (pakai field hasil $group)
			bson.M{"$addFields": bson.D{
				{Key: "route", Value: "$_id"},

				// Monthly
				{Key: "lf_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$seat_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$pax_monthly", "$seat_monthly"}}}, 0}}}},
				{Key: "rph_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_monthly", "$flh_monthly"}}}, 0}}}},
				{Key: "cph_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$cost_monthly", "$flh_monthly"}}}, 0}}}},
				{Key: "rpp_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$pax_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_monthly", "$pax_monthly"}}}, 0}}}},
				{Key: "profit_monthly", Value: bson.D{{Key: "$max", Value: bson.A{
					0, bson.D{{Key: "$subtract", Value: bson.A{"$rev_monthly", "$cost_monthly"}}}}}}},
				{Key: "loss_monthly", Value: bson.D{{Key: "$max", Value: bson.A{
					0, bson.D{{Key: "$subtract", Value: bson.A{"$cost_monthly", "$rev_monthly"}}}}}}},
				{Key: "profit_prstnc_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$profit_flight_monthly", "$flight_monthly"}}}, 0}}}},
				{Key: "loss_prstnc_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$loss_flight_monthly", "$flight_monthly"}}}, 0}}}},

				// Today
				{Key: "lf_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$seat_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$pax_daily", "$seat_daily"}}}, 0}}}},
				{Key: "rph_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_daily", "$flh_daily"}}}, 0}}}},
				{Key: "cph_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$cost_daily", "$flh_daily"}}}, 0}}}},
				{Key: "rpp_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$pax_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_daily", "$pax_daily"}}}, 0}}}},
				{Key: "profit_daily", Value: bson.D{{Key: "$max", Value: bson.A{
					0, bson.D{{Key: "$subtract", Value: bson.A{"$rev_daily", "$cost_daily"}}}}}}},
				{Key: "loss_daily", Value: bson.D{{Key: "$max", Value: bson.A{
					0, bson.D{{Key: "$subtract", Value: bson.A{"$cost_daily", "$rev_daily"}}}}}}},
				{Key: "profit_prstnc_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$profit_flight_daily", "$flight_daily"}}}, 0}}}},
				{Key: "loss_prstnc_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$loss_flight_daily", "$flight_daily"}}}, 0}}}},
			}},

			// score, stage terpisah karena memakai field dari stage sebelumnya
			bson.M{"$addFields": bson.D{
				{Key: "profit_score_monthly", Value: bson.D{{Key: "$multiply", Value: bson.A{"$profit_monthly", "$profit_prstnc_monthly"}}}},
				{Key: "loss_score_monthly", Value: bson.D{{Key: "$multiply", Value: bson.A{"$loss_monthly", "$loss_prstnc_monthly"}}}},
				{Key: "profit_score_daily", Value: bson.D{{Key: "$multiply", Value: bson.A{"$profit_daily", "$profit_prstnc_daily"}}}},
				{Key: "loss_score_daily", Value: bson.D{{Key: "$multiply", Value: bson.A{"$loss_daily", "$loss_prstnc_daily"}}}},
			}},

			// filter sort limit data
			// findSpesific["find_topbot"],
			findSpesific["sort_topbot"],
			bson.M{"$limit": 10},
			bson.M{"$project": bson.M{"_id": 0}},
		},

		// Time bucket
		"time_bucket": bson.A{
			bson.M{"$match": findSpesific["find_date"]},

			// agregasi per route
			bson.M{"$group": bson.D{
				{Key: "_id", Value: "$time_bucket_operating"},

				// Monthly
				{Key: "flight_monthly", Value: bson.D{{Key: "$sum", Value: 1}}},
				{Key: "seat_monthly", Value: bson.D{{Key: "$sum", Value: "$total_seat_configuration"}}},
				{Key: "pax_monthly", Value: bson.D{{Key: "$sum", Value: "$total_passenger"}}},
				{Key: "flh_monthly", Value: bson.D{{Key: "$sum", Value: "$flight_hour"}}},
				{Key: "rev_monthly", Value: bson.D{{Key: "$sum", Value: "$total_revenue"}}},
				{Key: "cost_monthly", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$multiply", Value: bson.A{"$cost_perhour", "$flight_hour"}}}}}},
				{Key: "profit_flight_monthly", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$gte", Value: bson.A{
						"$revenue_perhour", "$cost_perhour"}}}, 1, 0}}}}}},

				// Today
				{Key: "flight_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], 1, 0}}}}}},
				{Key: "seat_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_seat_configuration", 0}}}}}},
				{Key: "pax_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_passenger", 0}}}}}},
				{Key: "flh_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$flight_hour", 0}}}}}},
				{Key: "rev_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], "$total_revenue", 0}}}}}},
				{Key: "cost_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{findSpesific["find_last_date"], bson.D{
						{Key: "$multiply", Value: bson.A{"$cost_perhour", "$flight_hour"}}}, 0}}}}}},
				{Key: "profit_flight_daily", Value: bson.D{{Key: "$sum", Value: bson.D{
					{Key: "$cond", Value: bson.A{bson.D{{Key: "$and", Value: bson.A{
						findSpesific["find_last_date"],
						bson.D{{Key: "$gte", Value: bson.A{"$revenue_perhour", "$cost_perhour"}}},
					}}}, 1, 0}}}}}},
			}},

			// metrik turunan (pakai field hasil $group)
			bson.M{"$addFields": bson.D{
				{Key: "tbucket", Value: "$_id"},

				// Monthly
				{Key: "lf_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$seat_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$pax_monthly", "$seat_monthly"}}}, 0}}}},
				{Key: "rph_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_monthly", "$flh_monthly"}}}, 0}}}},
				{Key: "cph_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$cost_monthly", "$flh_monthly"}}}, 0}}}},
				{Key: "rpp_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$pax_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_monthly", "$pax_monthly"}}}, 0}}}},
				{Key: "profit_monthly", Value: bson.D{{Key: "$subtract", Value: bson.A{
					"$rev_monthly", "$cost_monthly"}}}},
				{Key: "profit_prstnc_monthly", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight_monthly", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$profit_flight_monthly", "$flight_monthly"}}}, 0}}}},

				// Today
				{Key: "lf_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$seat_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$pax_daily", "$seat_daily"}}}, 0}}}},
				{Key: "rph_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_daily", "$flh_daily"}}}, 0}}}},
				{Key: "cph_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flh_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$cost_daily", "$flh_daily"}}}, 0}}}},
				{Key: "rpp_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$pax_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$rev_daily", "$pax_daily"}}}, 0}}}},
				{Key: "profit_daily", Value: bson.D{{Key: "$subtract", Value: bson.A{
					"$rev_daily", "$cost_daily"}}}},
				{Key: "profit_prstnc_daily", Value: bson.D{{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$gt", Value: bson.A{"$flight_daily", 0}}},
					bson.D{{Key: "$divide", Value: bson.A{"$profit_flight_daily", "$flight_daily"}}}, 0}}}},
			}},

			// filter sort limit data
			bson.M{"$set": bson.M{"sortOrder": bson.M{"$indexOfArray": bson.A{
				bson.A{"Dawn", "Morning", "Afternoon", "Evening", "Night"}, "$tbucket"}}}},
			bson.M{"$sort": bson.M{"sortOrder": 1}},
			bson.M{"$project": bson.M{"_id": 0}},
		},
	}}})
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelFlight.FlightInsight]("flight_agregate", pipeline, page, limit, "xxx")
}

// Get Agregate
func GetAgregates(find bson.M, sort bson.D, page, limit int) (
	modelPublic.PublicPagedata[modelFlight.FlightAgregates], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelFlight.FlightAgregates]("flight_agregate", pipeline, page, limit)
}
