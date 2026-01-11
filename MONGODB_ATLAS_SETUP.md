# 🚀 Quick Start Guide - MongoDB Atlas Setup

## Step-by-Step Instructions for Beginners

### Step 1: Create MongoDB Atlas Account (2 minutes)

1. Open your browser and go to: **https://www.mongodb.com/cloud/atlas/register**
2. Click **"Sign Up"**
3. Fill in:
   - Email address
   - Password
   - First name and Last name
4. Click **"Create your Atlas account"**
5. Check your email and verify your account

### Step 2: Create Free Database Cluster (3 minutes)

1. After login, click **"Build a Database"** (big green button)
2. Choose **"M0 FREE"** plan (scroll down if needed)
3. Click **"Create"** at the bottom
4. Select settings:
   - **Provider**: AWS (or any)
   - **Region**: Choose closest to you (e.g., Mumbai for India)
   - **Cluster Name**: Keep default or name it `RestaurantCluster`
5. Click **"Create Cluster"**
6. Wait 1-3 minutes for cluster creation

### Step 3: Create Database User (1 minute)

You'll see a "Security Quickstart" screen:

1. Under **"Authentication Method"**, keep **"Username and Password"**
2. Create credentials:
   - **Username**: `restaurantUser` (or your choice)
   - **Password**: Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Copy the password and save it somewhere!
3. Click **"Create User"**

### Step 4: Allow Network Access (1 minute)

Still on the Security Quickstart screen:

1. Under **"Where would you like to connect from?"**
2. **Option A - For Development (Easy):**

   - Click **"Add IP Address"**
   - Enter IP: `0.0.0.0/0`
   - Description: `Allow from anywhere`
   - Click **"Add Entry"**

   **Option B - More Secure:**

   - Click **"Add My Current IP Address"**
   - It will auto-detect your IP

3. Click **"Finish and Close"**
4. Click **"Go to Database"**

### Step 5: Get Connection String (2 minutes)

1. On your Database page, click **"Connect"** button
2. Choose **"Drivers"**
3. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
4. You'll see a connection string like:
   ```
   mongodb+srv://restaurantUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Copy this string**
6. **IMPORTANT**: Replace `<password>` with your actual password from Step 3
7. **IMPORTANT**: Add `/restaurant_db` before the `?`

**Final connection string should look like:**

```
mongodb+srv://restaurantUser:YourActualPassword@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
```

### Step 6: Configure Your Project

1. Open the `.env` file in the `server` folder
2. Paste your connection string:
   ```env
   MONGODB_URI=mongodb+srv://restaurantUser:YourPassword@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
   JWT_SECRET=my_super_secret_key_12345
   PORT=5000
   ```
3. Save the file

### Step 7: Install Dependencies & Run

Open terminal and run:

```bash
# Navigate to server folder
cd server

# Install backend dependencies
npm install

# Seed the database
npm run seed

# Start the server
npm run dev
```

In a NEW terminal:

```bash
# Navigate to client folder
cd client

# Install frontend dependencies
npm install

# Start the React app
npm run dev
```

### Step 8: Access the Application

Open your browser and go to: **http://localhost:3000**

**Login with:**

- Email: `admin@restaurant.com`
- Password: `Admin@123`

---

## ✅ Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Created database user with password
- [ ] Added IP address (0.0.0.0/0)
- [ ] Got connection string
- [ ] Replaced `<password>` in connection string
- [ ] Added `/restaurant_db` to connection string
- [ ] Pasted connection string in `.env` file
- [ ] Installed backend dependencies (`npm install` in server folder)
- [ ] Installed frontend dependencies (`npm install` in client folder)
- [ ] Seeded database (`npm run seed` in server folder)
- [ ] Started backend server (`npm run dev` in server folder)
- [ ] Started frontend (`npm run dev` in client folder)
- [ ] Opened http://localhost:3000 in browser
- [ ] Logged in successfully

---

## 🆘 Common Issues

### Issue: "MongoServerError: bad auth"

**Solution**: Your password is wrong. Check the `.env` file and make sure you replaced `<password>` with your actual password.

### Issue: "connect ETIMEDOUT"

**Solution**:

1. Check your internet connection
2. Make sure you added `0.0.0.0/0` in Network Access in MongoDB Atlas
3. Wait a few minutes and try again

### Issue: "Cannot find module"

**Solution**: Run `npm install` in both server and client folders

### Issue: "Port 5000 already in use"

**Solution**: Change PORT to 5001 in `.env` file

### Issue: Database not seeded

**Solution**: Make sure `.env` file has correct connection string, then run `npm run seed` again

---

## 📞 Need Help?

If you're stuck:

1. Check the connection string in `.env` file
2. Make sure you replaced `<password>` with actual password
3. Make sure `/restaurant_db` is added before `?`
4. Verify internet connection is working
5. Try the seed command again: `npm run seed`

**Example of CORRECT .env file:**

```env
MONGODB_URI=mongodb+srv://restaurantUser:MyPass123@cluster0.abc123.mongodb.net/restaurant_db?retryWrites=true&w=majority
JWT_SECRET=my_secret_key_12345
PORT=5000
```
