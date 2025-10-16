import React from 'react';
import { CheckCircle, Loader2, XCircle, MinusCircle } from 'lucide-react';

const ValidationStep = ({ icon: Icon, status, label, stepNumber }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'completed': return { color: 'from-green-400 to-green-600', glow: 'shadow-green-500/50', text: 'text-green-600', badge: 'bg-green-100 text-green-700 border-green-300' };
            case 'processing': return { color: 'from-blue-400 to-blue-600', glow: 'shadow-blue-500/50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-300' };
            case 'failed': return { color: 'from-red-400 to-red-600', glow: 'shadow-red-500/50', text: 'text-red-600', badge: 'bg-red-100 text-red-700 border-red-300' };
            case 'skipped': return { color: 'from-gray-300 to-gray-400', glow: '', text: 'text-gray-400', badge: 'bg-gray-100 text-gray-500 border-gray-300' };
            default: return { color: 'from-gray-300 to-gray-400', glow: '', text: 'text-gray-500', badge: '' };
        }
    };
  
    const styles = getStatusStyles();

    const renderIcon = () => {
        const iconSize = "w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white";
        switch (status) {
            case 'processing': return <Loader2 className={iconSize + " animate-spin"} />;
            case 'completed': return <CheckCircle className={iconSize} />;
            case 'failed': return <XCircle className={iconSize} />;
            case 'skipped': return <MinusCircle className={iconSize + " opacity-70"} />;
            default: return <Icon className={iconSize + " opacity-50"} />;
        }
    };

    const renderStatusText = () => {
        switch (status) {
            case 'completed': return '✓ Done';
            case 'processing': return '⟳ Processing';
            case 'failed': return '✗ Failed';
            case 'skipped': return '- Skipped';
            default: return null;
        }
    };

    return (
      <div className="flex flex-col items-center flex-1 relative px-2">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md border-2 border-gray-200 z-20"><span className="text-xs font-bold text-gray-600">Step {stepNumber}</span></div>
        <div className={`w-16 h-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full bg-gradient-to-br ${styles.color} flex items-center justify-center mb-4 transition-all duration-500 relative z-10 ${styles.glow} ${status !== 'pending' ? 'shadow-2xl' : 'shadow-lg'} transform ${status === 'processing' ? 'scale-110' : 'scale-100'}`}>
          {renderIcon()}
        </div>
        <p className={`text-center font-semibold text-sm md:text-base mb-2 transition-colors ${styles.text}`}>{label}</p>
        {status !== 'pending' && <span className={`text-xs font-medium px-3 py-1 rounded-full border ${styles.badge}`}>{renderStatusText()}</span>}
      </div>
    );
};

export default ValidationStep;