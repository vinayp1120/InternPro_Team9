# InternPro_Team9
# 📊 EDA Platform

A modern and interactive Exploratory Data Analysis (EDA) platform built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and powerful data libraries like **Plotly.js**, **PapaParse**, **XLSX**, and **Simple Statistics**.

---

## 🚀 Features

- Upload and analyze **CSV**, **XLSX**, or **XLS** datasets
- Automatic **data profiling**, **distributions**, and **correlation heatmaps**
- **Outlier detection** with boxplots
- **Missing value** analysis
- Advanced **Time Series Analysis**
- Built-in **sample datasets** for demo and testing

---

## 🛠️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js) or yarn
- Git (optional, for cloning)

---

## 📥 Installation

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd eda-platform
Install Dependencies

bash
Copy
Edit
npm install
This will install:

React + TypeScript

Vite (build tool)

Tailwind CSS

Plotly.js

XLSX

PapaParse

Simple Statistics

Date-fns

And other dependencies

Start Development Server

bash
Copy
Edit
npm run dev
Example output:

pgsql
Copy
Edit
VITE v5.4.2  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
Open in Browser

Visit: http://localhost:5173
You should see the EDA platform landing page!

🧾 Project Structure
lua
Copy
Edit
eda-platform/
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── UploadPage.tsx
│   │   ├── EDADashboard.tsx
│   │   ├── TimeSeriesAnalysis.tsx
│   │   └── ... (other components)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
📦 Available Scripts
Command	Description
npm run dev	Start development server
npm run build	Build optimized production files
npm run preview	Preview the production build
npm run lint	Run linter to check code quality

🧪 Testing the Platform
Upload Sample or Custom Data

Click "Load Sample Business Data"

Or upload your own .csv, .xlsx, or .xls file

Explore Features

📋 Data Overview (data dictionary & stats)

📊 Distributions (histograms)

🔗 Correlations (heatmaps)

📉 Outliers (box plots)

❓ Missing Data (patterns)

⏱️ Time Series (date-based trends)

Supported File Formats

.xlsx (Excel 2007+)

.xls (Excel 97–2003)

.csv (Comma-separated values)

❗ Troubleshooting
🔌 Port Already in Use
Vite will switch to a new port automatically.

Or specify a port manually:

bash
Copy
Edit
npm run dev -- --port 3000
🧱 Node Version Issues
Ensure you are using Node.js v16 or above:

bash
Copy
Edit
node --version
🧼 Package Installation Errors
Try cleaning the cache and reinstalling:

bash
Copy
Edit
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
🛠 TypeScript Errors
To see compilation issues:

bash
Copy
Edit
npm run build
🌐 Build for Production
When you're ready to deploy:

bash
Copy
Edit
npm run build
This will generate an optimized dist/ folder, which can be hosted with any static file server.

📁 Sample Data
You can test the platform using:

Provided sample business datasets

Your own Excel/CSV datasets containing numeric and categorical columns

📜 License
MIT License
