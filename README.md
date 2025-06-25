# 💻 Sumit Garg - GST Reconciliation Tool Developer

![GST Reconciliation Banner](https://sumitgarg100000.github.io/GSTReconciliation/Image.jpg)

## 🔍 Project Analysis: GST Reconciliation Tool

### 🏗️ Architecture Overview
```javascript
// Core System Components:
1. Login System (Secure authentication)
   - User management with expiry tracking
   - Free service tier with restricted features

2. Data Processing Engine:
   - Excel file parsing (XLSX, ExcelJS)
   - Advanced date normalization
   - Multi-criteria matching algorithm

3. Reconciliation Logic:
   - 7-level matching system
   - Amount difference tolerance
   - Batch processing

4. UI Framework:
   - Responsive Tailwind CSS design
   - Interactive data tables
   - Real-time editing

### 🚀 Key Technical Features
<table>
  <tr>
    <th>Feature</th>
    <th>Implementation</th>
    <th>Tech Used</th>
  </tr>
  <tr>
    <td>Advanced Matching</td>
    <td>7-level criteria with configurable tolerance</td>
    <td>Custom JS algorithms</td>
  </tr>
  <tr>
    <td>Excel Integration</td>
    <td>Full Excel I/O with formatting</td>
    <td>ExcelJS, SheetJS</td>
  </tr>
  <tr>
    <td>Date Handling</td>
    <td>Multi-format date parsing</td>
    <td>date-fns, custom parsers</td>
  </tr>
  <tr>
    <td>Responsive UI</td>
    <td>Mobile-friendly controls</td>
    <td>Tailwind CSS</td>
  </tr>
</table>

### 📊 Code Highlights
```javascript
// Smart Date Parsing (handles 5+ formats)
function parseAndFormatDate(dateInput) {
  // Handles: Excel serial, DD-MMM-YYYY, DD/MM/YY, etc.
  if (typeof dateInput === 'number' && dateInput > 40000) {
    // Excel serial number conversion
    const excelEpoch = new Date(1899, 11, 30);
    return formatDate(new Date(excelEpoch.getTime() + dateInput * 86400 * 1000));
  }
  // Additional format handlers...
}

// 7-Level Matching Algorithm
function findMatch(row, sourceData, compareData, is3b, diffAllowed) {
  // 1. Exact match (GSTN+InvNo+Date)
  // 2. GSTN+InvoiceNo match
  // 3. GSTN+Date match
  // 4. GSTN-only match
  // 5. Unmatched - GSTN missing
  // 6. Amount difference
  // 7. Complete mismatch
  // Each level has custom tolerance logic
}

// Real-time Excel Export
async function generateOutput(reconciled2bData, reconciled3bData) {
  const workbook = new ExcelJS.Workbook();
  // Color-coded worksheets
  const ws1 = workbook.addWorksheet('GST Portal');
  const ws2 = workbook.addWorksheet('Client Data');
  // Automatic formatting based on match status
}
```

## 🌐 Live Projects

### 🧾 GST Reconciliation Tool
[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-Open_Tool-1a73e8?style=for-the-badge)](https://sumitgarg100000.github.io/GSTReconciliation/)

**Features:**
✅ 100% client-side processing  
✅ No data leaves your browser  
✅ Free tier available  
✅ Detailed audit trails  

### 🏡 Personal Homepage
[![Visit Homepage](https://img.shields.io/badge/🏠_Homepage-Visit_Now-ff6b6b?style=for-the-badge)](https://sumitgarg100000.github.io/Home/)

## 🛠 Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white" />
</p>

## 📈 Project Stats

```text
Code Complexity Breakdown:
├── Core Logic: 45% (Matching algorithms)
├── UI Components: 30% (Interactive tables)
├── Excel Integration: 15%
└── Utilities: 10% (Date parsers, etc.)

Performance Metrics:
✔ Load Time: <1.5s
✔ Max Rows Processed: 5,000+
✔ Memory Efficient: <50MB usage
```

## 📬 Contact Me

<p align="center">
  <a href="https://wa.me/9716804520">
    <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  </a>
  <a href="mailto:SumitGarg100000@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" />
  </a>
  <a href="tel:+919716804520">
    <img src="https://img.shields.io/badge/Phone-6A5ACD?style=for-the-badge&logo=phone&logoColor=white" />
  </a>
</p>

<details>
<summary>📜 Click for Technical FAQs</summary>

**Q: How does the matching algorithm work?**  
A: 7-level cascading match system with configurable tolerance for:
- GSTN + Invoice No + Date (exact)
- GSTN + Invoice No
- GSTN + Date
- GSTN only
- Then identifies mismatches

**Q: Is my data secure?**  
A: Absolutely! All processing happens in your browser - no server communication.

**Q: What Excel formats are supported?**  
A: Both .xlsx and .xls formats with automatic date detection.
</details>
```
