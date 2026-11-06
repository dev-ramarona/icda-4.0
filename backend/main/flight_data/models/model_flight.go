package modelFlight

// Flight Initials data
type FlightInitials struct {
	Airlines []FlightInitialsItems[string] `bson:"airlines,omitempty" json:"airlines,omitempty"`
	Regions  []FlightInitialsItems[string] `bson:"regions,omitempty" json:"regions,omitempty"`
	Dates    []FlightInitialsItems[int32]  `bson:"dates,omitempty" json:"dates,omitempty"`
}
type FlightInitialsItems[T any] struct {
	ID T `bson:"_id"`
}

// Flight Insight data
type FlightInsight struct {
	Trend   []FlightInsightTrend   `bson:"trend_revph,omitempty" json:"trend_revph,omitempty"`
	Topbot  []FlightInsightTopbot  `bson:"top_bottom,omitempty" json:"top_bottom,omitempty"`
	Tbucket []FlightInsightTbucket `bson:"time_bucket,omitempty" json:"time_bucket,omitempty"`
}
type FlightInsightTrend struct {
	Dot          string  `bson:"dot,omitempty" json:"dot,omitempty"`
	Day          string  `bson:"day,omitempty" json:"day,omitempty"`
	Date         int32   `bson:"date,omitempty" json:"date,omitempty"`
	Cph          float64 `bson:"cph" json:"cph"`
	Flight       int32   `bson:"flight" json:"flight"`
	Seat         int32   `bson:"seat" json:"seat"`
	Pax          int32   `bson:"pax" json:"pax"`
	Lf           float64 `bson:"lf" json:"lf"`
	Flh          float64 `bson:"flh" json:"flh"`
	Rev          float64 `bson:"rev" json:"rev"`
	Cost         float64 `bson:"cost" json:"cost"`
	Rph          float64 `bson:"rph" json:"rph"`
	Rpp          float64 `bson:"rpp" json:"rpp"`
	ProfitFlight int32   `bson:"profit_flight" json:"profit_flight"`
	Profit       float64 `bson:"profit" json:"profit"`
	ProfitPrstnc float64 `bson:"profit_prstnc" json:"profit_prstnc"`
}

type FlightInsightTopbot struct {
	Route               string  `bson:"route" json:"route"`
	FlightDaily         int32   `bson:"flight_daily" json:"flight_daily"`
	SeatDaily           int32   `bson:"seat_daily" json:"seat_daily"`
	PaxDaily            int32   `bson:"pax_daily" json:"pax_daily"`
	LfDaily             float64 `bson:"lf_daily" json:"lf_daily"`
	FlhDaily            float64 `bson:"flh_daily" json:"flh_daily"`
	RevDaily            float64 `bson:"rev_daily" json:"rev_daily"`
	CostDaily           float64 `bson:"cost_daily" json:"cost_daily"`
	RphDaily            float64 `bson:"rph_daily" json:"rph_daily"`
	CphDaily            float64 `bson:"cph_daily" json:"cph_daily"`
	RppDaily            float64 `bson:"rpp_daily" json:"rpp_daily"`
	ProfitFlightDaily   int32   `bson:"profit_flight_daily" json:"profit_flight_daily"`
	LossFlightDaily     int32   `bson:"loss_flight_daily" json:"loss_flight_daily"`
	ProfitDaily         float64 `bson:"profit_daily" json:"profit_daily"`
	LossDaily           float64 `bson:"loss_daily" json:"loss_daily"`
	ProfitPrstncDaily   float64 `bson:"profit_prstnc_daily" json:"profit_prstnc_daily"`
	ProfitScoreDaily    float64 `bson:"profit_score_daily" json:"profit_score_daily"`
	LossPrstncDaily     float64 `bson:"loss_prstnc_daily" json:"loss_prstnc_daily"`
	LossScoreDaily      float64 `bson:"loss_score_daily" json:"loss_score_daily"`
	FlightMonthly       int32   `bson:"flight_monthly" json:"flight_monthly"`
	SeatMonthly         int32   `bson:"seat_monthly" json:"seat_monthly"`
	PaxMonthly          int32   `bson:"pax_monthly" json:"pax_monthly"`
	LfMonthly           float64 `bson:"lf_monthly" json:"lf_monthly"`
	FlhMonthly          float64 `bson:"flh_monthly" json:"flh_monthly"`
	RevMonthly          float64 `bson:"rev_monthly" json:"rev_monthly"`
	CostMonthly         float64 `bson:"cost_monthly" json:"cost_monthly"`
	RphMonthly          float64 `bson:"rph_monthly" json:"rph_monthly"`
	CphMonthly          float64 `bson:"cph_monthly" json:"cph_monthly"`
	RppMonthly          float64 `bson:"rpp_monthly" json:"rpp_monthly"`
	ProfitFlightMonthly int32   `bson:"profit_flight_monthly" json:"profit_flight_monthly"`
	LossFlightMonthly   int32   `bson:"loss_flight_monthly" json:"loss_flight_monthly"`
	ProfitMonthly       float64 `bson:"profit_monthly" json:"profit_monthly"`
	LossMonthly         float64 `bson:"loss_monthly" json:"loss_monthly"`
	ProfitPrstncMonthly float64 `bson:"profit_prstnc_monthly" json:"profit_prstnc_monthly"`
	ProfitScoreMonthly  float64 `bson:"profit_score_monthly" json:"profit_score_monthly"`
	LossPrstncMonthly   float64 `bson:"loss_prstnc_monthly" json:"loss_prstnc_monthly"`
	LossScoreMonthly    float64 `bson:"loss_score_monthly" json:"loss_score_monthly"`
}
type FlightInsightTbucket struct {
	Tbucket             string  `bson:"tbucket" json:"tbucket"`
	FlightDaily         int32   `bson:"flight_daily" json:"flight_daily"`
	SeatDaily           int32   `bson:"seat_daily" json:"seat_daily"`
	PaxDaily            int32   `bson:"pax_daily" json:"pax_daily"`
	LfDaily             float64 `bson:"lf_daily" json:"lf_daily"`
	FlhDaily            float64 `bson:"flh_daily" json:"flh_daily"`
	RevDaily            float64 `bson:"rev_daily" json:"rev_daily"`
	CostDaily           float64 `bson:"cost_daily" json:"cost_daily"`
	RphDaily            float64 `bson:"rph_daily" json:"rph_daily"`
	CphDaily            float64 `bson:"cph_daily" json:"cph_daily"`
	RppDaily            float64 `bson:"rpp_daily" json:"rpp_daily"`
	ProfitFlightDaily   int32   `bson:"profit_flight_daily" json:"profit_flight_daily"`
	ProfitDaily         float64 `bson:"profit_daily" json:"profit_daily"`
	ProfitPrstncDaily   float64 `bson:"profit_prstnc_daily" json:"profit_prstnc_daily"`
	FlightMonthly       int32   `bson:"flight_monthly" json:"flight_monthly"`
	SeatMonthly         int32   `bson:"seat_monthly" json:"seat_monthly"`
	PaxMonthly          int32   `bson:"pax_monthly" json:"pax_monthly"`
	LfMonthly           float64 `bson:"lf_monthly" json:"lf_monthly"`
	FlhMonthly          float64 `bson:"flh_monthly" json:"flh_monthly"`
	RevMonthly          float64 `bson:"rev_monthly" json:"rev_monthly"`
	CostMonthly         float64 `bson:"cost_monthly" json:"cost_monthly"`
	RphMonthly          float64 `bson:"rph_monthly" json:"rph_monthly"`
	CphMonthly          float64 `bson:"cph_monthly" json:"cph_monthly"`
	RppMonthly          float64 `bson:"rpp_monthly" json:"rpp_monthly"`
	ProfitFlightMonthly int32   `bson:"profit_flight_monthly" json:"profit_flight_monthly"`
	ProfitMonthly       float64 `bson:"profit_monthly" json:"profit_monthly"`
	ProfitPrstncMonthly float64 `bson:"profit_prstnc_monthly" json:"profit_prstnc_monthly"`
}
type FlightInsightKpi struct {
	Rph    float64 `bson:"rph,omitempty" json:"rph,omitempty"`
	Rphprv float64 `bson:"rphprv,omitempty" json:"rphprv,omitempty"`
	Rpp    float64 `bson:"rpp,omitempty" json:"rpp,omitempty"`
	Rppprv float64 `bson:"rppprv,omitempty" json:"rppprv,omitempty"`
	Pax    int32   `bson:"pax,omitempty" json:"pax,omitempty"`
	Paxprv int32   `bson:"paxprv,omitempty" json:"paxprv,omitempty"`
	Lf     float64 `bson:"lf,omitempty" json:"lf,omitempty"`
	Lfprv  int32   `bson:"lfprv,omitempty" json:"lfprv,omitempty"`
	Flh    float64 `bson:"flh,omitempty" json:"flh,omitempty"`
	Flhprv float64 `bson:"flhprv,omitempty" json:"flhprv,omitempty"`
}
type FlightInsightKpiPrev struct {
	Pax  int32   `bson:"pax,omitempty" json:"pax,omitempty"`
	Seat int32   `bson:"seat,omitempty" json:"seat,omitempty"`
	Flh  float64 `bson:"flh,omitempty" json:"flh,omitempty"`
	Rev  float64 `bson:"rev,omitempty" json:"rev,omitempty"`
}

// Flight Agregates
type FlightAgregates struct {
	Primary_key              string  `bson:"primary_key,omitempty" json:"primary_key,omitempty"`
	Airline_operating        string  `bson:"airline_operating,omitempty" json:"airline_operating,omitempty"`
	Aircraft_type            string  `bson:"aircraft_type,omitempty" json:"aircraft_type,omitempty"`
	Departure                string  `bson:"departure,omitempty" json:"departure,omitempty"`
	Flight_hour              float64 `bson:"flight_hour,omitempty" json:"flight_hour,omitempty"`
	Flight_number_marketing  string  `bson:"flight_number_marketing,omitempty" json:"flight_number_marketing,omitempty"`
	Flight_number_join       string  `bson:"flight_number_join,omitempty" json:"flight_number_join,omitempty"`
	Flight_number_operating  string  `bson:"flight_number_operating,omitempty" json:"flight_number_operating,omitempty"`
	Flight_status            string  `bson:"flight_status,omitempty" json:"flight_status,omitempty"`
	Day_operating            string  `bson:"day_operating,omitempty" json:"day_operating,omitempty"`
	Date_operating           int32   `bson:"date_operating,omitempty" json:"date_operating,omitempty"`
	Month_operating          int32   `bson:"month_operating,omitempty" json:"month_operating,omitempty"`
	Time_operating           int64   `bson:"time_operating,omitempty" json:"time_operating,omitempty"`
	Time_bucket_operating    string  `bson:"time_bucket_operating,omitempty" json:"time_bucket_operating,omitempty"`
	Region                   string  `bson:"region,omitempty" json:"region,omitempty"`
	Route_operating          string  `bson:"route_operating,omitempty" json:"route_operating,omitempty"`
	Seat_configuration       string  `bson:"seat_configuration,omitempty" json:"seat_configuration,omitempty"`
	Total_seat_configuration int32   `bson:"total_seat_configuration,omitempty" json:"total_seat_configuration,omitempty"`
	Total_passenger          int32   `bson:"total_passenger,omitempty" json:"total_passenger,omitempty"`
	Total_fare_nta           float64 `bson:"total_fare_nta,omitempty" json:"total_fare_nta,omitempty"`
	Revenue_perhour          float64 `bson:"revenue_perhour,omitempty" json:"revenue_perhour,omitempty"`
	Cost_perhour             float64 `bson:"cost_perhour,omitempty" json:"cost_perhour,omitempty"`
	Total_taxes_yq           float64 `bson:"total_taxes_yq,omitempty" json:"total_taxes_yq,omitempty"`
	Total_fare_ancillary     float64 `bson:"total_fare_ancillary,omitempty" json:"total_fare_ancillary,omitempty"`
	Total_fare_q             float64 `bson:"total_fare_q,omitempty" json:"total_fare_q,omitempty"`
	Total_taxes_yr           float64 `bson:"total_taxes_yr,omitempty" json:"total_taxes_yr,omitempty"`
	Load_factor              float64 `bson:"load_factor,omitempty" json:"load_factor,omitempty"`
	Total_cost               float64 `bson:"total_cost,omitempty" json:"total_cost,omitempty"`
	Total_revenue            float64 `bson:"total_revenue,omitempty" json:"total_revenue,omitempty"`
}
