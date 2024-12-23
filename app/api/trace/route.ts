export async function GET(request: Request): Promise<Response> {
  const ip =
    request.headers.get('x-forwarded-for') || 
    request.headers.get('host') || 
    'unknown';

  const ipAddress = ip.split(',')[0]; // Handle jika ada proxy atau beberapa IP

  // Ambil data GeoIP dari layanan eksternal
  const geoIpResponse = await fetch(`https://ipinfo.io/${ipAddress}?token=bc764156993d7f`);
  if (!geoIpResponse.ok) {
    return new Response('Error fetching GeoIP data', { status: 500 });
  }

  const geoData = await geoIpResponse.json();

  // Ambil data GeoIP
  const { city, region, country, loc } = geoData;

  const data = {
    ip: ipAddress,
    city: city || 'unknown',
    region: region || 'unknown',
    country: country || 'unknown',
    location: loc || 'unknown',
    host: request.headers.get('host') || 'unknown',
    user_agent: request.headers.get('user-agent') || 'unknown',
    protocol: request.headers.get('x-forwarded-proto') || 'http',
    method: 'GET',
  };

  // Kirim data ke PostHog
  const postHogResponse = await fetch('https://app.posthog.com/capture/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: 'phc_sU6rMQbWW9Gudy3d1Pne8nZpK6pHh0vEK4u26RwGqTy', // Ganti dengan API Key PostHog Anda
      event: 'geoip_event', // Nama event yang Anda tentukan
      properties: {
        ...data, // Masukkan seluruh properti GeoIP
      },
    }),
  });

  if (!postHogResponse.ok) {
    console.error('Error sending data to PostHog:', await postHogResponse.text());
  }

  // Format output menjadi text/plain untuk response asli
  const formattedResponse = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  return new Response(formattedResponse, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
