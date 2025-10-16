// import React from 'react';
// import { Loader2, RotateCcw, Sparkles } from 'lucide-react';

// const ActionButtons = ({ onSubmit, onReset, isValidating, canSubmit }) => {
//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//       <button 
//         onClick={onSubmit} 
//         disabled={isValidating || !canSubmit} 
//         className={`w-full sm:w-auto flex-grow py-4 rounded-xl sm:rounded-2xl font-bold text-white text-lg sm:text-xl transition-all transform relative overflow-hidden ${isValidating || !canSubmit ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/50 hover:scale-[1.02]'}`}
//       >
//         <span className="relative z-10 flex items-center justify-center gap-3">
//           {isValidating ? <><Loader2 className="w-6 h-6 animate-spin" />Validating...</> : <><Sparkles className="w-6 h-6" />Start Validation</>}
//         </span>
//         {!isValidating && canSubmit && (<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />)}
//       </button>
//       <button 
//         onClick={onReset} 
//         disabled={isValidating} 
//         className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl sm:rounded-2xl font-bold bg-gray-200 text-gray-700 text-lg sm:text-xl transition-all hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center gap-3"
//       >
//         <RotateCcw className="w-6 h-6" /> Reset
//       </button>
//     </div>
//   );
// };

// export default ActionButtons;

import React from 'react';
import { Loader2, RotateCcw, Sparkles, DoorOpen, ShieldX } from 'lucide-react';

const ActionButtons = ({ onSubmit, onReset, isValidating, canSubmit, finalResult }) => {
  // Determine which icon to show for the "Reset" button based on the validation result
  const getResetIcon = () => {
    if (finalResult?.status === 'success') {
      return <DoorOpen className="w-6 h-6" />;
    }
    if (finalResult?.status === 'failed') {
      return <ShieldX className="w-6 h-6" />;
    }
    // Default icon
    return <RotateCcw className="w-6 h-6" />;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button 
        onClick={onSubmit} 
        disabled={isValidating || !!finalResult} // Disable if validating OR if there's already a result
        className={`w-full sm:w-auto flex-grow py-4 rounded-xl sm:rounded-2xl font-bold text-white text-lg sm:text-xl transition-all transform relative overflow-hidden ${isValidating || !canSubmit || finalResult ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/50 hover:scale-[1.02]'}`}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isValidating ? <><Loader2 className="w-6 h-6 animate-spin" />Validating...</> : <><Sparkles className="w-6 h-6" />Start Validation</>}
        </span>
        {!isValidating && canSubmit && !finalResult && (<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />)}
      </button>
      
      {/* The Reset button now shows a dynamic icon and text */}
      <button 
        onClick={onReset} 
        disabled={isValidating} 
        className={`w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl transition-all hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center gap-3 ${finalResult ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-700'}`}
      >
        {getResetIcon()}
        {finalResult ? 'Start Over' : 'Reset'}
      </button>
    </div>
  );
};

export default ActionButtons;