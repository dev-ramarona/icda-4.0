package modelPublic

// Public pagedata output standar.
type PublicPagedata[T any] struct {
	Data  []T   `json:"data"`
	Total int64 `json:"total"`
}

// Public facet standor decode facet
type PublicFacet[T any] struct {
	Data  []T `bson:"data"`
	Total []struct {
		Count int64 `bson:"count"`
	} `bson:"total"`
}
