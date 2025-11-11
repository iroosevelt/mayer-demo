namespace MayerDemo.API.Models;

public class PlanReview
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "pending"; // pending, analyzing, completed, failed
    public PlanAnalysis? Analysis { get; set; }
    public string? ImageUrl { get; set; }
    public string? ErrorMessage { get; set; }
}

public class PlanAnalysis
{
    public PlanDetails? Details { get; set; }
    public List<CodeViolation> Violations { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public int ComplianceScore { get; set; } // 0-100
    public bool RequiresHumanReview { get; set; }
}

public class PlanDetails
{
    public int? CircuitCount { get; set; }
    public int? PanelAmperage { get; set; }
    public string? ServiceEntranceLocation { get; set; }
    public string? SolarInterconnectionPoint { get; set; }
    public int? ProposedSolarSystemSize { get; set; } // in kW
}

public class CodeViolation
{
    public string CodeSection { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Severity { get; set; } = "medium"; // low, medium, high, critical
}

public class UploadPlanRequest
{
    public string ImageBase64 { get; set; } = string.Empty;
    public string? FileName { get; set; }
    public string? City { get; set; } // Which city's codes to check against
}

public class UploadPlanResponse
{
    public string ReviewId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}
