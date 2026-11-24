import fs from "node:fs";
import path from "node:path";
import pg from "pg";
const dossier = path.join(process.cwd(), "migrations");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
async function main() {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    appliquee_le TIMESTAMPTZ NOT NULL DEFAULT now())`);
  const fichiers = fs.readdirSync(dossier).filter((f) => f.endsWith(".sql")).sort();
  for (const fichier of fichiers) {
    const { rowCount } = await pool.query(
      "SELECT 1 FROM schema_migrations WHERE version = $1", [fichier]);
    if (rowCount > 0) { console.log(`deja appliquee : ${fichier}`); continue; }
    const sql = fs.readFileSync(path.join(dossier, fichier), "utf8");
    await pool.query("BEGIN");
    try {
      await pool.query(sql);
      await pool.query("INSERT INTO schema_migrations (version) VALUES ($1)", [fichier]);
      await pool.query("COMMIT");
      console.log(`appliquee : ${fichier}`);
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
}
main().then(() => pool.end()).catch(async (error) => {
  console.error("migration echouee :", error.message);
  await pool.end();
  process.exit(1);
});
