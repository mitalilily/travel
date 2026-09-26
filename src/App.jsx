import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bike, CalendarDays, Check, ChevronDown, ChevronRight,
  Camera, CircleDollarSign, Clock3, Compass, Headphones, Heart, Hotel,
  Mail, MapPin, Menu, MessageCircle, Phone, Plane, Play, ShieldCheck, Star,
  TentTree, Users, X,
} from 'lucide-react';
import heroCommunity from './assets/hero-community.png';
import heroLake from './assets/hero-lake.png';
import destinationsStrip from './assets/destinations-strip.png';

const destinations = [
  { name: 'Leh Ladakh', price: '₹18,900', pos: '0%' },
  { name: 'Meghalaya', price: '₹24,500', pos: '33.33%' },
  { name: 'Bali', price: '₹51,999', pos: '66.66%' },
  { name: 'Europe', price: '₹94,990', pos: '100%' },
];

const international = ['Europe', 'Vietnam', 'Bali', 'Thailand', 'Japan', 'Georgia', 'Sri Lanka', 'Bhutan'];
const india = ['Leh Ladakh', 'Spiti Valley', 'Meghalaya', 'Zanskar', 'Arunachal Pradesh', 'Kashmir'];

const trips = [
  { id: 'meghalaya-trails', title: 'Meghalaya Trails & Root Bridges', place: 'Meghalaya', duration: '6N / 7D', route: 'Guwahati – Guwahati', old: '₹34,999', price: '₹28,999', date: '12 Oct', pos: '33.33%', tag: 'COMMUNITY FAVOURITE', months: ['OCT 26', 'NOV 26'] },
  { id: 'ladakh-high-road', title: 'The Great Ladakh High Road', place: 'Ladakh', duration: '6N / 7D', route: 'Leh – Leh', old: '₹38,999', price: '₹31,499', date: '18 Oct', pos: '0%', tag: 'BEST SELLER', months: ['OCT 26', 'MAY 27'] },
  { id: 'bali-island-loop', title: 'Bali Islands, Surf & Sunsets', place: 'Bali', duration: '7N / 8D', route: 'Denpasar – Denpasar', old: '₹62,999', price: '₹54,999', date: '24 Oct', pos: '66.66%', tag: 'LIMITED SEATS', months: ['OCT 26', 'DEC 26', 'JAN 27'] },
  { id: 'alpine-europe', title: 'Alpine Europe: Lakes to Peaks', place: 'Europe', duration: '8N / 9D', route: 'Paris – Zurich', old: '₹1,49,999', price: '₹1,34,990', date: '3 Nov', pos: '100%', tag: 'ALL AGE', months: ['NOV 26', 'APR 27'] },
  { id: 'spiti-stargaze', title: 'Spiti Stargazing Expedition', place: 'Spiti', duration: '7N / 8D', route: 'Delhi – Delhi', old: '₹29,999', price: '₹25,499', date: '14 Nov', pos: '0%', tag: 'NEW', months: ['NOV 26', 'MAR 27'] },
  { id: 'winter-bali', title: 'Bali New Year Escape', place: 'Bali', duration: '6N / 7D', route: 'Denpasar – Denpasar', old: '₹69,999', price: '₹59,999', date: '26 Dec', pos: '66.66%', tag: 'FESTIVE SPECIAL', months: ['DEC 26'] },
];

const months = ['OCT 26', 'NOV 26', 'DEC 26', 'JAN 27', 'FEB 27', 'MAR 27', 'APR 27', 'MAY 27'];

function Logo({ light = false }) {
  return <a href="#home" className={`logo ${light ? 'logo-light' : ''}`} aria-label="Roamora home">
    <span className="logo-mark"><i /><i /><i /></span>
    <span>ROAMORA<small>TRAVEL TOGETHER</small></span>
  </a>;
}

function Header({ onEnquire }) {
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState('');
  const dropdown = drop === 'international' ? international : india;

  return <header className="site-header">
    <div className="topbar shell">
      <Logo />
      <nav className="desktop-top" aria-label="Primary">
        <a href="#trips">Upcoming Trips <CalendarDays size={15} /></a>
        <a href="#contact">Corporate Tours</a><a href="#stories">Stories</a><a href="#why">About Us</a>
        <button className="phone-pill"><Phone size={16} /> +91 80101 77444</button>
      </nav>
      <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button>
    </div>
    <div className={`navband ${menu ? 'open' : ''}`}>
      <nav className="shell mainnav" aria-label="Trip categories">
        <div className="navdrop" onMouseEnter={() => setDrop('international')} onMouseLeave={() => setDrop('')}>
          <button>International Trips <ChevronDown size={15} /></button>
          {drop === 'international' && <Dropdown items={dropdown} />}
        </div>
        <div className="navdrop" onMouseEnter={() => setDrop('india')} onMouseLeave={() => setDrop('')}>
          <button>India Trips <ChevronDown size={15} /></button>
          {drop === 'india' && <Dropdown items={dropdown} />}
        </div>
        <a href="#trips">Group Tours</a><a href="#trips">Events & Festivals</a>
        <a href="#india">Weekend Getaways</a><a href="#international">Honeymoon Trips</a>
        <button className="mobile-enquire" onClick={onEnquire}>Plan my trip</button>
      </nav>
    </div>
  </header>;
}

function Dropdown({ items }) {
  return <div className="dropdown">{items.map((item, i) => <a key={item} href={`#destination/${item.toLowerCase().replaceAll(' ', '-')}`}><span>{item}</span><ChevronRight size={15}/>{i === 0 && <b>POPULAR</b>}</a>)}</div>;
}

function Hero({ onEnquire }) {
  return <section className="hero" id="home">
    <div className="hero-frame frame-one" style={{ backgroundImage: `url(${heroCommunity})` }} />
    <div className="hero-frame frame-two" style={{ backgroundImage: `url(${heroLake})` }} />
    <div className="hero-shade" />
    <div className="hero-copy">
      <p className="eyebrow">CURATED GROUP ADVENTURES</p>
      <h1>Global Community<br/>of Travelers</h1>
      <p>Explore farther. Laugh louder. Come home with stories.</p>
      <button className="hero-cta" onClick={onEnquire}>Explore trips <ArrowRight size={18}/></button>
    </div>
    <div className="play-chip"><Play size={14} fill="currentColor" /> ORIGINAL TRAVEL FILM</div>
  </section>;
}

function ReviewStrip() {
  return <div className="review-strip"><div className="shell reviews">
    <ReviewBadge brand="G" color="#4285f4" rating="4.9" count="12,800 reviews" />
    <ReviewBadge brand="◉" color="#28a879" rating="5.0" count="3,916 reviews" />
    <ReviewBadge brand="f" color="#1877f2" rating="4.9" count="980 reviews" />
  </div></div>;
}
function ReviewBadge({ brand, color, rating, count }) {
  return <div className="review"><span className="review-logo" style={{ color }}>{brand}</span><div><b><Star size={13} fill="#ffc107" strokeWidth={0}/> {rating}</b><small>({count})</small></div></div>;
}

function QuickLinks() {
  const links = ['Europe', 'Vietnam', 'Bali', 'Thailand', 'Japan', 'Sri Lanka', 'Singapore', 'Ladakh', 'Spiti', 'Bhutan', 'Meghalaya', 'Zanskar'];
  return <section className="quick shell"><h2>Destinations</h2><div>{links.map((x, i) => <a key={x} href={`#destination/${x.toLowerCase()}`} className={i < 4 ? 'hot' : ''}>{x}</a>)}</div></section>;
}

function TripCard({ trip, onOpen }) {
  return <article className="trip-card" onClick={() => onOpen(trip)} tabIndex="0" onKeyDown={e => e.key === 'Enter' && onOpen(trip)}>
    <div className="trip-img photo-sprite" style={{ '--pos': trip.pos }}><span>{trip.tag}</span><button aria-label="Save trip"><Heart size={18}/></button></div>
    <div className="trip-body"><p className="place"><MapPin size={13}/>{trip.place}</p><h3>{trip.title}</h3>
      <div className="trip-meta"><span><Clock3 size={14}/>{trip.duration}</span><span><MapPin size={14}/>{trip.route}</span></div>
      <div className="trip-bottom"><div><del>{trip.old}</del><strong>{trip.price}</strong><small>per person</small></div><time><CalendarDays size={14}/>{trip.date}</time></div>
    </div>
  </article>;
}

function UpcomingTrips({ onOpen }) {
  const [month, setMonth] = useState('OCT 26');
  const visible = useMemo(() => trips.filter(t => t.months.includes(month)), [month]);
  return <section className="section shell" id="trips">
    <div className="section-head"><div><p className="kicker">PACK YOUR BAGS</p><h2>Upcoming Community Trips</h2></div><a href="#all-trips">View all <ArrowRight size={16}/></a></div>
    <div className="month-tabs">{months.map(m => <button className={month === m ? 'active' : ''} onClick={() => setMonth(m)} key={m}>{m.replace(' ', " '")}</button>)}</div>
    <div className="trip-grid">{visible.length ? visible.map(t => <TripCard trip={t} key={t.id} onOpen={onOpen}/>) : <div className="empty-trip"><CalendarDays/><h3>Trips for {month} are coming soon</h3><p>Leave your details and we’ll notify you first.</p></div>}</div>
  </section>;
}

function DestinationSection({ type, title, subtitle, items, reverse = false }) {
  return <section className={`destination-section ${reverse ? 'soft' : ''}`} id={type}>
    <div className="shell"><div className="section-head"><div><p className="kicker">{type.toUpperCase()}</p><h2>{title}</h2><p className="subtitle">{subtitle}</p></div><a href="#all-trips">Explore <ArrowRight size={16}/></a></div>
      <div className="destination-grid">{items.map((d, i) => <a href={`#destination/${d.name.toLowerCase().replaceAll(' ', '-')}`} className="destination-card" key={`${type}-${d.name}-${i}`}><div className="destination-image photo-sprite" style={{ '--pos': d.pos }} /><div><h3>{d.name}</h3><p>Starting from</p><strong>{d.price}</strong><span><ArrowRight size={17}/></span></div></a>)}</div>
    </div>
  </section>;
}

const benefits = [
  [Compass, 'Expertly Crafted Itineraries', 'Iconic sights and local discoveries, balanced around your pace and budget.'],
  [Users, 'Passionate Trip Captains', 'Friendly leaders who keep every journey smooth, social and memorable.'],
  [Headphones, 'End-to-End Support', 'Planning, stays and on-ground help from the first hello to homecoming.'],
  [Star, 'Loved by Travelers', 'Thousands of verified guests return for another journey with our community.'],
  [CircleDollarSign, 'Clear, Honest Pricing', 'What is included and what is not — explained before you reserve.'],
  [Hotel, 'Thoughtful Stays & Travel', 'Comfortable stays, trusted transport and locally loved meals.'],
];

function WhyUs() {
  return <section className="why" id="why"><div className="shell"><div className="center-head"><p className="kicker">WHY ROAMORA?</p><h2>Travel more. Worry less.</h2><p>We sweat the tiny details, so you can live the big moments.</p></div>
    <div className="benefits">{benefits.map(([Icon, title, text]) => <article key={title}><div className="benefit-icon"><Icon/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
  </div></section>;
}

function Moments() {
  const labels = ['High Roads', 'Wild Greens', 'Island Sun', 'Alpine Blue', 'New Friends', 'Open Skies'];
  return <section className="moments" id="stories"><div className="shell"><div className="center-head"><p className="kicker">JOURNEY IN FRAMES</p><h2>Picture-perfect moments</h2></div>
    <div className="moment-grid">{labels.map((label, i) => <div className={`moment m${i}`} key={label}><div className="photo-sprite" style={{ '--pos': `${[0,33.33,66.66,100,33.33,0][i]}%` }}/><span><Camera size={16}/>{label}</span></div>)}</div>
  </div></section>;
}

function AdventureBanner({ onEnquire }) {
  return <section className="adventure" style={{ backgroundImage: `linear-gradient(90deg,rgba(1,35,49,.88),rgba(1,35,49,.15)),url(${heroLake})` }}><div className="shell"><p>Dreaming of your next adventure?</p><h2>Make it a story worth telling.</h2><button onClick={onEnquire}>Connect now <ArrowRight size={17}/></button></div></section>;
}

function ContactForm() {
  const [done, setDone] = useState(false);
  if (done) return <div className="form-success"><Check/><h3>You’re on the list!</h3><p>Our trip expert will get back to you shortly.</p><button onClick={() => setDone(false)}>Plan another trip</button></div>;
  return <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
    <label>Name *<input required placeholder="e.g. Arjun Mehta" /></label>
    <div className="form-row"><label>Phone number *<input required type="tel" pattern="[0-9]{10}" placeholder="10-digit mobile number" /></label><label>Destination<select defaultValue=""><option value="" disabled>Select a destination</option>{[...india, ...international].map(x => <option key={x}>{x}</option>)}</select></label></div>
    <label>Email<input type="email" placeholder="you@example.com" /></label><button className="submit">Submit enquiry <ArrowRight size={17}/></button>
  </form>;
}

function Contact() {
  return <section className="contact" id="contact"><div className="shell contact-grid"><div className="contact-art" style={{ backgroundImage: `url(${heroCommunity})` }}><div><p>YOUR NEXT STORY STARTS HERE</p><h2>Ready when you are.</h2><span><ShieldCheck/>No spam. Just thoughtful trip planning.</span></div></div><div className="contact-form"><p className="kicker">GET IN TOUCH</p><h2>Allow us to call you back</h2><ContactForm/></div></div></section>;
}

function Footer() {
  return <footer><div className="shell footer-grid"><div className="footer-brand"><Logo light/><p>Meaningful journeys, unforgettable people and stories that stay long after the road ends.</p><div className="socials"><a href="#photos" aria-label="Photos"><Camera/></a><a href="#community" aria-label="Community"><Users/></a><a href="#messages" aria-label="Messages"><MessageCircle/></a></div></div>
    <FooterCol title="International Trips" links={international.slice(0,6)} /><FooterCol title="India Trips" links={india.slice(0,5)} /><FooterCol title="Quick Links" links={['About Us','Community Trips','Corporate Tours','Travel Stories','Privacy Policy']} />
    <div className="footer-contact"><h3>Talk to us</h3><a href="tel:+918010177444"><Phone/>+91 80101 77444</a><a href="mailto:hello@roamora.example"><Mail/>hello@roamora.example</a><span><MapPin/>Gurugram, Haryana, India</span></div></div><div className="copyright shell">© 2026 Roamora Travel. All rights reserved. <span>Original demonstration experience.</span></div></footer>;
}
function FooterCol({ title, links }) { return <div><h3>{title}</h3>{links.map(x => <a key={x} href={`#destination/${x.toLowerCase().replaceAll(' ','-')}`}>{x}</a>)}</div>; }

function EnquiryModal({ open, onClose }) {
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  if (!open) return null;
  return <div className="modal" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="modal-card"><button className="modal-close" onClick={onClose}><X/></button><p className="kicker">LET'S GO SOMEWHERE</p><h2>Tell us your travel dream</h2><p>Share a few details and our travel expert will shape the right journey for you.</p><ContactForm/></div></div>;
}

function DetailPage({ trip, onBack, onEnquire }) {
  return <main className="detail-page"><section className="detail-hero photo-sprite" style={{ '--pos': trip.pos }}><button onClick={onBack}><ArrowLeft/> Back to trips</button><div><span>{trip.tag}</span><h1>{trip.title}</h1><p><MapPin/> {trip.route} · {trip.duration}</p></div></section><section className="detail-content shell"><div><p className="kicker">THE EXPERIENCE</p><h2>A journey designed around real moments</h2><p>Wake up to spectacular landscapes, share the road with an easy-going community, and discover the small local places most itineraries miss.</p><div className="detail-features"><span><TentTree/>Curated adventures</span><span><Hotel/>Comfortable stays</span><span><Users/>Expert trip captain</span><span><Bike/>Local experiences</span></div><h3>Trip highlights</h3><ul><li>Small-group experience with a dedicated trip captain</li><li>Scenic stays and handpicked local meals</li><li>Balanced itinerary with adventure and free time</li><li>24×7 on-trip support</li></ul></div><aside><p>Starting from</p><del>{trip.old}</del><strong>{trip.price}</strong><small>per person</small><button onClick={onEnquire}>Reserve your spot</button><span><ShieldCheck/> No payment required to enquire</span></aside></section></main>;
}

function DestinationPage({ destination, onBack, onEnquire }) {
  const related = trips.filter(t => t.place.toLowerCase().includes(destination.name.split(' ')[0].toLowerCase()));
  return <main className="detail-page"><section className="detail-hero photo-sprite" style={{ '--pos': destination.pos }}><button onClick={onBack}><ArrowLeft/> Back home</button><div><span>EXPLORE MORE</span><h1>{destination.name}</h1><p><MapPin/> Curated journeys · Flexible dates</p></div></section><section className="detail-content shell"><div><p className="kicker">DISCOVER {destination.name.toUpperCase()}</p><h2>Your next unforgettable chapter</h2><p>Thoughtfully planned days, remarkable landscapes and authentic local moments come together in a trip that feels effortless from start to finish.</p><div className="detail-features"><span><Compass/>Curated itinerary</span><span><Hotel/>Handpicked stays</span><span><Users/>Local trip experts</span><span><Plane/>Travel support</span></div>{related.length > 0 && <><h3>Featured journey</h3><p>{related[0].title} · {related[0].duration} · from {related[0].price}</p></>}</div><aside><p>Packages starting from</p><strong>{destination.price}</strong><small>per person</small><button onClick={onEnquire}>Plan this journey</button><span><ShieldCheck/> Personalised assistance included</span></aside></section></main>;
}

export default function App() {
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  useEffect(() => {
    const sync = () => {
      const tripId = location.hash.match(/^#trip\/(.+)$/)?.[1];
      const destinationId = location.hash.match(/^#destination\/(.+)$/)?.[1];
      setSelected(trips.find(t => t.id === tripId) || null);
      if (destinationId) {
        const name = decodeURIComponent(destinationId).replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
        const known = destinations.find(d => d.name.toLowerCase() === name.toLowerCase());
        setSelectedDestination(known || { name, price: '₹24,999', pos: ['bali','thailand','singapore'].some(x => name.toLowerCase().includes(x)) ? '66.66%' : name.toLowerCase().includes('europe') ? '100%' : name.toLowerCase().includes('meghalaya') || name.toLowerCase().includes('vietnam') ? '33.33%' : '0%' });
      } else setSelectedDestination(null);
    };
    sync(); addEventListener('hashchange', sync); return () => removeEventListener('hashchange', sync);
  }, []);
  const openTrip = trip => { location.hash = `trip/${trip.id}`; setSelected(trip); scrollTo({ top: 0 }); };
  const back = () => { location.hash = 'trips'; setSelected(null); setTimeout(() => document.getElementById('trips')?.scrollIntoView(), 20); };
  if (selected) return <><Header onEnquire={() => setModal(true)}/><DetailPage trip={selected} onBack={back} onEnquire={() => setModal(true)}/><Footer/><EnquiryModal open={modal} onClose={() => setModal(false)}/></>;
  if (selectedDestination) return <><Header onEnquire={() => setModal(true)}/><DestinationPage destination={selectedDestination} onBack={() => { location.hash='home'; setSelectedDestination(null); scrollTo({top:0}); }} onEnquire={() => setModal(true)}/><Footer/><EnquiryModal open={modal} onClose={() => setModal(false)}/></>;
  return <><Header onEnquire={() => setModal(true)}/><main><Hero onEnquire={() => document.getElementById('trips')?.scrollIntoView({ behavior:'smooth' })}/><ReviewStrip/><QuickLinks/><UpcomingTrips onOpen={openTrip}/><DestinationSection type="india" title="India Trips" subtitle="A journey through time, colour and culture" items={destinations.slice(0,2).concat([{ name: 'Spiti Valley', price:'₹19,999', pos:'0%' }, { name:'Zanskar',price:'₹12,499',pos:'100%' }])}/><DestinationSection type="international" title="International Trips" subtitle="Discover the world, one destination at a time" items={destinations.slice(2).concat([{ name:'Vietnam',price:'₹38,999',pos:'33.33%' },{ name:'Thailand',price:'₹44,999',pos:'66.66%' }])} reverse/><AdventureBanner onEnquire={() => setModal(true)}/><WhyUs/><Moments/><Contact/></main><Footer/><div className="floating"><button onClick={() => setModal(true)}><Phone/> <span>Request a call back</span></button><a href="#contact"><MessageCircle/></a></div><EnquiryModal open={modal} onClose={() => setModal(false)}/></>;
}
