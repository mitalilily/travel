import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CalendarDays, Camera, Check, ChevronDown, ChevronRight,
  CircleCheck, Clock3, Compass, ExternalLink, Headphones, Heart, Hotel,
  Languages, Mail, MapPin, Menu, MessageCircle, Phone, Search, ShieldCheck,
  Star, Users, X,
} from 'lucide-react';
import currentTours from './data/tourradar.json';
import officialTours from './data/official-tours.json';
import audit from './data/catalog-audit.json';
import logo from './assets/vijay-logo.png';
import destinationIconAtlas from './assets/vijay-destination-icons.png';

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
  const titleMatch = categoryRules.find(([, rule]) => rule.test(item.name || ''));
  if (titleMatch) return titleMatch[0];
  const text = [item.name, item.description, item.overview, item.plan, ...(item.destinations || []), ...(item.styles || [])].join(' ');
  return categoryRules.find(([, rule]) => rule.test(text))?.[0] || 'Cultural India';
}

const officialListings = officialTours.map((tour) => ({
  ...tour,
  type: 'official',
  duration: tour.dayCount || null,
  description: tour.overview,
  destinations: tour.plan ? tour.plan.split(/\s*(?:->|>|–|-)\s*/).filter(Boolean) : [],
  origin: tour.plan?.split(/\s*(?:->|>|–|-)\s*/)[0] || 'India',
  end: tour.plan?.split(/\s*(?:->|>|–|-)\s*/).filter(Boolean).at(-1) || 'India',
  included: [],
  excluded: [],
  departureYears: [],
}));

const currentListings = currentTours.map((tour) => ({ ...tour, type: 'current' }));
const allListings = [...currentListings, ...officialListings];
const destinationFilters = [
  { name: 'Delhi', keywords: ['delhi'], column: 0, row: 0 },
  { name: 'Jaipur', keywords: ['jaipur'], column: 1, row: 0 },
  { name: 'Agra', keywords: ['agra'], column: 2, row: 0 },
  { name: 'Ranthambore', keywords: ['ranthambore'], column: 3, row: 0 },
  { name: 'Pushkar', keywords: ['pushkar'], column: 0, row: 1 },
  { name: 'Jodhpur', keywords: ['jodhpur'], column: 1, row: 1 },
  { name: 'Udaipur', keywords: ['udaipur'], column: 2, row: 1 },
  { name: 'Jaisalmer', keywords: ['jaisalmer'], column: 3, row: 1 },
  { name: 'Varanasi', keywords: ['varanasi', 'benaras', 'banaras'], column: 0, row: 2 },
  { name: 'Bikaner', keywords: ['bikaner'], column: 1, row: 2 },
  { name: 'Kerala', keywords: ['kerala', 'kochi', 'cochin', 'munnar', 'alleppey'], column: 2, row: 2 },
  { name: 'Himalayas', keywords: ['himalaya', 'ladakh', 'leh', 'manali', 'shimla', 'rishikesh', 'uttarakhand'], column: 3, row: 2 },
];
const heroTours = [currentTours[0], currentTours[1], currentTours[3]];
const galleryTours = [currentTours[0], currentTours[1], currentTours[2], currentTours[3], currentTours[5], currentTours[9]];
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
  return <a className={`logo ${light ? 'logo-light' : ''}`} href="#home" aria-label="Vijay India Tours home"><img src={logo} alt="Vijay India Tours" /></a>;
}

function Header({ onEnquire }) {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const categories = categoryRules.slice(0, 8).map(([name]) => name);
  return <header className="site-header">
    <div className="topbar shell"><Logo /><nav className="desktop-top"><a href="#packages">All Packages <CalendarDays size={15} /></a><a href="#popular">Popular Tours</a><a href="#why">About Us</a><a href="#contact">Contact</a><a className="phone-pill" href={CONTACT.phoneHref}><Phone size={16} /> {CONTACT.phone}</a></nav><button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button></div>
    <div className={`navband ${open ? 'open' : ''}`}><nav className="shell mainnav">
      <div className="navdrop" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}><button>India Tour Packages <ChevronDown size={15} /></button>{drop && <div className="dropdown">{categories.map((name) => <a href={`#packages`} key={name}><span>{name}</span><ChevronRight size={15} /></a>)}</div>}</div>
      <a href="#packages">Golden Triangle</a><a href="#packages">Rajasthan</a><a href="#packages">Tiger Safari</a><a href="#packages">Festivals</a><a href="#packages">Food Tours</a><button className="mobile-enquire" onClick={onEnquire}>Plan my trip</button>
    </nav></div>
  </header>;
}

function Hero({ onExplore }) {
  return <section className="hero" id="home">{heroTours.map((tour, index) => <div className={`hero-frame frame-${index + 1}`} style={{ backgroundImage: `url(${tour.image})` }} key={tour.id} />)}<div className="hero-shade"/><div className="shell hero-copy"><p className="hero-kicker">VIJAY INDIA TOURS · JAIPUR</p><h1>Discover India.<br/>Your way.</h1><p>Real private tours across the Golden Triangle, Rajasthan, tiger country, the Himalayas and South India.</p><button className="hero-cta" onClick={onExplore}>Explore all 83 packages <ArrowRight size={18}/></button><div className="hero-facts"><span><b>30+</b> years</span><span><b>69</b> current tours</span><span><b>820</b> itinerary days</span></div></div><div className="play-chip"><span className="pulse"/> REAL VIJAY TOUR IMAGERY</div></section>;
}

function TrustStrip() {
  return <section className="trust-strip"><div className="shell trust-grid"><div><Star fill="#ffc107" strokeWidth={0}/><span><b>5.0 operator rating</b><small>TourRadar profile</small></span></div><div><Headphones/><span><b>Under 1 hour</b><small>Typical response time</small></span></div><div><ShieldCheck/><span><b>Private & personalised</b><small>Dates built around you</small></span></div><div><Languages/><span><b>English & German</b><small>Languages available</small></span></div></div></section>;
}

function QuickLinks({ onDestination }) {
  return <section className="quick shell" aria-labelledby="destination-title"><div className="quick-heading"><div><p className="kicker">CHOOSE YOUR DESTINATION</p><h2 id="destination-title">Explore India city by city</h2></div><p>Tap a city to see every matching Vijay package.</p></div><div className="destination-rail">{destinationFilters.map((destination) => {
    const count = allListings.filter((item) => matchesDestination(item, destination)).length;
    return <button key={destination.name} className="destination-icon-card" onClick={() => onDestination(destination.name)} aria-label={`Show ${count} ${destination.name} tour packages`}><span className="destination-icon-circle" aria-hidden="true"><span className="destination-icon-art" style={{ backgroundImage: `url(${destinationIconAtlas})`, backgroundPosition: `${destination.column * 33.3333}% ${destination.row * 50}%` }}/></span><strong>{destination.name}</strong><small>{count} {count === 1 ? 'tour' : 'tours'}</small></button>;
  })}</div></section>;
}

function PackageCard({ item, onOpen }) {
  return <article className="trip-card"><button className="trip-image" onClick={() => onOpen(item)} aria-label={`Open ${item.name}`}><img src={item.image || currentTours[0].image} alt={item.name} loading="lazy"/><span>{item.type === 'official' ? 'VIJAY SIGNATURE' : categoryFor(item).toUpperCase()}</span><i>{item.duration ? `${item.duration} DAYS` : 'CUSTOM'}</i></button><div className="trip-body"><p className="place"><MapPin size={13}/>{item.origin || 'India'} <ArrowRight size={12}/> {item.end || 'India'}</p><h3><button onClick={() => onOpen(item)}>{item.name}</button></h3><div className="trip-meta"><span><Clock3 size={14}/>{item.duration ? `${item.duration} days` : 'Flexible duration'}</span><span><CalendarDays size={14}/>{dateLabel(item)}</span></div><div className="trip-bottom"><div><small>Starting from</small><strong>{money(item.price)}</strong><small>per person</small></div><button onClick={() => onOpen(item)}>Full details <ArrowRight size={15}/></button></div></div></article>;
}

function Popular({ onOpen }) {
  return <section className="section shell" id="popular"><div className="section-head"><div><p className="kicker">REAL VIJAY PACKAGES</p><h2>Popular India Tours</h2><p>Open any package for its complete published day-by-day plan.</p></div><a href="#packages">View all 83 <ArrowRight size={16}/></a></div><div className="trip-grid featured-grid">{currentListings.slice(0, 8).map((item) => <PackageCard item={item} onOpen={onOpen} key={item.id}/>)}</div></section>;
}

function Collections({ onCategory }) {
  const picks = [
    { name: 'Rajasthan', subtitle: 'Forts, palaces & desert routes', tour: currentTours.find((tour) => /rajasthan/i.test(tour.name)) || currentTours[0] },
    { name: 'Wildlife', subtitle: 'Tigers, safaris & culture', tour: currentTours.find((tour) => /tiger/i.test(tour.name)) || currentTours[0] },
    { name: 'South India', subtitle: 'Temples, hills & backwaters', tour: currentTours.find((tour) => /south india/i.test(tour.name)) || currentTours[1] },
    { name: 'Himalayas', subtitle: 'Ladakh, Rishikesh & high roads', tour: currentTours.find((tour) => /ladakh/i.test(tour.name)) || currentTours[2] },
  ];
  return <section className="destination-section"><div className="shell"><div className="section-head"><div><p className="kicker">TRAVEL YOUR STYLE</p><h2>India Collections</h2><p>Every image comes from a real Vijay package listing.</p></div></div><div className="destination-grid">{picks.map((pick) => <button className="destination-card" key={pick.name} onClick={() => onCategory(pick.name)}><img src={pick.tour.image} alt={pick.name}/><div><p>{pick.subtitle}</p><h3>{pick.name}</h3><span>Explore packages <ArrowRight size={17}/></span></div></button>)}</div></div></section>;
}

function AllPackages({ onOpen, requestedCategory, clearRequestedCategory, requestedDestination, clearRequestedDestination }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [source, setSource] = useState('All 83');
  const [destination, setDestination] = useState('');
  const [limit, setLimit] = useState(12);
  useEffect(() => { if (requestedCategory) { setCategory(requestedCategory); setDestination(''); setLimit(12); clearRequestedCategory(); } }, [requestedCategory, clearRequestedCategory]);
  useEffect(() => { if (requestedDestination) { setDestination(requestedDestination); setCategory('All'); setSource('All 83'); setQuery(''); setLimit(12); clearRequestedDestination(); } }, [requestedDestination, clearRequestedDestination]);
  const categories = ['All', ...new Set(allListings.map(categoryFor))];
  const destinationConfig = destinationFilters.find((item) => item.name === destination);
  const filtered = useMemo(() => allListings.filter((item) => {
    const text = listingText(item);
    const categoryMatch = category === 'All' || categoryFor(item) === category;
    const sourceMatch = source === 'All 83' || (source === '69 Current Tours' ? item.type === 'current' : item.type === 'official');
    const destinationMatch = !destinationConfig || matchesDestination(item, destinationConfig);
    return categoryMatch && sourceMatch && destinationMatch && text.includes(query.toLowerCase().trim());
  }), [query, category, source, destinationConfig]);
  useEffect(() => setLimit(12), [query, category, source, destination]);
  return <section className="all-packages" id="packages"><div className="shell"><div className="section-head"><div><p className="kicker">EVERY PUBLISHED PACKAGE</p><h2>All Vijay India Tours</h2><p>{audit.tourRadarListings} current TourRadar packages + {audit.officialListings} official website tours, all with real images and full details.</p></div></div>{destinationConfig && <div className="destination-filter-note"><MapPin/><span>Showing all <b>{destinationConfig.name}</b> packages</span><button onClick={() => setDestination('')}>View every destination <X/></button></div>}<div className="catalog-tools"><label className="search"><Search/><input value={query} onChange={(event) => { setQuery(event.target.value); setDestination(''); }} placeholder="Search by tour, city or experience"/><b>{filtered.length} found</b></label><div className="source-tabs">{['All 83', '69 Current Tours', '14 Official Tours'].map((label) => <button className={source === label ? 'active' : ''} onClick={() => setSource(label)} key={label}>{label}</button>)}</div></div><div className="category-tabs">{categories.map((name) => <button className={category === name && !destination ? 'active' : ''} onClick={() => { setCategory(name); setDestination(''); }} key={name}>{name}</button>)}</div>{filtered.length ? <><div className="trip-grid">{filtered.slice(0, limit).map((item) => <PackageCard key={`${item.type}-${item.id}`} item={item} onOpen={onOpen}/>)}</div>{limit < filtered.length && <button className="load-more" onClick={() => setLimit(filtered.length)}>Show all {filtered.length} packages <ChevronDown/></button>}</> : <div className="empty"><Search/><h3>No package matched</h3><p>Try another destination or clear the filters.</p><button onClick={() => { setQuery(''); setCategory('All'); setSource('All 83'); setDestination(''); }}>Clear filters</button></div>}</div></section>;
}

const benefits = [
  [Compass, '30+ Years of India Expertise', 'Routes are shaped by an experienced Jaipur-based family team led by Mr. Singh.'],
  [Users, 'Private, Personal Journeys', 'Trip pace, hotel level and experiences can be adjusted around your travellers.'],
  [Headphones, 'Fast Local Support', 'Direct planning and on-ground help throughout your India journey.'],
  [CircleCheck, 'Real Published Itineraries', 'Every current package includes its published route, daily activities and trip categories.'],
  [ShieldCheck, 'Clear Package Details', 'Prices, dates, inclusions and exclusions are shown without invented promises.'],
  [Hotel, 'India-Wide Collection', 'Golden Triangle, Rajasthan, wildlife, food, festivals, coasts and the Himalayas.'],
];

function WhyUs() {
  return <section className="why" id="why"><div className="shell"><div className="center-head"><p className="kicker">WHY VIJAY INDIA TOURS?</p><h2>India, handled by people who know it.</h2><p>Personal planning from Jaipur, backed by three decades of destination knowledge.</p></div><div className="benefits">{benefits.map(([Icon, title, text]) => <article key={title}><div className="benefit-icon"><Icon/></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}

function Gallery() {
  return <section className="moments" id="stories"><div className="shell"><div className="center-head"><p className="kicker">REAL PACKAGE PHOTOS</p><h2>India through Vijay’s tours</h2></div><div className="moment-grid">{galleryTours.map((tour, index) => <div className={`moment m${index}`} key={tour.id}><img src={tour.image} alt={tour.name} loading="lazy"/><span><Camera size={16}/>{tour.name}</span></div>)}</div></div></section>;
}

function ContactForm({ prefill = '' }) {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="form-success"><Check/><h3>Your enquiry is ready</h3><p>WhatsApp opened with your details. Tap send there to contact Vijay India Tours.</p><button onClick={() => setSent(false)}>Prepare another enquiry</button></div>;
  const submit = (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const message = [`Hello Vijay India Tours, I would like a personal tour plan.`, `Name: ${data.get('name')}`, `Phone: ${data.get('phone')}`, `Email: ${data.get('email') || 'Not provided'}`, `Preferred dates: ${data.get('dates') || 'Flexible'}`, `Package / request: ${data.get('message') || 'Please help me choose.'}`].join('\n'); window.open(`https://wa.me/917976064160?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); setSent(true); };
  return <form onSubmit={submit}><label>Name *<input name="name" required placeholder="Your full name"/></label><div className="form-row"><label>Phone / WhatsApp *<input name="phone" required placeholder="+91"/></label><label>Preferred dates<input name="dates" placeholder="e.g. November 2026"/></label></div><label>Email<input name="email" type="email" placeholder="you@example.com"/></label><label>Package or travel request<textarea name="message" defaultValue={prefill} placeholder="Which tour are you interested in?"/></label><button className="submit">Continue on WhatsApp <ArrowRight size={17}/></button><small><ShieldCheck/>Nothing is sent until you confirm it in WhatsApp.</small></form>;
}

function Contact() {
  return <section className="contact" id="contact"><div className="shell contact-grid"><div className="contact-art" style={{ backgroundImage: `url(${currentTours[5].image})` }}><div><p>YOUR INDIA JOURNEY STARTS HERE</p><h2>Plan directly with Vijay.</h2><span><Phone/>{CONTACT.phone}</span><span><Mail/>{CONTACT.email}</span><span><MapPin/>{CONTACT.address}</span></div></div><div className="contact-form"><p className="kicker">GET IN TOUCH</p><h2>Build a personal itinerary</h2><ContactForm/></div></div></section>;
}

function Footer() {
  const links = ['Golden Triangle', 'Rajasthan', 'Wildlife', 'South India', 'Himalayas'];
  return <footer><div className="shell footer-grid"><div className="footer-brand"><Logo light/><p>Private India tours, locally planned from Jaipur by a family team with more than three decades of experience.</p></div><div><h3>Tour Collections</h3>{links.map((name) => <a href="#packages" key={name}>{name}</a>)}</div><div><h3>Quick Links</h3><a href="#packages">All 83 packages</a><a href="#popular">Popular tours</a><a href="#why">About Vijay</a><a href="#contact">Plan a tour</a></div><div className="footer-contact"><h3>Talk to us</h3><a href={CONTACT.phoneHref}><Phone/>{CONTACT.phone}</a><a href={`mailto:${CONTACT.email}`}><Mail/>{CONTACT.email}</a><span><MapPin/>{CONTACT.address}</span></div></div><div className="copyright shell">© 2026 Vijay India Tours. <span>Prices, hotels and departures are reconfirmed before booking.</span></div></footer>;
}

function EnquiryModal({ open, onClose, prefill }) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  if (!open) return null;
  return <div className="modal" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-card"><button className="modal-close" onClick={onClose}><X/></button><p className="kicker">PLAN WITH VIJAY</p><h2>Tell us about your trip</h2><p>Dates and availability are confirmed personally by the Jaipur team.</p><ContactForm prefill={prefill}/></div></div>;
}

function Fact({ icon: Icon, label, value }) { return <div className="fact"><Icon/><span><small>{label}</small><b>{value}</b></span></div>; }

function CurrentDetail({ item, onBack, onEnquire }) {
  return <main className="detail-page"><section className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}><div className="detail-overlay"/><button className="back" onClick={onBack}><ArrowLeft/> Back to all packages</button><div className="detail-hero-copy"><span>{categoryFor(item)}</span><h1>{item.name}</h1><p><MapPin/>{item.origin} to {item.end}</p></div></section><section className="detail-facts"><div className="shell"><Fact icon={Clock3} label="DURATION" value={`${item.duration} days`}/><Fact icon={Compass} label="ROUTE" value={`${item.destinations.length} stops`}/><Fact icon={Users} label="TRAVELLERS" value={item.audience}/><Fact icon={Languages} label="LANGUAGES" value={item.languages.join(' & ')}/></div></section><nav className="detail-nav"><div className="shell"><a href="#overview">Overview</a><a href="#itinerary">Full itinerary</a><a href="#included">Inclusions & exclusions</a><a href="#dates">Dates & price</a></div></nav><section className="shell detail-layout"><div className="detail-main"><section id="overview" className="detail-section"><p className="kicker">PACKAGE OVERVIEW</p><h2>{item.name}</h2><p className="lead">{item.description}</p><div className="style-chips">{item.styles.map((style) => <span key={style}>{style}</span>)}</div><h3>Published route</h3><div className="route-line">{item.destinations.map((place, index) => <span key={`${place}-${index}`}><i>{index + 1}</i>{place}{index < item.destinations.length - 1 && <ArrowRight/>}</span>)}</div></section><section id="itinerary" className="detail-section"><p className="kicker">EVERY PUBLISHED DAY</p><h2>Complete {item.duration}-day itinerary</h2><p className="section-intro">All {item.days.length} days are displayed below—nothing is hidden inside closed accordions.</p><div className="timeline">{item.days.map((day) => <article className="day" key={`${item.id}-${day.day}`}><div className="day-number"><small>DAY</small><b>{String(day.day).padStart(2, '0')}</b></div><div className="day-content"><h3>{day.place}</h3>{day.activities && <p><strong>Included activities</strong>{day.activities}</p>}{day.landmarks && <p><strong>Landmarks</strong>{day.landmarks}</p>}{day.transport && <p><strong>Transport</strong>{day.transport}</p>}{day.meals && <p><strong>Meals</strong>{day.meals}</p>}{day.optional && <p className="optional"><strong>Optional experiences</strong>{day.optional}</p>}{!day.activities && !day.transport && !day.optional && <p>Arrival, departure or free time as listed in the published itinerary.</p>}</div></article>)}</div></section><section id="included" className="detail-section"><p className="kicker">WHAT THE PACKAGE COVERS</p><h2>Inclusions & exclusions</h2><div className="include-grid"><div><h3><CircleCheck/>Included categories</h3><ul>{item.included.map((text) => <li key={text}>{text}</li>)}</ul></div><div className="excluded"><h3><X/>Not included</h3><ul>{item.excluded.map((text) => <li key={text}>{text}</li>)}</ul></div></div><p className="fine-print">These are the exact public inclusion and exclusion categories. The final quote itemises the specific hotels, transfers and services for your dates.</p></section><section id="dates" className="detail-section"><p className="kicker">CHOOSE YOUR TRAVEL TIME</p><h2>Flexible private departures</h2><p className="lead">This listing accepts flexible date enquiries across the published years below. Choose a preferred month; the team will confirm live availability, hotels and the final price.</p><div className="year-row">{item.departureYears.map((year) => <span key={year}>{year}</span>)}</div><div className="month-row">{months.map((month) => <span key={month}>{month}</span>)}</div></section><div className="source-note"><ShieldCheck/><p><b>Source-checked package</b><span>Package facts were organised from Vijay’s public listing. Verify live operational details before payment.</span></p><a href={item.sourceUrl} target="_blank" rel="noreferrer">Original listing <ExternalLink/></a></div></div><aside className="booking-card"><p>STARTING FROM</p><strong>{money(item.price)}</strong><span>per person · published price</span><div className="booking-line"><CalendarDays/><p><b>{dateLabel(item)}</b><small>Live availability on enquiry</small></p></div><button onClick={() => onEnquire(`I am interested in “${item.name}” (${item.duration} days).`)}>Check dates & get details</button><a href={`https://wa.me/917976064160?text=${encodeURIComponent(`Hello Vijay India Tours, I am interested in ${item.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle/>Ask on WhatsApp</a><small><ShieldCheck/>No payment required to enquire</small></aside></section></main>;
}

function OfficialDetail({ item, onBack, onEnquire }) {
  return <main className="detail-page"><section className="detail-hero" style={{ backgroundImage: `url(${item.image})` }}><div className="detail-overlay"/><button className="back" onClick={onBack}><ArrowLeft/> Back to all packages</button><div className="detail-hero-copy"><span>VIJAY OFFICIAL TOUR</span><h1>{item.name}</h1><p><MapPin/>{item.plan || 'Custom India route'}</p></div></section><section className="detail-facts"><div className="shell"><Fact icon={Clock3} label="DURATION" value={item.dayCount ? `${item.dayCount} days` : 'Flexible'}/><Fact icon={Compass} label="ROUTE" value={`${item.destinations.length || 'Custom'} stops`}/><Fact icon={CalendarDays} label="DEPARTURES" value="Dates on request"/><Fact icon={ShieldCheck} label="FORMAT" value="Private & custom"/></div></section><nav className="detail-nav"><div className="shell"><a href="#overview">Overview</a><a href="#itinerary">Full itinerary</a><a href="#highlights">Highlights</a><a href="#dates">Dates & price</a></div></nav><section className="shell detail-layout"><div className="detail-main"><section id="overview" className="detail-section"><p className="kicker">OFFICIAL TOUR OVERVIEW</p><h2>{item.name}</h2><p className="lead full-copy">{item.overview}</p><h3>Tour plan</h3><div className="official-plan">{item.plan || 'A custom route prepared around your dates and interests.'}</div></section><section id="itinerary" className="detail-section"><p className="kicker">COMPLETE PUBLISHED PLAN</p><h2>{item.days.length ? `All ${item.days.length} itinerary days` : 'Custom day-by-day itinerary'}</h2>{item.days.length ? <div className="timeline official-timeline">{item.days.map((day) => <article className="day" key={`${item.id}-${day.day}`}><div className="day-number"><small>DAY</small><b>{String(day.day).padStart(2, '0')}</b></div><div className="day-content"><h3>{day.place}</h3><p>{day.description}</p></div></article>)}</div> : <p className="lead">This official listing is designed as a flexible custom tour. Vijay’s team prepares the exact sequence after your enquiry.</p>}</section><section id="highlights" className="detail-section"><p className="kicker">TOUR HIGHLIGHTS</p><h2>What you’ll experience</h2><div className="highlight-copy">{item.highlights || 'Highlights are tailored around your route, travel dates and interests.'}</div></section><section id="dates" className="detail-section"><p className="kicker">DATES, SERVICES & PRICE</p><h2>Prepared for your travel dates</h2><p className="lead">The official listing does not publish fixed departure dates or a complete service breakdown. Send your preferred dates to receive live availability, hotels, transport, inclusions, exclusions and the final quote.</p><div className="month-row">{months.map((month) => <span key={month}>{month}</span>)}</div></section><div className="source-note"><ShieldCheck/><p><b>Official Vijay listing</b><span>The overview, route, day plan, highlights, image and price above come from Vijay India Tours’ own package page.</span></p><a href={item.sourceUrl} target="_blank" rel="noreferrer">Original listing <ExternalLink/></a></div></div><aside className="booking-card"><p>PUBLISHED FROM</p><strong>{money(item.price)}</strong><span>guide price · final quote on request</span><div className="booking-line"><CalendarDays/><p><b>Dates on request</b><small>Any month · live confirmation</small></p></div><button onClick={() => onEnquire(`I am interested in the official tour “${item.name}”.`)}>Get complete live quote</button><a href={CONTACT.phoneHref}><Phone/>Call {CONTACT.phone}</a></aside></section></main>;
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [modal, setModal] = useState(false);
  const [prefill, setPrefill] = useState('');
  const [requestedCategory, setRequestedCategory] = useState('');
  const [requestedDestination, setRequestedDestination] = useState('');
  useEffect(() => { const sync = () => { const id = location.hash.match(/^#tour\/(.+)$/)?.[1]; const officialId = location.hash.match(/^#official\/(.+)$/)?.[1]; setSelected(currentListings.find((tour) => tour.id === id) || null); setSelectedOfficial(officialListings.find((tour) => tour.id === officialId) || null); if (id || officialId) scrollTo({ top: 0 }); }; sync(); addEventListener('hashchange', sync); return () => removeEventListener('hashchange', sync); }, []);
  const open = (item) => { location.hash = `${item.type === 'official' ? 'official' : 'tour'}/${item.id}`; };
  const back = () => { location.hash = 'packages'; setSelected(null); setSelectedOfficial(null); setTimeout(() => document.getElementById('packages')?.scrollIntoView(), 30); };
  const enquire = (message = '') => { setPrefill(message); setModal(true); };
  const chooseCategory = (name) => { setRequestedCategory(name); location.hash = 'packages'; setTimeout(() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }), 30); };
  const chooseDestination = (name) => { setRequestedDestination(name); location.hash = 'packages'; setTimeout(() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' }), 30); };
  if (selected) return <><Header onEnquire={() => enquire()}/><CurrentDetail item={selected} onBack={back} onEnquire={enquire}/><Footer/><EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill}/></>;
  if (selectedOfficial) return <><Header onEnquire={() => enquire()}/><OfficialDetail item={selectedOfficial} onBack={back} onEnquire={enquire}/><Footer/><EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill}/></>;
  return <><Header onEnquire={() => enquire()}/><main><Hero onExplore={() => document.getElementById('popular')?.scrollIntoView({ behavior: 'smooth' })}/><TrustStrip/><QuickLinks onDestination={chooseDestination}/><Popular onOpen={open}/><Collections onCategory={chooseCategory}/><AllPackages onOpen={open} requestedCategory={requestedCategory} clearRequestedCategory={() => setRequestedCategory('')} requestedDestination={requestedDestination} clearRequestedDestination={() => setRequestedDestination('')}/><WhyUs/><Gallery/><Contact/></main><Footer/><div className="floating"><button onClick={() => enquire()}><Phone/><span>Request a call back</span></button><a href="https://wa.me/917976064160" target="_blank" rel="noreferrer" aria-label="WhatsApp Vijay India Tours"><MessageCircle/></a></div><EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill}/></>;
}
