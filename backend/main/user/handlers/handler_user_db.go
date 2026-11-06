package handlerUser

import (
	modelUser "backend/main/user/models"
	handlerPublic "backend/public/handlers"
	modelPublic "backend/public/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Get Account
func GetAccounts(find bson.M, sort bson.D, page, limit int) (modelPublic.PublicPagedata[modelUser.UserAccounts], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelUser.UserAccounts]("user_account", pipeline, page, limit)
}

// Get Screens
func GetScreens(find bson.M, sort bson.D, page, limit int) (modelPublic.PublicPagedata[modelUser.UserScreens], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelUser.UserScreens]("user_screen", pipeline, page, limit)
}

// Get role
func GetRoles(find bson.M, sort bson.D, page, limit int) (modelPublic.PublicPagedata[modelUser.UserRoles], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelUser.UserRoles]("user_role", pipeline, page, limit)
}

// Get key roles
func GetKeyRoles(find bson.M, sort bson.D, page, limit int) ([]string, error) {
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: find}},
		{{Key: "$project", Value: bson.D{
			{Key: "rolekey", Value: 1},
			{Key: "_id", Value: 0}}}},
	}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	rolekey := []string{}
	role, err := handlerPublic.GetPagedata[modelUser.UserRoles]("user_role", pipeline, page, limit)
	if err != nil {
		return rolekey, err
	}
	for _, role := range role.Data {
		rolekey = append(rolekey, role.RoleKey)
	}
	return rolekey, nil
}

// Get Formats
func GetFormats(find bson.M, sort bson.D, page, limit int) (modelPublic.PublicPagedata[modelUser.UserFormats], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelUser.UserFormats]("user_format", pipeline, page, limit)
}

// Get key formats
func GetKeyFormats(find bson.M, sort bson.D, page, limit int) ([]string, error) {
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: find}},
		{{Key: "$project", Value: bson.D{
			{Key: "formatkey", Value: 1},
			{Key: "_id", Value: 0}}}},
	}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	formatkey := []string{}
	format, err := handlerPublic.GetPagedata[modelUser.UserFormats]("user_format", pipeline, page, limit)
	if err != nil {
		return formatkey, err
	}
	for _, format := range format.Data {
		formatkey = append(formatkey, format.FormatKey)
	}
	return formatkey, nil
}

// // Get screen
// func GetScreens(find bson.M, options *options.FindOptionsBuilder) ([]modelUser.UserScreens, error) {

// 	// Get user role from database
// 	var table = handlerPublic.Client.Database(handlerPublic.MongoDBName).Collection("user_screen")
// 	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
// 	defer cancel()

// 	// Get list screen
// 	var screens []modelUser.UserScreens
// 	cursor, err := table.Find(ctx, find, options)
// 	if err != nil {
// 		return screens, err
// 	}
// 	defer cursor.Close(ctx)

// 	// Return slice list user
// 	for cursor.Next(ctx) {
// 		var screen modelUser.UserScreens
// 		if err := cursor.Decode(&screen); err != nil {
// 			screens = append(screens, screen)
// 			return screens, err
// 		}
// 		screens = append(screens, screen)
// 	}

// 	// Cek if data isset
// 	if len(screens) == 0 {
// 		return screens, errors.New("data not found")
// 	}
// 	return screens, nil
// }

// Get permits
func GetPermits(find bson.M, sort bson.D, page, limit int) (modelPublic.PublicPagedata[modelUser.UserPermits], error) {
	pipeline := mongo.Pipeline{{{Key: "$match", Value: find}}}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	return handlerPublic.GetPagedata[modelUser.UserPermits]("user_permit", pipeline, page, limit)
}

// Get key permits
func GetKeyPermits(find bson.M, sort bson.D, page, limit int) ([]string, error) {
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: find}},
		{{Key: "$project", Value: bson.D{
			{Key: "permitkey", Value: 1},
			{Key: "_id", Value: 0}}}},
	}
	if len(sort) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$sort", Value: sort}})
	}
	permitkey := []string{}
	permit, err := handlerPublic.GetPagedata[modelUser.UserPermits]("user_permit", pipeline, page, limit)
	if err != nil {
		return permitkey, err
	}
	for _, permit := range permit.Data {
		permitkey = append(permitkey, permit.PermitKey)
	}
	return permitkey, nil
}
