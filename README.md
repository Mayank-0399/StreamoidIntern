# 🛍️ Streamoid Intern — Product Upload & Search API

A simple **Node.js + SQLite** API to upload, validate, list, search, and export product data —  
all testable directly from your terminal using **`npm start`** and **`curl`**.

---

##  Getting Started

###  Prerequisites

Make sure you have the following installed:

- Node.js (v18+)
- npm

Also ensure you have a file named **`products.csv`** in your main folder.

---

##  Installation & Launch


# Step 1: Navigate to the project folder
cd StreamoidIntern

# Step 2: Install dependencies
npm install express multer csv-parser sqlite3 json2csv console.table

# Step 3: Start the server
npm start
Server runs at http://localhost:8000
Keep this terminal open — it acts as your Server Log.

💻 Testing APIs Using curl
Open a new terminal window to test your endpoints
(Keep your first terminal running the server).

1️⃣ Upload the CSV File
bash
Copy code
curl -X POST -F "file=@products.csv" http://localhost:8000/upload
✅ Success Output

json
Copy code
{"stored": 20, "failed": []}
❌ Failure Output

json
Copy code
{"stored": 19, "failed": [{"sku": "FAIL-PRICE", "reason": "Price cannot be greater than MRP"}]}
💡 Check the first terminal window — failed rows will appear in a neat table.

2️⃣ List Products with Pagination
bash
Copy code
curl "http://localhost:8000/products?page=2&limit=5"
📦 Example Output

json
Copy code
[
  { "sku": "A101", "name": "T-shirt", "price": 1999 },
  ...
]
3️⃣ Search & Filter Products
bash
Copy code
# Search by brand
curl "http://localhost:8000/products/search?brand=Stream Threads"

# Filter by price range
curl "http://localhost:8000/products/search?minPrice=1500&maxPrice=2500"

# Combine filters
curl "http://localhost:8000/products/search?brand=BloomWear&maxPrice=2200"
4️⃣ Download Filtered Data as CSV
bash
Copy code
curl "http://localhost:8000/products/download?brand=Stream%20Threads" --output "stream_threads_export.csv"
📁 Verify the file:

bash
Copy code
ls
# products.csv  stream_threads_export.csv
🧩 Tech Stack
Package	Purpose
express	Web framework
multer	File uploads
csv-parser	CSV parsing
sqlite3	Lightweight database
json2csv	Export data to CSV
console.table	Pretty tables in terminal

🏁 Example Workflow
bash
Copy code
# 1. Start the server
npm start

# 2. Upload CSV
curl -X POST -F "file=@products.csv" http://localhost:8000/upload

# 3. List products
curl "http://localhost:8000/products"

# 4. Search or filter
curl "http://localhost:8000/products/search?brand=Stream Threads"

# 5. Export filtered data
curl "http://localhost:8000/products/download?brand=Stream%20Threads" --output "stream_threads_export.csv"
🧠 Notes
Fully testable using only terminal commands — no Postman or UI needed.

The server console logs validations and results in tabular format.

