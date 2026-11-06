package handlerPublic

import (
	modelPublic "backend/public/models"
	"context"
	"errors"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

// Connect mongodb
func ConnectDB() {
	if MongoDomain == "" {
		log.Fatal("MONGO_URI tidak diset")
	}

	// Set max and min poolsize
	clientOpts := options.Client().
		ApplyURI(MongoDomain).
		SetMaxPoolSize(50).
		SetMinPoolSize(5).
		SetMaxConnIdleTime(30 * time.Second)

	// Connect to database
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(clientOpts)
	if err != nil {
		log.Fatalf("Gagal konek MongoDB: %v", err)
	}
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Ping MongoDB gagal: %v", err)
	}
	Client = client
}

// Input Bulkwrite to the database All
func PushSingle(mongoModel []mongo.WriteModel, collection string) error {

	// Select database and collection
	var table = Client.Database(MongoDBName).Collection(collection)
	var ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Insert batch into MongoDB
	options := options.BulkWrite().SetOrdered(false)
	_, err := table.BulkWrite(ctx, mongoModel, options)
	if err != nil {
		return errors.New("error bulk")
	}
	return err
}

// Input to the database All
func PushBulk(mapMongoModel map[string]*[]mongo.WriteModel, limit int) error {
	for key, mongoModel := range mapMongoModel {
		if len(*mongoModel) > limit {
			err := PushSingle(*mongoModel, key)
			if err != nil {
				return err
			}
			*mongoModel = []mongo.WriteModel{}
		}
	}
	return nil
}

// Push db
func PushDB(body any, collection string, bsonm bson.M) error {
	errPush := PushSingle([]mongo.WriteModel{
		mongo.NewUpdateOneModel().
			SetFilter(bsonm).
			SetUpdate(bson.M{"$set": body}).
			SetUpsert(true)}, collection)
	if errPush != nil {
		return errPush
	}
	return nil
}

// Get data from database with pagination using aggregation pipeline
func GetPagedata[T any](
	collection string,
	pipeline mongo.Pipeline,
	page, limit int, testx ...string) (modelPublic.PublicPagedata[T], error) {
	finalres := modelPublic.PublicPagedata[T]{Data: []T{}}

	// Connect to database
	table := Client.Database(MongoDBName).Collection(collection)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Salin pipeline supaya slice milik pemanggil tidak berubah, lalu tambah $facet
	stages := make(mongo.Pipeline, 0, len(pipeline)+1)
	stages = append(stages, pipeline...)

	// Set page and limit
	page = max(page, 1)
	limit = min(limit, 800000)
	dataPipeline := bson.A{}
	if limit != 0 {
		dataPipeline = append(dataPipeline,
			bson.D{{Key: "$skip", Value: (page - 1) * limit}},
			bson.D{{Key: "$limit", Value: limit}})
	}
	stages = append(stages, bson.D{
		{Key: "$facet", Value: bson.D{
			{Key: "data", Value: dataPipeline},
			{Key: "total", Value: bson.A{bson.D{
				{Key: "$count", Value: "count"}}}}}}})

	// Query database with aggregation pipeline
	cursor, err := table.Aggregate(ctx, stages)
	if err != nil {
		return finalres, err
	}
	defer cursor.Close(ctx)

	// Decode finalres into struct
	var facet []modelPublic.PublicFacet[T]
	if err := cursor.All(ctx, &facet); err != nil {
		return finalres, err
	}

	// Push to finalres
	if len(facet) > 0 {
		if facet[0].Data != nil {
			finalres.Data = facet[0].Data
		}
		if len(facet[0].Total) > 0 {
			finalres.Total = facet[0].Total[0].Count
		}
	}

	// If no data found return error
	if len(finalres.Data) == 0 {
		return finalres, errors.New("data not found")
	}

	// Final Result
	// if len(testx) > 0 {
	// 	fmt.Println("xxx")
	// 	fmt.Println(cursor)
	// 	b, _ := json.MarshalIndent(cursor, " ", " ")
	// 	fmt.Println(string(b))
	// 	fmt.Println(finalres)
	// 	fmt.Println("xxx")
	// }
	return finalres, nil
}
