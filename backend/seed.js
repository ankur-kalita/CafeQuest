require('dotenv').config();
const mongoose = require('mongoose');
const Cafe = require('./src/models/Cafe');
const User = require('./src/models/User');

const cafes = [
  // ===== VISITED CAFES =====
  { name: 'The Roastery', location: 'Hauz Khas Village, Delhi', rating: 5, status: 'visited', tags: ['wifi', 'good-coffee', 'aesthetic'], notes: 'Best single-origin pour over in the city. The latte art is insane.', isPublic: true },
  { name: 'Brew Haven', location: 'Koramangala, Bangalore', rating: 4, status: 'visited', tags: ['wifi', 'quiet'], notes: 'Great spot to work from. Fast WiFi and cozy corners.', isPublic: true },
  { name: 'Café Latte Dreams', location: 'Connaught Place, Delhi', rating: 4, status: 'visited', tags: ['good-coffee', 'aesthetic'], notes: 'Instagrammable interiors and solid espresso.', isPublic: true },
  { name: 'Morning Ritual', location: 'Indiranagar, Bangalore', rating: 5, status: 'visited', tags: ['good-coffee', 'quiet', 'pet-friendly'], notes: 'Peaceful morning vibes. My dog loved it too.', isPublic: true },
  { name: 'Third Wave Coffee', location: 'HSR Layout, Bangalore', rating: 4, status: 'visited', tags: ['wifi', 'good-coffee'], notes: 'Reliable chain with consistent quality.', isPublic: true },
  { name: 'The Coffee Collective', location: 'Bandra West, Mumbai', rating: 5, status: 'visited', tags: ['aesthetic', 'good-coffee', 'quiet'], notes: 'Hidden gem with amazing cold brew.', isPublic: true },
  { name: 'Grind & Bloom', location: 'MG Road, Pune', rating: 3, status: 'visited', tags: ['wifi'], notes: 'Decent coffee but gets crowded after 5pm.', isPublic: true },
  { name: 'Bean There Done That', location: 'Jubilee Hills, Hyderabad', rating: 4, status: 'visited', tags: ['good-coffee', 'pet-friendly'], notes: 'Funky name, even funkier menu. Try the hazelnut mocha.', isPublic: true },
  { name: 'Sip & Scribble', location: 'Campal, Goa', rating: 5, status: 'visited', tags: ['quiet', 'aesthetic', 'wifi'], notes: 'Ocean breeze + coffee = perfection. Spent the whole afternoon here.', isPublic: true },
  { name: 'Espresso Express', location: 'Park Street, Kolkata', rating: 3, status: 'visited', tags: ['good-coffee'], notes: 'Quick espresso shots. No nonsense.', isPublic: true },
  { name: 'The Drip Lounge', location: 'Sector 29, Gurgaon', rating: 4, status: 'visited', tags: ['wifi', 'aesthetic', 'quiet'], notes: 'Modern interiors. Great for client meetings.', isPublic: true },
  { name: 'Paws & Pour', location: 'Whitefield, Bangalore', rating: 5, status: 'visited', tags: ['pet-friendly', 'good-coffee', 'aesthetic'], notes: 'A cafe WITH resident cats. Need I say more?', isPublic: true },

  // ===== WISHLIST CAFES =====
  { name: 'Cloud Nine Café', location: 'Mall Road, Shimla', rating: 4, status: 'wishlist', tags: ['aesthetic', 'quiet'], notes: 'Heard the mountain view from here is breathtaking.', isPublic: true },
  { name: 'The Bohemian Bean', location: 'Anjuna, Goa', rating: 4, status: 'wishlist', tags: ['aesthetic', 'pet-friendly', 'wifi'], notes: 'Boho vibes and beach nearby. On my must-visit list.', isPublic: true },
  { name: 'Himalayan Brew House', location: 'McLeod Ganj, Dharamshala', rating: 5, status: 'wishlist', tags: ['quiet', 'good-coffee'], notes: 'Everyone recommends this place. Planning a trip soon.', isPublic: true },
  { name: 'Artisan Alley Café', location: 'Fort Kochi, Kerala', rating: 4, status: 'wishlist', tags: ['aesthetic', 'good-coffee', 'quiet'], notes: 'Art gallery + cafe combo. Right up my alley.', isPublic: true },
  { name: 'Nomad\'s Nest', location: 'Pushkar, Rajasthan', rating: 3, status: 'wishlist', tags: ['wifi', 'quiet'], notes: 'Digital nomad hotspot supposedly. Want to check it out.', isPublic: true },
  { name: 'The Lazy Lemur', location: 'Pondicherry', rating: 4, status: 'wishlist', tags: ['pet-friendly', 'aesthetic'], notes: 'French quarter vibes with a quirky twist.', isPublic: true },
  { name: 'Moonlight Mocha', location: 'Leh, Ladakh', rating: 5, status: 'wishlist', tags: ['quiet', 'aesthetic', 'good-coffee'], notes: 'Coffee at 11,500 feet? Sign me up.', isPublic: true },
  { name: 'Sunrise Sips', location: 'Udaipur, Rajasthan', rating: 4, status: 'wishlist', tags: ['aesthetic', 'good-coffee'], notes: 'Lakeside cafe with sunrise views. Bucket list material.', isPublic: true },
  { name: 'The Quiet Corner', location: 'Jaipur, Rajasthan', rating: 3, status: 'wishlist', tags: ['quiet', 'wifi'], notes: 'Supposedly the quietest cafe in the Pink City.', isPublic: true },
  { name: 'Bark & Brew', location: 'Koregaon Park, Pune', rating: 4, status: 'wishlist', tags: ['pet-friendly', 'good-coffee', 'wifi'], notes: 'Dog-friendly with a puppy play area!', isPublic: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the user "Ankur" or the first available user
    let user = await User.findOne({ username: /ankur/i });
    if (!user) {
      user = await User.findOne({});
    }

    if (!user) {
      console.error('No users found. Please register first.');
      process.exit(1);
    }

    console.log(`Seeding cafes for user: ${user.username} (${user._id})`);

    // Add userId and dates to each cafe
    const cafesWithUser = cafes.map((cafe, i) => ({
      ...cafe,
      userId: user._id,
      visitedAt: cafe.status === 'visited'
        ? new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)) // stagger dates
        : null,
      createdAt: new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)),
    }));

    const result = await Cafe.insertMany(cafesWithUser);
    console.log(`Inserted ${result.length} cafes successfully!`);
    console.log(`  - Visited: ${cafes.filter(c => c.status === 'visited').length}`);
    console.log(`  - Wishlist: ${cafes.filter(c => c.status === 'wishlist').length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
