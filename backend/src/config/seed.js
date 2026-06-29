import bcrypt from 'bcryptjs';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

export const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const { rows } = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);

    if (rows.length > 0) {
      const admin = rows[0];
      const updates = [];
      const values = [];
      let idx = 1;

      if (admin.email.toLowerCase() !== email) {
        updates.push(`email = $${idx++}`);
        values.push(email);
      }
      if (password) {
        const hash = await bcrypt.hash(password, 12);
        updates.push(`password = $${idx++}`);
        values.push(hash);
      }

      if (updates.length > 0) {
        values.push(admin.id);
        await pool.query(
          `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`,
          values
        );
        console.log('✅ Admin account updated:', email);
      }
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)',
      ['Admin', email, hash, 'admin']
    );
    console.log('✅ Admin seeded:', email);
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

export const seedTours = async () => {
  try {
    const count = await pool.query('SELECT COUNT(*) FROM tours');
    if (parseInt(count.rows[0].count) > 0) return;

    const tours = [
      {
        title: 'Maldives Overwater Escape',
        slug: 'maldives-overwater-escape',
        region: 'Indian Ocean',
        destination: 'Maldives',
        description: 'Private villa above the turquoise lagoon, manta ray snorkelling, dolphin cruises, and a magical sunset dhoni dinner.',
        short_desc: 'Private overwater villa, snorkelling, sunset dhoni dinner.',
        price: 850000,
        duration_nights: 7,
        tour_type: 'Beach & Island',
        badge: 'Bestseller',
        emoji: '🏝️',
        bg_gradient: 'linear-gradient(135deg,#C5E9F7,#7DD3F0)',
        is_featured: true,
        highlights: ['Overwater bungalow', 'Manta ray snorkelling', 'Sunset dhoni dinner', 'Dolphin cruise'],
        included: ['Return flights', 'All meals', 'Airport transfers', 'Snorkelling gear'],
        excluded: ['Travel insurance', 'Personal expenses', 'Spa treatments'],
      },
      {
        title: 'Serengeti Great Migration',
        slug: 'serengeti-great-migration',
        region: 'East Africa',
        destination: 'Tanzania',
        description: 'Witness millions of wildebeest thunder across the Mara River. Luxury tented camps, expert trackers, and skies packed with stars.',
        short_desc: 'Luxury safari camps, expert trackers, Great Migration.',
        price: 1200000,
        duration_nights: 8,
        tour_type: 'Safari & Wildlife',
        badge: 'Seasonal',
        emoji: '🦁',
        bg_gradient: 'linear-gradient(135deg,#fdf6ec,#f9d87a)',
        is_featured: false,
        highlights: ['Great Migration crossing', 'Luxury tented camps', 'Big Five game drives', 'Night safari'],
        included: ['All game drives', 'Full board', 'Park fees', 'Expert tracker'],
        excluded: ['International flights', 'Visa fees', 'Travel insurance'],
      },
      {
        title: 'Japan Cherry Blossom Trail',
        slug: 'japan-cherry-blossom-trail',
        region: 'East Asia',
        destination: 'Japan',
        description: 'Tokyo, Kyoto, Nara, and Osaka during sakura season — ancient temples, neon-lit streets, and a private tea ceremony.',
        short_desc: 'Sakura season, temples, tea ceremony, city exploration.',
        price: 1450000,
        duration_nights: 10,
        tour_type: 'Culture & Nature',
        badge: 'Limited Spots',
        emoji: '🌸',
        bg_gradient: 'linear-gradient(135deg,#fff0f3,#ffc6d3)',
        is_featured: false,
        highlights: ['Cherry blossom viewing', 'Private tea ceremony', 'Fushimi Inari hike', 'Bullet train ride'],
        included: ['Hotels', 'Bullet train pass', 'Private guide', 'Tea ceremony'],
        excluded: ['Flights', 'Some meals', 'Personal shopping'],
      },
      {
        title: 'Morocco Desert & Medina',
        slug: 'morocco-desert-medina',
        region: 'North Africa',
        destination: 'Morocco',
        description: 'Fes medina, Sahara overnight camp under a billion stars, and a luxury riad in Marrakech.',
        short_desc: 'Sahara camp, Fes medina, luxury riad.',
        price: 680000,
        duration_nights: 8,
        tour_type: 'Adventure & Culture',
        badge: 'Popular',
        emoji: '🏜️',
        bg_gradient: 'linear-gradient(135deg,#fdf4e7,#f9c96e)',
        is_featured: false,
        highlights: ['Sahara camel trek', 'Overnight desert camp', 'Fes medina tour', 'Luxury riad stay'],
        included: ['Riad accommodation', 'Desert camp', 'Guided tours', 'Transport'],
        excluded: ['Flights', 'Some meals', 'Travel insurance'],
      },
      {
        title: 'Santorini Honeymoon Escape',
        slug: 'santorini-honeymoon-escape',
        region: 'Southern Europe',
        destination: 'Greece',
        description: 'Cliffside suites in Oia with caldera views, private catamaran cruise, couples spa, and sunset dinners you will never forget.',
        short_desc: 'Cliffside suites, catamaran cruise, couples spa.',
        price: 980000,
        duration_nights: 7,
        tour_type: 'Honeymoon',
        badge: 'Romantic',
        emoji: '🌅',
        bg_gradient: 'linear-gradient(135deg,#EBF7FD,#b3d9f0)',
        is_featured: false,
        highlights: ['Oia cliffside suite', 'Private catamaran', 'Couples spa', 'Sunset dinner'],
        included: ['Suite accommodation', 'Catamaran cruise', 'Welcome champagne', 'Transfers'],
        excluded: ['Flights', 'Travel insurance', 'Personal expenses'],
      },
      {
        title: 'Amalfi Coast & Capri',
        slug: 'amalfi-coast-capri',
        region: 'Southern Europe',
        destination: 'Italy',
        description: 'Clifftop villages draped in bougainvillea, limoncello at sunset, and a private boat around the island of Capri.',
        short_desc: 'Clifftop villages, limoncello sunsets, Capri by boat.',
        price: 720000,
        duration_nights: 6,
        tour_type: 'Culture & Leisure',
        badge: 'New',
        emoji: '⛵',
        bg_gradient: 'linear-gradient(135deg,#e8f4f8,#7DD3F0)',
        is_featured: false,
        highlights: ['Private Capri boat tour', 'Ravello villa visit', 'Limoncello tasting', 'Positano sunset walk'],
        included: ['Boutique hotel', 'Private boat', 'Guided tours', 'Breakfast daily'],
        excluded: ['Flights', 'Dinners', 'Travel insurance'],
      },
    ];

    for (const t of tours) {
      await pool.query(
        `INSERT INTO tours (title,slug,region,destination,description,short_desc,price,duration_nights,
          tour_type,badge,emoji,bg_gradient,is_featured,highlights,included,excluded)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
        [t.title, t.slug, t.region, t.destination, t.description, t.short_desc, t.price,
         t.duration_nights, t.tour_type, t.badge, t.emoji, t.bg_gradient, t.is_featured,
         t.highlights, t.included, t.excluded]
      );
    }
    console.log('✅ Tours seeded');
  } catch (err) {
    console.error('Tour seed error:', err.message);
  }
};

export const seedPosts = async () => {
  try {
    const count = await pool.query('SELECT COUNT(*) FROM posts');
    if (parseInt(count.rows[0].count) > 0) return;

    const posts = [
      {
        title: 'The Maldives Beyond the Photos',
        slug: 'maldives-beyond-photos',
        category: 'Destination Guide',
        excerpt: 'The real Maldives is quieter, wilder, and far more beautiful than your feed suggests.',
        emoji: '🌊',
        bg_color: 'linear-gradient(135deg,#C5E9F7,#EBF7FD)',
        read_time: '6 min read',
        is_published: true,
      },
      {
        title: 'How to Time Your Safari for the Great Migration',
        slug: 'safari-great-migration-timing',
        category: 'Safari',
        excerpt: 'The wildebeest crossing changes everything. Get your dates right and witness something extraordinary.',
        emoji: '🦁',
        bg_color: 'linear-gradient(135deg,#fdf6ec,#f9d87a)',
        read_time: '8 min read',
        is_published: true,
      },
      {
        title: "Japan in Cherry Blossom Season: A First-Timer's Complete Guide",
        slug: 'japan-cherry-blossom-guide',
        category: 'Culture & Food',
        excerpt: "Tokyo, Kyoto, Nara — here's how to plan the perfect sakura trip without the overwhelm.",
        emoji: '🌸',
        bg_color: 'linear-gradient(135deg,#fff0f3,#ffd6e0)',
        read_time: '7 min read',
        is_published: true,
      },
    ];

    for (const p of posts) {
      await pool.query(
        'INSERT INTO posts (title,slug,category,excerpt,emoji,bg_color,read_time,is_published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        [p.title, p.slug, p.category, p.excerpt, p.emoji, p.bg_color, p.read_time, p.is_published]
      );
    }
    console.log('✅ Posts seeded');
  } catch (err) {
    console.error('Post seed error:', err.message);
  }
};