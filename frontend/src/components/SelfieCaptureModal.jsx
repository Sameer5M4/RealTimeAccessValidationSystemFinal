import React, { useState, useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from '@vladmandic/face-api';

const SelfieCaptureModal = ({ onCapture, onclose }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [captureMessage, setCaptureMessage] = useState("Loading Models...");

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)]);
      setModelsLoaded(true);
      setCaptureMessage("Position your face in the oval");
    };
    loadModels();
  }, []);

  const captureAndCropFace = useCallback(async () => {
    if (!webcamRef.current || !canvasRef.current || !webcamRef.current.video || webcamRef.current.video.readyState !== 4) return false;
    const video = webcamRef.current.video;
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

    if (detections.length === 1) {
      setCaptureMessage("Face detected! Hold still...");
      const { box } = detections[0];
      const padding = 30;
      const canvas = canvasRef.current;
      canvas.width = box.width + 2 * padding;
      canvas.height = box.height + 2 * padding;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, box.x - padding, box.y - padding, box.width + 2 * padding, box.height + 2 * padding, 0, 0, canvas.width, canvas.height);
      onCapture(canvas.toDataURL('image/jpeg'));
      return true;
    }
    return false;
  }, [onCapture]);

  useEffect(() => {
    let interval;
    if (modelsLoaded) {
      interval = setInterval(async () => {
        const success = await captureAndCropFace();
        if (success) clearInterval(interval);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [modelsLoaded, captureAndCropFace]);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative">
        <button onClick={onclose} className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full text-2xl text-gray-500 hover:text-gray-800 shadow-lg">&times;</button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">Capture Selfie</h2>
        <div className="relative">
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg w-full" videoConstraints={{ facingMode: "user" }} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-4/5 h-11/12 border-4 border-dashed border-white/80" style={{ borderRadius: '50%' }} /></div>
          <p className="text-center mt-4 text-lg font-medium bg-black/50 text-white p-2 rounded-lg">{captureMessage}</p>
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default SelfieCaptureModal;