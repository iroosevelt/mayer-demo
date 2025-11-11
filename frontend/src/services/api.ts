import type {
  PlanReview,
  UploadPlanResponse,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DashboardStats,
  Activity,
  Appointment,
  CreateAppointmentRequest
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

class ApiService {
  async uploadPlan(imageBase64: string, city: string | null = null): Promise<UploadPlanResponse> {
    const response = await fetch(`${API_BASE_URL}/planreview/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        city,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload plan');
    }

    return response.json();
  }

  async getReview(reviewId: string): Promise<PlanReview> {
    const response = await fetch(`${API_BASE_URL}/planreview/${reviewId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Review not found');
      }
      throw new Error('Failed to get review');
    }

    return response.json();
  }

  async getRecentReviews(count: number = 10): Promise<PlanReview[]> {
    const response = await fetch(`${API_BASE_URL}/planreview?count=${count}`);

    if (!response.ok) {
      throw new Error('Failed to get recent reviews');
    }

    return response.json();
  }

  async registerUser(userData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle validation errors with details
      if (errorData.details && Array.isArray(errorData.details)) {
        throw new Error(errorData.details.join(', '));
      }

      // Handle specific error messages
      const errorMessage = errorData.error || errorData.message || 'Registration failed';
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async loginUser(credentials: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Provide user-friendly error messages
      if (response.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }

      if (response.status === 400) {
        throw new Error(errorData.error || errorData.message || 'Please check your email and password.');
      }

      // Generic error
      throw new Error(errorData.error || errorData.message || 'Login failed. Please try again later.');
    }

    return response.json();
  }

  async triggerPermitAutomation(dealId: number): Promise<{ message: string; dealId: number }> {
    const response = await fetch(`${API_BASE_URL}/webhook/permit-automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dealId,
        action: 'START_PERMIT_PROCESS',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to trigger permit automation');
    }

    return response.json();
  }

  // User Profile APIs
  async getUserProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      throw new Error('Failed to get user profile');
    }

    return response.json();
  }

  async updateUserProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    return response.json();
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get dashboard stats');
    }

    return response.json();
  }

  async getRecentActivity(limit: number = 10): Promise<Activity[]> {
    const response = await fetch(`${API_BASE_URL}/dashboard/activity?limit=${limit}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get recent activity');
    }

    return response.json();
  }

  // Appointments APIs
  async getAppointments(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get appointments');
    }

    return response.json();
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create appointment');
    }

    return response.json();
  }

  async updateAppointment(id: string, data: Partial<CreateAppointmentRequest>): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update appointment');
    }

    return response.json();
  }

  async cancelAppointment(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel appointment');
    }

    return response.json();
  }

  // Plan Details API
  async getPlanDetails(reviewId: string): Promise<PlanReview> {
    // This uses the same endpoint as getReview
    return this.getReview(reviewId);
  }
}

export default new ApiService();
