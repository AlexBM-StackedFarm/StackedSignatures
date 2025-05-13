// Root handler for Cloudflare Functions
export async function onRequest(context) {
  // Return a simple response to ensure the worker is running
  return new Response("Stacked Farm Email Signature Generator API", {
    headers: {
      "content-type": "text/plain;charset=UTF-8",
    },
  });
}