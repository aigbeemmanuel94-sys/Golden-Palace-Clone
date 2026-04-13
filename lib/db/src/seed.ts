import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { categoriesTable, productsTable, usersTable } from "./schema/index";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function seed() {
  console.log("Seeding database...");

  const categories = [
    { name: "Rings", slug: "rings", imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80" },
    { name: "Earrings", slug: "earrings", imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
    { name: "Mangalsutra", slug: "mangalsutra", imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80" },
    { name: "Necklace", slug: "necklace", imageUrl: "https://images.unsplash.com/photo-1599459183200-59c7687a0c70?w=400&q=80" },
    { name: "Bracelet", slug: "bracelet", imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94f9b47?w=400&q=80" },
    { name: "Chain", slug: "chain", imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80" },
    { name: "Pendant", slug: "pendant", imageUrl: "https://images.unsplash.com/photo-1620647500337-7f35b8ece527?w=400&q=80" },
  ];

  const insertedCategories = await db.insert(categoriesTable).values(categories).onConflictDoNothing().returning();
  console.log(`Inserted ${insertedCategories.length} categories`);

  const allCategories = await db.select().from(categoriesTable);
  const catMap: Record<string, number> = {};
  for (const c of allCategories) catMap[c.slug] = c.id;

  const products = [
    {
      name: "Royal Kundan Solitaire Ring",
      description: "A breathtaking 22kt gold ring adorned with hand-set Kundan stones and intricate meenakari work on the band.",
      price: "45,999",
      originalPrice: "58,999",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
      categoryId: catMap["rings"],
      categoryName: "Rings",
      isNewArrival: true,
      isTrending: false,
      badge: "New",
      weight: "8.2g",
    },
    {
      name: "Heritage Polki Diamond Ring",
      description: "A stunning polki diamond ring set in 22kt gold with traditional rajasthani craftsmanship.",
      price: "78,500",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80",
      categoryId: catMap["rings"],
      categoryName: "Rings",
      isNewArrival: false,
      isTrending: true,
      badge: "Bestseller",
      weight: "9.5g",
    },
    {
      name: "Floral Jhumka Earrings",
      description: "Traditional bell-shaped jhumka earrings in 22kt gold with emerald drops and intricate filigree work.",
      price: "32,499",
      originalPrice: "42,000",
      imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
      categoryId: catMap["earrings"],
      categoryName: "Earrings",
      isNewArrival: true,
      isTrending: true,
      badge: "Sale",
      weight: "12.6g",
    },
    {
      name: "Temple Chandelier Earrings",
      description: "Opulent long chandelier earrings featuring temple motifs and ruby accents in 22kt gold.",
      price: "56,000",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1622557850716-54a5a5bec55b?w=600&q=80",
      categoryId: catMap["earrings"],
      categoryName: "Earrings",
      isNewArrival: false,
      isTrending: true,
      badge: null,
      weight: "18.3g",
    },
    {
      name: "Lakshmi Mangalsutra",
      description: "An auspicious 22kt gold mangalsutra featuring intricate Lakshmi motifs with black bead chain.",
      price: "68,999",
      originalPrice: "82,000",
      imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
      categoryId: catMap["mangalsutra"],
      categoryName: "Mangalsutra",
      isNewArrival: true,
      isTrending: false,
      badge: "New",
      weight: "22.1g",
    },
    {
      name: "Diamond Pendant Mangalsutra",
      description: "A modern mangalsutra with a diamond-studded pendant in 18kt white and yellow gold.",
      price: "1,25,000",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80",
      categoryId: catMap["mangalsutra"],
      categoryName: "Mangalsutra",
      isNewArrival: false,
      isTrending: true,
      badge: "Premium",
      weight: "16.8g",
    },
    {
      name: "Haar Necklace Set",
      description: "A royal 22kt gold haar necklace set with matching earrings, featuring meenakari peacock motifs.",
      price: "2,45,000",
      originalPrice: "2,95,000",
      imageUrl: "https://images.unsplash.com/photo-1599459183200-59c7687a0c70?w=600&q=80",
      categoryId: catMap["necklace"],
      categoryName: "Necklace",
      isNewArrival: false,
      isTrending: true,
      badge: "Sale",
      weight: "65.4g",
    },
    {
      name: "Choker Temple Necklace",
      description: "A stunning temple-work choker in 22kt gold with ruby and emerald detailing.",
      price: "98,500",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&q=80",
      categoryId: catMap["necklace"],
      categoryName: "Necklace",
      isNewArrival: true,
      isTrending: false,
      badge: "New",
      weight: "42.2g",
    },
    {
      name: "Kada Gold Bracelet",
      description: "A classic 22kt gold kada with intricate engravings and a traditional bangle-style clasp.",
      price: "38,999",
      originalPrice: "46,000",
      imageUrl: "https://images.unsplash.com/photo-1573408301185-9519f94f9b47?w=600&q=80",
      categoryId: catMap["bracelet"],
      categoryName: "Bracelet",
      isNewArrival: false,
      isTrending: false,
      badge: "Sale",
      weight: "28.7g",
    },
    {
      name: "Filigree Bangle Bracelet",
      description: "Delicate filigree work bracelet in 22kt gold with a floral pattern and secure clasp.",
      price: "28,500",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1618898909019-010e4e234c55?w=600&q=80",
      categoryId: catMap["bracelet"],
      categoryName: "Bracelet",
      isNewArrival: true,
      isTrending: true,
      badge: "New",
      weight: "15.3g",
    },
    {
      name: "Singapore Gold Chain",
      description: "A versatile 22kt gold Singapore chain, lightweight yet durable, perfect for everyday wear.",
      price: "18,999",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
      categoryId: catMap["chain"],
      categoryName: "Chain",
      isNewArrival: false,
      isTrending: true,
      badge: "Bestseller",
      weight: "10.5g",
    },
    {
      name: "Box Link Gold Chain",
      description: "A sturdy 22kt gold box link chain with a secure lobster clasp, ideal for pendant wear.",
      price: "24,500",
      originalPrice: "29,000",
      imageUrl: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80",
      categoryId: catMap["chain"],
      categoryName: "Chain",
      isNewArrival: true,
      isTrending: false,
      badge: "Sale",
      weight: "14.2g",
    },
    {
      name: "Ganesha Gold Pendant",
      description: "An auspicious 22kt gold Ganesha pendant with intricate detailing, a symbol of prosperity.",
      price: "12,999",
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1620647500337-7f35b8ece527?w=600&q=80",
      categoryId: catMap["pendant"],
      categoryName: "Pendant",
      isNewArrival: true,
      isTrending: true,
      badge: "New",
      weight: "5.8g",
    },
    {
      name: "Locket with Temple Design",
      description: "A beautifully crafted 22kt gold locket pendant with a traditional temple architecture motif.",
      price: "8,750",
      originalPrice: "10,500",
      imageUrl: "https://images.unsplash.com/photo-1569397288884-4d43d6738fbd?w=600&q=80",
      categoryId: catMap["pendant"],
      categoryName: "Pendant",
      isNewArrival: false,
      isTrending: false,
      badge: "Sale",
      weight: "4.2g",
    },
  ];

  const insertedProducts = await db.insert(productsTable).values(products).onConflictDoNothing().returning();
  console.log(`Inserted ${insertedProducts.length} products`);

  const passwordHash = await bcrypt.hash("goldpalace@admin2024", 10);
  await db.insert(usersTable).values({
    email: "admin@goldpalace.com",
    passwordHash,
    firstName: "Admin",
    lastName: "User",
    isAdmin: true,
  }).onConflictDoNothing();
  console.log("Admin user created");

  await pool.end();
  console.log("Seeding complete!");
}

seed().catch(console.error);
