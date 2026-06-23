/**
 * Qadam seed script
 * -----------------
 * Wipes the *dedicated* `qadam` database and seeds it with:
 *   - 1 customer account (to log in and shop)
 *   - 1 Qadam seller shop (owns the catalogue)
 *   - 10 shoe products across every category, with real Unsplash imagery
 *     and shoe-specific attributes (sizes / gender / material / brand / colors).
 *
 * Safe by construction: it asserts the connected DB is named `qadam` before
 * dropping anything, so it can never touch the shared `test` database.
 *
 * Run from the backend folder:  node seed/qadamSeed.js
 */
require("dotenv").config({ path: "config/.env" });
const mongoose = require("mongoose");

const User = require("../model/user");
const Shop = require("../model/shop");
const Product = require("../model/product");

const img = (id) => ({ url: `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop` });
const avatar = (name, bg = "241A14") => ({
  public_id: `qadam-seed/${name.toLowerCase().replace(/\s+/g, "-")}`,
  url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=F2A93B&size=256&bold=true`,
});

const MEN = ["6", "7", "8", "9", "10", "11"];
const WOMEN = ["3", "4", "5", "6", "7", "8"];
const KIDS = ["10", "11", "12", "13", "1", "2"];

// description helper so every product reads like a real listing
const desc = (kind, extra) =>
  `${kind} Hand-finished and built for everyday wear, ${extra} Each pair is quality-checked before it leaves our workshop. Free delivery on orders over Rs 5,000 and a 7-day easy size exchange.`;

const buildProducts = (shop) => {
  const base = { shopId: shop._id.toString(), shop, brand: "Qadam" };
  return [
    {
      ...base,
      name: "Classic Oxford Formal Shoes",
      category: "Men's Formal",
      tags: "men, formal, leather, office, oxford",
      description: desc("Polished genuine-leather Oxfords for office and occasions.", "with a cushioned insole that keeps you comfortable through long days."),
      originalPrice: 6500, discountPrice: 4999, stock: 40,
      gender: "Men", material: "Genuine Leather", colors: ["Black", "Brown"], sizes: MEN,
      images: [img("1614252369475-531eba835eb1"), img("1449505278894-297fdb3edbc1")],
      ratings: 4.6, sold_out: 32,
    },
    {
      ...base,
      name: "Everyday Casual Loafers",
      category: "Men's Casual",
      tags: "men, casual, loafers, slip-on, daily",
      description: desc("Soft slip-on loafers for relaxed, everyday style.", "with a flexible sole that moves with you."),
      originalPrice: 4500, discountPrice: 3299, stock: 55,
      gender: "Men", material: "Suede", colors: ["Tan", "Grey"], sizes: MEN,
      images: [img("1556906781-9a412961c28c"), img("1460353581641-37baddab0fa2")],
      ratings: 4.4, sold_out: 47,
    },
    {
      ...base,
      name: "Street Runner Sneakers",
      category: "Sneakers",
      tags: "sneakers, casual, unisex, street, comfort",
      description: desc("Lightweight low-top sneakers for the city.", "with breathable mesh and a grippy rubber outsole."),
      originalPrice: 7999, discountPrice: 5999, stock: 60,
      gender: "Unisex", material: "Canvas & Mesh", colors: ["White", "Black"], sizes: MEN,
      images: [img("1549298916-b41d501d3772"), img("1600185365926-3a2ce3cdb9eb")],
      ratings: 4.7, sold_out: 88,
    },
    {
      ...base,
      name: "Summer Comfort Sandals",
      category: "Sandals & Slides",
      tags: "sandals, summer, men, comfort, casual",
      description: desc("Open sandals with adjustable straps for warm days.", "with a contoured footbed for all-day support."),
      originalPrice: 2500, discountPrice: 1799, stock: 70,
      gender: "Men", material: "Faux Leather", colors: ["Brown", "Black"], sizes: MEN,
      images: [img("1514989940723-e8e51635b782"), img("1603487742131-4160ec999306")],
      ratings: 4.3, sold_out: 51,
    },
    {
      ...base,
      name: "Traditional Leather Chappals",
      category: "Chappals",
      tags: "chappal, traditional, men, leather, everyday",
      description: desc("Handcrafted leather chappals in a timeless cut.", "stitched by local artisans for lasting comfort."),
      originalPrice: 1499, discountPrice: 999, stock: 90,
      gender: "Men", material: "Genuine Leather", colors: ["Tan", "Dark Brown"], sizes: MEN,
      images: [img("1531310197839-ccf54634509e"), img("1605812860427-4024433a70fd")],
      ratings: 4.5, sold_out: 120,
    },
    {
      ...base,
      name: "Hand-Stitched Peshawari Khussa",
      category: "Peshawari & Khussa",
      tags: "peshawari, khussa, traditional, handmade, eid",
      description: desc("Classic Peshawari-style khussa with hand stitching.", "perfect for Eid, weddings and festive wear."),
      originalPrice: 3999, discountPrice: 2999, stock: 45,
      gender: "Men", material: "Genuine Leather", colors: ["Mustard", "Maroon"], sizes: MEN,
      images: [img("1542838132-92c53300491e"), img("1449505278894-297fdb3edbc1")],
      ratings: 4.8, sold_out: 64,
    },
    {
      ...base,
      name: "Block Heel Party Shoes",
      category: "Women's Heels",
      tags: "women, heels, party, block heel, formal",
      description: desc("Elegant block heels that stay comfortable.", "with a padded sole and secure ankle fit."),
      originalPrice: 5500, discountPrice: 3999, stock: 38,
      gender: "Women", material: "Faux Suede", colors: ["Nude", "Black"], sizes: WOMEN,
      images: [img("1543163521-1bf539c55dd2"), img("1562183241-b937e95585b6")],
      ratings: 4.4, sold_out: 41,
    },
    {
      ...base,
      name: "Everyday Ballerina Flats",
      category: "Women's Flats",
      tags: "women, flats, ballerina, daily, comfort",
      description: desc("Soft ballerina flats for work and everyday wear.", "with a slip-resistant sole and roomy toe."),
      originalPrice: 3200, discountPrice: 2299, stock: 65,
      gender: "Women", material: "Faux Leather", colors: ["Beige", "Black"], sizes: WOMEN,
      images: [img("1596703263926-eb0762ee17e4"), img("1562183241-b937e95585b6")],
      ratings: 4.2, sold_out: 73,
    },
    {
      ...base,
      name: "Kids Velcro Sneakers",
      category: "Kids",
      tags: "kids, sneakers, velcro, school, comfort",
      description: desc("Easy velcro sneakers that little feet can wear themselves.", "with a soft, flexible sole for play and school."),
      originalPrice: 2800, discountPrice: 1999, stock: 80,
      gender: "Kids", material: "Canvas", colors: ["Blue", "Red"], sizes: KIDS,
      images: [img("1606107557195-0e29a4b5b4aa"), img("1608231387042-66d1773070a5")],
      ratings: 4.6, sold_out: 58,
    },
    {
      ...base,
      name: "Pro Trainer Sports Shoes",
      category: "Sports",
      tags: "sports, running, training, gym, unisex",
      description: desc("Cushioned trainers for running and the gym.", "with shock-absorbing foam and a breathable upper."),
      originalPrice: 8500, discountPrice: 6499, stock: 50,
      gender: "Unisex", material: "Engineered Mesh", colors: ["Black", "Volt"], sizes: MEN,
      images: [img("1542291026-7eec264c27ff"), img("1607522370275-f14206abe5d3")],
      ratings: 4.7, sold_out: 95,
    },
  ];
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const dbName = mongoose.connection.name;
    // ── Safety guard: never wipe anything that isn't the dedicated qadam db ──
    if (dbName !== "qadam") {
      throw new Error(
        `Refusing to seed: connected DB is "${dbName}", expected "qadam". ` +
          `Check MONGO_URL in config/.env.`
      );
    }
    console.log(`Connected to isolated DB "${dbName}". Wiping it for a clean slate...`);
    await mongoose.connection.db.dropDatabase();

    // 1) Customer account
    const customer = await User.create({
      name: "Ahmed Khan",
      email: "customer@qadam.pk",
      password: "qadam123",
      phoneNumber: 3001234567,
      role: "user",
      avatar: avatar("Ahmed Khan"),
      addresses: [
        {
          country: "PK",
          city: "Lahore",
          address1: "12 Mall Road",
          address2: "Gulberg III",
          zipCode: 54000,
          addressType: "Home",
        },
      ],
    });

    // 2) Qadam seller shop (owns the catalogue)
    const shop = await Shop.create({
      name: "Qadam Footwear",
      email: "seller@qadam.pk",
      password: "qadam123",
      description:
        "The Qadam flagship store — chappals, sandals, formal, sneakers, khussa and more for the whole family. Shoes for every step you take.",
      address: "Shoe Market, Anarkali Bazaar, Lahore",
      phoneNumber: 3009876543,
      zipCode: 54000,
      avatar: avatar("Qadam", "F2A93B"),
      availableBalance: 0,
    });

    // 3) Products
    const products = await Product.insertMany(buildProducts(shop));

    console.log("\n✅ Seed complete.");
    console.log(`   DB:        ${dbName}`);
    console.log(`   Products:  ${products.length}`);
    console.log("\n──────── Login credentials ────────");
    console.log("  Customer (storefront /login):");
    console.log("     email:    customer@qadam.pk");
    console.log("     password: qadam123");
    console.log("  Seller (dashboard /shop-login):");
    console.log("     email:    seller@qadam.pk");
    console.log("     password: qadam123");
    console.log("───────────────────────────────────\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();
