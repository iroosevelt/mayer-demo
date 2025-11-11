import type { PlanReview, CodeViolation } from '../types';

interface ReviewResultsProps {
  review: PlanReview | null;
}

export function ReviewResults({ review }: ReviewResultsProps) {
  if (!review || !review.analysis) {
    return null;
  }

  const { analysis } = review;
  const { details, violations, recommendations, complianceScore, requiresHumanReview } = analysis;

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreRingColor = (score: number): string => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const getSeverityConfig = (severity: CodeViolation['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          label: 'Critical'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600',
          label: 'High'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          label: 'Medium'
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          label: 'Low'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          label: 'Info'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Compliance Score - Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Score Display */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              {/* Circular progress ring */}
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    className={`bg-gradient-to-r ${getScoreRingColor(complianceScore)}`}
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - complianceScore / 100)}`}
                    style={{
                      stroke: complianceScore >= 80 ? '#22c55e' : complianceScore >= 60 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(complianceScore)}`}>
                      {complianceScore}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                {complianceScore >= 80 ? 'Excellent Compliance' : complianceScore >= 60 ? 'Good Progress' : 'Needs Attention'}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Analyzed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${violations.length === 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-gray-600">
                    {violations.length} {violations.length === 1 ? 'Violation' : 'Violations'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-gray-600">
                    {recommendations.length} {recommendations.length === 1 ? 'Recommendation' : 'Recommendations'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Human Review Badge */}
          {requiresHumanReview && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex-shrink-0 max-w-xs">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Human Review Required</p>
                  <p className="text-xs text-amber-700">This plan needs manual verification before final approval.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plan Details Grid */}
      {details && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">Plan Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {details.circuitCount && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Circuit Count</div>
                <div className="text-2xl font-semibold text-gray-900">{details.circuitCount}</div>
              </div>
            )}
            {details.panelAmperage && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Panel Amperage</div>
                <div className="text-2xl font-semibold text-gray-900">{details.panelAmperage}A</div>
              </div>
            )}
            {details.serviceEntranceLocation && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Service Entrance</div>
                <div className="text-lg font-semibold text-gray-900">{details.serviceEntranceLocation}</div>
              </div>
            )}
            {details.solarInterconnectionPoint && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Solar Interconnection</div>
                <div className="text-lg font-semibold text-gray-900">{details.solarInterconnectionPoint}</div>
              </div>
            )}
            {details.proposedSolarSystemSize && (
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">System Size</div>
                <div className="text-2xl font-semibold text-gray-900">{details.proposedSolarSystemSize} kW</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Violations */}
      {violations && violations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Code Violations
            </h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
              {violations.length}
            </span>
          </div>
          <div className="space-y-3">
            {violations.map((violation, index) => {
              const config = getSeverityConfig(violation.severity);
              return (
                <div
                  key={index}
                  className={`${config.bg} border ${config.border} rounded-xl p-5 transition-all hover:shadow-sm`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${config.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className={`text-sm font-bold ${config.text}`}>
                          {violation.codeSection}
                        </div>
                        <span className={`flex-shrink-0 px-2.5 py-1 ${config.iconBg} ${config.text} text-xs font-semibold rounded-full`}>
                          {config.label}
                        </span>
                      </div>
                      <p className={`text-sm ${config.text} leading-relaxed`}>
                        {violation.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-semibold text-gray-900">
              Recommendations
            </h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
              {recommendations.length}
            </span>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Issues - Success State */}
      {violations.length === 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-900 mb-1">
                No Code Violations Detected
              </h4>
              <p className="text-sm text-green-700">
                Your electrical plan appears to be compliant with all applicable codes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
