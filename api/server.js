import http from "node:http";
import pg from "pg";
const PORT = Number(process.env.PORT || 3000);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
function json(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  response.end(JSON.stringify(body));
}
const server = http.createServer(async (request, response) => {
  if (request.url === "/health") {
    try {
      await pool.query("SELECT 1");
      return json(response, 200, { status: "UP", database: "UP" });
    } catch (error) {
      return json(response, 503, { status: "DOWN", database: "DOWN" });
    }
  }
  if (request.url === "/tasks") {
    try {
      const result = await pool.query("SELECT id, titre, fait FROM taches ORDER BY id");
      return json(response, 200, { tasks: result.rows });
    } catch (error) {
      return json(response, 500, { error: "Lecture impossible", detail: error.message });
    }
  }
  return json(response, 404, { error: "Route inconnue" });
});
server.listen(PORT, "0.0.0.0", () => {
  console.log(`API tp3 demarree sur le port ${PORT}`);
});
