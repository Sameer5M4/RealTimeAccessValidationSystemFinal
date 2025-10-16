import React from 'react';
import { Camera, CheckCircle, Upload, XCircle } from 'lucide-react';

const ImageUploadBox = ({ title, icon: Icon, image, onOpenModal, onClear, type }) => {
  const text = type === 'selfie'
    ? { title: "Click to Open Camera", subtitle: "Auto-capture Selfie" }
    : { title: "Click to Capture or Upload", subtitle: "ID Card Image" };

  return (
    <div
      onClick={() => !image && onOpenModal()}
      className={`border-3 border-dashed rounded-2xl sm:rounded-3xl p-6 text-center transition-all min-h-[380px] sm:min-h-[420px] flex items-center justify-center relative overflow-hidden 
      ${image
        ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50'
        : 'cursor-pointer border-gray-300 bg-gradient-to-br from-slate-50 to-purple-50 hover:border-blue-400'
      }`}
    >
      {image ? (
        <div className="relative w-full z-10">
          <div className="relative group">
            <img
              src={image}
              alt={`${type} Preview`}
              className="max-h-64 sm:max-h-80 mx-auto rounded-2xl shadow-2xl object-contain border-4 border-white"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-3 hover:bg-red-600 shadow-lg transition-all hover:scale-110"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              {type === 'selfie' ? 'Captured' : 'Uploaded'} Successfully
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
            <Icon className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
          </div>
          <p className="text-gray-800 font-bold text-xl mb-2">{text.title}</p>
          <p className="text-gray-600">{text.subtitle}</p>
        </div>
      )}
    </div>
  );
};

const ImageUploadContainer = ({
  idCard,
  selfie,
  onOpenIdModal,
  onOpenSelfieModal,
  onClearId,
  onClearSelfie,
}) => {
  return (
    // ✅ Always horizontal layout
    <div className="flex flex-row gap-8 mb-8">
      {/* Left: ID Card Upload */}
      <div className="flex-1">
        <ImageUploadBox
          title="ID Card Image"
          icon={Upload}
          image={idCard}
          onOpenModal={onOpenIdModal}
          onClear={onClearId}
          type="id_card"
        />
      </div>

      {/* Right: Selfie Capture */}
      <div className="flex-1">
        <ImageUploadBox
          title="Selfie Image"
          icon={Camera}
          image={selfie}
          onOpenModal={onOpenSelfieModal}
          onClear={onClearSelfie}
          type="selfie"
        />
      </div>
    </div>
  );
};

export default ImageUploadContainer;
