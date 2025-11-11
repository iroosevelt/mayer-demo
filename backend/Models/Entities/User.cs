using System;
using System.Collections.Generic;

namespace MayerDemo.API.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public string Role { get; set; } = "Customer"; // Default role
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<Appointment> Appointments { get; set; }
        public ICollection<Plan> Plans { get; set; }
    }
}
