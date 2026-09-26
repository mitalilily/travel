import { mkdir, writeFile } from 'node:fs/promises';

const headers = { 'user-agent': 'Mozilla/5.0 (compatible; VijayIndiaToursCatalog/1.0)' };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(url, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      await sleep(350 * (attempt + 1));
    }
  }
  throw lastError;
}

function decode(value = '') {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&#038;', '&')
    .replaceAll('&#8211;', '–')
    .replaceAll('&#8217;', '’')
    .replaceAll('&quot;', '"')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1]);
      if (parsed?.['@type'] === 'TouristTrip') return parsed;
    } catch {
      // Ignore unrelated malformed structured data.
    }
  }
  return null;
}

function repairText(value = '') {
  const decoded = decode(value)
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('\u00e2\u20ac\u2122', '\u2019')
    .replaceAll('\u00e2\u20ac\u0153', '\u201c')
    .replaceAll('\u00e2\u20ac\u009d', '\u201d')
    .replaceAll('\u00e2\u20ac\u201c', '\u2013')
    .replaceAll('\u00e2\u20ac\u201d', '\u2014')
    .replaceAll('\u00c3\u2014', '\u00d7')
    .replaceAll('\u00e2\u201a\u00b9', '\u20b9')
    .replaceAll('\u00c2', '');
  if (!/[\u00c3\u00e2\u00f0]/.test(decoded)) return decoded;
  const repaired = Buffer.from(decoded, 'latin1').toString('utf8');
  return repaired.includes('\ufffd') ? decoded : repaired;
}

function extractListPrice(html, id) {
  const index = html.indexOf(`href="/t/${id}"`);
  if (index < 0) return null;
  const segment = html.slice(index, index + 16000);
  const match = segment.match(/US\s*\$\s*([0-9,]+)\s*per person/i);
  return match ? Number(match[1].replaceAll(',', '')) : null;
}

function extractIncluded(html, included) {
  const heading = included ? "What's Included" : "What's Not Included";
  const start = html.indexOf(heading);
  if (start < 0) return [];
  const stopHeading = included ? "What's Not Included" : 'Operated by';
  const stop = html.indexOf(stopHeading, start + heading.length);
  const segment = html.slice(start, stop > start ? stop : start + 14000);
  return [...segment.matchAll(/ao-common-accordion__title-text[^>]*>([^<]+)</gi)]
    .map((match) => decode(match[1]))
    .filter((value, index, array) => value && array.indexOf(value) === index);
}

function extractDetailPrice(html) {
  const match = html.match(/ao-tour-above-fold__price[^>]*>\s*([0-9,]+)/i);
  return match ? Number(match[1].replaceAll(',', '')) : null;
}

function normalizeDay(item, index) {
  const text = item?.item?.description || '';
  const split = text.split(/(?=Meals |Transport |Included Activities |Optional Activities |Landmarks )/g);
  const find = (label) => split.find((part) => part.startsWith(label))?.slice(label.length).trim() || '';
  const activitiesText = find('Included Activities');
  const optionalText = find('Optional Activities');
  const landmarksText = find('Landmarks');
  return {
    day: index + 1,
    place: repairText(item?.item?.name || `Day ${index + 1}`),
    meals: repairText(find('Meals')),
    transport: repairText(find('Transport')),
    activities: repairText(activitiesText),
    optional: repairText(optionalText),
    landmarks: repairText(landmarksText),
  };
}

const listingPages = [];
const ids = [];
for (let page = 1; page <= 5; page += 1) {
  const html = await get(`https://www.tourradar.com/o/vijay-india-tours/tours?page=${page}`);
  listingPages.push(html);
  for (const match of html.matchAll(/href="\/t\/(\d+)"/g)) {
    if (!ids.includes(match[1])) ids.push(match[1]);
  }
}

const tours = [];
const concurrency = 6;
for (let offset = 0; offset < ids.length; offset += concurrency) {
  const batch = ids.slice(offset, offset + concurrency);
  const results = await Promise.all(batch.map(async (id) => {
    const html = await get(`https://www.tourradar.com/t/${id}`);
    const data = extractJsonLd(html);
    if (!data) throw new Error(`Tour ${id} did not expose TouristTrip JSON-LD`);
    const audience = (data.touristType || []).find((type) => typeof type === 'object')?.audienceType || 'All ages welcome';
    const styles = (data.touristType || []).filter((type) => typeof type === 'string' && type !== 'Multi-day tour');
    const price = extractDetailPrice(html) || listingPages.map((page) => extractListPrice(page, id)).find(Boolean) || null;
    const days = data.itinerary?.itemListElement?.map(normalizeDay) || [];
    const destinations = [...new Set(days.map((day) => day.place).filter(Boolean))];
    return {
      id,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      name: repairText(data.name),
      description: repairText(data.description),
      image: data.image,
      duration: data.itinerary?.numberOfItems || days.length,
      origin: data.tripOrigin?.name || destinations[0] || 'India',
      end: destinations.at(-1) || 'India',
      destinations,
      audience: repairText(audience),
      languages: html.includes('Other languages on request: German') ? ['English', 'German'] : ['English'],
      styles: styles.map(repairText),
      price,
      included: extractIncluded(html, true),
      excluded: extractIncluded(html, false),
      days,
      sourceUrl: `https://www.tourradar.com/t/${id}`,
    };
  }));
  tours.push(...results);
  console.log(`Read ${Math.min(offset + concurrency, ids.length)} of ${ids.length} TourRadar packages`);
}

const officialResponse = await fetch('https://vijayindiatours.com/wp-json/wp/v2/tours?per_page=100&orderby=date&order=asc', { headers });
if (!officialResponse.ok) throw new Error(`Official catalogue: ${officialResponse.status}`);
const officialPosts = await officialResponse.json();
const officialTours = [];
for (const post of officialPosts) {
  const html = await get(post.link);
  const planMatch = html.match(/<div class="tab-pane" id="2">([\s\S]*?)<div class="tab-pane" id="3">/i);
  const itineraryMatch = html.match(/<div class="tab-pane" id="3">([\s\S]*?)<div class="tab-pane" id="4">/i);
  const highlightMatch = html.match(/<div class="tab-pane" id="4">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<form/i);
  const priceMatch = html.match(/name="tour_price" value="([^"]+)"/i);
  const route = repairText(planMatch?.[1]).replace(/^Tour Plan\s*/i, '').trim();
  const dayCount = [...repairText(itineraryMatch?.[1]).matchAll(/Day\s*-?\s*\d+/gi)].length;
  const highlight = repairText(highlightMatch?.[1]).replace(/^Tour Highlights\s*/i, '').split(/\s+/).slice(0, 20).join(' ');
  officialTours.push({
    id: `official-${post.id}`,
    slug: post.slug,
    name: repairText(post.title.rendered),
    overview: `${repairText(post.title.rendered)} is part of Vijay India Tours' signature collection, built around the published route: ${route}.`,
    plan: route,
    dayCount,
    highlights: highlight,
    price: priceMatch ? Number(priceMatch[1]) : null,
    sourceUrl: post.link,
  });
}

await mkdir('src/data', { recursive: true });
await writeFile('src/data/tourradar.json', `${JSON.stringify(tours, null, 2)}\n`);
await writeFile('src/data/official-tours.json', `${JSON.stringify(officialTours, null, 2)}\n`);
await writeFile('src/data/catalog-audit.json', `${JSON.stringify({
  researchedAt: new Date().toISOString(),
  tourRadarListings: tours.length,
  officialListings: officialTours.length,
  sourceListingsRead: tours.length + officialTours.length,
  tourRadarIds: tours.map((tour) => tour.id),
  officialSlugs: officialTours.map((tour) => tour.slug),
}, null, 2)}\n`);

console.log(`Complete: ${tours.length} TourRadar + ${officialTours.length} official listings = ${tours.length + officialTours.length} source listings read.`);
