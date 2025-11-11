/**
 * Cloudflare Worker - HubSpot Webhook Handler
 *
 * This worker receives webhooks from HubSpot and forwards them to
 * the Railway backend for processing. This is exactly how Mayer
 * uses Cloudflare Workers!
 *
 * Deploy: wrangler deploy
 * Test: wrangler tail (to see logs in real-time)
 */

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    try {
      // Parse webhook payload from HubSpot
      const webhookData = await request.json();

      console.log('📨 Received HubSpot webhook:', JSON.stringify(webhookData, null, 2));

      // HubSpot sends an array of events
      const events = Array.isArray(webhookData) ? webhookData : [webhookData];
      const processedEvents = [];

      for (const event of events) {
        console.log(`Processing event: ${event.objectType} - ${event.propertyName}`);

        // Check if this is a deal closure (closedwon)
        if (
          event.objectType === 'DEAL' &&
          event.propertyName === 'dealstage' &&
          event.propertyValue === 'closedwon'
        ) {
          console.log(`✅ Deal ${event.objectId} closed! Triggering permit automation.`);

          // Forward to Railway backend API for processing
          try {
            const backendResponse = await fetch(
              `${env.BACKEND_API_URL}/api/webhook/permit-automation`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  // Optional: Add authentication
                  ...(env.API_SECRET && { 'Authorization': `Bearer ${env.API_SECRET}` })
                },
                body: JSON.stringify({
                  dealId: event.objectId,
                  action: 'START_PERMIT_PROCESS',
                  timestamp: new Date().toISOString(),
                  source: 'cloudflare-worker'
                })
              }
            );

            if (backendResponse.ok) {
              const result = await backendResponse.json();
              console.log('✅ Backend processed successfully:', result);
              processedEvents.push({
                dealId: event.objectId,
                status: 'success',
                message: 'Permit automation triggered'
              });
            } else {
              console.error('❌ Backend error:', backendResponse.status);
              processedEvents.push({
                dealId: event.objectId,
                status: 'error',
                message: `Backend returned ${backendResponse.status}`
              });
            }
          } catch (error) {
            console.error('❌ Failed to call backend:', error);
            processedEvents.push({
              dealId: event.objectId,
              status: 'error',
              message: error.message
            });
          }
        } else {
          console.log(`ℹ️ Skipping event: ${event.objectType} ${event.propertyName} = ${event.propertyValue}`);
          processedEvents.push({
            objectId: event.objectId,
            status: 'skipped',
            message: 'Not a deal closure event'
          });
        }
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Webhook processed',
          processed: processedEvents.length,
          events: processedEvents
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );

    } catch (error) {
      console.error('❌ Webhook processing error:', error);

      return new Response(
        JSON.stringify({
          success: false,
          error: error.message
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }
  },
};

/**
 * Example HubSpot Webhook Payload:
 *
 * [
 *   {
 *     "objectType": "DEAL",
 *     "objectId": 12345,
 *     "propertyName": "dealstage",
 *     "propertyValue": "closedwon",
 *     "changeSource": "CRM",
 *     "eventId": 67890,
 *     "subscriptionId": 54321,
 *     "portalId": 123456,
 *     "occurredAt": 1635789012345
 *   }
 * ]
 */
