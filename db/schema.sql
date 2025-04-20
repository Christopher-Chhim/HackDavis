-- Zones in the building
CREATE TABLE zones (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- Devices (microphones, speakers, doors, signage, etc.)
CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  zone_id INTEGER REFERENCES zones(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  identifier TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active'
);

-- Detected incidents (panic, gunshot, fire, etc.)
CREATE TABLE incidents (
  id SERIAL PRIMARY KEY,
  zone_id INTEGER REFERENCES zones(id) ON DELETE SET NULL,
  device_id INTEGER REFERENCES devices(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  detected_at TIMESTAMP DEFAULT NOW(),
  severity TEXT,
  status TEXT DEFAULT 'active'
);

-- Actions taken by the system (lockdown, evacuation, etc.)
CREATE TABLE actions (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  performed_by TEXT, -- 'ai', 'human', etc.
  performed_at TIMESTAMP DEFAULT NOW(),
  details TEXT
);

-- Users (security staff, admins)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
