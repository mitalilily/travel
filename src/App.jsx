import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Camera, Check, ChevronDown, ChevronRight, CircleCheck, Clock3, Compass, ExternalLink, Headphones, Heart, Hotel, Languages, Mail, MapPin, Menu, MessageCircle, Phone, Search, ShieldCheck, Star, Users, X } from 'lucide-react';
import currentTours from './data/tourradar.json';
import officialTours from './data/official-tours.json';
import internationalTours from './data/international-tours.js';
import audit from './data/catalog-audit.json';
import logo from './assets/vijay-logo.png';
import destinationIconAtlas from './assets/vijay-destination-icons.png';
import internationalMontage from './assets/international-montage.mp4';

const CONTACT = {
  phone: '+91 79760 64160',
  phoneHref: 'tel:+917976064160',
  email: 'info@vijayindiatours.com',
  address: '2nd Floor, Shop 20–21, Khatipura Road, Chand Bihari Nagar, Jhotwara, Jaipur 302012',
};

const categoryRules = [
  ['Food & Culture', /food|cuisine|village|country side|life in india/i],
  ['Women Only', /women|woman/i],
  ['Festivals', /diwali|holi|festival|fair/i],
  ['South India', /south india|kerala|kochi|cochin|munnar|madurai|mysore/i],
  ['Himalayas', /ladakh|leh|rishikesh|himalaya|uttarakhand|shimla|manali/i],
  ['Spiritual', /spiritual|varanasi|temple|yoga|pilgrim|khajuraho/i],
  ['Wildlife', /tiger|ranthambore|safari|wildlife|national park|corbett/i],
  ['Golden Triangle', /golden triangle|taj ?mahal|delhi.*agra.*jaipur/i],
  ['Rajasthan', /rajasthan|jaipur|jodhpur|jaisalmer|bikaner|shekhawati|thar|pushkar/i],
  ['Coasts & Luxury', /goa|beach|luxury|mumbai/i],
];

function categoryFor(item) {
  if (item.type === 'international') return 'International';
  const titleMatch = categoryRules.find(([, rule]) => rule.test(item.name || ''));
  if (titleMatch) return titleMatch[0];
  const text = [item.name, item.description, item.overview, item.plan, ...(item.destinations || []), ...(item.styles || [])].join(' ');
  return categoryRules.find(([, rule]) => rule.test(text))?.[0] || 'Cultural India';
}

const officialCopy = {
  'official-238': {
    name: 'Golden Triangle: Delhi, Agra & Jaipur',
    description: 'A five-day introduction to India’s most celebrated trio: Old and New Delhi, the Taj Mahal in Agra, and Jaipur’s forts and palaces. Ideal for a first visit or a short private journey.',
  },
  'official-252': {
    name: 'Golden Triangle & Shekhawati',
    description: 'See Delhi, Agra and Jaipur, then continue into Shekhawati—Rajasthan’s open-air gallery of painted havelis, quiet towns and old merchant stories.',
  },
  'official-280': {
    name: 'Indian Saga: Rajasthan, Tigers & Varanasi',
    description: 'A broad two-week portrait of North India, combining the Taj Mahal and Jaipur with village life, Ranthambore’s tiger country and the ghats of Varanasi.',
  },
  'official-282': {
    name: 'Across the Thar Desert',
    description: 'Travel through the heart of Rajasthan from Shekhawati and Bikaner to golden Jaisalmer, blue Jodhpur and Jaipur. Expect forts, desert landscapes and richly decorated old towns.',
  },
  'official-284': {
    name: 'Taj Mahal, Rajasthan & Udaipur',
    description: 'Begin with Delhi and the Taj Mahal, continue through Jaipur and Chittorgarh, and finish beside the lakes and palaces of Udaipur.',
  },
  'official-371': {
    name: 'Rishikesh, Varanasi & Spiritual India',
    description: 'Follow the Ganges from Haridwar and Rishikesh to Varanasi, with a contrast of forest and wildlife in Corbett and Mughal history in Agra.',
  },
  'official-374': {
    name: 'Incredible India, Made for You',
    description: 'A flexible private journey for travellers who know what they want from India but need help joining the pieces. Tell us your interests and we’ll shape the route around them.',
  },
  'official-384': {
    name: 'India’s Countryside & Heritage Towns',
    description: 'Step beyond the headline monuments into smaller towns and rural Rajasthan, with time in Jaipur, Deoli, Gwalior and Agra along the way.',
  },
  'official-388': {
    name: 'Rajasthan Adventure Trail',
    description: 'A varied route through Shekhawati, Bikaner and Jaipur, followed by Ranthambore’s wildlife, Gwalior’s hilltop fort and the Taj Mahal in Agra.',
  },
  'official-399': {
    name: 'Tigers, Temples & the Golden Triangle',
    description: 'Pair Delhi, Agra and Jaipur with two of India’s great wildlife regions. Ranthambore and Bandhavgarh bring the chance of tiger sightings; Khajuraho adds remarkable temple architecture.',
  },
  'official-402': {
    name: 'India’s Festivals, Up Close',
    description: 'Plan your journey around Holi, Diwali or another local celebration and experience the festival with people who understand its traditions, timing and best places to be.',
  },
  'official-405': {
    name: 'Life in India: Homestays & Local Hosts',
    description: 'Travel from Delhi and Agra into rural Rajasthan, staying in family homes and guesthouses before continuing to Udaipur and Jaipur. A more personal look at everyday India.',
  },
  'official-407': {
    name: 'A Taste of North India',
    description: 'Eat your way from Delhi to Jaipur, Bikaner, Jodhpur and Pushkar. Markets, family recipes and regional specialities turn a classic Rajasthan route into a food-led journey.',
  },
  'official-3014': {
    name: 'Jaipur: The Pink City',
    description: 'Spend time with Jaipur’s great sights—Amber Fort, City Palace, Jantar Mantar, Hawa Mahal and Jal Mahal—with room for bazaars, crafts and local food.',
  },
};

const officialListings = officialTours.map((tour) => ({
  ...tour,
  ...(officialCopy[tour.id] || {}),
  type: 'official',
  duration: tour.dayCount || null,
  description: officialCopy[tour.id]?.description || tour.overview,
  destinations: tour.plan ? tour.plan.split(/\s*(?:->|>|–|-)\s*/).filter(Boolean) : [],
  origin: tour.plan?.split(/\s*(?:->|>|–|-)\s*/)[0] || 'India',
  end:
    tour.plan
      ?.split(/\s*(?:->|>|–|-)\s*/)
      .filter(Boolean)
      .at(-1) || 'India',
  included: [],
  excluded: [],
  departureYears: [],
}));

const currentTourNames = {
  110582: 'Golden Triangle & Ranthambore',
  248014: 'South India: Temples, Coast & Culture',
  306427: 'Golden Triangle, Manali & Ladakh',
  307412: 'Rishikesh Adventure',
  237027: 'Rajasthan Beyond Jaipur',
  237616: 'Tigers & Culture in Rajasthan',
  313150: 'Golden Triangle & Tiger Safari',
  306773: 'Jaipur Food & Wildlife Journey',
  319758: 'Rajasthan, Agra & Tiger Safari',
  315428: 'Spiritual & Royal India',
  307427: 'Rishikesh Adventure & Wellness',
  307529: 'Pushkar Fair & Rajasthan Heritage',
  353974: 'Rajasthan, Agra & Tiger Safari',
  317405: 'Golden Triangle, Mumbai & Goa',
  307879: 'Diwali Across the Golden Triangle',
  356274: 'India’s Palace Train Journey',
  308417: 'Maldives Island Escape',
  355865: 'Bali Island Journey',
  356180: 'Goa Coast Escape',
  309010: 'Pushkar Fair & Royal Rajasthan',
  311420: 'Women’s Kerala Backwaters Journey',
  306366: 'Jaipur, Rajasthan & Delhi',
  247595: 'Taj Mahal, Tigers & Jaipur',
  306887: 'Jaipur Heritage & Rajasthan',
  314416: 'Rajasthan Heritage Escape',
  170154: 'Backpacking India',
  353575: 'Taj Mahal & Tiger Country',
  308570: 'Golden Triangle & Sacred Cities',
  315745: 'Rajasthan, Khajuraho & Varanasi',
  313272: 'Amritsar, the Himalayas & Rajasthan',
  313947: 'Diwali in Varanasi & North India',
  312984: 'Pushkar Fair & Wildlife Safari',
  309954: 'North India Temple Trail',
  309069: 'Women’s Journey Through India',
  309066: 'Kerala: Hills, Backwaters & Beaches',
  311856: 'Golden Triangle & Ranthambore',
  316831: 'Pushkar Fair, Ranthambore & Golden Triangle',
  316013: 'Delhi, Agra, Bharatpur & Jaipur',
  310593: 'Eastern Himalayas Journey',
  308004: 'Char Dham Yatra',
  308647: 'Diwali Across India',
  309090: 'Women’s India Journey',
  314236: 'Culture, Nature & Faith in India',
  307959: 'Summer Journey Through India',
  314303: 'Golden Triangle & Ranthambore Short Tour',
  306318: 'Holi & the Golden Triangle',
  306355: 'Holi in India',
  309227: 'Women’s Golden Triangle & Safari',
  353779: 'India’s Luxury Palace Train',
  311814: 'Royal Bengal Tiger Safari',
  317652: 'Rajasthan Heritage & Culture',
  307986: 'Ladakh in Seven Days',
  316228: 'Golden Triangle & Rishikesh',
  314180: 'Rajasthan & Spiritual Central India',
  316645: 'Diwali, Ayodhya & Golden Triangle',
  315529: 'Golden Triangle & Rajasthan',
  309231: 'Himachal Mountain Journey',
  315554: 'Golden Triangle Short Escape',
  313256: 'North India Wildlife & Heritage',
  318812: 'Taj Mahal & Wildlife',
  317330: 'Golden Triangle & Royal Rajasthan',
  308539: 'Kashmir Adventure',
  319746: 'Classic Golden Triangle',
  306609: 'Luxury Golden Triangle',
  306654: 'Essential Golden Triangle',
  318153: 'Golden Triangle & Varanasi',
  302710: 'Kumbh Mela, Taj Mahal & Rajasthan',
  306307: 'Golden Triangle & Jaipur Extension',
  314415: 'Palaces, Temples & Sacred India',
};

const currentTourIntros = {
  'Golden Triangle': 'See Delhi, Agra and Jaipur while leaving room for the character of each city.',
  Wildlife: 'Pair India’s heritage cities with time in its national parks and tiger country.',
  Rajasthan: 'Follow a Rajasthan route shaped by forts, old cities and desert landscapes.',
  'South India': 'Move through South India’s temple towns, coast, hills and backwaters.',
  Himalayas: 'Trade the plains for mountain roads, high passes and Himalayan towns.',
  Spiritual: 'Explore the places where India’s faith, ritual and everyday life meet.',
  Festivals: 'Experience India at its most colourful, with the route timed around a major festival.',
  'Women Only': 'Travel in a women-only group with a comfortable pace and a strong local focus.',
  'Food & Culture': 'Get to know the region through its markets, kitchens and everyday food culture.',
  'Coasts & Luxury': 'Slow the pace with coastal stays and carefully chosen city experiences.',
  'Cultural India': 'See a varied side of India through its cities, landscapes and local culture.',
};

function cleanPlaceName(value = '') {
  return String(value)
    .replace(/\s*\(departure\)\s*/gi, '')
    .replace(/^.*?\s+to\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function readableList(values) {
  if (values.length <= 1) return values[0] || '';
  return `${values.slice(0, -1).join(', ')} and ${values.at(-1)}`;
}

function buildCurrentDescription(tour) {
  const category = categoryFor(tour);
  const intro = currentTourIntros[category] || currentTourIntros['Cultural India'];
  const places = [...new Set((tour.destinations || []).map(cleanPlaceName).filter(Boolean))].slice(0, 5);
  const route = places.length ? ` Highlights include ${readableList(places)}.` : '';
  return `${intro} This ${tour.duration}-day journey travels from ${cleanPlaceName(tour.origin)} to ${cleanPlaceName(tour.end)}.${route}`;
}

const currentListings = currentTours.map((tour) => {
  const item = {
    ...tour,
    name: currentTourNames[tour.id] || tour.name,
    type: 'current',
  };

  return {
    ...item,
    description: buildCurrentDescription(item),
  };
});
const internationalListings = internationalTours;
const allListings = [...currentListings, ...officialListings, ...internationalListings];
const destinationFilters = [
  { name: 'Delhi', keywords: ['delhi'], column: 0, row: 0 },
  { name: 'Jaipur', keywords: ['jaipur'], column: 1, row: 0 },
  { name: 'Agra', keywords: ['agra'], column: 2, row: 0 },
  { name: 'Ranthambore', keywords: ['ranthambore'], column: 3, row: 0 },
  { name: 'Pushkar', keywords: ['pushkar'], column: 0, row: 1 },
  { name: 'Jodhpur', keywords: ['jodhpur'], column: 1, row: 1 },
  { name: 'Udaipur', keywords: ['udaipur'], column: 2, row: 1 },
  { name: 'Jaisalmer', keywords: ['jaisalmer'], column: 3, row: 1 },
  {
    name: 'Varanasi',
    keywords: ['varanasi', 'benaras', 'banaras'],
    column: 0,
    row: 2,
  },
  { name: 'Bikaner', keywords: ['bikaner'], column: 1, row: 2 },
  {
    name: 'Kerala',
    keywords: ['kerala', 'kochi', 'cochin', 'munnar', 'alleppey'],
    column: 2,
    row: 2,
  },
  {
    name: 'Himalayas',
    keywords: ['himalaya', 'ladakh', 'leh', 'manali', 'shimla', 'rishikesh', 'uttarakhand'],
    column: 3,
    row: 2,
  },
];
const heroTours = [currentTours[0], currentTours[4], currentTours[3]];
const galleryTours = [currentTours[0], internationalTours[0], currentTours[2], internationalTours[3], currentTours[5], internationalTours[5]];
const popularListings = [currentListings[0], internationalListings[0], currentListings[4], internationalListings[1], currentListings[5], internationalListings[3], currentListings[2], internationalListings[4]];
const internationalVideo = internationalMontage;
const indiaVideo = 'https://video.gumlet.io/6808bf5ac1d254855e3aee9d/681a10d271185aee8bc1688f/main.mp4';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function money(value) {
  return value ? `US $${Number(value).toLocaleString('en-US')}` : 'Price on request';
}

function dateLabel(item) {
  return item.departureYears?.length ? `${Math.min(...item.departureYears)}–${Math.max(...item.departureYears)} · Flexible` : 'Dates on request';
}

function listingText(item) {
  return [item.name, item.description, item.overview, item.plan, item.origin, item.end, ...(item.destinations || [])].filter(Boolean).join(' ').toLowerCase();
}

function matchesDestination(item, destination) {
  const text = listingText(item);
  return destination.keywords.some((keyword) => text.includes(keyword));
}

function Logo({ light = false }) {
  return (
    <a className={`logo ${light ? 'logo-light' : ''}`} href="#home" aria-label="Vijay India Tours home">
      <img src={logo} alt="Vijay India Tours" />
    </a>
  );
}

function Header({ onEnquire }) {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const categories = categoryRules.slice(0, 8).map(([name]) => name);
  return (
    <header className="site-header">
      <div className="topbar shell">
        <Logo />
        <nav className="desktop-top">
          <a href="#packages">
            All Packages <CalendarDays size={15} />
          </a>
          <a href="#popular">Popular Tours</a>
          <a href="#why">About Us</a>
          <a href="#contact">Contact</a>
          <a className="phone-pill" href={CONTACT.phoneHref}>
            <Phone size={16} /> {CONTACT.phone}
          </a>
        </nav>
        <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div className={`navband ${open ? 'open' : ''}`}>
        <nav className="shell mainnav">
          <a href="#international-trips">International Trips</a>
          <a href="#india-trips">India Trips</a>
          <div className="navdrop" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
            <button>
              India Tour Packages <ChevronDown size={15} />
            </button>
            {drop && (
              <div className="dropdown">
                {categories.map((name) => (
                  <a href={`#packages`} key={name}>
                    <span>{name}</span>
                    <ChevronRight size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>
          <a href="#packages">Golden Triangle</a>
          <a href="#packages">Rajasthan</a>
          <a href="#packages">Tiger Safari</a>
          <a href="#packages">Food Tours</a>
          <button className="mobile-enquire" onClick={onEnquire}>
            Plan my trip
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onExplore }) {
  return (
    <section className="hero" id="home">
      {heroTours.map((tour, index) => (
        <div className={`hero-frame frame-${index + 1}`} style={{ backgroundImage: `url(${tour.image})` }} key={tour.id} />
      ))}
      <div className="hero-shade" />
      <div className="shell hero-copy">
        <p className="hero-kicker">PRIVATE TOURS · PLANNED IN JAIPUR</p>
        <h1>
          See more than
          <br />
          the postcards.
        </h1>
        <p>Thoughtful India tours and carefully chosen journeys abroad, with clear itineraries and a real team to help you plan.</p>
        <button className="hero-cta" onClick={onExplore}>
          Find your trip <ArrowRight size={18} />
        </button>
        <div className="hero-facts">
          <span>
            <b>30+</b> years in travel
          </span>
          <span>
            <b>89</b> journeys to explore
          </span>
          <span>
            <b>1</b> Jaipur-based team
          </span>
        </div>
      </div>
      <div className="play-chip">
        <span className="pulse" /> INDIA EXPERTISE · JOURNEYS WORLDWIDE
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="shell trust-grid">
        <div>
          <Star fill="#ffc107" strokeWidth={0} />
          <span>
            <b>Rated 5.0</b>
            <small>By TourRadar travellers</small>
          </span>
        </div>
        <div>
          <Headphones />
          <span>
            <b>Quick, personal replies</b>
            <small>Usually within an hour</small>
          </span>
        </div>
        <div>
          <ShieldCheck />
          <span>
            <b>Private by design</b>
            <small>Your dates, pace and comfort</small>
          </span>
        </div>
        <div>
          <Languages />
          <span>
            <b>English & German</b>
            <small>Speak directly with the team</small>
          </span>
        </div>
      </div>
    </section>
  );
}

function JourneyMiniCard({ item, onOpen }) {
  return (
    <button className="journey-mini-card" onClick={() => onOpen(item)} aria-label={`View ${item.name}`}>
      <img src={item.image} alt="" loading="lazy" />
      <span className="journey-card-shade" />
      <span className="journey-card-copy">
        <small>
          {item.duration} DAYS · {categoryFor(item).toUpperCase()}
        </small>
        <strong>{item.name}</strong>
        <i>{item.price ? `From ${money(item.price)}` : 'Price on request'}</i>
      </span>
      <span className="journey-card-arrow">
        <ArrowRight />
      </span>
    </button>
  );
}

function TravelPanel({ id, eyebrow, title, copy, video, items, onOpen, onExplore, tone }) {
  return (
    <article className={`journey-panel ${tone}`} id={id}>
      <div className="journey-video-wrap">
        <video className="journey-video" autoPlay muted loop playsInline preload="metadata" aria-label={`${title} destination film`}>
          <source src={video} type="video/mp4" />
        </video>
        <div className="journey-video-shade" />
        <div className="journey-panel-copy">
          <p>{eyebrow}</p>
          <h2>{title}</h2>
          <span>{copy}</span>
          <button onClick={onExplore}>
            See the trips <ArrowRight />
          </button>
        </div>
        <div className="journey-sound-label">
          <span /> SEE THE DESTINATION
        </div>
      </div>
      <div className="journey-rail" aria-label={`${title} packages`}>
        {items.map((item) => (
          <JourneyMiniCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpen} />
        ))}
      </div>
    </article>
  );
}

function JourneyShowcase({ onOpen, onCategory }) {
  const indiaPicks = [currentListings[0], currentListings[4], currentListings[2], currentListings[5], currentListings[9], currentListings[12]];
  return (
    <section className="journey-showcase" aria-label="Featured India and international trips">
      <div className="shell">
        <div className="journey-intro">
          <div>
            <p className="kicker">START WITH THE PLACE</p>
            <h2>A journey you can picture—and plan.</h2>
          </div>
          <p>Browse real routes, compare prices and read the full itinerary before you enquire.</p>
        </div>
        <TravelPanel id="international-trips" tone="international" eyebrow="EUROPE & NORTH AMERICA" title="International Journeys" copy="From Paris and the Swiss Alps to New York and Niagara—well-paced routes with the details laid out up front." video={internationalVideo} items={internationalListings} onOpen={onOpen} onExplore={() => onCategory('International')} />
        <TravelPanel id="india-trips" tone="india" eyebrow="INDIA, OUR HOME GROUND" title="India, Up Close" copy="Palaces at sunrise, tiger country, Himalayan roads and Kerala backwaters—planned with local knowledge from Jaipur." video={indiaVideo} items={indiaPicks} onOpen={onOpen} onExplore={() => onCategory('All')} />
      </div>
    </section>
  );
}

function QuickLinks({ onDestination }) {
  return (
    <section className="quick shell" aria-labelledby="destination-title">
      <div className="quick-heading">
        <div>
          <p className="kicker">WHERE IN INDIA?</p>
          <h2 id="destination-title">Choose a place. See the right tours.</h2>
        </div>
        <p>Start with a city or region and we’ll narrow the collection for you.</p>
      </div>
      <div className="destination-rail">
        {destinationFilters.map((destination) => {
          const count = allListings.filter((item) => matchesDestination(item, destination)).length;
          return (
            <button key={destination.name} className="destination-icon-card" onClick={() => onDestination(destination.name)} aria-label={`Show ${count} ${destination.name} tour packages`}>
              <span className="destination-icon-circle" aria-hidden="true">
                <span
                  className="destination-icon-art"
                  style={{
                    backgroundImage: `url(${destinationIconAtlas})`,
                    backgroundPosition: `${destination.column * 33.3333}% ${destination.row * 50}%`,
                  }}
                />
              </span>
              <strong>{destination.name}</strong>
              <small>
                {count} {count === 1 ? 'tour' : 'tours'}
              </small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PackageCard({ item, onOpen }) {
  return (
    <article className="trip-card">
      <button className="trip-image" onClick={() => onOpen(item)} aria-label={`Open ${item.name}`}>
        <img src={item.image || currentTours[0].image} alt={item.name} loading="lazy" />
        <span>{item.type === 'official' ? 'VIJAY SIGNATURE' : categoryFor(item).toUpperCase()}</span>
        <i>{item.duration ? `${item.duration} DAYS` : 'CUSTOM'}</i>
      </button>
      <div className="trip-body">
        <p className="place">
          <MapPin size={13} />
          {item.origin || 'India'} <ArrowRight size={12} /> {item.end || 'India'}
        </p>
        <h3>
          <button onClick={() => onOpen(item)}>{item.name}</button>
        </h3>
        <div className="trip-meta">
          <span>
            <Clock3 size={14} />
            {item.duration ? `${item.duration} days` : 'Flexible duration'}
          </span>
          <span>
            <CalendarDays size={14} />
            {dateLabel(item)}
          </span>
        </div>
        <div className="trip-bottom">
          <div>
            <small>Starting from</small>
            <strong>{money(item.price)}</strong>
            {item.price && <small>per person</small>}
          </div>
          <button onClick={() => onOpen(item)}>
            View itinerary <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Popular({ onOpen }) {
  return (
    <section className="section shell" id="popular">
      <div className="section-head">
        <div>
          <p className="kicker">GOOD PLACES TO START</p>
          <h2>Trips travellers ask for most</h2>
          <p>Compare the route, pace, included services and price before you decide.</p>
        </div>
        <a href="#packages">
          Browse all 89 <ArrowRight size={16} />
        </a>
      </div>
      <div className="trip-grid featured-grid">
        {popularListings.map((item) => (
          <PackageCard item={item} onOpen={onOpen} key={`${item.type}-${item.id}`} />
        ))}
      </div>
    </section>
  );
}

function Collections({ onCategory }) {
  const picks = [
    {
      name: 'Rajasthan',
      subtitle: 'Palaces, blue cities & desert nights',
      tour: currentTours.find((tour) => /rajasthan/i.test(tour.name)) || currentTours[0],
    },
    {
      name: 'International',
      subtitle: 'Europe’s classics & North America’s east',
      tour: internationalListings[0],
    },
    {
      name: 'Wildlife',
      subtitle: 'Tiger reserves & days in the wild',
      tour: currentTours.find((tour) => /tiger/i.test(tour.name)) || currentTours[0],
    },
    {
      name: 'South India',
      subtitle: 'Temple towns, tea hills & backwaters',
      tour: currentTours.find((tour) => /south india/i.test(tour.name)) || currentTours[1],
    },
  ];
  return (
    <section className="destination-section">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="kicker">TRAVEL BY INTEREST</p>
            <h2>Find the trip that feels like you</h2>
            <p>Start with the experience you want; the right route can follow.</p>
          </div>
        </div>
        <div className="destination-grid">
          {picks.map((pick) => (
            <button className="destination-card" key={pick.name} onClick={() => onCategory(pick.name)}>
              <img src={pick.tour.image} alt={pick.name} />
              <div>
                <p>{pick.subtitle}</p>
                <h3>{pick.name}</h3>
                <span>
                  See this collection <ArrowRight size={17} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function AllPackages({ onOpen, requestedCategory, clearRequestedCategory, requestedDestination, clearRequestedDestination }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [source, setSource] = useState('All 89');
  const [destination, setDestination] = useState('');
  const [limit, setLimit] = useState(12);
  useEffect(() => {
    if (requestedCategory) {
      setCategory(requestedCategory);
      setSource('All 89');
      setDestination('');
      setLimit(12);
      clearRequestedCategory();
    }
  }, [requestedCategory, clearRequestedCategory]);
  useEffect(() => {
    if (requestedDestination) {
      setDestination(requestedDestination);
      setCategory('All');
      setSource('All 89');
      setQuery('');
      setLimit(12);
      clearRequestedDestination();
    }
  }, [requestedDestination, clearRequestedDestination]);
  const categories = ['All', ...new Set(allListings.map(categoryFor))];
  const destinationConfig = destinationFilters.find((item) => item.name === destination);
  const filtered = useMemo(
    () =>
      allListings.filter((item) => {
        const text = listingText(item);
        const categoryMatch = category === 'All' || categoryFor(item) === category;
        const sourceMatch = source === 'All 89' || (source === '69 Current India' ? item.type === 'current' : source === '14 Official India' ? item.type === 'official' : item.type === 'international');
        const destinationMatch = !destinationConfig || matchesDestination(item, destinationConfig);
        return categoryMatch && sourceMatch && destinationMatch && text.includes(query.toLowerCase().trim());
      }),
    [query, category, source, destinationConfig],
  );
  useEffect(() => setLimit(12), [query, category, source, destination]);
  return (
    <section className="all-packages" id="packages">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="kicker">THE FULL COLLECTION</p>
            <h2>Find your next journey</h2>
            <p>
              Explore {audit.tourRadarListings} current India departures, {audit.officialListings} flexible Vijay itineraries and 6 international journeys. Every route opens into a full day-by-day plan.
            </p>
          </div>
        </div>
        {destinationConfig && (
          <div className="destination-filter-note">
            <MapPin />
            <span>
              Tours visiting <b>{destinationConfig.name}</b>
            </span>
            <button onClick={() => setDestination('')}>
              Clear destination <X />
            </button>
          </div>
        )}
        <div className="catalog-tools">
          <label className="search">
            <Search />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setDestination('');
              }}
              placeholder="Search a place, tour or experience"
            />
            <b>{filtered.length} matches</b>
          </label>
          <div className="source-tabs">
            {['All 89', '69 Current India', '14 Official India', '6 International'].map((label) => (
              <button className={source === label ? 'active' : ''} onClick={() => setSource(label)} key={label}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="category-tabs">
          {categories.map((name) => (
            <button
              className={category === name && !destination ? 'active' : ''}
              onClick={() => {
                setCategory(name);
                setDestination('');
              }}
              key={name}
            >
              {name}
            </button>
          ))}
        </div>
        {filtered.length ? (
          <>
            <div className="trip-grid">
              {filtered.slice(0, limit).map((item) => (
                <PackageCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpen} />
              ))}
            </div>
            {limit < filtered.length && (
              <button className="load-more" onClick={() => setLimit(filtered.length)}>
                See all {filtered.length} trips <ChevronDown />
              </button>
            )}
          </>
        ) : (
          <div className="empty">
            <Search />
            <h3>We couldn’t find that trip</h3>
            <p>Try a different place or remove one of the filters.</p>
            <button
              onClick={() => {
                setQuery('');
                setCategory('All');
                setSource('All 89');
                setDestination('');
              }}
            >
              Reset search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const benefits = [
  [Compass, 'Planned by people who know India', 'Our Jaipur team brings more than 30 years of practical route knowledge to every India journey.'],
  [Users, 'Your trip, not a template', 'Adjust the pace, hotel style and experiences to suit the people you are travelling with.'],
  [Headphones, 'Help before and during travel', 'Speak with the same team while you plan and whenever you need support on the road.'],
  [CircleCheck, 'The full route before you book', 'Read the day-by-day plan, transport notes and important inclusions without chasing for basics.'],
  [ShieldCheck, 'Straight answers on cost', 'See published prices where available and know what still needs to be confirmed before payment.'],
  [Hotel, 'One team, near and far', 'Plan India in depth, or choose selected routes through Europe and eastern North America.'],
];

function WhyUs() {
  return (
    <section className="why" id="why">
      <div className="shell">
        <div className="center-head">
          <p className="kicker">WHY TRAVELLERS CHOOSE VIJAY</p>
          <h2>Advice that comes from experience.</h2>
          <p>Talk to a Jaipur-based team that knows the routes, answers the practical questions and stays close when plans change.</p>
        </div>
        <div className="benefits">
          {benefits.map(([Icon, title, text]) => (
            <article key={title}>
              <div className="benefit-icon">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="moments" id="stories">
      <div className="shell">
        <div className="center-head">
          <p className="kicker">A GLIMPSE OF THE ROAD</p>
          <h2>Places worth travelling for</h2>
        </div>
        <div className="moment-grid">
          {galleryTours.map((tour, index) => (
            <div className={`moment m${index}`} key={`${tour.id}-${index}`}>
              <img src={tour.image} alt={tour.name} loading="lazy" />
              <span>
                <Camera size={16} />
                {tour.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactForm({ prefill = '' }) {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="form-success">
        <Check />
        <h3>You’re one tap away</h3>
        <p>We opened WhatsApp with your details. Review the message, add anything useful and tap send when you’re ready.</p>
        <button onClick={() => setSent(false)}>Start a different enquiry</button>
      </div>
    );
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [`Hello Vijay India Tours, I’d like help planning a trip.`, `Name: ${data.get('name')}`, `Phone: ${data.get('phone')}`, `Email: ${data.get('email') || 'Not provided'}`, `Preferred dates: ${data.get('dates') || 'Flexible'}`, `Trip idea: ${data.get('message') || 'I’d like help choosing the right tour.'}`].join('\n');
    window.open(`https://wa.me/917976064160?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return (
    <form onSubmit={submit}>
      <label>
        Name *<input name="name" required placeholder="Your full name" />
      </label>
      <div className="form-row">
        <label>
          Phone / WhatsApp *<input name="phone" required placeholder="+91" />
        </label>
        <label>
          Preferred dates
          <input name="dates" placeholder="e.g. November 2026" />
        </label>
      </div>
      <label>
        Email
        <input name="email" type="email" placeholder="you@example.com" />
      </label>
      <label>
        Where would you like to go?
        <textarea name="message" defaultValue={prefill} placeholder="Share a destination, tour name or the kind of trip you have in mind." />
      </label>
      <button className="submit">
        Review in WhatsApp <ArrowRight size={17} />
      </button>
      <small>
        <ShieldCheck />
        You can review and edit the message before sending it.
      </small>
    </form>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="shell contact-grid">
        <div className="contact-art" style={{ backgroundImage: `url(${currentTours[5].image})` }}>
          <div>
            <p>TALK TO THE TEAM WHO PLANS IT</p>
            <h2>Have dates in mind? Let’s shape the trip.</h2>
            <span>
              <Phone />
              {CONTACT.phone}
            </span>
            <span>
              <Mail />
              {CONTACT.email}
            </span>
            <span>
              <MapPin />
              {CONTACT.address}
            </span>
          </div>
        </div>
        <div className="contact-form">
          <p className="kicker">START A CONVERSATION</p>
          <h2>Tell us what you’re imagining</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const links = ['International Trips', 'Golden Triangle', 'Rajasthan', 'Wildlife', 'South India'];
  return (
    <footer>
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>Based in Jaipur and planning journeys for more than 30 years. Come with a tour in mind, or simply tell us where you want to go.</p>
        </div>
        <div>
          <h3>Tour Collections</h3>
          {links.map((name) => (
            <a href={name === 'International Trips' ? '#international-trips' : '#packages'} key={name}>
              {name}
            </a>
          ))}
        </div>
        <div>
          <h3>Quick Links</h3>
          <a href="#packages">All 89 packages</a>
          <a href="#popular">Popular tours</a>
          <a href="#why">About Vijay</a>
          <a href="#contact">Plan a tour</a>
        </div>
        <div className="footer-contact">
          <h3>Talk to us</h3>
          <a href={CONTACT.phoneHref}>
            <Phone />
            {CONTACT.phone}
          </a>
          <a href={`mailto:${CONTACT.email}`}>
            <Mail />
            {CONTACT.email}
          </a>
          <span>
            <MapPin />
            {CONTACT.address}
          </span>
        </div>
      </div>
      <div className="copyright shell">
        © 2026 Vijay India Tours. <span>Every price, hotel and departure is reconfirmed before you book.</span>
      </div>
    </footer>
  );
}

function EnquiryModal({ open, onClose, prefill }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>
          <X />
        </button>
        <p className="kicker">A FEW DETAILS ARE ENOUGH</p>
        <h2>Let’s find the right trip</h2>
        <p>Share what you know so far—destination, dates and who is travelling. The Jaipur team will take it from there.</p>
        <ContactForm prefill={prefill} />
      </div>
    </div>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="fact">
      <Icon />
      <span>
        <small>{label}</small>
        <b>{value}</b>
      </span>
    </div>
  );
}

function CurrentDetail({ item, onBack, onEnquire }) {
  const isInternational = item.type === 'international';
  return (
    <main className="detail-page">
      <section className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="detail-overlay" />
        <button className="back" onClick={onBack}>
          <ArrowLeft /> Back to tours
        </button>
        <div className="detail-hero-copy">
          <span>{isInternational ? 'INTERNATIONAL JOURNEY' : categoryFor(item)}</span>
          <h1>{item.name}</h1>
          <p>
            <MapPin />
            {item.origin} to {item.end}
          </p>
        </div>
      </section>
      <section className="detail-facts">
        <div className="shell">
          <Fact icon={Clock3} label="DURATION" value={`${item.duration} days`} />
          <Fact icon={Compass} label="ROUTE" value={`${item.destinations.length} stops`} />
          <Fact icon={Users} label="TRAVELLERS" value={item.audience} />
          <Fact icon={Languages} label="LANGUAGES" value={item.languages.join(' & ')} />
        </div>
      </section>
      <nav className="detail-nav">
        <div className="shell">
          <a href="#overview">Overview</a>
          <a href="#itinerary">Full itinerary</a>
          <a href="#included">Inclusions & exclusions</a>
          <a href="#dates">Dates & price</a>
        </div>
      </nav>
      <section className="shell detail-layout">
        <div className="detail-main">
          <section id="overview" className="detail-section">
            <p className="kicker">YOUR JOURNEY AT A GLANCE</p>
            <h2>{item.name}</h2>
            <p className="lead">{item.description}</p>
            <div className="style-chips">
              {item.styles.map((style) => (
                <span key={style}>{style}</span>
              ))}
            </div>
            <h3>Your route</h3>
            <div className="route-line">
              {item.destinations.map((place, index) => (
                <span key={`${place}-${index}`}>
                  <i>{index + 1}</i>
                  {place}
                  {index < item.destinations.length - 1 && <ArrowRight />}
                </span>
              ))}
            </div>
          </section>
          <section id="itinerary" className="detail-section">
            <p className="kicker">DAY BY DAY</p>
            <h2>What your {item.duration} days look like</h2>
            <p className="section-intro">Here is the complete route, including travel days, guided time and the days you can make your own.</p>
            <div className="timeline">
              {item.days.map((day) => (
                <article className="day" key={`${item.id}-${day.day}`}>
                  <div className="day-number">
                    <small>DAY</small>
                    <b>{String(day.day).padStart(2, '0')}</b>
                  </div>
                  <div className="day-content">
                    <h3>{day.place}</h3>
                    {day.activities && (
                      <p>
                        <strong>Day plan</strong>
                        {day.activities}
                      </p>
                    )}
                    {day.landmarks && (
                      <p>
                        <strong>Places</strong>
                        {day.landmarks}
                      </p>
                    )}
                    {day.transport && (
                      <p>
                        <strong>Transport</strong>
                        {day.transport}
                      </p>
                    )}
                    {day.meals && (
                      <p>
                        <strong>Meals</strong>
                        {day.meals}
                      </p>
                    )}
                    {day.optional && (
                      <p className="optional">
                        <strong>Optional experiences</strong>
                        {day.optional}
                      </p>
                    )}
                    {!day.activities && !day.transport && !day.optional && <p>A travel day or time at leisure, as noted in the itinerary.</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="included" className="detail-section">
            <p className="kicker">WHAT’S COVERED</p>
            <h2>Included—and what to budget for</h2>
            <div className="include-grid">
              <div>
                <h3>
                  <CircleCheck />
                  Included in the tour
                </h3>
                <ul>
                  {item.included.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </div>
              <div className="excluded">
                <h3>
                  <X />
                  Plan and pay separately
                </h3>
                <ul>
                  {item.excluded.map((text) => (
                    <li key={text}>{text}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="fine-print">{isInternational ? 'These details follow the published tour information. We will confirm the exact departure, hotels and services with you before any payment.' : 'These details follow the public package listing. Your final quote will name the exact hotels, transfers and services for your dates.'}</p>
          </section>
          <section id="dates" className="detail-section">
            <p className="kicker">WHEN CAN YOU GO?</p>
            <h2>{isInternational ? 'Choose from scheduled departures' : 'Travel on dates that suit you'}</h2>
            <p className="lead">{isInternational ? 'Departure dates and prices can change as places fill. Check the source tour or ask us to confirm what is currently available.' : 'Tell us your preferred month and we’ll check hotels, transport and the final price for your dates.'}</p>
            <div className="year-row">{item.departureYears.length ? item.departureYears.map((year) => <span key={year}>{year}</span>) : <span>Ask for the next available dates</span>}</div>
            {!isInternational && (
              <div className="month-row">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            )}
          </section>
          <div className="source-note">
            <ShieldCheck />
            <p>
              <b>{isInternational ? 'Route details checked' : 'Package details checked'}</b>
              <span>{isInternational ? 'The route and duration follow the published tour. Ask us to recheck departures, visa requirements, price and availability before you book.' : 'The route and package details follow Vijay’s public listing. We’ll reconfirm the live arrangements before payment.'}</span>
            </p>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                View source tour <ExternalLink />
              </a>
            )}
          </div>
        </div>
        <aside className="booking-card">
          <p>FROM</p>
          <strong>{money(item.price)}</strong>
          <span>{item.price ? `per person · ${isInternational ? 'guide price' : 'published price'}` : 'Ask us for the latest departure price'}</span>
          <div className="booking-line">
            <CalendarDays />
            <p>
              <b>{dateLabel(item)}</b>
              <small>We’ll confirm availability before you book</small>
            </p>
          </div>
          <button onClick={() => onEnquire(`I’m interested in “${item.name}” (${item.duration} days). Please share the latest dates and price.`)}>Ask about this trip</button>
          <a href={`https://wa.me/917976064160?text=${encodeURIComponent(`Hello Vijay India Tours, I am interested in ${item.name}.`)}`} target="_blank" rel="noreferrer">
            <MessageCircle />
            Chat on WhatsApp
          </a>
          <small>
            <ShieldCheck />
            Enquire first. Decide when you’re ready.
          </small>
        </aside>
      </section>
    </main>
  );
}

function OfficialDetail({ item, onBack, onEnquire }) {
  return (
    <main className="detail-page">
      <section className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="detail-overlay" />
        <button className="back" onClick={onBack}>
          <ArrowLeft /> Back to tours
        </button>
        <div className="detail-hero-copy">
          <span>VIJAY SIGNATURE JOURNEY</span>
          <h1>{item.name}</h1>
          <p>
            <MapPin />
            {item.plan || 'Custom India route'}
          </p>
        </div>
      </section>
      <section className="detail-facts">
        <div className="shell">
          <Fact icon={Clock3} label="DURATION" value={item.dayCount ? `${item.dayCount} days` : 'Flexible'} />
          <Fact icon={Compass} label="ROUTE" value={`${item.destinations.length || 'Custom'} stops`} />
          <Fact icon={CalendarDays} label="DEPARTURES" value="Dates on request" />
          <Fact icon={ShieldCheck} label="FORMAT" value="Private & custom" />
        </div>
      </section>
      <nav className="detail-nav">
        <div className="shell">
          <a href="#overview">Overview</a>
          <a href="#itinerary">Full itinerary</a>
          <a href="#highlights">Highlights</a>
          <a href="#dates">Dates & price</a>
        </div>
      </nav>
      <section className="shell detail-layout">
        <div className="detail-main">
          <section id="overview" className="detail-section">
            <p className="kicker">THE JOURNEY AT A GLANCE</p>
            <h2>{item.name}</h2>
            <p className="lead full-copy">{item.description}</p>
            <h3>Proposed route</h3>
            <div className="official-plan">{item.plan || 'A custom route prepared around your dates and interests.'}</div>
          </section>
          <section id="itinerary" className="detail-section">
            <p className="kicker">DAY BY DAY</p>
            <h2>{item.days.length ? `Your ${item.days.length}-day route` : 'A day-by-day plan made for you'}</h2>
            {item.days.length ? (
              <div className="timeline official-timeline">
                {item.days.map((day) => (
                  <article className="day" key={`${item.id}-${day.day}`}>
                    <div className="day-number">
                      <small>DAY</small>
                      <b>{String(day.day).padStart(2, '0')}</b>
                    </div>
                    <div className="day-content">
                      <h3>{day.place}</h3>
                      <p>{day.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="lead">This is a flexible private journey. Share your dates and interests, and Vijay’s team will arrange the days in the order that works best.</p>
            )}
          </section>
          <section id="highlights" className="detail-section">
            <p className="kicker">WHAT STANDS OUT</p>
            <h2>Experiences along the way</h2>
            <div className="highlight-copy">{item.highlights || 'We’ll shape the highlights around your route, travel dates and the experiences you care about most.'}</div>
          </section>
          <section id="dates" className="detail-section">
            <p className="kicker">YOUR DATES, YOUR QUOTE</p>
            <h2>Choose when you want to travel</h2>
            <p className="lead">Because this is a private tour, the final price depends on your dates, hotels and group size. Send us the basics and we’ll return with available hotels, transport and a clear quote.</p>
            <div className="month-row">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </section>
          <div className="source-note">
            <ShieldCheck />
            <p>
              <b>Vijay package details</b>
              <span>The route, day plan, highlights and guide price come from Vijay India Tours’ own published package.</span>
            </p>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer">
              View source tour <ExternalLink />
            </a>
          </div>
        </div>
        <aside className="booking-card">
          <p>GUIDE PRICE FROM</p>
          <strong>{money(item.price)}</strong>
          <span>per person · final quote depends on your dates</span>
          <div className="booking-line">
            <CalendarDays />
            <p>
              <b>Dates on request</b>
              <small>Travel in any month, subject to availability</small>
            </p>
          </div>
          <button onClick={() => onEnquire(`I’m interested in “${item.name}”. Please help me plan it for my dates.`)}>Plan this trip with us</button>
          <a href={CONTACT.phoneHref}>
            <Phone />
            Call {CONTACT.phone}
          </a>
        </aside>
      </section>
    </main>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [modal, setModal] = useState(false);
  const [prefill, setPrefill] = useState('');
  const [requestedCategory, setRequestedCategory] = useState('');
  const [requestedDestination, setRequestedDestination] = useState('');
  useEffect(() => {
    const sync = () => {
      const id = location.hash.match(/^#tour\/(.+)$/)?.[1];
      const internationalId = location.hash.match(/^#international\/(.+)$/)?.[1];
      const officialId = location.hash.match(/^#official\/(.+)$/)?.[1];
      setSelected(currentListings.find((tour) => tour.id === id) || internationalListings.find((tour) => tour.id === internationalId) || null);
      setSelectedOfficial(officialListings.find((tour) => tour.id === officialId) || null);
      if (id || internationalId || officialId) scrollTo({ top: 0 });
    };
    sync();
    addEventListener('hashchange', sync);
    return () => removeEventListener('hashchange', sync);
  }, []);
  const open = (item) => {
    const route = item.type === 'official' ? 'official' : item.type === 'international' ? 'international' : 'tour';
    location.hash = `${route}/${item.id}`;
  };
  const back = () => {
    location.hash = 'packages';
    setSelected(null);
    setSelectedOfficial(null);
    setTimeout(() => document.getElementById('packages')?.scrollIntoView(), 30);
  };
  const enquire = (message = '') => {
    setPrefill(message);
    setModal(true);
  };
  const chooseCategory = (name) => {
    setRequestedCategory(name);
    location.hash = 'packages';
    setTimeout(() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }), 30);
  };
  const chooseDestination = (name) => {
    setRequestedDestination(name);
    location.hash = 'packages';
    setTimeout(() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }), 30);
  };
  if (selected)
    return (
      <>
        <Header onEnquire={() => enquire()} />
        <CurrentDetail item={selected} onBack={back} onEnquire={enquire} />
        <Footer />
        <EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill} />
      </>
    );
  if (selectedOfficial)
    return (
      <>
        <Header onEnquire={() => enquire()} />
        <OfficialDetail item={selectedOfficial} onBack={back} onEnquire={enquire} />
        <Footer />
        <EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill} />
      </>
    );
  return (
    <>
      <Header onEnquire={() => enquire()} />
      <main>
        <Hero onExplore={() => document.getElementById('international-trips')?.scrollIntoView({ behavior: 'smooth' })} />
        <TrustStrip />
        <JourneyShowcase onOpen={open} onCategory={chooseCategory} />
        <QuickLinks onDestination={chooseDestination} />
        <Popular onOpen={open} />
        <Collections onCategory={chooseCategory} />
        <AllPackages onOpen={open} requestedCategory={requestedCategory} clearRequestedCategory={() => setRequestedCategory('')} requestedDestination={requestedDestination} clearRequestedDestination={() => setRequestedDestination('')} />
        <WhyUs />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <div className="floating">
        <button onClick={() => enquire()}>
          <Phone />
          <span>Request a call back</span>
        </button>
        <a href="https://wa.me/917976064160" target="_blank" rel="noreferrer" aria-label="WhatsApp Vijay India Tours">
          <MessageCircle />
        </a>
      </div>
      <EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill} />
    </>
  );
}
