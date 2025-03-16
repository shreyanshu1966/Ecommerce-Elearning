import { useState, useEffect, useRef, useCallback } from "react";
import { Edit, Trash2, Save, X, Plus, BookOpen, User, Clock, ChevronDown, ChevronRight, Video, Layers, Upload, Calendar, Globe, Radio, RefreshCw, Eye } from "lucide-react";
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const CoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    instructor: "",
    curriculum: "",
    duration: "",
    lessons: "",
    level: "",
    instructorBio: "",
    instructorImage: "",
    category: "",
    modules: [],
  });

  const [editCourse, setEditCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [uploadingVideo, setUploadingVideo] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewStreamKey, setPreviewStreamKey] = useState(null);
  const [streamCheckInterval, setStreamCheckInterval] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await axiosInstance.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    try {
      const { data } = await axiosInstance.get(`/courses/${courseId}`);
      setModulesList(data.modules || []);
      setCurrentCourseId(courseId);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setModulesList([]);
    }
  };

  const addCourse = async () => {
    if (!newCourse.category) {
      alert("Category is required");
      return;
    }

    try {
      const {
        title,
        description,
        price,
        image,
        instructor,
        curriculum,
        duration,
        lessons,
        level,
        instructorBio,
        instructorImage,
        category,
      } = newCourse;

      const response = await axiosInstance.post('/courses', {
        title,
        description,
        price,
        image,
        instructor,
        curriculum: curriculum.split("\n").filter(item => item.trim() !== ""),
        duration: Number(duration) || 0,
        lessons: Number(lessons) || 0,
        level,
        instructorBio,
        instructorImage,
        category,
        modules: [],
      });

      fetchCourses();
      setNewCourse({
        title: "",
        description: "",
        price: "",
        image: "",
        instructor: "",
        curriculum: "",
        duration: "",
        lessons: "",
        level: "",
        instructorBio: "",
        instructorImage: "",
        category: "",
      });
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
      alert(`Failed to add course: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateCourse = async () => {
    if (!editCourse) return;

    if (!editCourse.category) {
      alert("Category is required");
      return;
    }

    try {
      const curriculumArray = editCourse.curriculum
        ? editCourse.curriculum.split("\n").map((line) => line.trim()).filter((line) => line !== "")
        : [];

      await axiosInstance.put(`/courses/${editCourse._id}`, {
        ...editCourse,
        curriculum: curriculumArray,
        duration: editCourse.duration ? Number(editCourse.duration) : 0,
        lessons: editCourse.lessons ? Number(editCourse.lessons) : 0,
        category: editCourse.category,
      });

      fetchCourses();
      setEditCourse(null);
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
      alert(`Failed to update course: ${error.response?.data?.message || error.message}`);
    }
  };

  const saveModules = async () => {
    try {
      await axiosInstance.put(`/courses/${currentCourseId}/modules`, {
        modules: modulesList,
      });
      fetchCourses();
      alert("Course modules updated successfully");
    } catch (error) {
      console.error("Error saving modules:", error);
      alert("Failed to save modules");
    }
  };

  const deleteCourse = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (course) => {
    setEditCourse({
      ...course,
      curriculum: (course.curriculum || []).join("\n"),
      duration: course.duration?.toString() || "",
      lessons: course.lessons?.toString() || "",
      level: course.level || "",
      instructorBio: course.instructorBio || "",
      instructorImage: course.instructorImage || "",
      category: course.category || "",
    });
  };

  const handleModuleClick = (courseId) => {
    setCurrentCourseId(courseId);
    fetchCourseDetails(courseId);
  };

  const addModule = () => {
    setModulesList([
      ...modulesList,
      {
        title: "New Module",
        description: "",
        lessons: []
      }
    ]);
  };

  const updateModule = (index, field, value) => {
    const updatedModules = [...modulesList];
    updatedModules[index][field] = value;
    setModulesList(updatedModules);
  };

  const deleteModule = (index) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    const updatedModules = [...modulesList];
    updatedModules.splice(index, 1);
    setModulesList(updatedModules);
  };

  const toggleModuleExpand = (index) => {
    setExpandedModules({
      ...expandedModules,
      [index]: !expandedModules[index]
    });
  };

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons = [
      ...(updatedModules[moduleIndex].lessons || []),
      {
        title: "New Lesson",
        description: "",
        videoUrl: "",
        duration: 0,
        isFree: false
      }
    ];
    setModulesList(updatedModules);
  };

  const updateLesson = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModulesList(updatedModules);
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModulesList(updatedModules);
  };

  // Improve the handleVideoUpload function with progress tracking
const handleVideoUpload = async (moduleIndex, lessonIndex, file) => {
  if (!currentCourseId || !file) return;
  
  // Validate file size before upload
  if (file.size > 100 * 1024 * 1024) { // 100 MB
    alert("File too large. Maximum size is 100MB.");
    return;
  }
  
  // Check file type
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    alert("Invalid file type. Only MP4, WebM, OGG and QuickTime formats are allowed.");
    return;
  }
  
  try {
    // Create FormData for the file upload
    const formData = new FormData();
    formData.append('video', file);
    
    // Set uploading state for this specific lesson
    setUploadingVideo({
      moduleIndex,
      lessonIndex,
      uploading: true,
      progress: 0
    });
    
    // Upload the video with progress tracking
    const { data } = await axiosInstance.post(
      `/courses/${currentCourseId}/modules/${moduleIndex}/lessons/${lessonIndex}/upload-video`,
      formData,
      { 
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingVideo(prev => ({
            ...prev,
            progress: percentCompleted
          }));
        }
      }
    );
    
    // Update the lesson with new video URL and thumbnail if available
    const updatedModules = [...modulesList];
    updatedModules[moduleIndex].lessons[lessonIndex].videoUrl = data.videoUrl;
    if (data.thumbnailUrl) {
    updatedModules[moduleIndex].lessons[lessonIndex].thumbnailUrl = data.thumbnailUrl;
    }
    setModulesList(updatedModules);
    
    // Clear uploading state after a short delay for better UX
    setTimeout(() => {
    setUploadingVideo({});
    }, 1000);
    
  } catch (error) {
    console.error('Error uploading video:', error);
    alert(`Failed to upload video: ${error.response?.data?.message || error.message}`);
    setUploadingVideo({});
  }
};

// Replace your current StreamPreview component with this version
const StreamPreview = ({ streamKey, onClose }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [streamInfo, setStreamInfo] = useState(null);
  
  // Create player safely
  const initPlayer = useCallback(() => {
    if (!streamKey || !videoRef.current) return null;
    
    // Safe cleanup of any existing player
    if (playerRef.current) {
      try {
        playerRef.current.dispose();
      } catch (err) {
        console.error('Error disposing player:', err);
      }
      playerRef.current = null;
    }
    
    setError(false);
    setIsLoading(true);
    
    try {
      // Create video element directly without using innerHTML
      const videoContainer = videoRef.current;
      // Clear any existing children safely
      while (videoContainer && videoContainer.firstChild) {
        videoContainer.removeChild(videoContainer.firstChild);
      }
      
      const videoElement = document.createElement('video');
      videoElement.className = 'video-js vjs-big-play-centered vjs-theme-fantasy';
      // Set explicit dimensions to ensure proper rendering
      videoElement.style.width = '100%';
      videoElement.style.height = '100%';
      videoContainer.appendChild(videoElement);
      
      // Initialize Video.js with improved settings
      const player = videojs(videoElement, {
        autoplay: true,
        controls: true,
        fluid: false, // Change to false when using explicit container
        fill: true, // Make player fill the container
        responsive: true,
        liveui: true,
        playbackRates: [0.5, 1, 1.5, 2],
        controlBar: {
          pictureInPictureToggle: false,
          fullscreenToggle: true,
        },
        sources: [{
          src: `http://${window.location.hostname}:8080/hls/${streamKey}.m3u8?t=${Date.now()}`,
          type: 'application/x-mpegURL'
        }],
        html5: {
          vhs: {
            overrideNative: true,
            enableLowInitialPlaylist: true,
          }
        }
      });
      
      // Force player dimensions after initialization
      setTimeout(() => {
        if (player) {
          player.dimensions('100%', '100%');
        }
      }, 100);

      // Set up event handlers with more detailed logging
      player.on('error', () => {
        console.warn('Video player error occurred:', player.error());
        setError(true);
        setIsLoading(false);
      });
      
      player.on('loadeddata', () => {
        setIsLoading(false);
        
        // Try to extract stream information
        try {
          const streamWidth = player.videoWidth();
          const streamHeight = player.videoHeight();
          const currentSrc = player.currentSource();
          
          setStreamInfo({
            resolution: streamWidth && streamHeight ? `${streamWidth}×${streamHeight}` : 'Unknown',
            format: currentSrc?.type || 'HLS Stream',
          });
        } catch (err) {
          console.error('Error getting stream info:', err);
        }
      });
      
      // Set up timeout for loading detection
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setError(true);
          setIsLoading(false);
        }
      }, 10000);
      
      playerRef.current = player;
      
      // Return cleanup function
      return () => {
        clearTimeout(timeoutId);
      };
    } catch (err) {
      console.error('Error initializing player:', err);
      setError(true);
      setIsLoading(false);
      return null;
    }
  }, [streamKey]);
  
  // Initialize player on mount
  useEffect(() => {
    const cleanupFunc = initPlayer();
    
    // Cleanup on unmount
    return () => {
      if (cleanupFunc) cleanupFunc();
      
      if (playerRef.current) {
        try {
          const player = playerRef.current;
          playerRef.current = null;
          player.dispose();
        } catch (err) {
          console.error('Error disposing player on unmount:', err);
        }
      }
    };
  }, [initPlayer]);
  
  // Same retry logic as before...
  useEffect(() => {
    let retryTimer;
    if (error && retryCount < 2) {
      retryTimer = setTimeout(() => {
        setRetryCount(count => count + 1);
        initPlayer();
      }, 5000);
    }
    
    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [error, retryCount, initPlayer]);
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-8 animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Radio className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-semibold text-gray-800">Stream Preview</h3>
            {streamInfo && (
              <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {streamInfo.resolution}
              </span>
            )}
          </div>
          
          <button 
            onClick={() => {
              if (playerRef.current) {
                try {
                  playerRef.current.dispose();
                  playerRef.current = null;
                } catch (err) {
                  console.error('Error during manual cleanup:', err);
                }
              }
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Fixed aspect ratio container with proper styling */}
        <div className="relative w-full pb-[56.25%] bg-black">
          <div ref={videoRef} className="absolute inset-0 w-full h-full"></div>
          
          {isLoading && !error && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent mb-3"></div>
              <p className="text-white text-sm">Connecting to stream...</p>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-red-100 text-red-500 p-3 rounded-full mb-4">
                <X className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Stream Not Available</h4>
              <p className="text-gray-300 mb-6 max-w-md">
                The stream may not be active or there might be network connectivity issues.
              </p>
              <div className="space-y-4 w-full max-w-md">
                <div className="bg-gray-800/50 p-3 rounded-lg">
                  <h5 className="text-sm font-medium text-white mb-2">Troubleshooting Tips:</h5>
                  <ul className="text-sm text-gray-300 list-disc list-inside space-y-1">
                    <li>Ensure OBS is actively streaming with the correct stream key</li>
                    <li>Check that your streaming software shows "Stream Active" status</li>
                    <li>Verify your network connection is stable</li>
                    <li>Try a lower bitrate in your streaming software</li>
                  </ul>
                </div>
                <button 
                  onClick={() => {
                    setRetryCount(count => count + 1);
                    initPlayer();
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 w-full max-w-xs mx-auto transition-colors"
                >
                  <RefreshCw className="h-4 w-4 animate-spin-slow" /> 
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">Stream Quality Check</span>
            <span className="text-xs text-gray-500">
              Verify audio clarity and video quality before going live
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setRetryCount(count => count + 1);
                initPlayer();
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded flex items-center gap-1.5 hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh Stream
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stream Status Indicator component
const StreamStatusIndicator = ({ status }) => {
  let bgColor, textColor, label;
  
  switch (status) {
    case 'live':
      bgColor = 'bg-red-100';
      textColor = 'text-red-700';
      label = 'Live';
      break;
    case 'starting':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-700';
      label = 'Starting soon';
      break;
    case 'ended':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-700';
      label = 'Ended';
      break;
    default:
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-700';
      label = 'Offline';
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status === 'live' && (
        <span className="relative flex h-2 w-2 mr-1">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 bg-red-500`}></span>
        </span>
      )}
      {label}
    </span>
  );
};

const handleStreamControl = async (moduleIndex, lessonIndex, currentStatus) => {
  try {
    let newStatus;
    if (currentStatus === 'starting' || currentStatus === 'live') {
      newStatus = 'ended';
      
      // Show confirmation if ending live stream
      if (currentStatus === 'live' && 
          !window.confirm('Are you sure you want to end this live stream? Students will no longer be able to view it.')) {
        return;
      }
    } else {
      newStatus = 'starting';
    }
    
    const { data } = await axiosInstance.post(
      `/streams/${currentCourseId}/modules/${moduleIndex}/lessons/${lessonIndex}/control`,
      { status: newStatus }
    );
    
    // Update the lesson with new status from server response safely
    setModulesList(prevModules => {
      const updatedModules = [...prevModules];
      if (updatedModules[moduleIndex] && updatedModules[moduleIndex].lessons[lessonIndex]) {
        updatedModules[moduleIndex].lessons[lessonIndex].streamStatus = data.streamStatus || newStatus;
      }
      return updatedModules;
    });
    
    toast.success(`Stream ${newStatus === 'starting' ? 'started' : 'ended'} successfully`);
    
    // If starting a stream, show instructions
    if (newStatus === 'starting') {
      toast.info('Now open OBS and start streaming using the provided stream key', {
        autoClose: 10000 // Show for 10 seconds
      });
    }
  } catch (error) {
    console.error('Error controlling stream:', error);
    toast.error('Failed to control stream: ' + (error.response?.data?.message || 'Unknown error'));
  }
};

const verifyStreamIsActive = async (streamKey) => {
  if (!streamKey) return false;
  
  try {
    // Use a cache-busting parameter to avoid cached responses
    const timestamp = Date.now();
    const response = await fetch(`http://${window.location.hostname}:8080/hls/${streamKey}.m3u8?t=${timestamp}`, {
      method: 'HEAD',
      cache: 'no-cache'
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error verifying stream status:", error);
    return false;
  }
};

useEffect(() => {
  // Skip the effect if no current course
  if (!currentCourseId || modulesList.length === 0) return;
  
  // Function to check stream status
  const checkStreamStatuses = async () => {
    try {
      // Fetch updated course data to sync stream statuses
      const { data } = await axiosInstance.get(`/courses/${currentCourseId}`);
      
      // Only update if there are actual status changes
      let hasChanges = false;
      
      const updatedModules = [...modulesList];
      if (data.modules && data.modules.length > 0) {
        data.modules.forEach((serverModule, moduleIdx) => {
          if (serverModule.lessons && updatedModules[moduleIdx]) {
            serverModule.lessons.forEach((serverLesson, lessonIdx) => {
              if (serverLesson.isLiveStream && 
                  updatedModules[moduleIdx]?.lessons[lessonIdx] &&
                  updatedModules[moduleIdx].lessons[lessonIdx].streamStatus !== serverLesson.streamStatus) {
                
                updatedModules[moduleIdx].lessons[lessonIdx].streamStatus = serverLesson.streamStatus;
                hasChanges = true;
              }
            });
          }
        });
        
        if (hasChanges) {
          setModulesList(updatedModules);
        }
      }
    } catch (error) {
      console.error('Error checking stream statuses:', error);
    }
  };
  
  // Check once when the component loads
  checkStreamStatuses();
  
  // Set up interval for checking
  const intervalId = setInterval(checkStreamStatuses, 15000);
  
  return () => {
    clearInterval(intervalId);
  };
}, [currentCourseId]); // Only re-run when course ID changes

  // Main component rendering
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>

      {/* Create Course Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-500" />
          Add New Course
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Basic Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                placeholder="Course Title"
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Course Category (e.g. Programming, Robotics)"
                value={newCourse.category}
                onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Course Description"
                value={newCourse.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  placeholder="Price"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCourse.image}
                  onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Additional Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                <input
                  type="number"
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Lessons</label>
                <input
                  type="number"
                  placeholder="Lessons"
                  value={newCourse.lessons}
                  onChange={(e) => setNewCourse({ ...newCourse, lessons: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level (e.g. Beginner)</label>
              <input
                type="text"
                placeholder="Level"
                value={newCourse.level}
                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instructor Name</label>
              <input
                type="text"
                placeholder="Instructor Name"
                value={newCourse.instructor}
                onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor Image URL</label>
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newCourse.instructorImage}
                  onChange={(e) => setNewCourse({ ...newCourse, instructorImage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Instructor Bio</label>
                <textarea
                  placeholder="Short bio"
                  value={newCourse.instructorBio}
                  onChange={(e) => setNewCourse({ ...newCourse, instructorBio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Curriculum</label>
              <textarea
                placeholder="One learning objective per line"
                value={newCourse.curriculum}
                onChange={(e) => setNewCourse({ ...newCourse, curriculum: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
              />
            </div>
          </div>
        </div>
        <button
          onClick={addCourse}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          <Plus className="h-5 w-5" />
          Create Course
        </button>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Existing Courses ({courses.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course._id}>
                  {editCourse && editCourse._id === course._id ? (
                    <td colSpan="5" className="p-4 bg-blue-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Edit Form Left Column */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                              value={editCourse.title}
                              onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                              placeholder="Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                              value={editCourse.description}
                              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                              placeholder="Description"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                              value={editCourse.image}
                              onChange={(e) => setEditCourse({ ...editCourse, image: e.target.value })}
                              placeholder="Image URL"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        {/* Edit Form Right Column */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Price</label>
                              <input
                                type="number"
                                value={editCourse.price}
                                onChange={(e) => setEditCourse({ ...editCourse, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Duration</label>
                              <input
                                type="number"
                                value={editCourse.duration}
                                onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Lessons</label>
                            <input
                              type="number"
                              value={editCourse.lessons}
                              onChange={(e) => setEditCourse({ ...editCourse, lessons: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Level</label>
                            <input
                              type="text"
                              value={editCourse.level}
                              onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}
                              placeholder="Level"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Instructor Image URL</label>
                              <input
                                type="text"
                                value={editCourse.instructorImage}
                                onChange={(e) => setEditCourse({ ...editCourse, instructorImage: e.target.value })}
                                placeholder="Image URL"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Instructor Bio</label>
                              <textarea
                                value={editCourse.instructorBio}
                                onChange={(e) => setEditCourse({ ...editCourse, instructorBio: e.target.value })}
                                placeholder="Bio"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Curriculum</label>
                            <textarea
                              value={editCourse.curriculum}
                              onChange={(e) => setEditCourse({ ...editCourse, curriculum: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <input
                              value={editCourse.category}
                              onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                              placeholder="Category"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-4">
                            <button
                              onClick={updateCourse}
                              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditCourse(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-12 w-12 object-cover rounded-md"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">${course.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          {course.instructor}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {course.duration}h
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-md"
                            title="Edit course details"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleModuleClick(course._id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-md"
                            title="Manage modules and lessons"
                          >
                            <Layers className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteCourse(course._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                            title="Delete course"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module and Lesson Manager */}
      {currentCourseId && (
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Course Modules & Lessons
            </h3>
            <button
              onClick={() => setCurrentCourseId(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <h4 className="text-md font-medium text-gray-700">
                {courses.find(c => c._id === currentCourseId)?.title || "Course"} - Modules
              </h4>
              <button
                onClick={addModule}
                className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            </div>

            {modulesList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No modules yet. Add your first module to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {modulesList.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleModuleExpand(moduleIndex)}
                          className="p-1 rounded-md hover:bg-gray-200"
                        >
                          {expandedModules[moduleIndex] ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={module.title}
                          onChange={(e) => updateModule(moduleIndex, "title", e.target.value)}
                          className="font-medium text-gray-800 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => addLesson(moduleIndex)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded flex items-center gap-1 hover:bg-green-600"
                        >
                          <Plus className="h-3 w-3" />
                          Lesson
                        </button>
                        <button
                          onClick={() => deleteModule(moduleIndex)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {expandedModules[moduleIndex] && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Module Description</label>
                          <textarea
                            value={module.description}
                            onChange={(e) => updateModule(moduleIndex, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md h-20"
                            placeholder="Enter module description..."
                          />
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Lessons ({module.lessons?.length || 0})</h5>
                          
                          {!module.lessons?.length ? (
                            <div className="text-sm text-gray-500 py-4 text-center border border-dashed border-gray-300 rounded-md">
                              No lessons yet. Add your first lesson.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="border border-gray-200 rounded-md p-3">
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2">
                                      <Video className="h-4 w-4 text-blue-500" />
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, "title", e.target.value)}
                                        className="font-medium text-gray-800 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                                      />
                                    </div>
                                    <button
                                      onClick={() => deleteLesson(moduleIndex, lessonIndex)}
                                      className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                      <textarea
                                        value={lesson.description}
                                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, "description", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-20"
                                        placeholder="Lesson description..."
                                      />
                                    </div>
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Video</label>
                                        <div className="space-y-2">
                                          {lesson.videoUrl && (
                                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded flex items-center justify-between">
                                              <span className="truncate">{lesson.videoUrl}</span>
                                              <button
                                                type="button"
                                                onClick={() => updateLesson(moduleIndex, lessonIndex, "videoUrl", "")}
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                &times;
                                              </button>
                                            </div>
                                          )}

                                          <div className="flex items-center space-x-2">
                                            <input
                                              type="text"
                                              value={lesson.videoUrl}
                                              onChange={(e) => updateLesson(moduleIndex, lessonIndex, "videoUrl", e.target.value)}
                                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                              placeholder="External URL or upload"
                                            />
                                            
                                            <label className="relative cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors">
                                              <Upload className="h-4 w-4" />
                                              <input 
                                                type="file" 
                                                className="sr-only" 
                                                accept="video/mp4,video/webm,video/ogg"
                                                onChange={(e) => {
                                                  if (e.target.files?.[0]) {
                                                    handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0]);
                                                  }
                                                }}
                                              />
                                            </label>
                                          </div>
                                          
                                          {uploadingVideo.moduleIndex === moduleIndex && 
                                          uploadingVideo.lessonIndex === lessonIndex && 
                                          uploadingVideo.uploading && (
                                            <div className="flex items-center space-x-2 text-xs text-blue-600">
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                              <span>Uploading video...</span>
                                            </div>
                                          )}
                                          
                                          <p className="text-xs text-gray-500">
                                            Max file size: 100MB. Supported formats: MP4, WebM, OGG
                                          </p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">Duration (min)</label>
                                          <input
                                            type="number"
                                            value={lesson.duration}
                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "duration", Number(e.target.value))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                            placeholder="0"
                                          />
                                        </div>
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id={`free-${moduleIndex}-${lessonIndex}`}
                                            checked={lesson.isFree}
                                            onChange={(e) => updateLesson(moduleIndex, lessonIndex, "isFree", e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                          />
                                          <label htmlFor={`free-${moduleIndex}-${lessonIndex}`} className="ml-2 text-xs font-medium text-gray-700">
                                            Preview (Free)
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Live Stream Option */}
                                  <div className="mt-4 border-t pt-4">
                                    <label className="block text-xs font-medium text-gray-700 mb-2">Lesson Type</label>
                                    <div className="flex items-center space-x-4 mb-3">
                                      <label className="flex items-center">
                                        <input
                                          type="radio"
                                          checked={!lesson.isLiveStream}
                                          onChange={() => updateLesson(moduleIndex, lessonIndex, "isLiveStream", false)}
                                          className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Video Upload</span>
                                      </label>
                                      
                                      <label className="flex items-center">
                                        <input
                                          type="radio"
                                          checked={lesson.isLiveStream}
                                          onChange={() => updateLesson(moduleIndex, lessonIndex, "isLiveStream", true)}
                                          className="h-4 w-4 text-blue-600 border-gray-300"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Live Stream</span>
                                      </label>
                                    </div>
                                    
                                    {lesson.isLiveStream && (
                                      <div className="space-y-4">
                                        {/* Stream Key section */}
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                          {lesson.streamKey ? (
                                            <>
                                              <div className="flex items-center justify-between mb-2">
                                                <div className="font-medium text-sm">Stream Key</div>
                                                <div className={`text-xs px-2 py-1 rounded-full ${
                                                  lesson.streamStatus === 'live' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                  {lesson.streamStatus === 'live' ? 'LIVE' : 'Offline'}
                                                </div>
                                              </div>
                                              <div className="flex items-center">
                                                <input
                                                  type="password"
                                                  value={lesson.streamKey}
                                                  readOnly
                                                  className="text-xs bg-gray-100 border border-gray-300 rounded px-2 py-1 flex-grow"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    navigator.clipboard.writeText(lesson.streamKey);
                                                    alert('Stream key copied to clipboard');
                                                  }}
                                                  className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                                >
                                                  Copy
                                                </button>
                                              </div>
                                              <div className="mt-2 text-xs text-gray-500">
                                                RTMP URL: rtmp://{window.location.hostname}:1935/live
                                              </div>
                                              <div className="mt-1 text-xs text-gray-500">
                                                Stream Key: {lesson.streamKey} (Keep this private)
                                              </div>
                                              
                                              {/* Add stream control buttons */}
                                              <div className="mt-3 flex space-x-2">
                                                <button
                                                  type="button"
                                                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                                                    lesson.streamStatus === 'starting' || lesson.streamStatus === 'live'
                                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                  }`}
                                                  onClick={async () => handleStreamControl(moduleIndex, lessonIndex, lesson.streamStatus)}
                                                >
                                                  {lesson.streamStatus === 'starting' || lesson.streamStatus === 'live'
                                                    ? 'End Stream'
                                                    : 'Start Stream'}
                                                </button>
                                                
                                                <button
                                                  type="button"
                                                  className="px-3 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1 ml-2"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (lesson.streamKey) {
                                                      setPreviewStreamKey(lesson.streamKey);
                                                      setShowPreview(true);
                                                    } else {
                                                      toast.error("No stream key available");
                                                    }
                                                  }}
                                                  disabled={!lesson.streamKey}
                                                >
                                                  <Eye className="h-3 w-3" /> Preview Stream
                                                </button>
                                                
                                                <div className="px-3 py-1 text-xs rounded-md bg-gray-100 flex items-center">
                                                  Status: <StreamStatusIndicator status={lesson.streamStatus} />
                                                </div>
                                              </div>
                                            </>
                                          ) : (
                                            <div className="text-center py-2">
                                              <button
                                                type="button"
                                                onClick={async () => {
                                                  try {
                                                    const { data } = await axiosInstance.post(
                                                      `/streams/${currentCourseId}/modules/${moduleIndex}/lessons/${lessonIndex}/generate-key`
                                                    );
                                                    // Update the lesson with stream key
                                                    const updatedModules = [...modulesList];
                                                    updatedModules[moduleIndex].lessons[lessonIndex].streamKey = data.streamKey;
                                                    setModulesList(updatedModules);
                                                  } catch (error) {
                                                    console.error('Error generating stream key:', error);
                                                    alert('Failed to generate stream key');
                                                  }
                                                }}
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded flex items-center gap-1 mx-auto hover:bg-blue-600"
                                              >
                                                <Radio className="h-3 w-3" />
                                                Generate Stream Key
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {/* Schedule Stream */}
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Schedule Stream (Optional)
                                          </label>
                                          <input
                                            type="datetime-local"
                                            value={lesson.scheduledStartTime ? new Date(lesson.scheduledStartTime).toISOString().slice(0, 16) : ''}
                                            onChange={async (e) => {
                                              // Update lesson locally
                                              const updatedModules = [...modulesList];
                                              updatedModules[moduleIndex].lessons[lessonIndex].scheduledStartTime = e.target.value;
                                              setModulesList(updatedModules);
                                              
                                              // Save to server
                                              try {
                                                await axiosInstance.post(
                                                  `/streams/${currentCourseId}/modules/${moduleIndex}/lessons/${lessonIndex}/schedule`,
                                                  { scheduledStartTime: e.target.value }
                                                );
                                              } catch (error) {
                                                console.error('Error scheduling stream:', error);
                                              }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                          />
                                        </div>
                                        
                                        <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-800">
                                          <div className="font-medium mb-1">How to stream:</div>
                                          <ol className="list-decimal list-inside space-y-1">
                                            <li>Use OBS Studio or similar software</li>
                                            <li>Set up "Custom" streaming service</li>
                                            <li>Enter RTMP URL and Stream Key</li>
                                            <li>Configure your video/audio sources</li>
                                            <li>Click "Start Streaming" in OBS</li>
                                          </ol>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={saveModules}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                Save All Modules
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Render the stream preview modal when active */}
      {showPreview && previewStreamKey && (
        <StreamPreview 
          streamKey={previewStreamKey} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
};

export default CoursesAdmin;
