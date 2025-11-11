using MayerDemo.API.Models;

namespace MayerDemo.API.Services;

public interface IOpenAIService
{
    Task<PlanAnalysis> AnalyzeElectricalPlanAsync(string imageBase64, string? city = null);
}
