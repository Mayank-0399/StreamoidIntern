#  Streamoid Intern — Product Upload & Search API

# A simple Node.js + SQLite API to upload, validate, list, search, and export product data —
# all testable directly from your terminal using `npm start` and `curl`.

# ---------------------------------------------------------------------------
#  Getting Started
# ---------------------------------------------------------------------------

#  Prerequisites

# Install Node.js (v18+) and npm if not already installed
node -v
npm -v

# Make sure you have a file named products.csv in your main folder
ls
# Expected output:
# products.csv

# ---------------------------------------------------------------------------
#  Installation & Launch
# ---------------------------------------------------------------------------

# Step 1: Navigate to the project folder
cd StreamoidIntern

# Step 2: Install dependencies
npm install express multer csv-parser sqlite3 json2csv console.table

# Step 3: Start the server
npm start

# The server will start at:
# http://localhost:8000
#
# Keep this terminal open — it acts as your Server Log.

# ---------------------------------------------------------------------------
#  Testing APIs Using curl
# ---------------------------------------------------------------------------

# Open a new terminal window to run the following commands
# (Keep your first terminal running the server)

# ---------------------------------------------------------------------------
# 1️⃣ Upload the products.csv file to the server
# ---------------------------------------------------------------------------

curl -X POST -F "file=@products.csv" http://localhost:8000/upload

# ✅ Example Success Output:
# {"stored": 20, "failed": []}

# ❌ Example Failure Output:
# {"stored": 19, "failed": [{"sku": "FAIL-PRICE", "reason": "Price cannot be greater than MRP"}]}


# ---------------------------------------------------------------------------
# 2️⃣ List Products with Pagination
# ---------------------------------------------------------------------------

# Fetch products from page 2 with limit 5
curl "http://localhost:8000/products?page=2&limit=5"

# Example Output:
# [ { "sku": "A101", "name": "T-shirt", "price": 1999, ... }, ... ]


# ---------------------------------------------------------------------------
# 3️⃣ Search and Filter Products
# ---------------------------------------------------------------------------

# Search by brand
curl "http://localhost:8000/products/search?brand=Stream Threads"

# Filter by price range
curl "http://localhost:8000/products/search?minPrice=1500&maxPrice=2500"

# Combine filters
curl "http://localhost:8000/products/search?brand=BloomWear&maxPrice=2200"


# ---------------------------------------------------------------------------
# 4️⃣ Download Filtered Data as CSV
# ---------------------------------------------------------------------------

# Export filtered results as CSV file
curl "http://localhost:8000/products/download?brand=Stream%20Threads" --output "stream_threads_export.csv"

# Verify the exported CSV file exists
ls
# Expected output:
# products.csv  stream_threads_export.csv


# ---------------------------------------------------------------------------
#  Frameworks and Libraries Used
# ---------------------------------------------------------------------------

express         # Web framework
multer          # File uploads
csv-parser      # CSV reading
sqlite3         # Lightweight database
json2csv        # Export to CSV
console.table   # Pretty tables in terminal


# ---------------------------------------------------------------------------
# 🏁 Example Workflow
# ---------------------------------------------------------------------------

# 1. Start the server
npm start

# 2. Upload CSV
curl -X POST -F "file=@products.csv" http://localhost:8000/upload

# 3. List all products
curl "http://localhost:8000/products"

# 4. Search or filter
curl "http://localhost:8000/products/search?brand=Stream Threads"

# 5. Export filtered data as CSV
curl "http://localhost:8000/products/download?brand=Stream%20Threads" --output "stream_threads_export.csv"


# ---------------------------------------------------------------------------
# Notes
# ---------------------------------------------------------------------------

# - Everything works directly through terminal commands.
# - No Postman or frontend required.
# - The first terminal acts as your Server Log.
# - Validation errors and product tables appear live in the console.

# ---------------------------------------------------------------------------
#  Author
# MAYANK SINGH ---------------------------------------------------------------------------

# Streamoid Intern Project
# Built using Node.js, SQLite, and terminal-first design.
