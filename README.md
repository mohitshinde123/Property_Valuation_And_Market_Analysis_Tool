# PropVal India - Property Valuation & Market Analysis Platform

A full-stack real estate web application for the Indian market, inspired by 99acres.com. Built with React, Node.js, Express, and MongoDB.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Database Seeding](#database-seeding)
6. [Running the Application](#running-the-application)
7. [User Manual](#user-manual)
8. [API Reference](#api-reference)
9. [User Roles & Permissions](#user-roles--permissions)
10. [Features in Detail](#features-in-detail)
11. [Demo Credentials](#demo-credentials)
12. [Environment Variables](#environment-variables)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

PropVal India is a market-ready property valuation and market analysis tool designed for Indian real estate agencies. It provides:

- **Property Listings** — Browse, search, and filter properties across 8 major Indian cities
- **Smart Valuation Engine** — Algorithm-based property valuation with comparable analysis
- **Market Analysis Dashboard** — Price trends, locality insights, demand-supply charts
- **Multi-Role System** — Separate dashboards for Admin, Agent, Buyer, and Seller
- **EMI Calculator** — Monthly payment calculator with amortization charts
- **Property Comparison** — Side-by-side comparison of up to 4 properties
- **Lead Management** — Inquiry tracking and pipeline management for agents
- **Saved Searches & Properties** — Personalized experience for registered users

### Cities Covered

Mumbai | Delhi NCR | Bangalore | Hyderabad | Chennai | Pune | Kolkata | Ahmedabad

Each city includes 6 real localities with authentic pricing data, infrastructure scores, and 24-month price history.

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, JavaScript      |
| Backend    | Node.js, Express 5                            |
| Database   | MongoDB Atlas (Mongoose ODM)                  |
| Auth       | JWT (JSON Web Tokens), bcryptjs               |
| Charts     | Recharts                                      |
| HTTP       | Axios                                         |
| Upload     | Multer (image uploads)                        |
| UI Icons   | react-icons                                   |
| Toasts     | react-hot-toast                               |

---

## Project Structure

```
project/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Loader
│   │   │   ├── layout/              # Navbar, Footer
│   │   │   └── property/            # PropertyCard
│   │   ├── context/                 # AuthContext (login state)
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero search
│   │   │   ├── PropertySearch.jsx   # Search with filters + pagination
│   │   │   ├── PropertyDetail.jsx   # Full property view + inquiry form
│   │   │   ├── ValuationTool.jsx    # Property value estimator
│   │   │   ├── MarketAnalysis.jsx   # Charts dashboard
│   │   │   ├── EMICalculator.jsx    # Loan EMI calculator
│   │   │   ├── CompareProperties.jsx# Side-by-side comparison
│   │   │   ├── Login.jsx            # Login page with demo buttons
│   │   │   ├── Register.jsx         # Registration page
│   │   │   └── dashboard/
│   │   │       ├── AdminDashboard   # User mgmt, platform stats, leads
│   │   │       ├── AgentDashboard   # Listings, leads, performance
│   │   │       ├── BuyerDashboard   # Saved props, searches, inquiries
│   │   │       └── SellerDashboard  # Listed props, inquiries, stats
│   │   ├── services/api.js          # Axios API layer
│   │   ├── utils/constants.js       # Shared constants & formatters
│   │   ├── App.jsx                  # Router + protected routes
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js               # Vite config with API proxy
│   └── package.json
│
├── server/                          # Backend (Express + MongoDB)
│   ├── config/db.js                 # MongoDB Atlas connection
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification + role guard
│   │   └── upload.js                # Multer image upload config
│   ├── models/
│   │   ├── User.js                  # User schema (4 roles)
│   │   ├── Property.js              # Property listing schema
│   │   ├── LocalityData.js          # Locality stats + price history
│   │   ├── Lead.js                  # Buyer inquiry / lead
│   │   └── SavedSearch.js           # User saved search filters
│   ├── controllers/
│   │   ├── authController.js        # Register, Login, Profile
│   │   ├── propertyController.js    # CRUD + search + filters
│   │   ├── valuationController.js   # Valuation API
│   │   ├── marketController.js      # Trends, city/locality analytics
│   │   ├── leadController.js        # Lead CRUD + pipeline
│   │   └── userController.js        # User mgmt, saved items, stats
│   ├── routes/                      # Express route definitions
│   ├── utils/
│   │   ├── valuationEngine.js       # Weighted valuation algorithm
│   │   └── helpers.js               # Filter builder, formatters
│   ├── seed/seedData.js             # Database seed script
│   ├── uploads/                     # Uploaded images directory
│   ├── server.js                    # Express app entry point
│   ├── .env                         # Environment variables (local)
│   └── package.json
│
└── .gitignore
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free tier works) — or a local MongoDB instance
- **Git** (optional)

### Step 1: Clone / Open the Project

```bash
cd C:\Users\mohit\Desktop\project
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables

Edit `server/.env` with your MongoDB Atlas connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=<your-long-random-secret-key>
JWT_EXPIRE=7d
NODE_ENV=development
```

> **How to get your MongoDB Atlas URI:**
> 1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
> 2. Create a free cluster (or use existing)
> 3. Click **Connect** → **Connect your application**
> 4. Copy the connection string
> 5. Replace `<username>`, `<password>` with your database user credentials
> 6. Make sure your IP is whitelisted in **Network Access** (or use 0.0.0.0/0 for dev)

---

## Database Seeding

The seed script populates the database with sample data for immediate use:

```bash
cd server
npm run seed
```

### What Gets Created

| Data            | Count        | Details                                          |
|-----------------|--------------|--------------------------------------------------|
| Users           | 12           | 1 admin, 3 agents, 5 buyers, 3 sellers           |
| Localities      | 48           | 6 per city across 8 cities, with 24-month trends |
| Properties      | 120-160      | Mixed types, prices, and statuses                |

### Expected Output

```
Connected to MongoDB
Cleared existing data
Created 12 users
Created 48 localities
Created 152 properties

Seed completed successfully!

Login credentials:
Admin:  admin@propval.com  / admin123
Agent:  agent1@propval.com / agent123
Buyer:  buyer1@propval.com / buyer123
Seller: seller1@propval.com / seller123
```

> **Important:** If seeding fails with a connection error, make sure your MongoDB Atlas URI is correct and your IP is whitelisted.

---

## Running the Application

You need **two terminal windows** — one for the backend, one for the frontend.

### Terminal 1: Start Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net
```

### Terminal 2: Start Frontend Dev Server

```bash
cd client
npm run dev
```

Expected output:
```
VITE v8.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Open in Browser

Navigate to **http://localhost:5173** to use the application.

---

## User Manual

### 1. Home Page

The home page is the main entry point with:

- **Hero Search Bar** — Select a city, property type, and listing type (Buy/Rent/Lease), then click Search
- **Market Stats** — Live counts of total properties, cities, localities, and average price
- **Featured Properties** — Top verified properties sorted by popularity
- **Tools Section** — Quick links to Valuation, Market Analysis, and EMI Calculator
- **Explore by City** — Click any city card to see properties in that city

### 2. Property Search

Access via the top navigation **Properties** link or the hero search.

**Using Filters (Left Sidebar):**
- **Search** — Free text search across title, description, locality
- **Listing Type** — Toggle between Buy, Rent, or Lease
- **City** — Select from dropdown (Mumbai, Delhi NCR, Bangalore, etc.)
- **Property Type** — Apartment, Villa, Plot, Commercial, Independent House
- **Bedrooms** — Click 1, 2, 3, 4, or 5 (or Any)
- **Price Range** — Enter minimum and maximum price
- **Furnishing** — Furnished, Semi-Furnished, or Unfurnished
- **Property Age** — New, 1-5 years, 5-10 years, 10+ years
- Click **Apply** to filter, **Clear** to reset

**Sorting:** Use the dropdown (top right) to sort by Newest, Price Low/High, or Area.

**Pagination:** Navigate pages at the bottom of results.

**Comparing:** Click the **Compare** button on any property card. Select 2-4 properties, then click **Compare Now**.

### 3. Property Detail Page

Click **View Details** on any property card to see:

- **Image Gallery** — Property photos (placeholder if none uploaded)
- **Price & Location** — Full price, price per sq.ft, complete address
- **Key Details Grid** — Area, bedrooms, bathrooms, floor, furnishing, parking, facing, age
- **Description** — Full property description
- **Amenities** — List of available amenities (gym, pool, security, etc.)
- **Listed By** — Owner/agent contact info
- **Send Inquiry** — Write a message and submit (requires login)
- **Save Property** — Click the heart icon to save for later
- **Get Valuation** — Link to valuation tool pre-filled with this property's data

### 4. Property Valuation Tool

Access via navigation **Valuation** link.

**How to Use:**
1. Select **City** (required)
2. Enter **Locality** name (for accurate results, use a seeded locality like "Bandra West", "Whitefield", etc.)
3. Choose **Property Type**
4. Enter **Area in sq.ft** (required)
5. Select **Bedrooms**, **Floor**, **Total Floors**
6. Choose **Furnishing** and **Age**
7. Set **Parking** spots
8. Click amenity tags to select **Amenities**
9. Click **Get Valuation**

**Results Include:**
- **Estimated Value** — Calculated market value with low-high range
- **Confidence Score** — How reliable the estimate is (based on available data)
- **Price per sq.ft** — Adjusted rate after all factors
- **Price Adjustments Chart** — Bar chart showing how each factor (floor, age, furnishing, etc.) adjusted the price
- **Locality Insights** — Demand score, supply score, appreciation rating, livability rating
- **Comparable Properties** — Up to 5 similar properties from the same locality

**How the Algorithm Works:**
```
Base Rate (locality avg/sqft)
  × Floor Premium (+2% mid floors, -3% ground/top)
  × Age Depreciation (-5% for 1-5yr, -10% for 5-10yr, -18% for 10+)
  × Furnishing Bonus (+10% furnished, +5% semi)
  × Amenity Score (weighted by amenity type)
  × Parking Bonus (+1.5% per spot)
  × Demand-Supply Adjustment
  × Area
  = Estimated Value (±8% range)
```

### 5. Market Analysis

Access via navigation **Market Analysis** link.

**Dashboard Contains:**
- **Overview Stats** — Total properties, cities, localities, avg price per sqft
- **City Selector** — Click any city pill to view its data
- **Price Trend Chart** (line) — 24-month average price trend for selected city
- **Locality Prices** (horizontal bar) — Price per sqft comparison across localities
- **City Comparison** (bar) — Average prices across all 8 cities
- **Demand vs Supply** (grouped bar) — Demand and supply scores per locality
- **Top Appreciating Localities** — Ranked list of best-performing localities by appreciation rating

### 6. EMI Calculator

Access via navigation **EMI Calculator** link.

**Inputs (all use sliders):**
- **Loan Amount** — Drag from 5 Lakh to 10 Crore
- **Interest Rate** — Drag from 5% to 20%
- **Tenure** — Drag from 1 to 30 years

**Outputs (update in real-time):**
- **Monthly EMI** — Your monthly payment amount
- **Total Payment** — Total amount you'll pay over the loan term
- **Total Interest** — Interest portion of total payment
- **Payment Breakdown** (pie chart) — Visual split of principal vs interest
- **Yearly Amortization** (line chart) — How principal, interest, and balance change each year

### 7. Property Comparison

Access by selecting properties from the search page, or directly at `/compare`.

- Select 2-4 properties using the **Compare** button on property cards
- View a **side-by-side table** comparing: Price, Price/sqft, Area, Type, Bedrooms, Bathrooms, Floor, Furnishing, Age, Parking, Location, Amenities count, Verification status
- Remove properties using the X button on their column

### 8. Registration & Login

**Register:**
1. Click **Register** in the top right
2. Fill in: Name, Email, Phone, Password (min 6 characters)
3. Select your role: Buyer, Seller, or Agent
4. Click **Create Account**
5. You'll be automatically logged in and redirected to your dashboard

**Login:**
1. Click **Login** in the top right
2. Enter email and password
3. Or use the **Demo Credential** buttons to auto-fill test account details
4. Click **Sign In**

### 9. Role-Based Dashboards

After login, click your name → **Dashboard** to access your role-specific dashboard.

#### Admin Dashboard
- **Overview Tab** — Total users, properties, leads, active leads + pie/bar charts
- **Users Tab** — Full user list with ability to change roles or delete users
- **Leads Tab** — All platform inquiries with status, buyer info, and messages

#### Agent Dashboard
- **Stats** — My listings count, active listings, total views, inquiries
- **Overview Tab** — Recent leads + top performing listings
- **Properties Tab** — Table of all your listings with price, status, views, inquiries
- **Leads Tab** — Lead pipeline with status dropdown (New → Contacted → Interested → Negotiating → Closed/Lost)

#### Buyer Dashboard
- **Stats** — Saved properties, saved searches, my inquiries
- **Saved Properties Tab** — Grid of properties you've saved
- **Saved Searches Tab** — List of saved filter combinations with Run Search button
- **My Inquiries Tab** — History of inquiries you've sent with status tracking

#### Seller Dashboard
- **Stats** — My properties, total views, inquiries, portfolio value
- **Overview Tab** — Property performance chart + recent inquiries
- **Properties Tab** — Full table of your listings
- **Inquiries Tab** — All buyer inquiries on your properties

---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication
| Method | Endpoint             | Auth | Description           |
|--------|----------------------|------|-----------------------|
| POST   | /api/auth/register   | No   | Register new user     |
| POST   | /api/auth/login      | No   | Login, returns JWT    |
| GET    | /api/auth/profile    | Yes  | Get current user      |
| PUT    | /api/auth/profile    | Yes  | Update profile        |

### Properties
| Method | Endpoint                 | Auth   | Description                  |
|--------|--------------------------|--------|------------------------------|
| GET    | /api/properties          | No     | Search with filters          |
| GET    | /api/properties/featured | No     | Top 8 verified properties    |
| GET    | /api/properties/cities   | No     | List of all cities           |
| GET    | /api/properties/localities| No    | Localities (optional city)   |
| GET    | /api/properties/my       | Yes    | Current user's properties    |
| GET    | /api/properties/:id      | No     | Single property + view count |
| POST   | /api/properties          | Seller/Agent | Create new listing    |
| PUT    | /api/properties/:id      | Owner  | Update property              |
| DELETE | /api/properties/:id      | Owner/Admin | Delete property         |

**Query Parameters for GET /api/properties:**
`search`, `city`, `locality`, `propertyType`, `listingType`, `priceMin`, `priceMax`, `areaMin`, `areaMax`, `bedrooms`, `furnishing`, `age`, `amenities`, `sort`, `page`, `limit`

### Valuation
| Method | Endpoint          | Auth | Description              |
|--------|-------------------|------|--------------------------|
| POST   | /api/valuation    | No   | Calculate property value |

**Body:** `{ city, locality, propertyType, area, bedrooms, floor, totalFloors, furnishing, age, amenities[], parking }`

### Market Analysis
| Method | Endpoint                              | Auth | Description              |
|--------|---------------------------------------|------|--------------------------|
| GET    | /api/market/overview                  | No   | Platform-wide stats      |
| GET    | /api/market/cities                    | No   | All cities with avg prices|
| GET    | /api/market/top-localities            | No   | Top 10 by appreciation   |
| GET    | /api/market/city/:city                | No   | City trends + localities |
| GET    | /api/market/locality/:city/:locality  | No   | Detailed locality data   |

### Leads
| Method | Endpoint          | Auth       | Description              |
|--------|-------------------|------------|--------------------------|
| POST   | /api/leads        | Yes        | Send property inquiry    |
| GET    | /api/leads/my     | Yes        | My leads (role-based)    |
| PUT    | /api/leads/:id    | Yes        | Update lead status       |
| GET    | /api/leads/all    | Admin only | All platform leads       |

### Users
| Method | Endpoint                        | Auth       | Description              |
|--------|---------------------------------|------------|--------------------------|
| GET    | /api/users                      | Admin      | All users                |
| PUT    | /api/users/:id/role             | Admin      | Change user role         |
| DELETE | /api/users/:id                  | Admin      | Delete user              |
| POST   | /api/users/save-property/:id    | Yes        | Toggle save property     |
| GET    | /api/users/saved-properties     | Yes        | Get saved properties     |
| POST   | /api/users/saved-searches       | Yes        | Save a search            |
| GET    | /api/users/saved-searches       | Yes        | Get saved searches       |
| DELETE | /api/users/saved-searches/:id   | Yes        | Delete saved search      |
| GET    | /api/users/dashboard-stats      | Admin      | Platform statistics      |

---

## User Roles & Permissions

| Feature               | Admin | Agent | Seller | Buyer |
|-----------------------|-------|-------|--------|-------|
| Browse properties     | Yes   | Yes   | Yes    | Yes   |
| Use valuation tool    | Yes   | Yes   | Yes    | Yes   |
| View market analysis  | Yes   | Yes   | Yes    | Yes   |
| Use EMI calculator    | Yes   | Yes   | Yes    | Yes   |
| Compare properties    | Yes   | Yes   | Yes    | Yes   |
| List properties       | Yes   | Yes   | Yes    | No    |
| Send inquiries        | Yes   | Yes   | No     | Yes   |
| Manage leads          | Yes   | Yes   | View   | View  |
| Save properties       | Yes   | Yes   | Yes    | Yes   |
| Manage all users      | Yes   | No    | No     | No    |
| View all leads        | Yes   | No    | No     | No    |
| Delete any property   | Yes   | No    | No     | No    |

---

## Features in Detail

### Valuation Engine

The algorithm uses a weighted multi-factor model:

1. **Base Rate** — Locality average price per sq.ft from LocalityData collection
2. **Floor Premium** — Ground floor (-3%), Low (0%), Mid (+2%), High (+1%), Top (-2%)
3. **Age Depreciation** — New (0%), 1-5 years (-5%), 5-10 years (-10%), 10+ years (-18%)
4. **Furnishing Bonus** — Furnished (+10%), Semi-furnished (+5%), Unfurnished (0%)
5. **Amenity Score** — Each amenity has a specific weight (pool +3%, gym +2%, etc.)
6. **Parking** — +1.5% per parking spot
7. **Demand-Supply** — Adjusted based on locality demand/supply ratio

Final value = Adjusted Rate × Area, with ±8% confidence range.

### Seed Data Coverage

48 real Indian localities with authentic market data:

**Mumbai:** Andheri West, Bandra West, Powai, Worli, Goregaon East, Thane West
**Delhi NCR:** Dwarka, Noida Sector 62, Gurgaon Golf Course Road, Greater Noida, Vasant Kunj, Rohini
**Bangalore:** Whitefield, Koramangala, Electronic City, HSR Layout, Indiranagar, Sarjapur Road
**Hyderabad:** Gachibowli, HITEC City, Banjara Hills, Kondapur, Kukatpally, Madhapur
**Chennai:** OMR, Anna Nagar, T Nagar, Velachery, Adyar, Porur
**Pune:** Hinjewadi, Kharadi, Baner, Wakad, Viman Nagar, Hadapsar
**Kolkata:** Salt Lake, New Town, Rajarhat, EM Bypass, Tollygunge, Howrah
**Ahmedabad:** SG Highway, Prahlad Nagar, Satellite, Bopal, Vastrapur, Chandkheda

---

## Demo Credentials

| Role   | Email                | Password   |
|--------|----------------------|------------|
| Admin  | admin@propval.com    | admin123   |
| Agent  | agent1@propval.com   | agent123   |
| Agent  | agent2@propval.com   | agent123   |
| Agent  | agent3@propval.com   | agent123   |
| Buyer  | buyer1@propval.com   | buyer123   |
| Buyer  | buyer2@propval.com   | buyer123   |
| Seller | seller1@propval.com  | seller123  |
| Seller | seller2@propval.com  | seller123  |

> These accounts are only available after running `npm run seed`.

---

## Environment Variables

### Server (`server/.env`)

| Variable     | Required | Description                          | Example                              |
|-------------|----------|--------------------------------------|--------------------------------------|
| PORT        | No       | Server port (default 5000)           | 5000                                 |
| MONGODB_URI | Yes      | MongoDB Atlas connection string      | mongodb+srv://user:pass@cluster...   |
| JWT_SECRET  | Yes      | Secret key for JWT signing           | any-long-random-string               |
| JWT_EXPIRE  | No       | Token expiration (default 7d)        | 7d                                   |
| NODE_ENV    | No       | Environment mode                     | development                          |

---

## Troubleshooting

### Seed script fails with connection error
- Verify your `MONGODB_URI` in `server/.env`
- Whitelist your IP in MongoDB Atlas → Network Access → Add IP Address
- Try adding `0.0.0.0/0` (allows all IPs) for development

### Server starts but APIs return errors
- Check the terminal running `npm run dev` for error messages
- Ensure MongoDB is connected (look for "MongoDB Connected" in logs)
- Verify the seed script completed successfully

### Frontend shows "Loading..." forever
- Make sure the backend server is running on port 5000
- Check that `vite.config.js` proxy target matches your server address
- Open browser DevTools → Network tab to see failing API calls

### Login fails with "Invalid email or password"
- Run `npm run seed` first to create demo accounts
- Passwords are case-sensitive: `admin123`, `agent123`, `buyer123`, `seller123`

### Properties page shows "No properties found"
- Run `npm run seed` to populate the database
- Try clearing all filters and clicking Apply
- Switch listing type between Buy/Rent

### Valuation returns "No data available for this city"
- Use one of the 8 seeded cities exactly: Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad
- For locality-specific results, use a seeded locality name (see list above)

### Port already in use
- Kill the process: `npx kill-port 5000` or `npx kill-port 5173`
- Or change the port in `.env` (server) or `vite.config.js` (client)

---

## Production Build

```bash
# Build frontend
cd client
npm run build

# The built files are in client/dist/
# The server serves them automatically when NODE_ENV=production

# Start production server
cd ../server
NODE_ENV=production node server.js
```

---

Built with React + Vite + Tailwind CSS + Node.js + Express + MongoDB
