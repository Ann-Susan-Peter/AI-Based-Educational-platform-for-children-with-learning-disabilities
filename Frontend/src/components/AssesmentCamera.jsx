import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './AssesmentCamera.css';

const AssessmentCamera = ({ onEmotionCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [emotion, setEmotion] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    let activeStream = null;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 } }
        });
        activeStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(error => console.error("Error playing video: ", error));
          };
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    if (isCapturing) {
      startVideo();
    }

    const intervalId = setInterval(() => {
      if (isCapturing && !minimized) {
        handleCapture();
      }
    }, 5000); // Capture image every 5 seconds

    return () => {
      clearInterval(intervalId);
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCapturing, minimized]);

  const captureImage = () => {
    if (!videoRef.current || !videoRef.current.videoWidth) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  const handleCapture = async () => {
    const imageData = captureImage();
    if (!imageData) return;

    try {
      const blob = await fetch(imageData).then(res => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      
      const response = await axios.post('http://localhost:5000/facedetection',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      const detectedEmotion = response.data.emotion;
      if (detectedEmotion) {
        setEmotion(detectedEmotion);
        if (onEmotionCapture) {
          onEmotionCapture(detectedEmotion);
        }
      }
    } catch (error) {
      console.error('Error processing emotion detection:', error);
    }
  };

  const toggleMinimize = () => setMinimized(!minimized);
  
  const toggleCapture = () => {
    if (isCapturing) {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      setIsCapturing(false);
    } else {
      setIsCapturing(true);
    }
  };

  const getEmotionEmoji = () => {
    switch(emotion?.toLowerCase()) {
      case 'happy':
      case 'happiness': return '😊';
      case 'sad':
      case 'sadness': return '😢';
      case 'angry':
      case 'anger': return '😠';
      case 'surprised':
      case 'surprise': return '😮';
      case 'fear':
      case 'fearful': return '😨';
      case 'neutral': return '😐';
      case 'disgust': return '🤢';
      default: return '📷';
    }
  };

  const getEmotionClass = () => {
    const em = emotion?.toLowerCase() || '';
    if (em.includes('hap')) return 'happy';
    if (em.includes('sad') || em.includes('fear')) return 'sad';
    if (em.includes('ang') || em.includes('disg')) return 'angry';
    if (em.includes('surpr')) return 'surprise';
    return '';
  };

  return (
    <div className={`emotion-camera-widget ${minimized ? 'minimized' : ''}`}>
      {minimized ? (
        <div className="minimized-pill" onClick={toggleMinimize} title="Click to expand emotion sensor">
          <div className="minimized-pill-left">
            <span className={`live-indicator ${!isCapturing ? 'paused' : ''}`}></span>
            <span className="pill-title">AI Emotion Sensor:</span>
            <span className="pill-emoji">{getEmotionEmoji()}</span>
            <span className="pill-text">{emotion ? `Detected: ${emotion}` : "Active (Evaluating Expression)"}</span>
          </div>
          <button className="pill-expand-btn">Expand Sensor ⌃</button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="camera-widget-header">
            <div className="camera-header-left">
              <span className={`live-indicator ${!isCapturing ? 'paused' : ''}`}></span>
              <span className="camera-title">Live Facial Emotion Sensor</span>
              <span className="camera-subtitle">(Real-time Adaptive Monitoring)</span>
            </div>
            <div className="camera-controls">
              <button 
                onClick={toggleCapture} 
                className={`camera-ctrl-btn ${isCapturing ? 'active-pause' : 'active-play'}`}
                title={isCapturing ? 'Pause emotion detection' : 'Resume emotion detection'}
              >
                {isCapturing ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button 
                onClick={toggleMinimize} 
                className="camera-ctrl-btn"
                title="Minimize sensor panel"
              >
                ⌄ Minimize
              </button>
              {onClose && (
                <button 
                  onClick={onClose} 
                  className="camera-ctrl-btn close-btn"
                  title="Hide camera"
                >
                  ✕ Close
                </button>
              )}
            </div>
          </div>

          {/* Main Content Area: Video + Feedback Info */}
          <div className="camera-body-grid">
            {/* Video Preview */}
            <div className="video-preview-wrapper">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`camera-video-feed ${!isCapturing ? 'paused' : ''}`} 
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {!isCapturing && (
                <div className="paused-overlay">
                  <span>⏸ Camera Paused</span>
                </div>
              )}

              {emotion && isCapturing && (
                <div className="floating-emotion-tag">
                  <span>{getEmotionEmoji()}</span>
                  <span>{emotion}</span>
                </div>
              )}
            </div>

            {/* Real-time feedback column */}
            <div className="emotion-status-footer">
              <div className="emotion-status-heading">Current Emotional State</div>
              <div className={`emotion-card ${getEmotionClass()}`}>
                <span className="emotion-card-emoji">{getEmotionEmoji()}</span>
                <div className="emotion-label-text">
                  <div className="emotion-detected-title">
                    {emotion ? emotion : 'Analyzing expressions...'}
                  </div>
                  <div className="emotion-detected-subtitle">
                    {isCapturing ? 'Auto-evaluating expression every 5s' : 'Detection currently paused'}
                  </div>
                </div>
              </div>
              <div className="emotion-support-hint">
                {emotion && emotion.toLowerCase().includes('hap') && "🌟 Great focus! You're performing with confidence!"}
                {emotion && (emotion.toLowerCase().includes('sad') || emotion.toLowerCase().includes('ang') || emotion.toLowerCase().includes('fear')) && 
                  "💡 Take your time! No rush at all — you're doing great."}
                {emotion && emotion.toLowerCase().includes('neutr') && "🎯 Focused and engaged in the assessment."}
                {!emotion && "Keep your face visible to the camera for real-time adaptive support."}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentCamera;