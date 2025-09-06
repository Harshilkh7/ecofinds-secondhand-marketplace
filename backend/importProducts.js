// importProducts.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const productsData = require("./products.json");

const sellerNames = [
  "Rahul", "Riya", "Aman", "Neha", "Karan", "Priya",
  "Vikas", "Anjali", "Suresh", "Pooja", "Rohit", "Sneha",
  "Arjun", "Kavya", "Manish", "Divya", "Akash", "Meera",
  "Sanjay", "Isha", "Nitin", "Shreya", "Ankit", "Simran",
  "Harsh", "Tanvi", "Vivek", "Radhika", "Aditya", "Muskan"
];

function getRandomSellerName() {
  return sellerNames[Math.floor(Math.random() * sellerNames.length)];
}

async function main() {
  console.log("🗑 Deleting old data...");

  // ✅ Delete in correct order (respect FK constraints)
  await prisma.orderItem.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Old data cleared.");

  for (const item of productsData) {
    const sellerName = getRandomSellerName();
    const sellerEmail = `${sellerName.toLowerCase()}@gmail.com`;

    let seller = await prisma.user.findUnique({ where: { email: sellerEmail } });

    if (!seller) {
      seller = await prisma.user.create({
        data: {
          username: sellerName,
          email: sellerEmail,
          password: await bcrypt.hash("defaultpassword123", 10),
        },
      });
    }

    await prisma.product.create({
      data: {
        sellerId: seller.id,
        title: item.title,
        description: item.description,
        category: item.category,
        price: item.price,
        images: item.images,
        active: item.active,
      },
    });

    console.log(`✅ Imported product: ${item.title} by ${sellerName}`);
  }

  console.log("🎉 All products imported successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
