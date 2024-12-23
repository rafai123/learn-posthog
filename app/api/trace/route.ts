export async function GET(request: Request): Promise<Response> {
  const ip =
    request.headers.get('x-forwarded-for') || 
    request.headers.get('host') || 
    'unknown';
  
  // Dapatkan IP pengguna dari request
  const ipAddress = ip.split(',')[0]; // Handle jika ada proxy atau beberapa IP

  // Gunakan layanan GeoIP eksternal untuk mendapatkan lokasi berdasarkan IP
  const geoIpResponse = await fetch(`https://ipinfo.io/${ipAddress}?token=bc764156993d7f`);
  
  if (!geoIpResponse.ok) {
    return new Response('Error fetching GeoIP data', { status: 500 });
  }
  
  const geoData = await geoIpResponse.json();

  // Ambil data GeoIP
  const { city, region, country, loc } = geoData;
  
  // Format response yang ingin ditampilkan
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

  // Format output menjadi text/plain
  const formattedResponse = Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Return response dengan format teks
  return new Response(formattedResponse, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
