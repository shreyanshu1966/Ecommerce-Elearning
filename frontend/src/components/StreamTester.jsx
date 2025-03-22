import React, { useState, useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const StreamTester = () => {
  const [streamKey, setStreamKey] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const initPlayer = () => {
    if (!streamKey || !videoRef.current) return;
    
    setLoading(true);
    
    // Clean up previous player instance
    if (playerRef.current) {
      playerRef.current.dispose();
      playerRef.current = null;
    }
    
    const videoElement = document.createElement('video');
    videoElement.className = 'video-js vjs-big-play-centered';
    videoRef.current.innerHTML = '';
    videoRef.current.appendChild(videoElement);
    
    const player = videojs(videoElement, {
      autoplay: true,
      controls: true,
      fluid: true,
      sources: [{
        src: `https://api.intuitiverobotics.in/hls/${streamKey}.m3u8?t=${Date.now()}`,
        type: 'application/x-mpegURL'
      }],
      html5: {
        vhs: {
          overrideNative: true
        }
      }
    });
    
    player.on('error', () => {
      console.error('Player error:', player.error());
    });
    
    player.on('loadeddata', () => {
      setLoading(false);
    });
    
    player.ready(() => {
      console.log('Player is ready');
      playerRef.current = player;
    });
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Stream Tester</h2>
      <div className="mb-4">
        <input
          type="text"
          value={streamKey}
          onChange={(e) => setStreamKey(e.target.value)}
          placeholder="Enter stream key..."
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>
      <button 
        onClick={initPlayer}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Test Stream
      </button>
      
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden">
        <div ref={videoRef} className="w-full h-full">
          {!playerRef.current && !loading && (
            <div className="flex items-center justify-center h-full text-gray-500">
              Enter a stream key and click "Test Stream"
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamTester;