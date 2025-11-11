using MayerDemo.API.Models;

namespace MayerDemo.API.Services;

public interface IPlanReviewService
{
    Task<PlanReview> CreateReviewAsync(UploadPlanRequest request);
    Task<PlanReview?> GetReviewAsync(string reviewId);
    Task<List<PlanReview>> GetRecentReviewsAsync(int count = 10);
}
