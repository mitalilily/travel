import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, ChevronRight,
  CircleCheck, Clock3, Compass, Crown, ExternalLink, Globe2, HeartHandshake,
  Languages, Mail, Map as MapIcon, MapPin, Menu, MessageCircle, Phone, Search,
  ShieldCheck, Sparkles, Star, Users, X,
} from 'lucide-react';
import tours from './data/tourradar.json';
import officialTours from './data/official-tours.json';
import audit from './data/catalog-audit.json';
import logo from './assets/vijay-logo.png';
import hero from './assets/vijay-hero.png';
import wildlife from './assets/vijay-wildlife.png';
import beyond from './assets/vijay-beyond.png';

const contact = {
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
  ['Himalayas', /ladakh|leh|rishikesh|himalaya|uttarakhand|shimla|manali|adventure/i],
  ['Spiritual India', /spiritual|varanasi|temple|yoga|pilgrim|khajuraho/i],
  ['Wildlife & Safari', /tiger|ranthambore|safari|wildlife|national park/i],
  ['Golden Triangle', /golden triangle|taj ?mahal|delhi.*agra.*jaipur/i],
  ['Rajasthan', /rajasthan|jaipur|jodhpur|jaisalmer|bikaner|shekhawati|thar|pushkar/i],
  ['Coasts & Luxury', /goa|beach|luxury|mumbai/i],
];

function categoryFor(tour) {
  const titleMatch = categoryRules.find(([, rule]) => rule.test(tour.name || ''));
  if (titleMatch) return titleMatch[0];
  const haystack = [tour.name, tour.description, ...(tour.destinations || []), ...(tour.styles || [])].join(' ');
  return categoryRules.find(([, rule]) => rule.test(haystack))?.[0] || 'Cultural India';
}

function imageFor(tour) {
  const category = categoryFor(tour);
  if (category === 'Wildlife & Safari') return wildlife;
  if (['Himalayas', 'South India', 'Spiritual India', 'Coasts & Luxury'].includes(category)) return beyond;
  return hero;
}

function formatPrice(value) {
  return value ? `US $${Number(value).toLocaleString('en-US')}` : 'Price on request';
}

function Brand() {
  return <a className="brand" href="#home" aria-label="Vijay India Tours home"><img src={logo} alt="Vijay India Tours" /></a>;
}

function Header({ onEnquire }) {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="top-note"><div className="shell"><span>Private journeys, thoughtfully hosted from Jaipur</span><span><Star size={13} fill="currentColor" /> 30+ years of India travel expertise</span></div></div>
    <div className="nav-wrap shell"><Brand />
      <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">
        <a href="#journeys" onClick={() => setOpen(false)}>All tours</a><a href="#collections" onClick={() => setOpen(false)}>Collections</a><a href="#story" onClick={() => setOpen(false)}>Our story</a><a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        <button onClick={onEnquire}>Design my journey <ArrowRight size={16} /></button>
      </nav>
      <a className="header-phone" href={contact.phoneHref}><Phone size={16} /><span>{contact.phone}</span></a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    </div>
  </header>;
}

function Hero({ onExplore, onEnquire }) {
  return <section className="hero" id="home">
    <div className="hero-slide hero-a" style={{ backgroundImage: `url(${hero})` }} /><div className="hero-slide hero-b" style={{ backgroundImage: `url(${wildlife})` }} /><div className="hero-slide hero-c" style={{ backgroundImage: `url(${beyond})` }} /><div className="hero-overlay" />
    <div className="shell hero-content"><p className="eyebrow light">INDIA, PERSONALLY YOURS</p><h1>Journeys with a<br/><em>Jaipur heartbeat.</em></h1><p className="hero-lead">Private India tours shaped by three decades of local knowledge—from the Taj and tiger country to desert forts, sacred rivers and the Himalayas.</p>
      <div className="hero-actions"><button className="button gold" onClick={onExplore}>Explore 69 journeys <ArrowRight size={18} /></button><button className="text-button" onClick={onEnquire}>Create a custom tour <ChevronRight size={18} /></button></div>
      <div className="hero-trust"><span><ShieldCheck /> Private & personalised</span><span><Languages /> English & German</span><span><MapPin /> Jaipur based</span></div>
    </div><div className="hero-reel"><span>01</span><i /><span>03</span><small>ORIGINAL INDIA FILM</small></div>
  </section>;
}

function ResearchBand() {
  const days = tours.reduce((sum, tour) => sum + tour.days.length, 0);
  return <section className="research-band"><div className="shell research-grid"><div><strong>{audit.sourceListingsRead}</strong><span>source listings reviewed</span></div><div><strong>{audit.tourRadarListings}</strong><span>current adventures mapped</span></div><div><strong>{days}</strong><span>published itinerary days organised</span></div><div><strong>30+</strong><span>years of local expertise</span></div></div></section>;
}

function SectionTitle({ eyebrow, title, copy }) {
  return <div className="section-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="section-copy">{copy}</p>}</div></div>;
}

function CategoryRail({ selected, onSelect }) {
  const categories = useMemo(() => {
    const counts = tours.reduce((map, tour) => map.set(categoryFor(tour), (map.get(categoryFor(tour)) || 0) + 1), new Map());
    return ['All journeys', ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)];
  }, []);
  return <div className="category-rail" role="tablist" aria-label="Tour categories">{categories.map((category) => <button key={category} className={selected === category ? 'active' : ''} onClick={() => onSelect(category)}>{category}</button>)}</div>;
}

function TourCard({ tour, onOpen }) {
  return <article className="tour-card"><button className="tour-image" onClick={() => onOpen(tour)} style={{ backgroundImage: `url(${imageFor(tour)})` }} aria-label={`Open ${tour.name}`}><span>{categoryFor(tour)}</span><i>{tour.duration} DAYS</i></button>
    <div className="tour-body"><p className="tour-route"><MapPin size={14} /> {tour.origin} <ArrowRight size={12} /> {tour.end}</p><h3><button onClick={() => onOpen(tour)}>{tour.name}</button></h3><div className="tour-facts"><span><Compass size={14} />{tour.destinations.length} stops</span><span><Users size={14} />{tour.audience}</span></div><div className="tour-foot"><div><small>From</small><strong>{formatPrice(tour.price)}</strong><small>per person</small></div><button onClick={() => onOpen(tour)}>View itinerary <ArrowRight size={15} /></button></div></div>
  </article>;
}

function Catalogue({ onOpen }) {
  const [category, setCategory] = useState('All journeys');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [limit, setLimit] = useState(12);
  const filtered = useMemo(() => {
    let result = tours.filter((tour) => {
      const categoryMatch = category === 'All journeys' || categoryFor(tour) === category;
      const text = [tour.name, tour.origin, tour.end, ...(tour.destinations || []), ...(tour.styles || [])].join(' ').toLowerCase();
      return categoryMatch && text.includes(query.trim().toLowerCase());
    });
    if (sort === 'short') result = [...result].sort((a, b) => a.duration - b.duration);
    if (sort === 'long') result = [...result].sort((a, b) => b.duration - a.duration);
    if (sort === 'price') result = [...result].sort((a, b) => a.price - b.price);
    return result;
  }, [category, query, sort]);
  useEffect(() => setLimit(12), [category, query, sort]);
  return <section className="catalogue shell" id="journeys"><SectionTitle eyebrow="THE COMPLETE COLLECTION" title="Find your India" copy="Every current Vijay India Tours listing, organised for effortless comparison. Open any journey for its full day-by-day plan and published inclusions." />
    <div className="catalogue-tools"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Jaipur, tiger, Diwali, Kerala…" /><span>{filtered.length} tours</span></label><label className="sort-box">Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="short">Shortest first</option><option value="long">Longest first</option><option value="price">Lowest price</option></select><ChevronDown size={15} /></label></div>
    <CategoryRail selected={category} onSelect={setCategory} />
    {filtered.length ? <><div className="tour-grid">{filtered.slice(0, limit).map((tour) => <TourCard key={tour.id} tour={tour} onOpen={onOpen} />)}</div>{limit < filtered.length && <button className="load-more" onClick={() => setLimit(filtered.length)}>Show all {filtered.length} journeys <ChevronDown size={17} /></button>}</> : <div className="empty-state"><Search /><h3>No exact match yet</h3><p>Try a city, region, experience or a broader collection.</p><button onClick={() => { setQuery(''); setCategory('All journeys'); }}>Reset filters</button></div>}
  </section>;
}

function Collections({ onEnquire }) {
  const cards = [{ title: 'Royal Rajasthan', copy: 'Rose-coloured cities, desert camps, merchant havelis and living palace traditions.', image: hero },{ title: 'Taj & Tiger Country', copy: 'Mughal landmarks paired with the forests and safari drives of Ranthambore.', image: wildlife },{ title: 'India Beyond', copy: 'Backwaters, Himalayan valleys, sacred ghats and slower regional discoveries.', image: beyond }];
  return <section className="collections" id="collections"><div className="shell"><SectionTitle eyebrow="SIGNATURE WORLDS" title="One India. Many stories." copy="Begin with the feeling you want, then let Vijay’s local team shape the route around you." /><div className="collection-grid">{cards.map((card, index) => <article className="collection-card" key={card.title} style={{ backgroundImage: `url(${card.image})` }}><div><span>0{index + 1}</span><h3>{card.title}</h3><p>{card.copy}</p><a href="#journeys">Explore collection <ArrowRight size={16} /></a></div></article>)}</div><div className="tailor-banner"><div><Sparkles /><p>Have a different India in mind?</p><h3>Every route can begin as a conversation.</h3></div><button className="button gold" onClick={onEnquire}>Tailor my tour <ArrowRight size={17} /></button></div></div></section>;
}

function SignatureArchive({ onOpen }) {
  return <section className="signature shell"><SectionTitle eyebrow="FROM THE VIJAY ARCHIVE" title="14 signature tour ideas" copy="The original Vijay India Tours collection—ideal as a starting point for a custom itinerary." /><div className="signature-grid">{officialTours.map((tour, index) => <article key={tour.id}><span>{String(index + 1).padStart(2, '0')}</span><div><p>{tour.dayCount ? `${tour.dayCount} published days` : 'Flexible length'}</p><h3>{tour.name}</h3><small>{tour.plan || 'Custom route across India'}</small></div><button onClick={() => onOpen(tour)} aria-label={`Open ${tour.name}`}><ArrowRight /></button></article>)}</div></section>;
}

const reasons = [[Crown, 'A Jaipur family welcome', 'A locally rooted team led by Mr. Singh, with the destination knowledge that comes from more than three decades in travel.'],[Compass, 'Your route, not a template', 'Private and personalised journeys can flex around your pace, interests, ages and preferred comfort level.'],[HeartHandshake, 'Hosted from hello to home', 'Local planning and on-ground coordination connect the details across cities, guides, transport and experiences.'],[Globe2, 'India in full colour', 'Golden Triangle icons meet Rajasthan, wildlife, festivals, cuisine, spiritual centres, coasts and mountain adventures.']];

function Story() {
  return <section className="story" id="story"><div className="shell story-grid"><div className="story-photo" style={{ backgroundImage: `url(${hero})` }}><div><strong>30+</strong><span>years crafting<br/>India journeys</span></div></div><div className="story-copy"><p className="eyebrow light">WHY VIJAY INDIA TOURS</p><h2>Local knowledge.<br/><em>Genuine connection.</em></h2><p>India is not one story. Vijay India Tours brings together the celebrated landmarks and the everyday moments between them—shared meals, market lanes, village roads and the local context that makes a place memorable.</p><div className="reason-list">{reasons.map(([Icon, title, copy]) => <article key={title}><Icon /><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></div></section>;
}

function ContactForm({ prefill = '' }) {
  const [sent, setSent] = useState(false);
  if (sent) return <div className="success"><Check /><h3>Your enquiry is ready.</h3><p>WhatsApp has opened with your details. Tap send there to deliver it directly to Vijay India Tours.</p><button onClick={() => setSent(false)}>Prepare another enquiry</button></div>;
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [`Hello Vijay India Tours, I would like a personal travel plan.`, `Name: ${data.get('name')}`, `Phone: ${data.get('phone')}`, `Email: ${data.get('email')}`, `Travel month: ${data.get('month') || 'Flexible'}`, `Idea: ${data.get('message') || 'Please help me choose.'}`].join('\n');
    window.open(`https://wa.me/917976064160?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <form onSubmit={submit}><div className="form-row"><label>Your name<input required name="name" placeholder="Full name" /></label><label>Phone / WhatsApp<input required name="phone" placeholder="+91" /></label></div><div className="form-row"><label>Email<input required type="email" name="email" placeholder="you@example.com" /></label><label>Travel month<input type="month" name="month" /></label></div><label>Journey idea<textarea name="message" defaultValue={prefill} placeholder="Where would you like to go, for how long, and with whom?" /></label><button className="button dark" type="submit">Continue on WhatsApp <ArrowRight size={17} /></button><small><ShieldCheck size={13} /> Your message is sent only after you confirm it in WhatsApp.</small></form>;
}

function Contact() {
  return <section className="contact" id="contact"><div className="shell contact-panel"><div><p className="eyebrow light">PLAN WITH A LOCAL EXPERT</p><h2>Tell us the India<br/>you imagine.</h2><p>Share a rough idea. Vijay’s Jaipur team will help turn it into a practical, personal route.</p><ul><li><Phone /> <a href={contact.phoneHref}>{contact.phone}</a></li><li><Mail /> <a href={`mailto:${contact.email}`}>{contact.email}</a></li><li><MapPin /> {contact.address}</li></ul></div><div className="contact-card"><ContactForm /></div></div></section>;
}

function Footer() {
  return <footer><div className="shell footer-grid"><div><Brand /><p>Private India journeys with local heart, thoughtful planning and a Jaipur welcome.</p></div><div><h3>Explore</h3><a href="#journeys">All tours</a><a href="#collections">Collections</a><a href="#story">Why Vijay</a></div><div><h3>Popular</h3><a href="#journeys">Golden Triangle</a><a href="#journeys">Rajasthan</a><a href="#journeys">Tiger safari</a><a href="#journeys">South India</a></div><div><h3>Talk to us</h3><a href={contact.phoneHref}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><p>{contact.address}</p></div></div><div className="shell footer-bottom"><span>© 2026 Vijay India Tours</span><span>Prices and departures are subject to live confirmation.</span></div></footer>;
}

function EnquiryModal({ open, onClose, prefill }) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  if (!open) return null;
  return <div className="modal" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="modal-card"><button className="modal-close" onClick={onClose}><X /></button><p className="eyebrow">A JOURNEY MADE FOR YOU</p><h2>Start planning with Vijay</h2><p>Tell the Jaipur team what you have in mind. Dates, availability and the final price are confirmed personally.</p><ContactForm prefill={prefill} /></div></div>;
}

function DayRow({ day, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen);
  const details = [['Included activities', day.activities], ['Landmarks', day.landmarks], ['Meals', day.meals], ['Transport', day.transport], ['Optional experiences', day.optional]].filter(([, value]) => value);
  return <article className={open ? 'day-row open' : 'day-row'}><button onClick={() => setOpen(!open)}><span>DAY {String(day.day).padStart(2, '0')}</span><strong>{day.place}</strong><ChevronDown /></button>{open && <div>{details.length ? details.map(([label, value]) => <p key={label}><b>{label}</b><span>{value}</span></p>) : <p><span>Arrival, departure or free time as listed in the published plan.</span></p>}</div>}</article>;
}

function TourDetail({ tour, onBack, onEnquire }) {
  return <main className="detail-page"><section className="detail-hero" style={{ backgroundImage: `url(${imageFor(tour)})` }}><div className="detail-shade" /><div className="shell detail-hero-inner"><button className="back-button" onClick={onBack}><ArrowLeft /> Back to all tours</button><div><p>{categoryFor(tour)}</p><h1>{tour.name}</h1><span><MapPin /> {tour.origin} to {tour.end}</span></div></div></section>
    <section className="detail-summary"><div className="shell"><div><Clock3 /><span><small>DURATION</small><strong>{tour.duration} days</strong></span></div><div><MapIcon /><span><small>ROUTE</small><strong>{tour.destinations.length} published stops</strong></span></div><div><Users /><span><small>TRAVELLERS</small><strong>{tour.audience}</strong></span></div><div><Languages /><span><small>LANGUAGES</small><strong>{tour.languages.join(' & ')}</strong></span></div></div></section>
    <section className="shell detail-layout"><div className="detail-main"><p className="eyebrow">THE PUBLISHED JOURNEY</p><h2>Day by day</h2><p className="detail-intro">{tour.description} The factual itinerary below organises every published day, activity, landmark, meal, transfer and optional experience available for this listing.</p><div className="day-list">{tour.days.map((day, index) => <DayRow key={`${tour.id}-${day.day}`} day={day} initiallyOpen={index === 0} />)}</div><div className="include-grid"><div><h3><CircleCheck /> Included categories</h3>{tour.included.length ? <ul>{tour.included.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Confirm inclusions with the Vijay team.</p>}</div><div className="excluded"><h3><X /> Not included</h3>{tour.excluded.length ? <ul>{tour.excluded.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Confirm exclusions with the Vijay team.</p>}</div></div><div className="source-note"><ShieldCheck /><p><strong>Catalogue accuracy</strong><span>This itinerary reflects the public listing researched on {new Date(audit.researchedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Final hotels, dates, availability and inclusions are reconfirmed before booking.</span></p><a href={tour.sourceUrl} target="_blank" rel="noreferrer">View source <ExternalLink /></a></div></div>
      <aside className="booking-card"><p>PRIVATE TOUR FROM</p><strong>{formatPrice(tour.price)}</strong><span>per person · published guide price</span><hr/><div><CalendarDays /><p><b>Flexible departures</b><small>Choose your preferred dates. The team confirms live availability.</small></p></div><button className="button gold" onClick={() => onEnquire(`I’m interested in “${tour.name}” (${tour.duration} days).`)}>Check dates & availability</button><a href={`https://wa.me/917976064160?text=${encodeURIComponent(`Hello, I am interested in ${tour.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle /> Ask on WhatsApp</a><small><ShieldCheck /> No payment required to enquire</small></aside>
    </section></main>;
}

function OfficialDetail({ tour, onBack, onEnquire }) {
  return <main className="detail-page"><section className="detail-hero official-detail" style={{ backgroundImage: `url(${hero})` }}><div className="detail-shade"/><div className="shell detail-hero-inner"><button className="back-button" onClick={onBack}><ArrowLeft /> Back to signature tours</button><div><p>VIJAY SIGNATURE TOUR</p><h1>{tour.name}</h1><span><MapPin /> {tour.plan || 'Custom India route'}</span></div></div></section><section className="shell official-layout"><div><p className="eyebrow">THE TOUR IDEA</p><h2>A classic route, tailored around you</h2><p>{tour.overview}</p><div className="official-facts"><span><Clock3 /><b>{tour.dayCount || 'Flexible'} days</b></span><span><MapPin /><b>{tour.plan || 'Route on request'}</b></span><span><Star /><b>{tour.highlights || 'Personalised highlights'}</b></span></div><div className="source-note"><ShieldCheck/><p><strong>Built from Vijay’s official collection</strong><span>The final day-by-day itinerary, dates, hotels and inclusions are prepared personally for your enquiry.</span></p><a href={tour.sourceUrl} target="_blank" rel="noreferrer">Official listing <ExternalLink/></a></div></div><aside className="booking-card"><p>PUBLISHED FROM</p><strong>{formatPrice(tour.price)}</strong><span>guide price · confirm live quote</span><button className="button gold" onClick={() => onEnquire(`I’m interested in the signature tour “${tour.name}”.`)}>Build this itinerary</button><a href={contact.phoneHref}><Phone/> Call {contact.phone}</a></aside></section></main>;
}

export default function App() {
  const [selected, setSelected] = useState(null); const [selectedOfficial, setSelectedOfficial] = useState(null); const [modal, setModal] = useState(false); const [prefill, setPrefill] = useState('');
  useEffect(() => { const sync = () => { const id = location.hash.match(/^#tour\/(.+)$/)?.[1]; const officialId = location.hash.match(/^#signature\/(.+)$/)?.[1]; setSelected(tours.find((tour) => tour.id === id) || null); setSelectedOfficial(officialTours.find((tour) => tour.id === officialId) || null); if (id || officialId) scrollTo({ top: 0 }); }; sync(); addEventListener('hashchange', sync); return () => removeEventListener('hashchange', sync); }, []);
  const enquire = (message = '') => { setPrefill(message); setModal(true); }; const back = () => { location.hash = 'journeys'; setSelected(null); setSelectedOfficial(null); setTimeout(() => document.getElementById('journeys')?.scrollIntoView(), 30); };
  if (selected) return <><Header onEnquire={() => enquire()} /><TourDetail tour={selected} onBack={back} onEnquire={enquire} /><Footer /><EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill} /></>;
  if (selectedOfficial) return <><Header onEnquire={() => enquire()} /><OfficialDetail tour={selectedOfficial} onBack={back} onEnquire={enquire} /><Footer /><EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill} /></>;
  return <><Header onEnquire={() => enquire()} /><main><Hero onExplore={() => document.getElementById('journeys')?.scrollIntoView({ behavior: 'smooth' })} onEnquire={() => enquire()} /><ResearchBand /><Catalogue onOpen={(tour) => { location.hash = `tour/${tour.id}`; }} /><Collections onEnquire={() => enquire()} /><SignatureArchive onOpen={(tour) => { location.hash = `signature/${tour.id}`; }} /><Story /><Contact /></main><Footer /><a className="whatsapp" href="https://wa.me/917976064160" target="_blank" rel="noreferrer" aria-label="Chat with Vijay India Tours on WhatsApp"><MessageCircle /><span>Plan on WhatsApp</span></a><EnquiryModal open={modal} onClose={() => setModal(false)} prefill={prefill} /></>;
}
