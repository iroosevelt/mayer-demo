import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import type { Appointment, AppointmentType } from '../../types';
import PageHeader from '../../components/PageHeader';

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    type: 'consultation' as AppointmentType,
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await ApiService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await ApiService.createAppointment(formData);
      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setShowBookingForm(false);
      setFormData({ type: 'consultation', date: '', time: '', notes: '' });
      // Reload appointments
      await loadAppointments();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to book appointment'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await ApiService.cancelAppointment(appointmentId);
      setMessage({ type: 'success', text: 'Appointment cancelled successfully!' });
      // Reload appointments
      await loadAppointments();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to cancel appointment'
      });
    }
  };

  const getAppointmentTypeLabel = (type: AppointmentType): string => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'site_inspection':
        return 'Site Inspection';
      case 'final_inspection':
        return 'Final Inspection';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="badge badge-info">Upcoming</span>;
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-500">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Appointments"
        description="Manage your site inspections and consultations"
        action={
          <button
            onClick={() => setShowBookingForm(!showBookingForm)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book Appointment
          </button>
        }
      />

      {/* Success/Error Message */}
      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm ${
          message.type === 'success'
            ? 'bg-success-50 border border-success-200 text-success-700'
            : 'bg-danger-50 border border-danger-200 text-danger-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Error Message */}
      {error && !message.text && (
        <div className="card p-8 text-center border-danger-200">
          <svg className="w-16 h-16 text-danger-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-dark-900 mb-2">Failed to Load Appointments</h3>
          <p className="text-dark-600 mb-4">{error}</p>
          <button onClick={loadAppointments} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Booking Form */}
      {showBookingForm && (
        <div className="card p-5 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-dark-900 mb-5 md:mb-6">Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-dark-700 mb-2">
                  Appointment Type
                </label>
                <select
                  id="type"
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as AppointmentType })}
                >
                  <option value="consultation">Consultation</option>
                  <option value="site_inspection">Site Inspection</option>
                  <option value="final_inspection">Final Inspection</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-dark-700 mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  className="input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-dark-700 mb-2">
                  Preferred Time
                </label>
                <select
                  id="time"
                  className="input"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                >
                  <option value="">Select time...</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-dark-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                className="input"
                placeholder="Any special requirements or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowBookingForm(false)}
                className="btn-secondary w-full sm:w-auto"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-3 md:space-y-4">
        {appointments.length === 0 ? (
          <div className="card p-8 md:p-12 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-2">No appointments scheduled</h3>
            <p className="text-sm md:text-base text-dark-600 mb-4 md:mb-6">Book your first appointment to get started</p>
            <button onClick={() => setShowBookingForm(true)} className="btn-primary">
              Book Appointment
            </button>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="card p-4 md:p-6 hover:border-primary-200 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex items-start space-x-3 md:space-x-4 flex-1 w-full">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-dark-900">{getAppointmentTypeLabel(appointment.type)}</h3>
                      {getStatusBadge(appointment.status)}
                    </div>
                    <div className="space-y-1 text-sm text-dark-600">
                      <p className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} at {appointment.time}
                      </p>
                      {appointment.location && (
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {appointment.location}
                        </p>
                      )}
                      {appointment.notes && (
                        <p className="text-xs text-dark-500 mt-2">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                {appointment.status === 'upcoming' && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="btn-ghost text-sm text-danger-600 hover:bg-danger-50 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
