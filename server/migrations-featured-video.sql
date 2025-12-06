-- Migration pour la table featured_videos (MySQL)
CREATE TABLE IF NOT EXISTS featured_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  thumbnail VARCHAR(500),
  video_url VARCHAR(500) NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insérer une vidéo par défaut
INSERT INTO featured_videos (title, description, thumbnail, video_url, published) VALUES
('L''Afrique accélère son inclusion à l''intelligence artificielle', 
 'Découvrez comment l''Afrique s''approprie l''intelligence artificielle pour transformer son économie et créer des solutions innovantes adaptées aux réalités locales. Une analyse approfondie des initiatives et opportunités du continent.',
 '/blog/video-ia-afrique.jpg',
 'https://www.youtube.com/watch?v=YSVi4X10OUY',
 true);
