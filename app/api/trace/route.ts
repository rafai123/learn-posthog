import geoip from 'geoip-lite';

export async function GET(request: Request): Promise<Response> {
  // Ambil IP address pengguna dari headers
  const ip =
    request.headers.get('x-forwarded-for') || // Cek jika ada header x-forwarded-for
    request.headers.get('host') || // Atau fallback ke host
    'unknown';

  // Ambil lokasi berdasarkan IP
  const geo = geoip.lookup(ip.split(',')[0]); // Mengambil IP pertama jika ada proxy

  // Jika data GeoIP tersedia
  if (geo) {
    const { city, region, country, ll } = geo; // Mendapatkan kota, region, negara, dan koordinat
    
    // Format data untuk ditampilkan
    const data = {
      ip: ip.split(',')[0],
      city: city || 'unknown',
      region: region || 'unknown',
      country: country || 'unknown',
      location: ll ? `${ll[0]}, ${ll[1]}` : 'unknown', // Koordinat latitude dan longitude
      host: request.headers.get('host') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      protocol: request.headers.get('x-forwarded-proto') || 'http',
      method: 'GET',
    };

    // Format output menjadi text/plain
    const formattedResponse = Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    return new Response(formattedResponse, {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Jika tidak ada data GeoIP
  return new Response('GeoIP data not found', { status: 404 });
}
