const mongoose = require('mongoose');
const dns = require('dns').promises;
dns.setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');
const Property = require('../models/Property');
const LocalityData = require('../models/LocalityData');

function generatePriceHistory(basePrice, annualGrowthPct) {
  const history = [];
  const monthlyGrowth = annualGrowthPct / 100 / 12;
  let price = basePrice * (1 - annualGrowthPct / 100 * 2);
  for (let i = 0; i < 24; i++) {
    const month = ((3 + i) % 12) + 1;
    const year = 2024 + Math.floor((3 + i) / 12);
    price = Math.round(price * (1 + monthlyGrowth + (Math.random() - 0.5) * monthlyGrowth * 0.5));
    history.push({ month, year, avgPrice: price });
  }
  return history;
}

const AMENITY_POOL = ['gym', 'pool', 'garden', 'security', 'lift', 'power-backup', 'club-house', 'children-play-area', 'sports-facility', 'water-supply', 'vaastu-compliant'];
const FACINGS = ['north', 'south', 'east', 'west', 'north-east', 'south-east'];

function pick(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const usersData = [
  { name: 'Admin User', email: 'admin@propval.com', password: 'admin123', phone: '9999000001', role: 'admin' },
  { name: 'Rajesh Sharma', email: 'agent1@propval.com', password: 'agent123', phone: '9999000002', role: 'agent' },
  { name: 'Priya Patel', email: 'agent2@propval.com', password: 'agent123', phone: '9999000003', role: 'agent' },
  { name: 'Vikram Singh', email: 'agent3@propval.com', password: 'agent123', phone: '9999000004', role: 'agent' },
  { name: 'Amit Kumar', email: 'buyer1@propval.com', password: 'buyer123', phone: '9999000005', role: 'buyer' },
  { name: 'Sneha Reddy', email: 'buyer2@propval.com', password: 'buyer123', phone: '9999000006', role: 'buyer' },
  { name: 'Rohit Jain', email: 'buyer3@propval.com', password: 'buyer123', phone: '9999000007', role: 'buyer' },
  { name: 'Neha Gupta', email: 'buyer4@propval.com', password: 'buyer123', phone: '9999000008', role: 'buyer' },
  { name: 'Arun Mehta', email: 'buyer5@propval.com', password: 'buyer123', phone: '9999000009', role: 'buyer' },
  { name: 'Suresh Iyer', email: 'seller1@propval.com', password: 'seller123', phone: '9999000010', role: 'seller' },
  { name: 'Kavita Nair', email: 'seller2@propval.com', password: 'seller123', phone: '9999000011', role: 'seller' },
  { name: 'Deepak Verma', email: 'seller3@propval.com', password: 'seller123', phone: '9999000012', role: 'seller' },
];

const citiesConfig = [
  {
    city: 'Mumbai', state: 'Maharashtra',
    localities: [
      { locality: 'Andheri West', avg: 22000, demand: 85, supply: 70, growth: 8, infra: { metro: 0.5, hospital: 1, school: 0.8, mall: 1.5, airport: 8 }, ratings: { connectivity: 5, safety: 4, livability: 4, appreciation: 4 }, nearby: ['Goregaon East', 'Bandra West'] },
      { locality: 'Bandra West', avg: 42000, demand: 90, supply: 45, growth: 6, infra: { metro: 1, hospital: 1.5, school: 1, mall: 2, airport: 12 }, ratings: { connectivity: 5, safety: 5, livability: 5, appreciation: 5 }, nearby: ['Andheri West', 'Worli'] },
      { locality: 'Powai', avg: 20000, demand: 78, supply: 60, growth: 9, infra: { metro: 3, hospital: 2, school: 1, mall: 1, airport: 5 }, ratings: { connectivity: 4, safety: 4, livability: 5, appreciation: 4 }, nearby: ['Andheri West', 'Thane West'] },
      { locality: 'Worli', avg: 38000, demand: 88, supply: 40, growth: 7, infra: { metro: 1, hospital: 2, school: 1.5, mall: 3, airport: 15 }, ratings: { connectivity: 5, safety: 5, livability: 4, appreciation: 5 }, nearby: ['Bandra West', 'Powai'] },
      { locality: 'Goregaon East', avg: 16000, demand: 75, supply: 65, growth: 10, infra: { metro: 0.5, hospital: 2, school: 1, mall: 0.5, airport: 10 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 4 }, nearby: ['Andheri West', 'Thane West'] },
      { locality: 'Thane West', avg: 13000, demand: 72, supply: 68, growth: 11, infra: { metro: 2, hospital: 1.5, school: 0.5, mall: 1, airport: 15 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 4 }, nearby: ['Powai', 'Goregaon East'] },
    ],
  },
  {
    city: 'Delhi NCR', state: 'Delhi',
    localities: [
      { locality: 'Dwarka', avg: 9500, demand: 70, supply: 75, growth: 7, infra: { metro: 0.5, hospital: 2, school: 1, mall: 2, airport: 8 }, ratings: { connectivity: 5, safety: 4, livability: 4, appreciation: 3 }, nearby: ['Vasant Kunj', 'Gurgaon Golf Course Road'] },
      { locality: 'Noida Sector 62', avg: 8500, demand: 72, supply: 70, growth: 9, infra: { metro: 1, hospital: 3, school: 1.5, mall: 2, airport: 25 }, ratings: { connectivity: 4, safety: 3, livability: 4, appreciation: 4 }, nearby: ['Greater Noida', 'Dwarka'] },
      { locality: 'Gurgaon Golf Course Road', avg: 18000, demand: 85, supply: 50, growth: 8, infra: { metro: 2, hospital: 2, school: 1, mall: 1, airport: 15 }, ratings: { connectivity: 4, safety: 4, livability: 5, appreciation: 5 }, nearby: ['Dwarka', 'Vasant Kunj'] },
      { locality: 'Greater Noida', avg: 5500, demand: 60, supply: 80, growth: 12, infra: { metro: 5, hospital: 3, school: 2, mall: 3, airport: 35 }, ratings: { connectivity: 3, safety: 3, livability: 3, appreciation: 4 }, nearby: ['Noida Sector 62', 'Dwarka'] },
      { locality: 'Vasant Kunj', avg: 14000, demand: 78, supply: 55, growth: 6, infra: { metro: 2, hospital: 2, school: 1, mall: 1.5, airport: 10 }, ratings: { connectivity: 4, safety: 4, livability: 5, appreciation: 4 }, nearby: ['Dwarka', 'Gurgaon Golf Course Road'] },
      { locality: 'Rohini', avg: 8000, demand: 68, supply: 72, growth: 7, infra: { metro: 0.5, hospital: 1.5, school: 0.5, mall: 2, airport: 20 }, ratings: { connectivity: 5, safety: 3, livability: 4, appreciation: 3 }, nearby: ['Dwarka', 'Vasant Kunj'] },
    ],
  },
  {
    city: 'Bangalore', state: 'Karnataka',
    localities: [
      { locality: 'Whitefield', avg: 7500, demand: 80, supply: 65, growth: 10, infra: { metro: 2, hospital: 2, school: 1, mall: 1, airport: 30 }, ratings: { connectivity: 3, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Sarjapur Road', 'Electronic City'] },
      { locality: 'Koramangala', avg: 14000, demand: 88, supply: 45, growth: 7, infra: { metro: 3, hospital: 1.5, school: 1, mall: 2, airport: 35 }, ratings: { connectivity: 4, safety: 4, livability: 5, appreciation: 4 }, nearby: ['HSR Layout', 'Indiranagar'] },
      { locality: 'Electronic City', avg: 6000, demand: 75, supply: 70, growth: 11, infra: { metro: 5, hospital: 3, school: 2, mall: 3, airport: 40 }, ratings: { connectivity: 3, safety: 4, livability: 3, appreciation: 4 }, nearby: ['Whitefield', 'Sarjapur Road'] },
      { locality: 'HSR Layout', avg: 10000, demand: 82, supply: 55, growth: 9, infra: { metro: 3, hospital: 2, school: 1, mall: 2, airport: 35 }, ratings: { connectivity: 4, safety: 4, livability: 5, appreciation: 4 }, nearby: ['Koramangala', 'Electronic City'] },
      { locality: 'Indiranagar', avg: 16000, demand: 90, supply: 40, growth: 6, infra: { metro: 0.5, hospital: 2, school: 1, mall: 1, airport: 32 }, ratings: { connectivity: 5, safety: 5, livability: 5, appreciation: 4 }, nearby: ['Koramangala', 'Whitefield'] },
      { locality: 'Sarjapur Road', avg: 7000, demand: 78, supply: 68, growth: 12, infra: { metro: 5, hospital: 3, school: 1.5, mall: 2, airport: 38 }, ratings: { connectivity: 3, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Whitefield', 'HSR Layout'] },
    ],
  },
  {
    city: 'Hyderabad', state: 'Telangana',
    localities: [
      { locality: 'Gachibowli', avg: 8500, demand: 82, supply: 60, growth: 11, infra: { metro: 2, hospital: 2, school: 1, mall: 2, airport: 25 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 5 }, nearby: ['HITEC City', 'Kondapur'] },
      { locality: 'HITEC City', avg: 9500, demand: 85, supply: 55, growth: 10, infra: { metro: 1, hospital: 2, school: 1.5, mall: 1, airport: 28 }, ratings: { connectivity: 5, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Gachibowli', 'Madhapur'] },
      { locality: 'Banjara Hills', avg: 12000, demand: 80, supply: 42, growth: 6, infra: { metro: 1.5, hospital: 1, school: 1, mall: 1, airport: 22 }, ratings: { connectivity: 5, safety: 5, livability: 5, appreciation: 4 }, nearby: ['HITEC City', 'Kondapur'] },
      { locality: 'Kondapur', avg: 7500, demand: 78, supply: 65, growth: 12, infra: { metro: 1, hospital: 2, school: 1, mall: 1.5, airport: 26 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Gachibowli', 'Kukatpally'] },
      { locality: 'Kukatpally', avg: 6000, demand: 70, supply: 72, growth: 8, infra: { metro: 0.5, hospital: 1.5, school: 0.5, mall: 0.5, airport: 28 }, ratings: { connectivity: 5, safety: 3, livability: 4, appreciation: 3 }, nearby: ['Kondapur', 'Madhapur'] },
      { locality: 'Madhapur', avg: 8000, demand: 80, supply: 58, growth: 10, infra: { metro: 1.5, hospital: 2, school: 1, mall: 1, airport: 27 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 4 }, nearby: ['HITEC City', 'Gachibowli'] },
    ],
  },
  {
    city: 'Chennai', state: 'Tamil Nadu',
    localities: [
      { locality: 'OMR', avg: 7000, demand: 78, supply: 65, growth: 10, infra: { metro: 5, hospital: 2, school: 1.5, mall: 2, airport: 20 }, ratings: { connectivity: 3, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Velachery', 'Adyar'] },
      { locality: 'Anna Nagar', avg: 13000, demand: 82, supply: 50, growth: 6, infra: { metro: 0.5, hospital: 1, school: 0.5, mall: 1.5, airport: 15 }, ratings: { connectivity: 5, safety: 5, livability: 5, appreciation: 3 }, nearby: ['T Nagar', 'Porur'] },
      { locality: 'T Nagar', avg: 15000, demand: 85, supply: 40, growth: 5, infra: { metro: 0.5, hospital: 1.5, school: 1, mall: 0.5, airport: 12 }, ratings: { connectivity: 5, safety: 4, livability: 5, appreciation: 3 }, nearby: ['Anna Nagar', 'Adyar'] },
      { locality: 'Velachery', avg: 8500, demand: 75, supply: 68, growth: 9, infra: { metro: 1, hospital: 2, school: 1, mall: 1.5, airport: 18 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 4 }, nearby: ['OMR', 'Adyar'] },
      { locality: 'Adyar', avg: 14000, demand: 80, supply: 45, growth: 5, infra: { metro: 2, hospital: 1, school: 0.5, mall: 2, airport: 14 }, ratings: { connectivity: 4, safety: 5, livability: 5, appreciation: 3 }, nearby: ['T Nagar', 'Velachery'] },
      { locality: 'Porur', avg: 6500, demand: 68, supply: 72, growth: 11, infra: { metro: 5, hospital: 2, school: 1.5, mall: 2, airport: 10 }, ratings: { connectivity: 3, safety: 3, livability: 3, appreciation: 4 }, nearby: ['Anna Nagar', 'OMR'] },
    ],
  },
  {
    city: 'Pune', state: 'Maharashtra',
    localities: [
      { locality: 'Hinjewadi', avg: 7500, demand: 82, supply: 65, growth: 11, infra: { metro: 5, hospital: 3, school: 2, mall: 2, airport: 25 }, ratings: { connectivity: 3, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Wakad', 'Baner'] },
      { locality: 'Kharadi', avg: 8500, demand: 80, supply: 60, growth: 10, infra: { metro: 4, hospital: 2, school: 1.5, mall: 1.5, airport: 15 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Viman Nagar', 'Hadapsar'] },
      { locality: 'Baner', avg: 10000, demand: 85, supply: 55, growth: 9, infra: { metro: 3, hospital: 2, school: 1, mall: 1, airport: 20 }, ratings: { connectivity: 4, safety: 5, livability: 5, appreciation: 4 }, nearby: ['Hinjewadi', 'Wakad'] },
      { locality: 'Wakad', avg: 7000, demand: 75, supply: 70, growth: 10, infra: { metro: 4, hospital: 2.5, school: 1, mall: 1.5, airport: 22 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 4 }, nearby: ['Hinjewadi', 'Baner'] },
      { locality: 'Viman Nagar', avg: 11000, demand: 80, supply: 52, growth: 7, infra: { metro: 3, hospital: 1.5, school: 1, mall: 1, airport: 5 }, ratings: { connectivity: 5, safety: 4, livability: 5, appreciation: 4 }, nearby: ['Kharadi', 'Hadapsar'] },
      { locality: 'Hadapsar', avg: 6500, demand: 72, supply: 68, growth: 9, infra: { metro: 4, hospital: 2, school: 1.5, mall: 2, airport: 12 }, ratings: { connectivity: 3, safety: 3, livability: 4, appreciation: 4 }, nearby: ['Kharadi', 'Viman Nagar'] },
    ],
  },
  {
    city: 'Kolkata', state: 'West Bengal',
    localities: [
      { locality: 'Salt Lake', avg: 7000, demand: 75, supply: 60, growth: 7, infra: { metro: 1, hospital: 1.5, school: 0.5, mall: 1, airport: 12 }, ratings: { connectivity: 5, safety: 4, livability: 5, appreciation: 3 }, nearby: ['New Town', 'Rajarhat'] },
      { locality: 'New Town', avg: 5500, demand: 78, supply: 72, growth: 10, infra: { metro: 2, hospital: 2, school: 1, mall: 1, airport: 8 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 5 }, nearby: ['Salt Lake', 'Rajarhat'] },
      { locality: 'Rajarhat', avg: 4500, demand: 70, supply: 78, growth: 12, infra: { metro: 3, hospital: 3, school: 2, mall: 2, airport: 5 }, ratings: { connectivity: 3, safety: 3, livability: 3, appreciation: 5 }, nearby: ['New Town', 'Salt Lake'] },
      { locality: 'EM Bypass', avg: 8000, demand: 80, supply: 55, growth: 6, infra: { metro: 2, hospital: 1, school: 1, mall: 1, airport: 15 }, ratings: { connectivity: 4, safety: 4, livability: 4, appreciation: 3 }, nearby: ['Salt Lake', 'Tollygunge'] },
      { locality: 'Tollygunge', avg: 6500, demand: 72, supply: 62, growth: 5, infra: { metro: 0.5, hospital: 1.5, school: 0.5, mall: 2, airport: 18 }, ratings: { connectivity: 5, safety: 3, livability: 4, appreciation: 3 }, nearby: ['EM Bypass', 'Howrah'] },
      { locality: 'Howrah', avg: 4500, demand: 65, supply: 75, growth: 8, infra: { metro: 1, hospital: 2, school: 1, mall: 3, airport: 20 }, ratings: { connectivity: 4, safety: 3, livability: 3, appreciation: 3 }, nearby: ['Tollygunge', 'EM Bypass'] },
    ],
  },
  {
    city: 'Ahmedabad', state: 'Gujarat',
    localities: [
      { locality: 'SG Highway', avg: 7000, demand: 80, supply: 62, growth: 10, infra: { metro: 2, hospital: 1.5, school: 1, mall: 0.5, airport: 12 }, ratings: { connectivity: 5, safety: 4, livability: 5, appreciation: 5 }, nearby: ['Prahlad Nagar', 'Satellite'] },
      { locality: 'Prahlad Nagar', avg: 8000, demand: 82, supply: 55, growth: 8, infra: { metro: 2, hospital: 1, school: 0.5, mall: 1, airport: 15 }, ratings: { connectivity: 4, safety: 5, livability: 5, appreciation: 4 }, nearby: ['SG Highway', 'Vastrapur'] },
      { locality: 'Satellite', avg: 9000, demand: 78, supply: 48, growth: 6, infra: { metro: 1.5, hospital: 1, school: 0.5, mall: 1, airport: 14 }, ratings: { connectivity: 4, safety: 5, livability: 5, appreciation: 3 }, nearby: ['Prahlad Nagar', 'Vastrapur'] },
      { locality: 'Bopal', avg: 5000, demand: 72, supply: 70, growth: 12, infra: { metro: 5, hospital: 3, school: 1.5, mall: 2, airport: 18 }, ratings: { connectivity: 3, safety: 4, livability: 4, appreciation: 5 }, nearby: ['SG Highway', 'Satellite'] },
      { locality: 'Vastrapur', avg: 7500, demand: 75, supply: 58, growth: 7, infra: { metro: 1, hospital: 1.5, school: 1, mall: 0.5, airport: 13 }, ratings: { connectivity: 5, safety: 4, livability: 4, appreciation: 3 }, nearby: ['Prahlad Nagar', 'Satellite'] },
      { locality: 'Chandkheda', avg: 4000, demand: 65, supply: 78, growth: 11, infra: { metro: 1, hospital: 2.5, school: 1, mall: 3, airport: 8 }, ratings: { connectivity: 4, safety: 3, livability: 3, appreciation: 4 }, nearby: ['Bopal', 'SG Highway'] },
    ],
  },
];

const PROPERTY_TEMPLATES = [
  { type: 'apartment', beds: [1,2,3,4], areaRange: [500, 2500], floors: [1, 25] },
  { type: 'apartment', beds: [2,3], areaRange: [800, 1800], floors: [1, 15] },
  { type: 'villa', beds: [3,4,5], areaRange: [2000, 5000], floors: [1, 3] },
  { type: 'independent-house', beds: [2,3,4], areaRange: [1200, 3500], floors: [1, 4] },
  { type: 'plot', beds: [0], areaRange: [1000, 5000], floors: [0, 0] },
  { type: 'commercial', beds: [0], areaRange: [500, 3000], floors: [1, 10] },
];

function generateProperties(cityConfig, users) {
  const properties = [];
  const sellers = users.filter(u => u.role === 'seller');
  const agents = users.filter(u => u.role === 'agent');

  cityConfig.localities.forEach((loc) => {
    const numProps = rand(12, 20);
    for (let i = 0; i < numProps; i++) {
      const template = PROPERTY_TEMPLATES[i < numProps * 0.6 ? rand(0, 1) : rand(2, 5)];
      const bedrooms = template.beds[rand(0, template.beds.length - 1)];
      const area = rand(template.areaRange[0], template.areaRange[1]);
      const priceVariation = 0.8 + Math.random() * 0.4;
      const price = Math.round(loc.avg * area * priceVariation);
      const isRent = Math.random() < 0.25;
      const rentPrice = isRent ? Math.round(price * 0.003) : price;
      const listingType = isRent ? 'rent' : (Math.random() < 0.07 ? 'lease' : 'sale');
      const floor = rand(template.floors[0], template.floors[1]);
      const totalFloors = Math.max(floor, rand(template.floors[0], template.floors[1]));
      const owner = sellers[rand(0, sellers.length - 1)];
      const agent = Math.random() > 0.4 ? agents[rand(0, agents.length - 1)] : null;
      const furnishing = ['furnished', 'semi-furnished', 'unfurnished'][rand(0, 2)];
      const age = ['new', '1-5', '5-10', '10+'][rand(0, 3)];
      const amenities = pick(AMENITY_POOL, rand(3, 8));

      const typeLabel = template.type === 'apartment' ? 'Apartment' : template.type === 'villa' ? 'Villa' : template.type === 'independent-house' ? 'Independent House' : template.type === 'plot' ? 'Plot' : 'Commercial Space';
      const bhkLabel = bedrooms > 0 ? `${bedrooms} BHK ` : '';
      const furnLabel = furnishing === 'furnished' ? 'Fully Furnished ' : furnishing === 'semi-furnished' ? 'Semi-Furnished ' : '';
      const title = `${furnLabel}${bhkLabel}${typeLabel} in ${loc.locality}`;

      const descriptions = [
        `Beautiful ${bhkLabel}${typeLabel.toLowerCase()} located in the heart of ${loc.locality}, ${cityConfig.city}. This property offers modern amenities and excellent connectivity.`,
        `Premium ${bhkLabel}${typeLabel.toLowerCase()} available in ${loc.locality}. Well-maintained property with great neighborhood and all essential facilities nearby.`,
        `Spacious ${bhkLabel}${typeLabel.toLowerCase()} in prime location of ${loc.locality}, ${cityConfig.city}. Ideal for families looking for a comfortable living space.`,
      ];

      properties.push({
        title,
        description: descriptions[rand(0, 2)],
        propertyType: template.type,
        listingType,
        price: listingType === 'rent' ? rentPrice : price,
        area,
        bedrooms,
        bathrooms: Math.max(1, bedrooms - (bedrooms > 1 ? 1 : 0)),
        balconies: rand(0, Math.min(bedrooms, 3)),
        floor,
        totalFloors: Math.max(totalFloors, 1),
        furnishing,
        parking: rand(0, 2),
        facing: FACINGS[rand(0, FACINGS.length - 1)],
        age,
        amenities,
        address: {
          street: `${rand(1, 200)}, ${['Sector', 'Block', 'Phase', 'Street'][rand(0, 3)]} ${rand(1, 20)}`,
          locality: loc.locality,
          city: cityConfig.city,
          state: cityConfig.state,
          pincode: `${rand(100, 999)}${rand(100, 999)}`,
        },
        images: [],
        verified: Math.random() > 0.3,
        owner: owner._id,
        agent: agent ? agent._id : undefined,
        status: Math.random() > 0.15 ? 'active' : 'sold',
        views: rand(10, 500),
        inquiries: rand(0, 20),
      });
    }
  });

  return properties;
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany(),
      Property.deleteMany(),
      LocalityData.deleteMany(),
    ]);
    console.log('Cleared existing data');

    const users = await User.create(usersData);
    console.log(`Created ${users.length} users`);

    const localityDocs = [];
    citiesConfig.forEach(cityConf => {
      cityConf.localities.forEach(loc => {
        localityDocs.push({
          city: cityConf.city,
          locality: loc.locality,
          state: cityConf.state,
          avgPricePerSqFt: loc.avg,
          medianPrice: loc.avg * 1000,
          priceHistory: generatePriceHistory(loc.avg, loc.growth),
          demandScore: loc.demand,
          supplyScore: loc.supply,
          nearbyLocalities: loc.nearby,
          infrastructure: loc.infra,
          ratings: loc.ratings,
        });
      });
    });
    const localities = await LocalityData.create(localityDocs);
    console.log(`Created ${localities.length} localities`);

    let allProperties = [];
    citiesConfig.forEach(cityConf => {
      allProperties = allProperties.concat(generateProperties(cityConf, users));
    });
    const properties = await Property.create(allProperties);
    console.log(`Created ${properties.length} properties`);

    console.log('\nSeed completed successfully!');
    console.log(`Total: ${users.length} users, ${localities.length} localities, ${properties.length} properties`);
    console.log('\nLogin credentials:');
    console.log('Admin: admin@propval.com / admin123');
    console.log('Agent: agent1@propval.com / agent123');
    console.log('Buyer: buyer1@propval.com / buyer123');
    console.log('Seller: seller1@propval.com / seller123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
