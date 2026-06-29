CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  short_desc VARCHAR(300),
  price NUMERIC(12,2) NOT NULL,
  duration_nights INTEGER NOT NULL,
  tour_type VARCHAR(50),
  badge VARCHAR(50),
  emoji VARCHAR(10) DEFAULT '✈️',
  bg_gradient VARCHAR(200),
  image_url TEXT,
  highlights TEXT[],
  included TEXT[],
  excluded TEXT[],
  max_group_size INTEGER DEFAULT 20,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference VARCHAR(50) UNIQUE NOT NULL,
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_title VARCHAR(200),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  num_travellers INTEGER DEFAULT 1,
  travel_date DATE,
  total_amount NUMERIC(12,2),
  amount_paid NUMERIC(12,2) DEFAULT 0,
  payment_status VARCHAR(30) DEFAULT 'pending',
  paystack_ref VARCHAR(100),
  status VARCHAR(30) DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),
  destination VARCHAR(100),
  travel_date DATE,
  message TEXT,
  status VARCHAR(30) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  category VARCHAR(80),
  excerpt VARCHAR(400),
  content TEXT,
  image_url TEXT,
  emoji VARCHAR(10) DEFAULT '📝',
  bg_color VARCHAR(100),
  read_time VARCHAR(20),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);