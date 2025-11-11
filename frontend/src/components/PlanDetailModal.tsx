import React from 'react';
import type { PlanReview } from '../types';

interface PlanDetailModalProps {
  plan: PlanReview;
  isOpen: boolean;
  onClose: () => void;
}

const PlanDetailModal: React.FC<PlanDetailModalProps> = ({ plan, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusColor = (status: PlanReview['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success-700 bg-success-100 border-success-200';
      case 'analyzing':
        return 'text-primary-700 bg-primary-100 border-primary-200';
      case 'failed':
        return 'text-danger-700 bg-danger-100 border-danger-200';
      default:
        return 'text-dark-700 bg-dark-100 border-dark-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-danger-700 bg-danger-100 border-danger-200';
      case 'high':
        return 'text-warning-700 bg-warning-100 border-warning-200';
      case 'medium':
        return 'text-warning-600 bg-warning-50 border-warning-100';
      case 'low':
        return 'text-success-600 bg-success-50 border-success-100';
      default:
        return 'text-dark-700 bg-dark-100 border-dark-200';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 80) return 'text-success-700';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-700';
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-dark-900 bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-dark-100 px-8 py-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-dark-900 mb-1">Plan Details</h2>
              <p className="text-sm text-dark-500">ID: {plan.id.substring(0, 8)}...</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-dark-50 transition-colors"
            >
              <svg className="w-6 h-6 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Status and Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card p-4">
                <p className="text-sm text-dark-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
              <div className="card p-4">
                <p className="text-sm text-dark-500 mb-1">Compliance Score</p>
                <p className={`text-2xl font-bold ${plan.analysis ? getComplianceColor(plan.analysis.complianceScore) : 'text-dark-900'}`}>
                  {plan.analysis?.complianceScore ?? 'N/A'}%
                </p>
              </div>
              <div className="card p-4">
                <p className="text-sm text-dark-500 mb-1">Submitted</p>
                <p className="text-sm font-medium text-dark-900">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Location */}
            {plan.city && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-dark-900 mb-2">Location</h3>
                <p className="text-dark-600">{plan.city}</p>
              </div>
            )}

            {/* Plan Image */}
            {plan.imageUrl && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-dark-900 mb-4">Uploaded Plan</h3>
                <img
                  src={plan.imageUrl}
                  alt="Electrical Plan"
                  className="w-full rounded-xl border border-dark-200"
                />
              </div>
            )}

            {/* Analysis Details */}
            {plan.analysis && (
              <>
                {/* Plan Details */}
                {plan.analysis.details && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-dark-900 mb-4">Plan Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.analysis.details.circuitCount && (
                        <div>
                          <p className="text-sm text-dark-500 mb-1">Circuit Count</p>
                          <p className="font-medium text-dark-900">{plan.analysis.details.circuitCount}</p>
                        </div>
                      )}
                      {plan.analysis.details.panelAmperage && (
                        <div>
                          <p className="text-sm text-dark-500 mb-1">Panel Amperage</p>
                          <p className="font-medium text-dark-900">{plan.analysis.details.panelAmperage}A</p>
                        </div>
                      )}
                      {plan.analysis.details.serviceEntranceLocation && (
                        <div>
                          <p className="text-sm text-dark-500 mb-1">Service Entrance</p>
                          <p className="font-medium text-dark-900">{plan.analysis.details.serviceEntranceLocation}</p>
                        </div>
                      )}
                      {plan.analysis.details.solarInterconnectionPoint && (
                        <div>
                          <p className="text-sm text-dark-500 mb-1">Solar Interconnection</p>
                          <p className="font-medium text-dark-900">{plan.analysis.details.solarInterconnectionPoint}</p>
                        </div>
                      )}
                      {plan.analysis.details.proposedSolarSystemSize && (
                        <div>
                          <p className="text-sm text-dark-500 mb-1">Solar System Size</p>
                          <p className="font-medium text-dark-900">{plan.analysis.details.proposedSolarSystemSize} kW</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Code Violations */}
                {plan.analysis.violations && plan.analysis.violations.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-dark-900 mb-4">
                      Code Violations ({plan.analysis.violations.length})
                    </h3>
                    <div className="space-y-3">
                      {plan.analysis.violations.map((violation, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl border border-dark-100 hover:border-dark-200 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-sm font-medium text-dark-600">{violation.codeSection}</span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getSeverityColor(violation.severity)}`}>
                              {violation.severity}
                            </span>
                          </div>
                          <p className="text-sm text-dark-700">{violation.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {plan.analysis.recommendations && plan.analysis.recommendations.length > 0 && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-dark-900 mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {plan.analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="text-sm text-dark-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Human Review Required */}
                {plan.analysis.requiresHumanReview && (
                  <div className="card p-6 border-warning-200 bg-warning-50">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-warning-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-warning-900 mb-1">Human Review Required</h4>
                        <p className="text-sm text-warning-800">
                          This plan requires additional review by a licensed professional before approval.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Error Message */}
            {plan.errorMessage && (
              <div className="card p-6 border-danger-200 bg-danger-50">
                <h3 className="text-lg font-semibold text-danger-900 mb-2">Error</h3>
                <p className="text-sm text-danger-800">{plan.errorMessage}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-dark-100 px-8 py-6 flex justify-end space-x-4">
            <button onClick={onClose} className="btn-ghost">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanDetailModal;
