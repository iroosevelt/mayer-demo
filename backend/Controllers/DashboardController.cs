using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MayerDemo.API.Data;
using System.Security.Claims;

namespace MayerDemo.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { error = "Invalid user ID" });
            }

            var totalPlans = await _context.Plans.CountAsync(p => p.UserId == userId);
            var approvedPlans = await _context.Plans.CountAsync(p => p.UserId == userId && p.Status == "Approved");
            var pendingPlans = await _context.Plans.CountAsync(p => p.UserId == userId && p.Status == "Pending");
            var upcomingAppointments = await _context.Appointments.CountAsync(a =>
                a.UserId == userId &&
                a.AppointmentDate > DateTime.UtcNow &&
                a.Status != "Cancelled");

            return Ok(new
            {
                totalPlans,
                approvedPlans,
                pendingPlans,
                upcomingAppointments
            });
        }

        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 10)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { error = "Invalid user ID" });
            }

            var activities = new List<object>();

            // Get recent plans
            var recentPlans = await _context.Plans
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.Id)
                .Take(limit)
                .ToListAsync();

            foreach (var plan in recentPlans)
            {
                string activityType = plan.Status switch
                {
                    "Approved" => "plan_approved",
                    "Rejected" => "plan_failed",
                    _ => "plan_uploaded"
                };

                string title = plan.Status switch
                {
                    "Approved" => $"{plan.Name} Approved",
                    "Rejected" => $"{plan.Name} Rejected",
                    _ => $"{plan.Name} Submitted"
                };

                string description = plan.Status switch
                {
                    "Approved" => "Your plan has been approved and is ready for installation",
                    "Rejected" => "Your plan needs revisions. Please check the feedback.",
                    _ => "Your plan is being reviewed by our team"
                };

                activities.Add(new
                {
                    id = $"plan_{plan.Id}",
                    type = activityType,
                    title,
                    description,
                    timestamp = DateTime.UtcNow.AddHours(-plan.Id).ToString("o") // Mock timestamp based on ID
                });
            }

            // Get recent appointments
            var recentAppointments = await _context.Appointments
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AppointmentDate)
                .Take(limit / 2)
                .ToListAsync();

            foreach (var appointment in recentAppointments)
            {
                activities.Add(new
                {
                    id = $"appointment_{appointment.Id}",
                    type = "appointment_scheduled",
                    title = "Appointment Scheduled",
                    description = $"Inspection scheduled for {appointment.AppointmentDate:MMM dd, yyyy}",
                    timestamp = appointment.AppointmentDate.AddDays(-7).ToString("o")
                });
            }

            // Sort by timestamp and limit
            var sortedActivities = activities
                .OrderByDescending(a => ((dynamic)a).timestamp)
                .Take(limit)
                .ToList();

            return Ok(sortedActivities);
        }
    }
}
