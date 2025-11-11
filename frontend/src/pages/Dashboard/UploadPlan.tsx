import React, { useState, useRef } from 'react';
import { useAIReview } from '../../hooks/useAIReview';
import { ReviewResults } from '../../components/ReviewResults';
import type { PlanReview } from '../../types';

const UploadPlan: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [city, setCity] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentReview, setCurrentReview] = useState<PlanReview | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { loading, error, uploadPlan } = useAIReview();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const review = await uploadPlan(selectedFile, city || null);
      setCurrentReview(review);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleNewUpload = () => {
    setCurrentReview(null);
    setSelectedFile(null);
    setPreview(null);
    setCity('');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (currentReview) {
    return (
      <div className="space-y-8">
        {/* Success Header */}
        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2 md:mb-3 tracking-tight">
            Analysis Complete
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 font-normal">
            Your electrical plan has been reviewed against NEC codes and local requirements.
          </p>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-2xl p-5 md:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 pb-5 md:pb-6 border-b border-gray-100 gap-3">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">Review Complete</h3>
                <p className="text-xs md:text-sm text-gray-500">Analysis finished successfully</p>
              </div>
            </div>
            <button
              onClick={handleNewUpload}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
            >
              Upload New Plan
            </button>
          </div>
          <ReviewResults review={currentReview} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2 md:mb-3 tracking-tight">
          Upload Electrical Plan
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 font-normal">
          Submit your plan for AI-powered analysis against NEC codes and local requirements.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-2xl p-5 md:p-8 border border-gray-100">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {/* Drag & Drop Zone */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2 md:mb-3">
              Plan Document
            </label>

            {!preview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  disabled={loading}
                  className="hidden"
                />

                <div className="space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                      {isDragging ? 'Drop your file here' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      PNG, JPG, or PDF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative border border-gray-200 rounded-2xl p-3 md:p-4 bg-gray-50/50">
                <div className="flex items-start space-x-3 md:space-x-4">
                  {/* Preview Thumbnail */}
                  <div className="w-16 h-16 md:w-24 md:h-24 flex-shrink-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <img
                      src={preview}
                      alt="Plan preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {selectedFile?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        disabled={loading}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Upload Progress */}
                    {loading && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Analyzing plan...</span>
                          <span>Processing</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '75%' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* City Input */}
          <div>
            <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2 md:mb-3">
              Location
              <span className="text-gray-400 font-normal ml-2 text-xs md:text-sm">(Optional)</span>
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Dallas, TX"
              disabled={loading}
              className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-1.5 md:mt-2 text-xs text-gray-500">
              Provide your city to check against local building codes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 md:p-4">
              <div className="flex items-start space-x-2 md:space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="w-full py-3 md:py-3.5 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Plan...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Plan
              </>
            )}
          </button>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  AI-Powered Analysis
                </p>
                <p className="text-xs text-blue-700">
                  Our AI will review your electrical plan against NEC codes and {city || 'local'} requirements,
                  identifying potential issues and providing recommendations for compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPlan;
