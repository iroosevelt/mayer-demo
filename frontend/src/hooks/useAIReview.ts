import { useState, useCallback } from 'react';
import api from '../services/api';
import type { PlanReview } from '../types';

export function useAIReview() {
  const [review, setReview] = useState<PlanReview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPlan = useCallback(async (imageFile: File, city: string | null = null): Promise<PlanReview> => {
    setLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const base64 = await fileToBase64(imageFile);
      const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix

      // Upload plan
      const uploadResponse = await api.uploadPlan(base64Data, city);
      const { reviewId } = uploadResponse;

      // Poll for results
      const reviewData = await pollForReview(reviewId);
      setReview(reviewData);

      return reviewData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pollForReview = async (reviewId: string, maxAttempts: number = 30): Promise<PlanReview> => {
    for (let i = 0; i < maxAttempts; i++) {
      const reviewData = await api.getReview(reviewId);

      if (reviewData.status === 'completed' || reviewData.status === 'failed') {
        return reviewData;
      }

      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error('Review timeout - please try again');
  };

  const clearReview = useCallback(() => {
    setReview(null);
    setError(null);
  }, []);

  return {
    review,
    loading,
    error,
    uploadPlan,
    clearReview
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
