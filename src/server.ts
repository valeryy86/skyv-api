import { createApp } from "./app";
import { env } from "./infrastructure/config/env";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`API de Sky V Cosmetics escuchando en http://localhost:${env.PORT}`);
});
