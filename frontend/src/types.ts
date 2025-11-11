// Types matching the backend models

export interface PlanDetails {
  circuitCount: number | null;
  panelAmperage: number | null;
  serviceEntranceLocation: string | null;
  solarInterconnectionPoint: string | null;
  proposedSolarSystemSize: number | null;
}

export interface CodeViolation {
  codeSection: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PlanAnalysis {
  details: PlanDetails | null;
  violations: CodeViolation[];
  recommendations: string[];
  complianceScore: number;
  requiresHumanReview: boolean;
}

export interface PlanReview {
  id: string;
  createdAt: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  analysis: PlanAnalysis | null;
  imageUrl: string | null;
  errorMessage: string | null;
  city?: string;
}

export interface UploadPlanRequest {
  imageBase64: string;
  fileName?: string;
  city?: string;
}

export interface UploadPlanResponse {
  reviewId: string;
  status: string;
}

// User and Profile Types
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  company?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Appointment Types
export type AppointmentType = 'consultation' | 'site_inspection' | 'final_inspection';
export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  userId: string;
  type: AppointmentType;
  date: string;
  time: string;
  notes?: string;
  location?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  type: AppointmentType;
  date: string;
  time: string;
  notes?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalPlans: number;
  approvedPlans: number;
  pendingPlans: number;
  upcomingAppointments: number;
}

export type ActivityType = 'plan_approved' | 'plan_uploaded' | 'appointment_scheduled' | 'plan_failed';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}
