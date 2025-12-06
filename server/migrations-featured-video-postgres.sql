-- Migration pour la table featured_videos (PostgreSQL)
CREATE TABLE IF NOT EXISTS featured_videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  thumbnail VARCHAR(500),
  video_url VARCHAR(500) NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_featured_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER featured_videos_updated_at
BEFORE UPDATE ON featured_videos
FOR EACH ROW
EXECUTE FUNCTION update_featured_videos_updated_at();

-- Insérer une vidéo par défaut
INSERT INTO featured_videos (title, description, thumbnail, video_url, published) VALUES
('L''Afrique accélère son inclusion à l''intelligence artificielle', 
 'Découvrez comment l''Afrique s''approprie l''intelligence artificielle pour transformer son économie et créer des solutions innovantes adaptées aux réalités locales. Une analyse approfondie des initiatives et opportunités du continent.',
 '/blog/video-ia-afrique.jpg',
 'https://www.youtube.com/watch?v=YSVi4X10OUY',
 true)
ON CONFLICT DO NOTHING;
