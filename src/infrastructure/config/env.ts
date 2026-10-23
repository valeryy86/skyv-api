import "dotenv/config";

// Lee una variable de entorno obligatoria; si falta, el servidor no arranca
function requerida(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}. Revisa tu archivo .env`);
  }
  return valor;
}

export const env = {
  DATABASE_URL: requerida("DATABASE_URL"),
  JWT_SECRET: requerida("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",
  PORT: Number(process.env.PORT ?? 4000),
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
};
