import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../components/Auth/AuthProvider';
import ApiService from '../../services/api';
import type { DashboardStats, Activity } from '../../types';
import StatCard from '../../components/StatCard';

const DashboardHome: React.FC = () => {
  const { user } = useAuthContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalPlans: 0,
    approvedPlans: 0,
    pendingPlans: 0,
    upcomingAppointments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, activityData] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getRecentActivity(5),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatActivityTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type: Activity['type']) => {
    const iconClass = "w-5 h-5";

    switch (type) {
      case 'plan_approved':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'plan_failed':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getActivityColor = (type: Activity['type']): string => {
    switch (type) {
      case 'plan_approved':
        return 'text-green-600 bg-green-50';
      case 'plan_failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h3>
        <p className="text-gray-600 mb-6 text-sm">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Header - Responsive text sizes */}
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-2 md:mb-3 tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 font-normal">
          Here's an overview of your solar permit activity.
        </p>
      </div>

      {/* Stats Grid - Responsive cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Plans */}
        <StatCard
          value={stats.totalPlans}
          label="Total Plans"
          bgColor="bg-white"
          hoverBorderColor="border-gray-200"
          iconBgColor="bg-gray-50"
          iconHoverBgColor="bg-gray-100"
          icon={
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        {/* Approved Plans */}
        <StatCard
          value={stats.approvedPlans}
          label="Approved"
          bgColor="bg-white"
          hoverBorderColor="border-green-200"
          iconBgColor="bg-green-50"
          iconHoverBgColor="bg-green-100"
          icon={
            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Pending Plans */}
        <StatCard
          value={stats.pendingPlans}
          label="In Review"
          bgColor="bg-white"
          hoverBorderColor="border-amber-200"
          iconBgColor="bg-amber-50"
          iconHoverBgColor="bg-amber-100"
          icon={
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        {/* Appointments */}
        <StatCard
          value={stats.upcomingAppointments}
          label="Upcoming"
          bgColor="bg-white"
          hoverBorderColor="border-blue-200"
          iconBgColor="bg-blue-50"
          iconHoverBgColor="bg-blue-100"
          icon={
            <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions - More spacious, button-like cards */}
      <div className="bg-white rounded-2xl p-5 md:p-8 border border-gray-100">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 md:mb-6 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/upload-plan"
            className="group p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Plan</h3>
                <p className="text-sm text-gray-500">Submit for review</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/appointments"
            className="group p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Book Appointment</h3>
                <p className="text-sm text-gray-500">Schedule inspection</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/my-plans"
            className="group p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all">
                <svg className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">View Plans</h3>
                <p className="text-sm text-gray-500">Check status</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity - Clean, minimal design */}
      <div className="bg-white rounded-2xl p-5 md:p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-5 md:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">Recent Activity</h2>
          {recentActivity.length > 0 && (
            <Link to="/dashboard/my-plans" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View all
            </Link>
          )}
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm font-medium">No recent activity</p>
            <p className="text-gray-400 text-sm mt-1">Your activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group cursor-default"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-400 font-medium flex-shrink-0">
                  {formatActivityTime(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
