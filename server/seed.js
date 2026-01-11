require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Category = require("./models/Category");
const FoodItem = require("./models/FoodItem");
const Coupon = require("./models/Coupon");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Category.deleteMany({});
    await FoodItem.deleteMany({});
    await Coupon.deleteMany({});
    console.log("Cleared existing data");

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
    const admin = await User.create({
      name: "Admin User",
      email: "admin@restaurant.com",
      mobile: "9999999999",
      password: hashedAdminPassword,
      role: "admin",
    });
    console.log("Admin user created");

    // Create 10 customer users
    const customerUsers = [
      {
        name: "John Doe",
        email: "john@gmail.com",
        mobile: "9876543210",
        password: "john123",
      },
      {
        name: "Ravi Kumar",
        email: "ravi@xyz.com",
        mobile: "9876543211",
        password: "ravi123",
      },
      {
        name: "Priya Sharma",
        email: "priya@gmail.com",
        mobile: "9876543212",
        password: "priya123",
      },
      {
        name: "Amit Patel",
        email: "amit@gmail.com",
        mobile: "9876543213",
        password: "amit123",
      },
      {
        name: "Sneha Singh",
        email: "sneha@gmail.com",
        mobile: "9876543214",
        password: "sneha123",
      },
      {
        name: "Rajesh Verma",
        email: "rajesh@yahoo.com",
        mobile: "9876543215",
        password: "rajesh123",
      },
      {
        name: "Anjali Reddy",
        email: "anjali@gmail.com",
        mobile: "9876543216",
        password: "anjali123",
      },
      {
        name: "Vikram Malhotra",
        email: "vikram@outlook.com",
        mobile: "9876543217",
        password: "vikram123",
      },
      {
        name: "Neha Gupta",
        email: "neha@gmail.com",
        mobile: "9876543218",
        password: "neha123",
      },
      {
        name: "Arjun Mehta",
        email: "arjun@gmail.com",
        mobile: "9876543219",
        password: "arjun123",
      },
    ];

    for (const userData of customerUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: hashedPassword,
        role: "customer",
      });
    }
    console.log("Customer users created");

    const categories = await Category.insertMany([
      {
        name: "Breakfast",
        description: "Start your day with delicious South Indian breakfast",
        imageUrl:
          "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400",
      },
      {
        name: "Starters",
        description: "Appetizing starters to begin your meal",
        imageUrl:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
      },
      {
        name: "Main Course",
        description: "Rich and flavorful main course dishes",
        imageUrl:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400",
      },
      {
        name: "Breads",
        description: "Freshly baked Indian breads",
        imageUrl:
          "https://images.unsplash.com/photo-1619086303291-0ef7699e4b31?w=400",
      },
      {
        name: "Rice & Biryani",
        description: "Aromatic rice dishes and biryanis",
        imageUrl:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
      },
      {
        name: "Desserts",
        description: "Sweet treats to end your meal",
        imageUrl:
          "https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=400",
      },
      {
        name: "Beverages",
        description: "Refreshing non-alcoholic drinks",
        imageUrl:
          "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400",
      },
      {
        name: "Alcoholic Drinks",
        description: "Premium alcoholic beverages (18+ only)",
        imageUrl:
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
      },
    ]);
    console.log("Categories created");

    const foodItems = [
      {
        name: "Masala Dosa",
        description: "Crispy rice crepe filled with spiced potato filling",
        price: 80,
        categoryId: categories[0]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400",
        isAvailable: true,
      },
      {
        name: "Idli",
        description: "Steamed rice cakes served with sambar and chutney",
        price: 60,
        categoryId: categories[0]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400",
        isAvailable: true,
      },
      {
        name: "Puri",
        description:
          "Deep-fried, puffed bread served with a spiced potato curry.",
        price: 50,
        categoryId: categories[0]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1605719161691-5d9771fc144f?w=400",
        isAvailable: true,
      },
      {
        name: "Vada",
        description: "Savory semolina porridge with vegetables",
        price: 55,
        categoryId: categories[0]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1730191843435-073792ba22bc?w=400",
        isAvailable: true,
      },
      {
        name: "Paneer Tikka",
        description: "Grilled cottage cheese marinated in spices",
        price: 180,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1701579231320-cc2f7acad3cd?w=400",
        isAvailable: true,
      },
      {
        name: "Samosa",
        description: "Crispy pastry filled with spiced potatoes and peas",
        price: 40,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
        isAvailable: true,
      },
      {
        name: "Pav Bhaji",
        description:
          "Buttery, spiced vegetable mash served with toasted bread rolls",
        price: 90,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400",
        isAvailable: true,
      },
      {
        name: "Sandwich",
        description:
          "A sandwich is a handheld food made with fillings like vegetables",
        price: 70,
        categoryId: categories[1]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
        isAvailable: true,
      },
      {
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato and butter gravy",
        price: 280,
        categoryId: categories[2]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
        isAvailable: true,
      },
      {
        name: "Paneer Butter Masala",
        description: "Cottage cheese cubes in creamy tomato gravy",
        price: 220,
        categoryId: categories[2]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
        isAvailable: true,
      },
      {
        name: "Dal",
        description: "Toor Dal lentils cooked in butter and cream",
        price: 180,
        categoryId: categories[2]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1626500155537-93690c24099e?w=400",
        isAvailable: true,
      },
      {
        name: "Chole Bhature",
        description: "Spicy chickpeas with fried bread",
        price: 150,
        categoryId: categories[2]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1717587052948-fb9825de50f8?w=400",
        isAvailable: true,
      },
      {
        name: "Palak Paneer",
        description: "Cottage cheese in spinach gravy",
        price: 200,
        categoryId: categories[2]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400",
        isAvailable: true,
      },
      {
        name: "Butter Naan",
        description: "Leavened flatbread brushed with butter",
        price: 40,
        categoryId: categories[3]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1683533761804-5fc12be0f684?w=400",
        isAvailable: true,
      },
      {
        name: "Garlic Naan",
        description: "Naan topped with garlic and cilantro",
        price: 50,
        categoryId: categories[3]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1683533743190-89c9b19f9ea6?w=400",
        isAvailable: true,
      },
      {
        name: "Tandoori Roti",
        description: "Whole wheat bread baked in tandoor",
        price: 25,
        categoryId: categories[3]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1599232288126-7dbd2127db14?w=400",
        isAvailable: true,
      },
      {
        name: "Laccha Paratha",
        description: "Flaky layered whole wheat flatbread",
        price: 45,
        categoryId: categories[3]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1668357530437-72a12c660f94?w=400",
        isAvailable: true,
      },
      {
        name: "Veg Biryani",
        description: "Aromatic basmati rice with mixed vegetables",
        price: 200,
        categoryId: categories[4]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
        isAvailable: true,
      },
      {
        name: "Chicken Biryani",
        description: "Fragrant rice layered with spiced chicken",
        price: 280,
        categoryId: categories[4]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1719239885399-f87d992e0f18?w=400",
        isAvailable: true,
      },
      {
        name: "Jeera Rice",
        description: "Basmati rice tempered with cumin",
        price: 120,
        categoryId: categories[4]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400",
        isAvailable: true,
      },
      {
        name: "Veg Pulao",
        description: "Mildly spiced rice with vegetables",
        price: 150,
        categoryId: categories[4]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400",
        isAvailable: true,
      },
      {
        name: "Gulab Jamun",
        description: "Deep fried milk dumplings in sugar syrup",
        price: 60,
        categoryId: categories[5]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1681476747916-8a8fc7e2001e?w=400",
        isAvailable: true,
      },
      {
        name: "Kulfi",
        description: "Traditional Indian ice cream",
        price: 70,
        categoryId: categories[5]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1633933037611-f26e54366832?w=400",
        isAvailable: true,
      },
      {
        name: "Ladoo",
        description: "Sweet round balls made from flour and sugar",
        price: 80,
        categoryId: categories[5]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1695568181747-f54dff1d4654?w=400",
        isAvailable: true,
      },
      {
        name: "Gajar Halwa",
        description: "Carrot pudding with nuts and ghee",
        price: 90,
        categoryId: categories[5]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=400",
        isAvailable: true,
      },
      {
        name: "Masala Chai",
        description: "Traditional Indian spiced tea",
        price: 30,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1619581073186-5b4ae1b0caad?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "Fresh Lime Soda",
        description: "Refreshing lime soda with sweet or salty option",
        price: 40,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "Mango Lassi",
        description: "Creamy yogurt drink with mango",
        price: 80,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "Cold Coffee",
        description: "Chilled coffee with ice cream",
        price: 90,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1645592241237-3b05af6c194f?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 70,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "7 Up",
        description: "Carbonated lemon-lime flavored soft drink",
        price: 35,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1738569594383-d7d6516eb42f?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "Coca-Cola",
        description: "Classic carbonated soft drink",
        price: 35,
        categoryId: categories[6]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400",
        isAvailable: true,
        isAlcoholic: false,
      },
      {
        name: "Kingfisher Beer",
        description: "Premium Indian lager Beer",
        price: 180,
        categoryId: categories[7]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1552317579-fb701baef383?w=400",
        isAvailable: true,
        isAlcoholic: true,
      },
      {
        name: "Red Wine",
        description: "Premium red wine (750ml)",
        price: 1200,
        categoryId: categories[7]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400",
        isAvailable: true,
        isAlcoholic: true,
      },
      {
        name: "Black Label Scotch",
        description: "Aged scotch whiskey",
        price: 1500,
        categoryId: categories[7]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1592620352607-53100d32f9fb?w=400",
        isAvailable: true,
        isAlcoholic: true,
      },
      {
        name: "Vodka",
        description: "Premium vodka",
        price: 1000,
        categoryId: categories[7]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1613255347968-aa2aaa353976?w=400",
        isAvailable: true,
        isAlcoholic: true,
      },
      {
        name: "Mojito Cocktail",
        description: "Classic mojito with rum, mint and lime",
        price: 280,
        categoryId: categories[7]._id,
        imageUrl:
          "https://images.unsplash.com/photo-1632995561645-86a7777d3e7a?w=400",
        isAvailable: true,
        isAlcoholic: true,
      },
    ];

    await FoodItem.insertMany(foodItems);
    console.log("Food items created");

    const coupons = await Coupon.insertMany([
      {
        code: "WELCOME10",
        discountPercent: 10,
        minOrderAmount: 500,
        description: "Get 10% off on orders above ₹500",
        isActive: true,
      },
      {
        code: "HELLO15",
        discountPercent: 15,
        minOrderAmount: 1000,
        description: "Get 15% off on orders above ₹1000",
        isActive: true,
      },
      {
        code: "SAVE20",
        discountPercent: 20,
        minOrderAmount: 1500,
        description: "Get 20% off on orders above ₹1500",
        isActive: true,
      },
      {
        code: "VIP25",
        discountPercent: 25,
        minOrderAmount: 2000,
        description: "Get 25% off on orders above ₹2000",
        isActive: true,
      },
    ]);
    console.log("Coupons created");

    console.log("\n========================================");
    console.log("Database seeded successfully!");
    console.log("========================================");
    console.log("Admin Credentials:");
    console.log("Email: admin@restaurant.com");
    console.log("Password: Admin@123");
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
