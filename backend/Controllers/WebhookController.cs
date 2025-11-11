using Microsoft.AspNetCore.Mvc;
using MayerDemo.API.Models;

namespace MayerDemo.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhookController : ControllerBase
{
    private readonly ILogger<WebhookController> _logger;

    public WebhookController(ILogger<WebhookController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Handle HubSpot webhook events
    /// </summary>
    [HttpPost("hubspot")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> HandleHubSpotWebhook([FromBody] List<HubSpotWebhook> webhooks)
    {
        try
        {
            _logger.LogInformation("Received {Count} HubSpot webhook(s)", webhooks.Count);

            foreach (var webhook in webhooks)
            {
                // Check if this is a deal closure event
                if (webhook.ObjectType == "DEAL" &&
                    webhook.PropertyName == "dealstage" &&
                    webhook.PropertyValue == "closedwon")
                {
                    _logger.LogInformation(
                        "Deal {DealId} closed! Triggering permit automation workflow",
                        webhook.ObjectId
                    );

                    // In production, this would:
                    // 1. Fetch deal details from HubSpot API
                    // 2. Queue a permit automation job
                    // 3. Trigger the Playwright-based portal automation

                    await TriggerPermitAutomation(webhook.ObjectId);
                }
                else
                {
                    _logger.LogInformation(
                        "Webhook received: ObjectType={ObjectType}, Property={Property}, Value={Value}",
                        webhook.ObjectType,
                        webhook.PropertyName,
                        webhook.PropertyValue
                    );
                }
            }

            return Ok(new { message = "Webhooks processed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing HubSpot webhooks");
            return StatusCode(500, new { error = "Failed to process webhooks" });
        }
    }

    /// <summary>
    /// Trigger permit automation for a deal
    /// </summary>
    [HttpPost("permit-automation")]
    [ProducesResponseType(200)]
    public async Task<IActionResult> TriggerPermitAutomationManually([FromBody] PermitAutomationRequest request)
    {
        _logger.LogInformation("Manual permit automation trigger for deal {DealId}", request.DealId);

        await TriggerPermitAutomation(request.DealId);

        return Ok(new { message = "Permit automation triggered", dealId = request.DealId });
    }

    private async Task TriggerPermitAutomation(long dealId)
    {
        // In production, this would:
        // 1. Fetch deal data from HubSpot
        // 2. Enqueue job to background worker (Bull, Hangfire, etc.)
        // 3. Background worker would:
        //    - Get customer's utility company
        //    - Select appropriate portal adapter
        //    - Run Playwright automation to submit permit
        //    - Update HubSpot with confirmation number
        //    - Send notification to team

        _logger.LogInformation("Permit automation workflow started for deal {DealId}", dealId);

        // Simulate async processing
        await Task.Run(async () =>
        {
            await Task.Delay(100); // Simulate work

            _logger.LogInformation(
                "Permit automation completed for deal {DealId}. Status: {Status}",
                dealId,
                "queued"
            );
        });
    }
}
