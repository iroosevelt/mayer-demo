using System;

namespace MayerDemo.API.Models.Entities
{
    public class Plan
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; } // Path to the stored file (e.g., S3 URL)
        public string Status { get; set; } = "Uploaded"; // e.g., "Uploaded", "Analyzing", "Completed", "Rejected"
        public string AnalysisResults { get; set; } // JSON string of AI analysis results
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key for User
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
