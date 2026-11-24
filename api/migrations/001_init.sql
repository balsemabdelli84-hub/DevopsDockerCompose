CREATE TABLE IF NOT EXISTS taches (
  id SERIAL PRIMARY KEY,
  titre TEXT NOT NULL,
  fait BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO taches (titre, fait) VALUES
  ('Installer Docker Desktop', true),
  ('Construire une image', false),
  ('Migrer la base', false)
ON CONFLICT DO NOTHING;
