import React, { useState, useEffect } from 'react';
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronRight } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';

const CourseContentPlayer = ({ courseId, userEnrolled }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  // Fetch course details with modules and lessons
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/courses/${courseId}`);
        setCourse(data);
        
        // Set initial active module and lesson if available
        if (data.modules && data.modules.length > 0) {
          setActiveModule(data.modules[0]);
          
          // Set first lesson as active, or first free lesson if user is not enrolled
          const firstModule = data.modules[0];
          if (firstModule.lessons && firstModule.lessons.length > 0) {
            if (userEnrolled) {
              setActiveLesson(firstModule.lessons[0]);
            } else {
              // If not enrolled, find the first free lesson
              const freeLesson = firstModule.lessons.find(lesson => lesson.isFree) || firstModule.lessons[0];
              setActiveLesson(freeLesson);
            }
          }
          
          // Expand the first module by default
          setExpandedModules({ 0: true });
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course content");
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, userEnrolled]);

  const toggleModuleExpand = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };

  const handleLessonClick = (module, lesson) => {
    // Allow only free lessons or all lessons if enrolled
    if (lesson.isFree || userEnrolled) {
      setActiveModule(module);
      setActiveLesson(lesson);
    }
  };

  if (loading) {
    return (
      <div className="py-10 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="py-10">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          No course content available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="grid md:grid-cols-3 divide-x divide-gray-200">
        {/* Course Sidebar - Module and Lesson List */}
        <div className="md:col-span-1 border-r border-gray-200 overflow-y-auto max-h-[600px]">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Course Content</h3>
            <p className="text-sm text-gray-500 mt-1">
              {course.modules.reduce((total, module) => total + (module.lessons?.length || 0), 0)} Lessons •{" "}
              {course.duration} hours
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {course.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border-b border-gray-200">
                <button
                  onClick={() => toggleModuleExpand(moduleIndex)}
                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-2">
                    {expandedModules[moduleIndex] ? (
                      <ChevronDown className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium">{module.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {module.lessons?.length || 0} lessons
                  </span>
                </button>
                
                {expandedModules[moduleIndex] && module.lessons && (
                  <div className="bg-gray-50 pl-10 pr-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <button
                        key={lessonIndex}
                        onClick={() => handleLessonClick(module, lesson)}
                        disabled={!lesson.isFree && !userEnrolled}
                        className={`flex items-center justify-between w-full py-3 px-2 text-left border-t border-gray-200 ${
                          activeLesson === lesson ? 'bg-blue-50' : ''
                        } ${!lesson.isFree && !userEnrolled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          {!lesson.isFree && !userEnrolled ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : activeLesson === lesson ? (
                            <PlayCircle className="h-4 w-4 text-blue-500" />
                          ) : lesson.isFree ? (
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={activeLesson === lesson ? 'font-medium' : ''}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center text-xs">
                          {lesson.duration && (
                            <span className="text-gray-500">{lesson.duration} min</span>
                          )}
                          {lesson.isFree && (
                            <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                              Free
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Video Player and Lesson Content */}
        <div className="md:col-span-2 flex flex-col">
          {activeLesson ? (
            <>
              <div className="aspect-w-16 aspect-h-9 bg-black">
                {activeLesson.videoUrl ? (
                  <iframe
                    src={activeLesson.videoUrl}
                    title={activeLesson.title}
                    allowFullScreen
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No video available for this lesson
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{activeLesson.title}</h2>
                  {!userEnrolled && !activeLesson.isFree && (
                    <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      Preview not available
                    </div>
                  )}
                </div>
                
                {activeLesson.description && (
                  <div className="prose max-w-none text-gray-600">
                    <p>{activeLesson.description}</p>
                  </div>
                )}
                
                {!userEnrolled && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-700">
                      Purchase this course to access all lessons and resources.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-10 text-center text-gray-500">
              Select a lesson to start learning
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentPlayer;