using Microsoft.AspNetCore.Mvc;
using MayerDemo.API.Models;
using MayerDemo.API.Services;

namespace MayerDemo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlanReviewController : ControllerBase
{
    private readonly IPlanReviewService _planReviewService;
    private readonly ILogger<PlanReviewController> _logger;

    public PlanReviewController(
        IPlanReviewService planReviewService,
        ILogger<PlanReviewController> logger)
    {
        _planReviewService = planReviewService;
        _logger = logger;
    }

    /// <summary>
    /// Upload an electrical plan for AI review
    /// </summary>
    [HttpPost("upload")]
    [ProducesResponseType(typeof(UploadPlanResponse), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<UploadPlanResponse>> UploadPlan([FromBody] UploadPlanRequest request)
    {
        if (string.IsNullOrEmpty(request.ImageBase64))
        {
            return BadRequest(new { error = "ImageBase64 is required" });
        }

        try
        {
            _logger.LogInformation("Received plan upload request. City: {City}", request.City);

            var review = await _planReviewService.CreateReviewAsync(request);

            return Ok(new UploadPlanResponse
            {
                ReviewId = review.Id,
                Status = review.Status
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading plan");
            return StatusCode(500, new { error = "Failed to process plan upload" });
        }
    }

    /// <summary>
    /// Get the status and results of a plan review
    /// </summary>
    [HttpGet("{reviewId}")]
    [ProducesResponseType(typeof(PlanReview), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<PlanReview>> GetReview(string reviewId)
    {
        var review = await _planReviewService.GetReviewAsync(reviewId);

        if (review == null)
        {
            return NotFound(new { error = "Review not found" });
        }

        return Ok(review);
    }

    /// <summary>
    /// Get recent plan reviews
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<PlanReview>), 200)]
    public async Task<ActionResult<List<PlanReview>>> GetRecentReviews([FromQuery] int count = 10)
    {
        if (count < 1 || count > 100)
        {
            return BadRequest(new { error = "Count must be between 1 and 100" });
        }

        var reviews = await _planReviewService.GetRecentReviewsAsync(count);
        return Ok(reviews);
    }
}
