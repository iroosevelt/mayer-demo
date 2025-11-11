namespace MayerDemo.API.Models;

public class HubSpotWebhook
{
    public string ObjectType { get; set; } = string.Empty; // e.g., "DEAL"
    public string PropertyName { get; set; } = string.Empty; // e.g., "dealstage"
    public string PropertyValue { get; set; } = string.Empty; // e.g., "closedwon"
    public long ObjectId { get; set; }
    public long OccurredAt { get; set; }
}

public class DealData
{
    public long Id { get; set; }
    public string CustomerFirstName { get; set; } = string.Empty;
    public string CustomerLastName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal SystemSize { get; set; }
    public string UtilityCompany { get; set; } = string.Empty;
    public string? ElectricalPlanUrl { get; set; }
}

public class PermitAutomationRequest
{
    public long DealId { get; set; }
    public string Action { get; set; } = string.Empty; // e.g., "START_PERMIT_PROCESS"
}
