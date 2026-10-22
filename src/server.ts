import "dotenv/config";
import express from "express";

// Versión TEMPORAL del Día 1: solo para comprobar que todo funciona.
// El Día 2 la reemplazas por la versión definitiva.
const app = express();

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});