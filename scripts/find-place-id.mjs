import https from 'https';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_API_KEY;
const query = encodeURIComponent("Papa Everett's Pizza Clear Lake Iowa");

const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const result = JSON.parse(data);
    if (result.results && result.results.length > 0) {
      console.log('Found Place ID:', result.results[0].place_id);
    } else {
      console.log('No results found:', result);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
