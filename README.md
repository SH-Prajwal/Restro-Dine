# 🍽️ Indian Restaurant Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing a restaurant with separate customer and admin interfaces.

## ✨ Features

### Customer Features

- **Authentication**: Login/Signup with email or mobile number
- **Browse Menu**: View food items organized by categories (Breakfast, Starters, Main Course, Breads, Rice & Biryani, Desserts)
- **Cart Management**: Add items to cart, update quantities, remove items
- **Checkout**: View itemized bill with GST calculation
- **Order History**: View all past orders with details

### Admin Features

- **Menu Management**: Add new food categories and items
- **Category Management**: Create and delete categories
- **Item Management**: Add, view, and delete food items
- **Availability Control**: Mark items as available or unavailable

## 🛠️ Tech Stack

**Frontend:**

- React 18
- React Router DOM (routing)
- Tailwind CSS (styling)
- Axios (API calls)
- React Icons
- React Toastify (notifications)
- Vite (build tool)

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- Bcrypt.js (password hashing)
- CORS
- Validator

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MongoDB Atlas Account** (Free) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)
- **Render.com Account** (Free) - [Sign up here](https://render.com)
- **GitHub Account** - [Sign up here](https://github.com)

## 🚀 Deployment on Render.com

This guide will walk you through deploying your restaurant management system to Render.com (completely free!).

### Step 1: Setup MongoDB Atlas (Free Cloud Database)

#### 1.1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (no credit card required)
3. Verify your email

#### 1.2: Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier (totally free forever)
3. Select a cloud provider (AWS, Google Cloud, or Azure) - any is fine
4. Choose a region closest to you (e.g., Mumbai for India, Oregon for US)
5. Name your cluster (or keep default) and click **"Create"**
6. Wait 1-3 minutes for cluster creation

#### 1.3: Create Database User

1. You'll see **"Security Quickstart"**
2. Under **"How would you like to authenticate your connection?"**
   - Choose **"Username and Password"**
   - Create a username (e.g., `restaurantUser`)
   - Create a password (e.g., `Restaurant123`) - **Remember this!**
   - Click **"Create User"**

#### 1.4: Add IP Address Whitelist

1. Under **"Where would you like to connect from?"**
   - Click **"Add IP Address"**
   - Enter `0.0.0.0/0` (Allow from anywhere - required for Render)
   - Description: "Allow All"
   - Click **"Add Entry"**
2. Click **"Finish and Close"**

#### 1.5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Drivers"**
3. Select **"Node.js"** and version **"4.1 or later"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://restaurantUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace** `<password>` with your actual password
6. **Add** the database name before the `?`. Example:
   ```
   mongodb+srv://restaurantUser:Restaurant123@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
   ```
7. **Save this connection string** - you'll need it for Render!

### Step 2: Seed Your MongoDB Database (One-time setup)

Before deploying, you need to populate your database with initial data (categories, food items, admin account).

**Seed Locally:**

1. **Navigate to your project:**

   ```bash
   cd server
   ```

2. **Create a `.env` file in the server folder:**

   ```bash
   notepad .env
   ```

3. **Add your MongoDB connection string:**

   ```env
   MONGODB_URI=mongodb+srv://restaurantUser:Restaurant123@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   PORT=5000
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Run the seed script:**

   ```bash
   npm run seed
   ```

   You should see:

   ```
   Connected to MongoDB
   Cleared existing data
   Admin user created
   Customer users created
   Categories created
   Food items created
   Coupons created
   ========================================
   Database seeded successfully!
   ========================================
   Admin Credentials:
   Email: admin@restaurant.com
   Password: Admin@123
   ========================================
   ```

**Default Admin Credentials:**

- Email: `admin@restaurant.com`
- Password: `Admin@123`

### Step 3: Deploy to Render.com

#### 3.1: Create Render Account

1. Go to [Render.com](https://render.com)
2. Sign up using GitHub, GitLab, or email
3. Verify your email

#### 3.2: Push Code to GitHub (if not already done)

1. Create a new repository on [GitHub](https://github.com/new)
2. Initialize git in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Restaurant Management System"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

#### 3.3: Deploy Backend Service

1. **Log into Render Dashboard**
2. Click **"New +"** → **"Web Service"**
3. **Connect your GitHub repository**
4. **Configure Backend Service:**

   - **Name**: `restaurant-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Select **Free**

5. **Add Environment Variables:**
   Click **"Advanced"** → **"Add Environment Variable"**

   Add these variables:

   - **MONGODB_URI**: Your MongoDB Atlas connection string from Step 1.5
   - **JWT_SECRET**: Any long random string (e.g., `my_super_secret_jwt_key_12345`)
   - **PORT**: `5000`
   - **NODE_ENV**: `production`

6. Click **"Create Web Service"**

7. **Wait for deployment** (3-5 minutes). You'll see logs in real-time.

8. **Copy your backend URL** (looks like: `https://restaurant-backend-xxxx.onrender.com`)

#### 3.4: Deploy Frontend Service

1. **Go back to Render Dashboard**
2. Click **"New +"** → **"Static Site"**
3. **Connect your GitHub repository** (same repo)
4. **Configure Frontend Service:**

   - **Name**: `restaurant-frontend` (or any name you prefer)
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Add Environment Variable:**
   Click **"Advanced"** → **"Add Environment Variable"**

   - **VITE_API_URL**: Your backend URL from step 3.3 (e.g., `https://restaurant-backend-xxxx.onrender.com/api`)

6. Click **"Create Static Site"**

7. **Wait for deployment** (2-4 minutes)

8. **Your app is live!** Click the URL provided (e.g., `https://restaurant-frontend-xxxx.onrender.com`)

### Step 4: Test Your Deployment

1. **Visit your frontend URL** (from step 3.4)
2. **Try logging in with admin credentials:**
   - Email: `admin@restaurant.com`
   - Password: `Admin@123`
3. **Test customer signup and ordering**

## 🔧 Local Development Setup (Optional)

If you want to run the app locally for development:

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Configure Environment Variables

Create `.env` file in the `server` folder:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

### 4. Run Backend

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`

### 5. Run Frontend

```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📖 Usage Guide

### For Customers

1. **Sign Up / Login**

   - Click "Sign Up" to create a new account
   - Choose either Email or Mobile number registration
   - Enter your credentials and password (minimum 6 characters)

2. **Browse Menu**

   - View food items organized by categories
   - Click on category tabs to filter items

3. **Add to Cart**

   - Click "Add" button on any food item
   - Adjust quantities in cart

4. **Checkout**

   - Review your order items
   - View bill with GST calculation
   - Click "Place Order" to confirm

5. **Order History**
   - Click "Orders" in navbar
   - View all past orders with details

### For Admin

1. **Login**

   - Email: `admin@restaurant.com`
   - Password: `Admin@123`

2. **Add New Category**

   - Fill in category name and description
   - Add image URL
   - Click "Add Category"

3. **Add Food Item**

   - Enter item details
   - Select category
   - Set availability
   - Click "Add Item"

4. **Manage Items**
   - View all categories and items
   - Delete items or categories using trash icon

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Menu (Public)

- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get all food items
- `GET /api/menu/items/category/:categoryId` - Get items by category

### Menu (Admin Only)

- `POST /api/menu/category` - Create category
- `POST /api/menu/item` - Create food item
- `DELETE /api/menu/item/:id` - Delete food item
- `DELETE /api/menu/category/:id` - Delete category

### Orders (Customer)

- `POST /api/orders/create` - Create new order
- `GET /api/orders/my-orders` - Get user's orders

## 🎨 Default Menu Categories

The seeded database includes:

1. **Breakfast** - Masala Dosa, Idli, Puri, Vada
2. **Starters** - Paneer Tikka, Samosa, Pav Bhaji, Sandwich
3. **Main Course** - Butter Chicken, Paneer Butter Masala, Dal, Chole Bhature, Palak Paneer
4. **Breads** - Butter Naan, Garlic Naan, Tandoori Roti, Laccha Paratha
5. **Rice & Biryani** - Veg Biryani, Chicken Biryani, Jeera Rice, Veg Pulao
6. **Desserts** - Gulab Jamun, Kulfi, Ladoo, Gajar Halwa
7. **Beverages** - Masala Chai, Fresh Lime Soda, Mango Lassi, Cold Coffee, Fresh Orange Juice
8. **Alcoholic Drinks** - Kingfisher Beer, Red Wine, Black Label Scotch, Vodka, Mojito Cocktail

## 🐛 Troubleshooting

### Render Deployment Issues

**Backend not starting:**

- Check environment variables are set correctly
- Verify MongoDB connection string has correct password
- Check Render logs for specific errors

**Frontend can't connect to backend:**

- Ensure `VITE_API_URL` environment variable is set correctly in frontend
- Verify backend service is running
- Check CORS settings in backend

**Free tier limitations:**

- Render free tier services spin down after 15 minutes of inactivity
- First request after idle period may take 30-60 seconds (cold start)

### MongoDB Connection Error

- Double-check your connection string
- Make sure you replaced `<password>` with your actual password
- Verify IP address `0.0.0.0/0` is whitelisted in Atlas
- Ensure you added `/restaurant_db` before the `?` in connection string

## 📂 Project Structure

```
SI/
├── server/                 # Backend
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── FoodItem.js
│   │   ├── Order.js
│   │   └── Coupon.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── menu.js
│   │   ├── orders.js
│   │   └── coupons.js
│   ├── middleware/        # Auth middleware
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── server.js         # Express server
│   ├── seed.js           # Database seeder
│   └── package.json
│
├── client/                # Frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── context/      # Context providers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml           # Render deployment config
└── README.md
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes for authenticated users
- Role-based access control (Admin vs Customer)
- Token expiration (7 days)
- Input validation

## 📱 Multi-User Support

- Multiple concurrent customer accounts
- Separate sessions on different devices
- Isolated cart and order history per customer

## 🎓 Learning Outcomes

This project demonstrates:

- Full-stack development with MERN
- RESTful API design
- JWT authentication
- Role-based access control
- State management in React
- Responsive UI with Tailwind CSS
- Database design and relationships
- Cloud deployment with Render.com

---

**Enjoy using the Restaurant Management System! 🍽️**

For any issues, check the troubleshooting section or review Render deployment logs.
