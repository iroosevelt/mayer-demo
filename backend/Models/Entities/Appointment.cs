using System;

namespace MayerDemo.API.Models.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime AppointmentTime { get; set; }
        public string Type { get; set; } // e.g., "Virtual", "In-person"
        public string Notes { get; set; }
        public string Status { get; set; } = "Scheduled"; // e.g., "Scheduled", "Completed", "Cancelled"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key for User
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
