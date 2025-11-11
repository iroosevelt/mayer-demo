import { useState } from 'react';
import { useAIReview } from '../hooks/useAIReview';
import type { PlanReview } from '../types';

interface PlanUploadProps {
  onReviewComplete?: (review: PlanReview) => void;
}

export function PlanUpload({ onReviewComplete }: PlanUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [city, setCity] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const { loading, error, uploadPlan } = useAIReview();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const review = await uploadPlan(selectedFile, city || null);
      onReviewComplete?.(review);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Upload Electrical Plan
      </h2>

      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Electrical Plan Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={loading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-mayer-green file:text-white
              hover:file:bg-green-600
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* City Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City (optional)
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., Plano, TX"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-mayer-blue focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <img
              src={preview}
              alt="Plan preview"
              className="max-w-full h-auto rounded-md border border-gray-300"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="w-full bg-mayer-green text-white font-semibold py-3 px-6 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            'Upload & Analyze Plan'
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          AI will analyze the plan against NEC codes and {city || 'local'} requirements
        </p>
      </div>
    </div>
  );
}
