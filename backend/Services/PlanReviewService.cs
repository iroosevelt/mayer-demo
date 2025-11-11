using System.Collections.Concurrent;
using MayerDemo.API.Models;

namespace MayerDemo.API.Services;

public class PlanReviewService : IPlanReviewService
{
    // In-memory storage for demo. In production, use a database.
    private static readonly ConcurrentDictionary<string, PlanReview> _reviews = new();

    private readonly IOpenAIService _openAIService;
    private readonly ILogger<PlanReviewService> _logger;

    public PlanReviewService(IOpenAIService openAIService, ILogger<PlanReviewService> logger)
    {
        _openAIService = openAIService;
        _logger = logger;
    }

    public async Task<PlanReview> CreateReviewAsync(UploadPlanRequest request)
    {
        var review = new PlanReview
        {
            Id = Guid.NewGuid().ToString(),
            Status = "analyzing",
            CreatedAt = DateTime.UtcNow
        };

        // Store initial review
        _reviews[review.Id] = review;

        // Start analysis in background (in production, use a queue/background service)
        _ = Task.Run(async () =>
        {
            try
            {
                _logger.LogInformation("Starting analysis for review {ReviewId}", review.Id);

                var analysis = await _openAIService.AnalyzeElectricalPlanAsync(
                    request.ImageBase64,
                    request.City
                );

                review.Analysis = analysis;
                review.Status = "completed";

                _logger.LogInformation("Completed analysis for review {ReviewId}. Score: {Score}",
                    review.Id, analysis.ComplianceScore);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to analyze plan for review {ReviewId}", review.Id);
                review.Status = "failed";
                review.ErrorMessage = ex.Message;
            }
        });

        return review;
    }

    public Task<PlanReview?> GetReviewAsync(string reviewId)
    {
        _reviews.TryGetValue(reviewId, out var review);
        return Task.FromResult(review);
    }

    public Task<List<PlanReview>> GetRecentReviewsAsync(int count = 10)
    {
        var reviews = _reviews.Values
            .OrderByDescending(r => r.CreatedAt)
            .Take(count)
            .ToList();

        return Task.FromResult(reviews);
    }
}
