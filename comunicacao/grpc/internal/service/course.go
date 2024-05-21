package service

import (
	"context"
	"io"

	"github.com/marco-moreiraf/grpc/internal/database"
	"github.com/marco-moreiraf/grpc/internal/pb"
)

type CourseService struct {
	pb.UnimplementedCourseServiceServer
	CourseDB database.Course
}

func NewCourseService(courseDB database.Course) *CourseService {
	return &CourseService{
		CourseDB: courseDB,
	}
}

func (c *CourseService) CreateCourse(ctx context.Context, input *pb.CreateCourseRequest) (*pb.Course, error) {
	course, err := c.CourseDB.Create(input.Name, input.Description, input.CategoryId)
	if err != nil {
		return nil, err
	}

	return &pb.Course{
		Id:          course.ID,
		Name:        course.Name,
		Description: course.Name,
		CategoryId:  course.CategoryID,
	}, nil
}

func (c *CourseService) CreateCourseStream(stream pb.CourseService_CreateCourseStreamServer) error {
	courses := pb.CourseList{}

	for {
		course, err := stream.Recv()
		if err == io.EOF {
			return stream.SendAndClose(&courses)
		}
		if err != nil {
			return err
		}

		courseResult, err := c.CourseDB.Create(course.Name, course.Description, course.CategoryId)
		if err != nil {
			return err
		}

		courses.Courses = append(courses.Courses, &pb.Course{
			Id:          courseResult.ID,
			Name:        courseResult.Name,
			Description: courseResult.Description,
			CategoryId:  courseResult.CategoryID,
		})
	}
}

func (c *CourseService) CreateCourseStreamBidirectional(stream pb.CourseService_CreateCourseStreamBidirectionalServer) error {
	for {
		course, err := stream.Recv()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return err
		}

		courseResult, err := c.CourseDB.Create(course.Name, course.Description, course.CategoryId)
		if err != nil {
			return err
		}

		err = stream.Send(&pb.Course{
			Id:          courseResult.ID,
			Name:        courseResult.Name,
			Description: courseResult.Description,
			CategoryId:  courseResult.CategoryID,
		})
		if err != nil {
			return err
		}
	}
}

func (c *CourseService) ListCourses(ctx context.Context, input *pb.Blank) (*pb.CourseList, error) {
	courses, err := c.CourseDB.FindAll()
	if err != nil {
		return nil, err
	}

	coursesResult := &pb.CourseList{}

	for _, course := range courses {
		coursesResult.Courses = append(coursesResult.Courses, &pb.Course{
			Id:          course.ID,
			Name:        course.Name,
			Description: course.Description,
			CategoryId:  course.CategoryID,
		})
	}

	return coursesResult, nil
}

func (c *CourseService) GetCourse(ctx context.Context, input *pb.CourseGetRequest) (*pb.Course, error) {
	course, err := c.CourseDB.FindByID(input.Id)
	if err != nil {
		return nil, err
	}

	return &pb.Course{
		Id:          course.ID,
		Name:        course.Name,
		Description: course.Description,
		CategoryId:  course.CategoryID,
	}, nil
}
