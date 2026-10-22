import { PrismaClient, Categoria } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Los mismos 8 productos del arreglo de catalogo.js de la Entrega 1
const productos: {
  nombre: string;
  marca: string;
  categoria: Categoria;
  precio: number;
  imagen: string;
}[] = [
  { nombre: "Serum Tinted", marca: "atenea", categoria: "maquillaje", precio: 55000, imagen: "/img/Productos_atenea/SerumTinted.png" },
  { nombre: "Corrector de ojeras", marca: "bloomshell", categoria: "maquillaje", precio: 30000, imagen: "/img/productos_bloomshell/Corrector.png" },
  { nombre: "Fijador de Maquillaje", marca: "montoc", categoria: "maquillaje", precio: 34000, imagen: "/img/productos_montoc/FijadorMaquillaje.png" },
  { nombre: "Serum Blush", marca: "anik", categoria: "maquillaje", precio: 28000, imagen: "/img/productos_anik/SerumBlush.png" },
  { nombre: "Perfume Capilar de miel", marca: "clickhair", categoria: "capilar", precio: 50500, imagen: "/img/productos_clickhair/PerfumeMiel.png" },
  { nombre: "Shampoo Herbal", marca: "milagros", categoria: "capilar", precio: 35000, imagen: "/img/productos_milagros/ShampooHerbal.png" },
  { nombre: "Shampoo de Cebolla", marca: "kaba", categoria: "capilar", precio: 40000, imagen: "/img/productos_kaba/ShampooCebolla.png" },
  { nombre: "Stick Capilar", marca: "ole", categoria: "capilar", precio: 36000, imagen: "/img/productos_ole/StickCapilar.png" },
];

async function main() {
  // Usuarios de prueba (upsert: si ya existen no se duplican)
  const adminHash = await bcrypt.hash("Admin123*", 10);
  const userHash = await bcrypt.hash("Cliente123*", 10);

  await prisma.user.upsert({
    where: { email: "admin@skyv.com" },
    update: {},
    create: { nombre: "Admin Sky V", email: "admin@skyv.com", password: adminHash, role: "admin" },
  });

  await prisma.user.upsert({
    where: { email: "cliente@skyv.com" },
    update: {},
    create: { nombre: "Cliente de Prueba", email: "cliente@skyv.com", password: userHash, role: "user" },
  });

  // Productos: solo se cargan si la tabla está vacía
  const total = await prisma.producto.count();
  if (total === 0) {
    await prisma.producto.createMany({ data: productos });
    console.log(`Se cargaron ${productos.length} productos`);
  } else {
    console.log(`Ya hay ${total} productos, no se cargan de nuevo`);
  }
  console.log("Seed terminado");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
