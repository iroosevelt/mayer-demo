import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import type { PlanReview } from '../../types';
import PlanDetailModal from '../../components/PlanDetailModal';
import PageHeader from '../../components/PageHeader';

const MyPlans: React.FC = () => {
  const [plans, setPlans] = useState<PlanReview[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<PlanReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanReview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (plan: PlanReview) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  // Apply filters and sorting whenever plans or filter/sort options change
  useEffect(() => {
    applyFiltersAndSort();
  }, [plans, statusFilter, sortBy, searchQuery]);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getRecentReviews(20);
      setPlans(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load plans');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...plans];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => plan.status === statusFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.id.toLowerCase().includes(query) ||
        plan.city?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'score-desc':
          return (b.analysis?.complianceScore || 0) - (a.analysis?.complianceScore || 0);
        case 'score-asc':
          return (a.analysis?.complianceScore || 0) - (b.analysis?.complianceScore || 0);
        default:
          return 0;
      }
    });

    setFilteredPlans(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'analyzing':
        return <span className="badge badge-info">Analyzing</span>;
      case 'failed':
        return <span className="badge badge-danger">Failed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getComplianceColor = (score: number | undefined) => {
    if (!score) return 'text-dark-400';
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-dark-600">Loading your plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="My Plans"
        description="View and manage your electrical plans"
        action={
          <Link to="/dashboard/upload-plan" className="btn-primary">
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload New Plan
          </Link>
        }
      />

      {/* Filters and Search */}
      {plans.length > 0 && (
        <div className="card p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-dark-700 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search by ID or location..."
                className="input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-dark-700 mb-2">
                Status
              </label>
              <select
                id="status"
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="analyzing">Analyzing</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-dark-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-3 md:mt-4 text-xs md:text-sm text-dark-600">
            Showing {filteredPlans.length} of {plans.length} plans
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="card p-8 md:p-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-2">No plans yet</h3>
          <p className="text-sm md:text-base text-dark-600 mb-4 md:mb-6">Upload your first electrical plan to get started</p>
          <Link to="/dashboard/upload-plan" className="btn-primary">
            Upload Plan
          </Link>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="card p-8 md:p-12 text-center">
          <svg className="w-12 h-12 md:w-16 md:h-16 text-dark-400 mx-auto mb-3 md:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg md:text-xl font-semibold text-dark-900 mb-2">No plans found</h3>
          <p className="text-sm md:text-base text-dark-600">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="card p-4 md:p-6 hover:border-primary-200 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                <div className="flex items-start space-x-3 md:space-x-4 flex-1 w-full">
                  {/* Icon */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-dark-900">
                        Plan #{plan.id.substring(0, 8)}
                      </h3>
                      {getStatusBadge(plan.status)}
                    </div>
                    {plan.city && (
                      <p className="text-sm text-dark-600 mb-2">Location: {plan.city}</p>
                    )}
                    {plan.analysis && (
                      <div className="mt-3 pt-3 border-t border-dark-100">
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6">
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Compliance Score</p>
                            <p className={`text-xl md:text-2xl font-bold ${getComplianceColor(plan.analysis.complianceScore)}`}>
                              {plan.analysis.complianceScore}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-dark-500 mb-1">Violations</p>
                            <p className="text-xl md:text-2xl font-bold text-dark-900">
                              {plan.analysis.violations?.length || 0}
                            </p>
                          </div>
                          {(plan.analysis as any).planDetails?.circuitCount && (
                            <div>
                              <p className="text-xs text-dark-500 mb-1">Circuits</p>
                              <p className="text-xl md:text-2xl font-bold text-dark-900">
                                {(plan.analysis as any).planDetails.circuitCount}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(plan)}
                  className="btn-ghost text-primary-600 text-sm md:text-base w-full sm:w-auto"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MyPlans;
