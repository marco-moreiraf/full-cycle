package main

import (
	"database/sql"
	"net"

	"github.com/marco-moreiraf/grpc/internal/database"
	"github.com/marco-moreiraf/grpc/internal/pb"
	"github.com/marco-moreiraf/grpc/internal/service"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "./db.sqlite")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	categoryDb := database.NewCategory(db)
	categoryService := service.NewCategoryService(*categoryDb)

	courseDb := database.NewCourse(db)
	courseService := service.NewCourseService(*courseDb)

	grpcServer := grpc.NewServer()
	pb.RegisterCategoryServiceServer(grpcServer, categoryService)
	pb.RegisterCourseServiceServer(grpcServer, courseService)
	reflection.Register(grpcServer)

	listener, err := net.Listen("tcp", ":50051")
	if err != nil {
		panic(err)
	}

	if err := grpcServer.Serve(listener); err != nil {
		panic(err)
	}
}
