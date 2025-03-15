import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Lock, PlayCircle, ChevronDown, ChevronRight, Radio, RefreshCw } from 'lucide-react';
import axiosInstance from '../utils/axiosConfig';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const CourseContentPlayer = ({ courseId, userEnrolled }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [streamInfo, setStreamInfo] = useState(null);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

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

  // Add or update the fetchStreamInfo function
  const fetchStreamInfo = async (module, lesson) => {
    if (!lesson.isLiveStream) return;
    
    try {
      const moduleIndex = course.modules.indexOf(module);
      const lessonIndex = module.lessons.indexOf(lesson);
      
      const { data } = await axiosInstance.get(
        `/streams/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}/info`
      );
      
      // Add timestamp to URL to avoid caching issues
      data.fullPlaybackUrl = `http://${window.location.hostname}:8080/hls/${data.streamKey}.m3u8?t=${Date.now()}`;
      
      // Only update the player if stream status has changed
      const statusChanged = !streamInfo || streamInfo.streamStatus !== data.streamStatus;
      
      setStreamInfo(data);
      
      // If stream comes back online, refresh the player
      if (statusChanged && data.streamStatus === 'live' && playerRef.current) {
        console.log('Stream status changed to live, refreshing player');
        playerRef.current.src({
          src: data.fullPlaybackUrl,
          type: 'application/x-mpegURL'
        });
        playerRef.current.play();
      }
    } catch (error) {
      console.error('Error fetching stream info:', error);
    }
  };

  const handleLessonClick = (module, lesson) => {
    // Allow only free lessons or all lessons if enrolled
    if (lesson.isFree || userEnrolled) {
      setActiveModule(module);
      setActiveLesson(lesson);
      
      // Fetch stream info if this is a live stream
      if (lesson.isLiveStream) {
        fetchStreamInfo(module, lesson);
      } else {
        setStreamInfo(null);
      }
    }
  };

  useEffect(() => {
    if (!activeLesson?.isLiveStream || !streamInfo) return;
    
    // Clean up previous player instance if it exists
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    
    // Only initialize VideoJS if we're showing a livestream
    if (videoRef.current) {
      const videoElement = document.createElement('video');
      videoElement.className = 'video-js vjs-big-play-centered';
      videoRef.current.innerHTML = '';
      videoRef.current.appendChild(videoElement);
      
      const player = videojs(videoElement, {
        autoplay: true,  // Changed to true for live streams
        controls: true,
        fluid: true,
        responsive: true,
        liveui: true,    // Enable live UI features
        liveTracker: {
          trackingThreshold: 0,
          liveTolerance: 15
        },
        html5: {
          hls: {
            overrideNative: true,
            withCredentials: false,
            enableLowInitialPlaylist: true,
            smoothQualityChange: true,
            bandwidth: 5000000  // Higher bandwidth for better quality
          }
        },
        sources: [{
          src: `http://${window.location.hostname}:8080/hls/${streamInfo.streamKey}.m3u8`,
          type: 'application/x-mpegURL'
        }]
      });
      
      // Add error recovery
      player.on('error', function() {
        console.error('Video player error:', player.error());
        
        // Try to recover after a brief delay
        setTimeout(() => {
          if (playerRef.current) {
            playerRef.current.src({
              src: `http://${window.location.hostname}:8080/hls/${streamInfo.streamKey}.m3u8?t=${Date.now()}`,
              type: 'application/x-mpegURL'
            });
            playerRef.current.play();
          }
        }, 3000);
      });
      
      // Handle network reconnection
      player.on('waiting', function() {
        console.log('Video is waiting for data...');
      });
      
      // Add this to your player initialization
      player.ready(() => {
        // Create reconnect mechanism
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        
        const attemptReconnect = () => {
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
            
            player.src({
              src: `http://${window.location.hostname}:8080/hls/${streamInfo.streamKey}.m3u8?t=${Date.now()}`,
              type: 'application/x-mpegURL'
            });
            
            player.play().catch(err => {
              console.error('Error during reconnect attempt:', err);
              // Try again after delay
              setTimeout(attemptReconnect, 2000);
            });
          } else {
            console.error('Maximum reconnect attempts reached');
            // Reset counter after a longer delay
            setTimeout(() => {
              reconnectAttempts = 0;
            }, 30000);
          }
        };
        
        // Listen for playback stall
        player.on('stalled', () => {
          console.log('Playback stalled, attempting to recover...');
          setTimeout(attemptReconnect, 1000);
        });
        
        // Listen for playback errors
        player.on('error', () => {
          console.error('Player error, attempting to recover...');
          setTimeout(attemptReconnect, 1000);
        });
        
        // Listen for network errors
        window.addEventListener('online', () => {
          if (playerRef.current) {
            console.log('Network connection restored, attempting to reconnect...');
            reconnectAttempts = 0; // Reset counter on network restore
            setTimeout(attemptReconnect, 1000);
          }
        });

        // Add to player initialization
        // Keep-alive ping to avoid player from timing out
        const keepAliveInterval = setInterval(() => {
          if (playerRef.current && streamInfo?.streamStatus === 'live') {
            console.log('Sending keep-alive ping to player');
            
            // Force a small seek to keep the connection active
            const currentTime = playerRef.current.currentTime();
            if (currentTime > 0) {
              // Seek to current position to refresh the connection
              playerRef.current.currentTime(currentTime);
            }
          }
        }, 30000); // Every 30 seconds

        // Clear interval on component unmount
        return () => {
          clearInterval(statusInterval);
          clearInterval(keepAliveInterval);
          if (playerRef.current) {
            playerRef.current.dispose();
            playerRef.current = null;
          }
        };
      });
      
      playerRef.current = player;
      
      // More frequent polling for live status and automatic recovery
      const statusInterval = setInterval(async () => {
        if (activeLesson?.isLiveStream && activeModule) {
          await fetchStreamInfo(moduleIndex, lessonIndex);
          
          // If player has stopped but stream is live, try to restart playback
          if (streamInfo?.streamStatus === 'live' && player.paused()) {
            console.log('Attempting to restart paused live stream...');
            player.src({
              src: `http://${window.location.hostname}:8080/hls/${streamInfo.streamKey}.m3u8?t=${Date.now()}`,
              type: 'application/x-mpegURL'
            });
            player.play();
          }
        }
      }, 5000); // Check every 5 seconds
      
      return () => {
        clearInterval(statusInterval);
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, [activeLesson, streamInfo]);

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
                          ) : lesson.isLiveStream ? (
                            <Radio className={`h-4 w-4 ${lesson.streamStatus === 'live' ? 'text-red-500' : 'text-gray-400'}`} />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={activeLesson === lesson ? 'font-medium' : ''}>
                            {lesson.title}
                            {lesson.isLiveStream && lesson.streamStatus === 'live' && (
                              <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">LIVE</span>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs">
                          {lesson.duration && !lesson.isLiveStream && (
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
                {activeLesson.isLiveStream ? (
                  <div className="w-full h-full relative" ref={videoRef}>
                    {streamInfo?.streamStatus !== 'live' ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white">
                        <Radio className="h-12 w-12 mb-3" />
                        <h3 className="text-lg font-medium">
                          {streamInfo?.scheduledStartTime 
                            ? `Stream scheduled for ${new Date(streamInfo.scheduledStartTime).toLocaleString()}` 
                            : 'Stream is currently offline'}
                        </h3>
                        {streamInfo?.streamStatus === 'ended' && (
                          <p className="mt-2 text-gray-300">This live stream has ended</p>
                        )}
                      </div>
                    ) : (
                      // Add reload button overlay
                      <button 
                        onClick={() => {
                          if (playerRef.current) {
                            playerRef.current.src({
                              src: `http://${window.location.hostname}:8080/hls/${streamInfo.streamKey}.m3u8?t=${Date.now()}`,
                              type: 'application/x-mpegURL'
                            });
                            playerRef.current.play();
                          }
                        }}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 z-10"
                        title="Reload stream"
                      >
                        <RefreshCw className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                ) : activeLesson.videoUrl ? (
                  activeLesson.videoUrl.startsWith('/uploads') ? (
                    // Local video file with improved player
                    <div className="w-full h-full relative">
                      <video 
                        src={`${import.meta.env.VITE_API_BASE_URL}${activeLesson.videoUrl}`}
                        title={activeLesson.title}
                        controls
                        controlsList="nodownload"
                        className="w-full h-full rounded-md"
                        poster={`${import.meta.env.VITE_API_BASE_URL}/uploads/thumbnails/default-video-thumb.jpg`}
                        preload="metadata"
                        onError={(e) => {
                          console.error("Video error:", e);
                          e.target.onerror = null;
                          e.target.src = ""; 
                          e.target.parentElement.innerHTML = `
                            <div class="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-100 rounded-md">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p>Error loading video</p>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    // External video URL (like YouTube embed)
                    <iframe
                      src={activeLesson.videoUrl}
                      title={activeLesson.title}
                      allowFullScreen
                      className="w-full h-full rounded-md"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-100 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>No video available for this lesson</p>
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