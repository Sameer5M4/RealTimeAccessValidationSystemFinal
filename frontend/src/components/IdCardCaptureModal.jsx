import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const IdCardCaptureModal = ({ onCapture, onclose }) => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative">
        <button onClick={onclose} className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-full text-2xl text-gray-500 hover:text-gray-800 shadow-lg">&times;</button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">Capture ID Card</h2>
        {showCamera ? (
          <div className="relative w-full">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="rounded-lg w-full" videoConstraints={{ facingMode: "environment" }} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-11/12 h-3/5 border-4 border-dashed border-white/80 rounded-lg"></div></div>
            <div className="flex gap-4 mt-4">
              <button onClick={capture} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">Capture ID</button>
              <button onClick={() => setShowCamera(false)} className="flex-1 bg-gray-400 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors">Back</button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <button onClick={() => setShowCamera(true)} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">Open Camera</button>
            <p className="text-center text-gray-500">OR</p>
            <button onClick={() => fileInputRef.current.click()} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition-colors">Upload a file</button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        )}
      </div>
    </div>
  );
};

export default IdCardCaptureModal;