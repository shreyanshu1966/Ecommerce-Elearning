const CourseCard = ({ course }) => {
    return (
      <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
        <h3 className="text-lg font-bold">{course.title}</h3>
        <p className="text-sm text-gray-600">{course.description}</p>
      </div>
    );
  };
  
  export default CourseCard;
  