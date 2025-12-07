-- Migration pour ajouter le champ external_link (MySQL)
ALTER TABLE blog_articles ADD COLUMN IF NOT EXISTS external_link VARCHAR(500);

-- Note: Si external_link est rempli, le bouton "Lire l'article" redirige vers ce lien
-- Sinon, il affiche le contenu complet de l'article
