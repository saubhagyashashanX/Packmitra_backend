# Database Setup Guide

## MongoDB Connection Issue Fix

If you're getting "not able to fetch" errors, follow these steps:

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster
4. Get your connection string (it will look like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/logisticsagg?retryWrites=true&w=majority
   ```
5. Add it to your `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/logisticsagg?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: MongoDB should start automatically as a service
   - Or run: `mongod` in terminal
3. Add to your `.env` file:
   ```
   MONGO_URI=mongodb://localhost:27017/logisticsagg
   ```

### Setting up .env file

1. Create or edit `.env` file in the `backend` folder
2. Add these variables:
   ```
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

### Verify Connection

After setting up, restart your backend server:
```bash
cd backend
npm start
```

You should see: "✅ MongoDB Connected Successfully"

If you see an error, check:
- MongoDB is running
- Connection string is correct
- Network/firewall allows connection
