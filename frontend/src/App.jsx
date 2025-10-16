// import React, { useState, useEffect } from 'react';
// import { AlertCircle } from 'lucide-react';
// import './App.css'

// // Import all the new components
// import Header from './components/Header';
// import IdCardCaptureModal from './components/IdCardCaptureModal';
// import SelfieCaptureModal from './components/SelfieCaptureModal';
// import ImageUploadContainer from './components/ImageUploadContainer';
// import ActionButtons from './components/ActionButtons';
// import ProgressDisplay from './components/ProgressDisplay';

// export default function App() {
//   const [idCard, setIdCard] = useState(null);
//   const [selfie, setSelfie] = useState(null);
//   const [isIdModalOpen, setIsIdModalOpen] = useState(false);
//   const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);
//   const [isValidating, setIsValidating] = useState(false);
//   const [validationSteps, setValidationSteps] = useState({ upload: 'pending', layout: 'pending', face: 'pending', field: 'pending', result: 'pending' });
//   const [finalResult, setFinalResult] = useState(null);
//   const [error, setError] = useState(null);

//   const resetState = () => {
//     setIsValidating(false);
//     setValidationSteps({ upload: 'pending', layout: 'pending', face: 'pending', field: 'pending', result: 'pending' });
//     setFinalResult(null);
//     setError(null);
//   };
  
//   const handleReset = () => {
//     setIdCard(null);
//     setSelfie(null);
//     resetState();
//   };

//   const handleIdCapture = (imageBase64) => { setIdCard(imageBase64); setIsIdModalOpen(false); };
//   const handleSelfieCapture = (imageBase64) => { setSelfie(imageBase64); setIsSelfieModalOpen(false); };
  
//   const handleSubmit = async () => {
//     if (!idCard || !selfie) { setError('Please provide both ID Card and Selfie images'); return; }
//     setError(null);
//     resetState();
//     setValidationSteps(prev => ({ ...prev, upload: 'completed' }));
//     setIsValidating(true);
  
//     try {
//       const response = await fetch('http://localhost:8000/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_card: idCard, selfie: selfie }) });
//       if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
//       const data = await response.json();
//       const sse = new EventSource(`http://localhost:8000/verify/stream/${data.task_id}`);
  
//       sse.onmessage = (event) => {
//         const progress = JSON.parse(event.data);
//         const stepsOrder = ['layout', 'face', 'field', 'grant'];
//         const currentStepIndex = stepsOrder.indexOf(progress.step);
        
//         setValidationSteps(prev => {
//           const newSteps = { ...prev };
//           for (let i = 0; i < currentStepIndex; i++) newSteps[stepsOrder[i]] = 'completed';
//           if(progress.step !== 'done') newSteps[progress.step] = 'processing';
//           return newSteps;
//         });
  
//         if (progress.status === 'success' || progress.status === 'failed') {
//           setFinalResult({ status: progress.status, message: progress.message });
//           setValidationSteps(prev => ({ ...prev, layout: 'completed', face: 'completed', field: 'completed', result: progress.status }));
//           setIsValidating(false);
//           sse.close();
//         }
//       };
//       sse.onerror = () => { throw new Error('Connection to server lost during verification.'); };
//     } catch (err) {
//       setError(err.message || 'Failed to start verification process.');
//       setIsValidating(false);
//       setFinalResult({ status: 'failed', message: err.message });
//       setValidationSteps(prev => ({...prev, result: 'failed'}));
//     }
//   };

//   useEffect(() => {
//     if (idCard && selfie && !isValidating) setValidationSteps(prev => ({ ...prev, upload: 'completed' }));
//     else if (!idCard || !selfie) {
//         setValidationSteps({ upload: 'pending', layout: 'pending', face: 'pending', field: 'pending', result: 'pending' });
//         setFinalResult(null);
//         setError(null);
//     }
//   }, [idCard, selfie, isValidating]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
//       {isIdModalOpen && <IdCardCaptureModal onCapture={handleIdCapture} onclose={() => setIsIdModalOpen(false)} />}
//       {isSelfieModalOpen && <SelfieCaptureModal onCapture={handleSelfieCapture} onclose={() => setIsSelfieModalOpen(false)} />}

//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl -top-32 -left-32 sm:-top-48 sm:-left-48 animate-pulse" />
//         <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-32 -right-32 sm:-bottom-48 sm:-right-48 animate-pulse" style={{ animationDelay: '1s' }} />
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         <Header />

//         <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 lg:p-10 mb-8 border border-white/20">
//           <ImageUploadContainer
//             idCard={idCard}
//             selfie={selfie}
//             onOpenIdModal={() => setIsIdModalOpen(true)}
//             onOpenSelfieModal={() => setIsSelfieModalOpen(true)}
//             onClearId={() => setIdCard(null)}
//             onClearSelfie={() => setSelfie(null)}
//           />
          
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 shadow-lg">
//               <AlertCircle className="w-7 h-7 text-red-500" />
//               <p className="text-red-700 font-semibold text-lg">{error}</p>
//             </div>
//           )}
          
//           <ActionButtons
//             onSubmit={handleSubmit}
//             onReset={handleReset}
//             isValidating={isValidating}
//             canSubmit={idCard && selfie}
//           />
//         </div>

//         <ProgressDisplay
//           validationSteps={validationSteps}
//           finalResult={finalResult}
//           isValidating={isValidating}
//         />
//       </div>
//       <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}.animate-shimmer{animation:shimmer 2s infinite}@keyframes slide-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.animate-slide-up{animation:slide-up .6s ease-out}`}</style>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import './App.css'

// Import all the components
import Header from './components/Header';
import IdCardCaptureModal from './components/IdCardCaptureModal';
import SelfieCaptureModal from './components/SelfieCaptureModal';
import ImageUploadContainer from './components/ImageUploadContainer';
import ActionButtons from './components/ActionButtons';
import ProgressDisplay from './components/ProgressDisplay';

export default function App() {
  const [idCard, setIdCard] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isSelfieModalOpen, setIsSelfieModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSteps, setValidationSteps] = useState({ upload: 'pending', layout: 'pending', face: 'pending', field: 'pending', result: 'pending' });
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState(null);

  // --- MODIFIED: Ref for auto-scrolling ---
  const progressRef = useRef(null);

  const resetState = () => {
    setIsValidating(false);
    setValidationSteps({ upload: 'pending', layout: 'pending', face: 'pending', field: 'pending', result: 'pending' });
    setFinalResult(null);
    setError(null);
  };
  
  const handleReset = () => {
    setIdCard(null);
    setSelfie(null);
    resetState();
  };

  const handleIdCapture = (imageBase64) => { setIdCard(imageBase64); setIsIdModalOpen(false); };
  const handleSelfieCapture = (imageBase64) => { setSelfie(imageBase64); setIsSelfieModalOpen(false); };
  
  const handleSubmit = async () => {
    if (!idCard || !selfie) { setError('Please provide both ID Card and Selfie images'); return; }
    setError(null);
    resetState();
    setValidationSteps(prev => ({ ...prev, upload: 'completed' }));
    setIsValidating(true);
  
    // --- MODIFIED: Auto-scroll logic ---
    setTimeout(() => {
        progressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetch('http://localhost:8000/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_card: idCard, selfie: selfie }) });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      const data = await response.json();
      const sse = new EventSource(`http://localhost:8000/verify/stream/${data.task_id}`);
  
      sse.onmessage = (event) => {
        const progress = JSON.parse(event.data);
        const stepsOrder = ['layout', 'face', 'field', 'grant'];
        
        // --- MODIFIED: State logic for failed and skipped steps ---
        if (progress.status === 'failed') {
            setFinalResult({ status: 'failed', message: progress.message });
            setValidationSteps(prev => {
                const newSteps = { ...prev };
                const failedStepIndex = stepsOrder.indexOf(progress.step);
                
                // Mark previous steps as completed
                for (let i = 0; i < failedStepIndex; i++) {
                    newSteps[stepsOrder[i]] = 'completed';
                }
                // Mark the current step as failed
                newSteps[progress.step] = 'failed';
                // Mark subsequent steps as skipped
                for (let i = failedStepIndex + 1; i < stepsOrder.length; i++) {
                    newSteps[stepsOrder[i]] = 'skipped';
                }
                newSteps.result = 'failed';
                return newSteps;
            });
            setIsValidating(false);
            sse.close();
        } else if (progress.status === 'success') {
            setFinalResult({ status: 'success', message: progress.message });
            setValidationSteps(prev => ({ ...prev, layout: 'completed', face: 'completed', field: 'completed', result: 'completed' }));
            setIsValidating(false);
            sse.close();
        } else { // Still processing
            const currentStepIndex = stepsOrder.indexOf(progress.step);
            setValidationSteps(prev => {
              const newSteps = { ...prev };
              for (let i = 0; i < currentStepIndex; i++) newSteps[stepsOrder[i]] = 'completed';
              newSteps[progress.step] = 'processing';
              return newSteps;
            });
        }
      };
      sse.onerror = () => { throw new Error('Connection to server lost during verification.'); };
    } catch (err) {
      setError(err.message || 'Failed to start verification process.');
      setIsValidating(false);
      setFinalResult({ status: 'failed', message: err.message });
      setValidationSteps(prev => ({...prev, result: 'failed'}));
    }
  };

  useEffect(() => {
    if (idCard && selfie && !isValidating) setValidationSteps(prev => ({ ...prev, upload: 'completed' }));
    else if (!idCard || !selfie) {
        resetState();
    }
  }, [idCard, selfie, isValidating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 sm:py-12 px-4 sm:px-6 relative overflow-hidden">
      {isIdModalOpen && <IdCardCaptureModal onCapture={handleIdCapture} onclose={() => setIsIdModalOpen(false)} />}
      {isSelfieModalOpen && <SelfieCaptureModal onCapture={handleSelfieCapture} onclose={() => setIsSelfieModalOpen(false)} />}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl -top-32 -left-32 sm:-top-48 sm:-left-48 animate-pulse" />
        <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl -bottom-32 -right-32 sm:-bottom-48 sm:-right-48 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Header />

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 lg:p-10 mb-8 border border-white/20">
          <ImageUploadContainer
            idCard={idCard}
            selfie={selfie}
            onOpenIdModal={() => setIsIdModalOpen(true)}
            onOpenSelfieModal={() => setIsSelfieModalOpen(true)}
            onClearId={() => setIdCard(null)}
            onClearSelfie={() => setSelfie(null)}
          />
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center gap-3 shadow-lg">
              <AlertCircle className="w-7 h-7 text-red-500" />
              <p className="text-red-700 font-semibold text-lg">{error}</p>
            </div>
          )}
          
          <ActionButtons
            onSubmit={handleSubmit}
            onReset={handleReset}
            isValidating={isValidating}
            canSubmit={idCard && selfie}
            finalResult={finalResult} // Pass the result to the component
          />
        </div>

        {/* --- MODIFIED: Pass the ref to the component --- */}
        <ProgressDisplay
          ref={progressRef}
          validationSteps={validationSteps}
          finalResult={finalResult}
          isValidating={isValidating}
        />
      </div>
      <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}.animate-shimmer{animation:shimmer 2s infinite}@keyframes slide-up{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.animate-slide-up{animation:slide-up .6s ease-out}`}</style>
    </div>
  );
}