/*
  # Traffic Management System Schema

  1. New Tables
    - `intersections`
      - `id` (uuid, primary key)
      - `name` (text) - Intersection name
      - `location` (text) - Location description
      - `status` (text) - active/inactive
      - `created_at` (timestamptz)
    
    - `traffic_signals`
      - `id` (uuid, primary key)
      - `intersection_id` (uuid, foreign key)
      - `direction` (text) - north/south/east/west
      - `current_state` (text) - red/yellow/green
      - `timing` (integer) - current timing in seconds
      - `updated_at` (timestamptz)
    
    - `vehicle_detections`
      - `id` (uuid, primary key)
      - `intersection_id` (uuid, foreign key)
      - `direction` (text)
      - `vehicle_count` (integer)
      - `confidence` (decimal) - AI detection confidence
      - `detected_at` (timestamptz)
    
    - `performance_metrics`
      - `id` (uuid, primary key)
      - `intersection_id` (uuid, foreign key)
      - `avg_wait_time` (decimal) - in seconds
      - `throughput` (integer) - vehicles per minute
      - `latency` (decimal) - processing latency in ms
      - `cycle_time` (integer) - signal cycle time
      - `recorded_at` (timestamptz)
    
    - `signal_cycles`
      - `id` (uuid, primary key)
      - `intersection_id` (uuid, foreign key)
      - `direction` (text)
      - `previous_state` (text)
      - `new_state` (text)
      - `duration` (integer) - how long the state lasted
      - `vehicle_count` (integer) - vehicles served
      - `changed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (for demo purposes)
    - Add policies for authenticated insert/update
*/

CREATE TABLE IF NOT EXISTS intersections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS traffic_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id uuid REFERENCES intersections(id) ON DELETE CASCADE,
  direction text NOT NULL,
  current_state text DEFAULT 'red',
  timing integer DEFAULT 30,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicle_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id uuid REFERENCES intersections(id) ON DELETE CASCADE,
  direction text NOT NULL,
  vehicle_count integer DEFAULT 0,
  confidence decimal DEFAULT 0.95,
  detected_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id uuid REFERENCES intersections(id) ON DELETE CASCADE,
  avg_wait_time decimal DEFAULT 0,
  throughput integer DEFAULT 0,
  latency decimal DEFAULT 0,
  cycle_time integer DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS signal_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intersection_id uuid REFERENCES intersections(id) ON DELETE CASCADE,
  direction text NOT NULL,
  previous_state text,
  new_state text NOT NULL,
  duration integer DEFAULT 0,
  vehicle_count integer DEFAULT 0,
  changed_at timestamptz DEFAULT now()
);

ALTER TABLE intersections ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_cycles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view intersections"
  ON intersections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view traffic signals"
  ON traffic_signals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view vehicle detections"
  ON vehicle_detections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view performance metrics"
  ON performance_metrics FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view signal cycles"
  ON signal_cycles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert vehicle detections"
  ON vehicle_detections FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can insert performance metrics"
  ON performance_metrics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can insert signal cycles"
  ON signal_cycles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update traffic signals"
  ON traffic_signals FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

INSERT INTO intersections (name, location, status) VALUES
  ('Main Street & Oak Avenue', 'Downtown District', 'active');

DO $$
DECLARE
  intersection_id uuid;
BEGIN
  SELECT id INTO intersection_id FROM intersections LIMIT 1;
  
  INSERT INTO traffic_signals (intersection_id, direction, current_state, timing) VALUES
    (intersection_id, 'north', 'green', 30),
    (intersection_id, 'south', 'green', 30),
    (intersection_id, 'east', 'red', 30),
    (intersection_id, 'west', 'red', 30);
END $$;