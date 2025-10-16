import React from 'react';
import { AlertCircle, CheckCircle, ClipboardCheck, FileCheck, Loader2, Users, XCircle, MinusCircle, DoorOpen, ShieldX } from 'lucide-react';
import ValidationStep from './ValidationStep'; // Assuming ValidationStep is in the same folder

const ProgressDisplay = React.forwardRef(({ validationSteps, finalResult, isValidating }, ref) => {

  const getProgressBarWidth = () => {
    if (validationSteps.result === 'failed') {
      if (validationSteps.field === 'failed') return 'calc(80% - 32px)';
      if (validationSteps.face === 'failed') return 'calc(50% - 32px)';
      if (validationSteps.layout === 'failed') return 'calc(20% - 32px)';
    }
    if (validationSteps.field === 'completed') return 'calc(100% - 64px)';
    if (validationSteps.face === 'completed') return 'calc(80% - 32px)';
    if (validationSteps.layout === 'completed') return 'calc(50% - 32px)';
    if (validationSteps.upload === 'completed') return 'calc(20% - 32px)';
    return '0%';
  };

  return (
    <div ref={ref} className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-10 animate-slide-up border border-white/20">
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Loader2 className={`w-6 sm:w-7 h-6 sm:h-7 text-white ${isValidating ? 'animate-spin' : ''}`} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Validation Progress</h2>
      </div>

      <div className="relative flex items-start justify-between pb-4">
        {/* Background line */}
        <div className="absolute top-8 sm:top-10 md:top-12 left-0 right-0 h-1.5 sm:h-2 bg-gray-200 rounded-full" style={{ width: 'calc(100% - 64px)', left: '32px' }} />
        
        {/* --- MODIFIED: Animated Progress Line --- */}
        <div 
          className="absolute top-8 sm:top-10 md:top-12 h-1.5 sm:h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out" 
          style={{ 
            left: '32px', 
            width: getProgressBarWidth()
          }} 
        />
        
        {/* Start Step */}
        <div className="flex flex-col items-center flex-1 relative"><div className="absolute -top-3 bg-white px-3 py-1 rounded-full shadow-md border-2 z-20"><span className="text-xs font-bold text-gray-600">Start</span></div><div className={`w-16 h-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-br ${validationSteps.upload === 'completed' ? 'from-green-400 to-green-600' : 'from-gray-300 to-gray-400'} flex items-center justify-center mb-4 z-10`}><CheckCircle className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white" /></div><p className={`text-sm sm:text-base font-semibold ${validationSteps.upload === 'completed' ? 'text-green-600' : 'text-gray-500'}`}>Images Ready</p></div>
        
        {/* --- MODIFIED: Validation steps now show skipped/failed status --- */}
        <ValidationStep icon={FileCheck} status={validationSteps.layout} label="Layout" stepNumber={1} />
        <ValidationStep icon={Users} status={validationSteps.face} label="Face Match" stepNumber={2} />
        <ValidationStep icon={ClipboardCheck} status={validationSteps.field} label="Fields" stepNumber={3} />
        
        {/* End Step */}
        <div className="flex flex-col items-center flex-1 relative"><div className="absolute -top-3 bg-white px-3 py-1 rounded-full shadow-md border-2 z-20"><span className="text-xs font-bold text-gray-600">End</span></div><div className={`w-16 h-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-br ${validationSteps.result === 'completed' ? 'from-green-400 to-green-600' : validationSteps.result === 'failed' ? 'from-red-400 to-red-600' : 'from-gray-300 to-gray-400'} flex items-center justify-center mb-4 z-10`}>{validationSteps.result === 'completed' ? <CheckCircle className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white" /> : validationSteps.result === 'failed' ? <XCircle className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white" /> : <AlertCircle className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white opacity-50" />}</div><p className={`text-sm sm:text-base font-semibold ${validationSteps.result === 'completed' ? 'text-green-600' : validationSteps.result === 'failed' ? 'text-red-600' : 'text-gray-500'}`}>Result</p></div>
      </div>

      {finalResult && <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl mt-10 ${finalResult.status === 'success' ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-400' : 'bg-gradient-to-br from-red-50 to-rose-100 border-2 border-red-400'}`}><div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"><div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center flex-shrink-0 ${finalResult.status === 'success' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-red-400 to-red-600'}`}>{finalResult.status === 'success' ? <CheckCircle className="w-10 sm:w-12 h-10 sm:h-12 text-white" /> : <XCircle className="w-10 sm:w-12 h-10 sm:h-12 text-white" />}</div><div className="text-center sm:text-left mt-4 sm:mt-0"><h3 className={`text-2xl sm:text-3xl font-black mb-1 ${finalResult.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>{finalResult.status === 'success' ? 'Success!' : 'Failed'}</h3><p className={`text-xl sm:text-2xl font-bold ${finalResult.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>{finalResult.message}</p></div></div></div>}
    </div>
  );
});

export default ProgressDisplay;