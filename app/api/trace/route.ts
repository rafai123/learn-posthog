export async function GET(request: Request): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("host") || "unknown"
  const userAgent = request.headers.get("user-agent") || "unknown"
  const protocol = request.headers.get("x-forwarded-proto") || "http"

  const data: Record<string, string> = {
    ip, 
    host: request.headers.get("host") || "unknown",
    user_agent: userAgent,
    protocol,
    method: "GET" 
  }

  const formattedResponse = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  return new Response(formattedResponse, {
    headers: {'Content-Type': "text/plain"}
  })
}