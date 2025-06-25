# GST Reconciliation Tool - Professional Edition

![GST Reconciliation Tool Preview](https://sumitgarg100000.github.io/GSTReconciliation/Image.jpg)

A comprehensive tool for reconciling GST data between GSTR-2B and GSTR-3B/books with advanced matching capabilities.

## Features

- **Secure Login System**: Username/password authentication with subscription management
- **Excel Data Processing**: Upload Excel files containing GSTR-2B and GSTR-3B data
- **Advanced Reconciliation**:
  - Multiple matching criteria (GSTN, Invoice No., Date combinations)
  - Configurable difference tolerance for amounts
  - Detailed vs. simple reconciliation views
- **Data Visualization**:
  - Color-coded results based on match status
  - Comprehensive summary tables
- **Data Export**: Download reconciled results in Excel format
- **User-Friendly Interface**: 
  - Editable tables (for authorized users)
  - Column filtering and sorting
  - Responsive design for all devices

## How to Use

### Step-by-Step Guide

1. **Log in** using your credentials
2. **Download Sample File** to understand the required format
3. **Prepare Your Data**:
   - Enter GSTR-2B data in "GST Portal" sheet
   - Enter GSTR-3B/books data in "Client Data" sheet
4. **Upload File** using the upload interface
5. **Configure Settings**:
   - Set difference allowed (default: 1)
   - Choose detailed or simple reconciliation
   - Enable filters if needed
6. **Reconcile Data** and review results
7. **Download Output** for your records

### Matching Criteria

#### Detailed Reconciliation:
- **Match - GSTN, Invoice No., Date**: Exact match on all three fields
- **Match - GSTN, Invoice No.**: Match on GSTN and invoice number
- **Match - GSTN, Date**: Match on GSTN and date
- **Match - GSTN**: Match only on GSTN
- **Unmatch - GSTN Not Exist**: GSTN not found in other sheet
- **Unmatch - Amt Diff**: Matching GSTN/Invoice but amount differences
- **Unmatch**: Other cases

#### Simple Reconciliation:
- **Match**: Any matching criteria met
- **Unmatch - GSTN Not Exist**
- **Unmatch - Amt Diff**
- **Unmatch**: Other cases

## Technical Details

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript
- **Libraries**: 
  - ExcelJS for Excel file generation
  - SheetJS for Excel file parsing
  - Font Awesome for icons
- **Data Processing**: Client-side JavaScript for all reconciliation logic
- **Storage**: LocalStorage for session persistence

## Free vs. Premium Features

| Feature | Free | Premium |
|---------|------|---------|
| Basic Reconciliation | ✓ | ✓ |
| Detailed Reconciliation | ✗ | ✓ |
| Adjustable Difference Tolerance | ✗ | ✓ |
| Table Filters | ✗ | ✓ |
| Editable Cells | ✗ | ✓ |

## Support

For assistance, contact:
- **Phone**: 9716804520
- **Email**: SumitGarg100000@gmail.com
- **Address**: Rohini, Delhi-110086

## License

This project is proprietary software. Unauthorized distribution or modification is prohibited.

---

Developed by **Sumit Garg** - GST and Financial Reconciliation Specialist
