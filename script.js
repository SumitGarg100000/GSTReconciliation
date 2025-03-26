  
        //   if (window.location.href === "https://sumitgarg100000.github.io/GSTReconciliation/") {
      let gstr2bData = localStorage.getItem('gstr2bData') ? JSON.parse(localStorage.getItem('gstr2bData')) : [];
      let gstr3bData = localStorage.getItem('gstr3bData') ? JSON.parse(localStorage.getItem('gstr3bData')) : [];
      const detailedReconciliationCheckbox = document.getElementById('detailed-reconciliation');

      // Page Load Check
      document.addEventListener("DOMContentLoaded", function() {
        const loggedInUser = localStorage.getItem("loggedInUser");
        if (!loggedInUser || !checkSubscription(loggedInUser)) {
          showLogin();
        } else {
          showTool();
        }
      });

      // Login Function
      function login() {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const error = document.getElementById("error");

        if (users[username] && users[username].password === password) {
          if (checkSubscription(username)) {
            localStorage.setItem("loggedInUser", username);
            showTool();
          } else {
            error.textContent = "Your subscription has expired!";
          }
        } else {
          error.textContent = "Invalid username or password!";
        }
      }

      // Check Subscription Expiry
      function checkSubscription(username) {
        const expiryDate = new Date(users[username].expiry);
        const today = new Date(); // Dynamic date
        return today <= expiryDate;
      }

      // Logout Function
      function logout() {
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("gstr2bData");
        localStorage.removeItem("gstr3bData");
        gstr2bData = [];
        gstr3bData = [];
        showLogin();
      }

      // Show Login Section
      function showLogin() {
        document.getElementById("login-section").classList.remove("hidden");
        document.getElementById("tool-section").classList.add("hidden");
      }

      // Show Tool Section
      function showTool() {
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("tool-section").classList.remove("hidden");
       
     //Store checkbox in local storage
        detailedReconciliationCheckbox.checked = localStorage.getItem('detailedReconciliation') === 'true';


  // Tool ke event listeners
        detailedReconciliationCheckbox.addEventListener('change', function() {
    reconcileData();
    localStorage.setItem('detailedReconciliation', detailedReconciliationCheckbox.checked);
  });
  
  
        document.getElementById('gst-file').addEventListener('change', handleFileUpload);
        document.getElementById('reconcile-btn').addEventListener('click', reconcileData);
        document.getElementById('download-sample').addEventListener('click', generateSampleFile);
        document.getElementById('diff-allowed').addEventListener('input', reconcileData);
        document.getElementById('reset-btn').addEventListener('click', resetData);

        // Restore data from localStorage if exists
        if (gstr2bData.length > 0) {
          displayData(gstr2bData, 'gstr2b-container', gstr2bHeaders(), 'gstr2b');
        }
        if (gstr3bData.length > 0) {
          displayData(gstr3bData, 'gstr3b-container', gstr3bHeaders(), 'gstr3b');
        }
        if (gstr2bData.length > 0 || gstr3bData.length > 0) {
          reconcileData();
        }
      }

      // Reset Data Function
      function resetData() {
        gstr2bData = [];
        gstr3bData = [];
        localStorage.removeItem('gstr2bData');
        localStorage.removeItem('gstr3bData');
        localStorage.setItem('detailedReconciliation', true);
        document.getElementById('gstr2b-container').innerHTML = '';
        document.getElementById('gstr3b-container').innerHTML = '';
        document.getElementById('summary-container').innerHTML = '';
        document.getElementById('output-link').style.display = 'none';
        document.getElementById('gst-file').value = ''; // Clear file input
      }

      function formatDate(excelDate) {
        if (!excelDate) return '';
        const date = new Date((excelDate - 25569) * 86400 * 1000);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = date.toUTCString().slice(8, 11);
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
      }

      const baseGstr2bHeaders = ['Match Criteria', 'GSTN', 'Name of Supplier', 'Invoice Number', 'Invoice type', 'Invoice Date', 'Invoice Value', 'Place of supply', 'Reverse Charge', 'Rate (%)', 'Taxable Value', 'IGST', 'CGST', 'SGST'];
      const extendedGstr2bHeaders = ['Cess', 'GSTR-1/5 Period', 'GSTR-1/5 Filing Date', 'ITC Availability', 'Reason', 'Applicable % of Tax Rate', 'Source', 'IRN', 'IRN Date'];
      function gstr2bHeaders() { return [...baseGstr2bHeaders, ...extendedGstr2bHeaders]; }

      const baseGstr3bHeaders = ['Match Criteria', 'Invoice Date', 'GSTN', 'Name of Supplier', 'Invoice Number', 'Taxable Value', 'IGST', 'CGST', 'SGST'];
      const extendedGstr3bHeaders = ['Invoice Value'];
      function gstr3bHeaders() { return [...baseGstr3bHeaders, ...extendedGstr3bHeaders]; }

      function generateSampleFile(event) {
        event.preventDefault();
        const wb = XLSX.utils.book_new();
        const gstr2bSampleHeaders = gstr2bHeaders();
        const gstr2bSample = [
          gstr2bSampleHeaders,
          ['Match', '27AABCU9603R1ZM', 'Supplier A', 'INV001', 'Regular', '01-Mar-2025', 11800, 'Maharashtra', 'N', 18, 10000, 1800, 0, 0, 0, 'Mar-2025', '15-Mar-2025', 'Yes', 'N/A', 18, 'GSTR-1', 'IRN001', '02-Mar-2025'],
          ['Match', '27AABCU9603R1ZM', 'Supplier A', 'INV002', 'Regular', '01-Mar-2025', 5900, 'Maharashtra', 'N', 18, 5000, 900, 0, 0, 0, 'Mar-2025', '15-Mar-2025', 'Yes', 'N/A', 18, 'GSTR-1', 'IRN002', '02-Mar-2025'],
          ['Match', '27XYZ1234P1ZQ', 'Supplier C', 'INV003', 'Regular', '02-Mar-2025', 23600, 'Karnataka', 'N', 9, 20000, 0, 1800, 1800, 0, 'Mar-2025', '16-Mar-2025', 'No', 'Pending', 9, 'GSTR-5', 'IRN003', '03-Mar-2025']
        ];
        const ws1 = XLSX.utils.aoa_to_sheet(gstr2bSample);
        gstr2bSampleHeaders.forEach((_, index) => {
          const cell = ws1[XLSX.utils.encode_cell({ r: 0, c: index })];
          if (cell) cell.s = { fill: { fgColor: { rgb: 'E0FFFF' } } };
        });
        XLSX.utils.book_append_sheet(wb, ws1, 'GST Portal');

        const gstr3bSampleHeaders = gstr3bHeaders();
        const gstr3bSample = [
          gstr3bSampleHeaders,
          ['Match', '01-Mar-2025', '27AABCU9603R1ZM', 'Supplier A', 'INV001', 15000, 2700, 0, 0, 17700],
          ['Match', '02-Mar-2025', '27AABCU9603R1ZM', 'Supplier A', 'INV004', 6000, 1080, 0, 0, 7080]
        ];
        const ws2 = XLSX.utils.aoa_to_sheet(gstr3bSample);
        gstr3bSampleHeaders.forEach((_, index) => {
          const cell = ws2[XLSX.utils.encode_cell({ r: 0, c: index })];
          if (cell) cell.s = { fill: { fgColor: { rgb: 'E0FFFF' } } };
        });
        XLSX.utils.book_append_sheet(wb, ws2, 'Client Data');

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Sample_GST_Reconciliation.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      function normalizeRow(row, headerLength) {
        const normalized = new Array(headerLength).fill('');
        row.forEach((cell, index) => {
          if (index < headerLength) normalized[index] = cell === undefined || cell === null ? '' : cell;
        });
        return normalized;
      }

      function handleFileUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', dateNF: 'dd-mmm-yyyy' });
          const gstr2bSheet = workbook.Sheets['GST Portal'];
          if (gstr2bSheet) {
            const rawData = XLSX.utils.sheet_to_json(gstr2bSheet, { header: 1, raw: true, defval: '' });
            gstr2bData = rawData.slice(1).map(row => normalizeRow(row, gstr2bHeaders().length));
            localStorage.setItem('gstr2bData', JSON.stringify(gstr2bData));
            displayData(gstr2bData, 'gstr2b-container', gstr2bHeaders(), 'gstr2b');
          }
          const gstr3bSheet = workbook.Sheets['Client Data'];
          if (gstr3bSheet) {
            const rawData = XLSX.utils.sheet_to_json(gstr3bSheet, { header: 1, raw: true, defval: '' });
            gstr3bData = rawData.slice(1).map(row => normalizeRow(row, gstr3bHeaders().length));
            localStorage.setItem('gstr3bData', JSON.stringify(gstr3bData));
            displayData(gstr3bData, 'gstr3b-container', gstr3bHeaders(), 'gstr3b');
          }
          reconcileData();
        };
        reader.readAsArrayBuffer(file);
      }

      function displayData(data, containerId, headers, sheetType) {
        const container = document.getElementById(containerId);
        let html = '<table><thead><tr>';
        headers.forEach(header => html += `<th>${header}</th>`);
        html += '</tr></thead><tbody>';
        data.forEach((row, rowIndex) => {
          html += `<tr data-row="${rowIndex}" data-sheet="${sheetType}">`;
          headers.forEach((_, colIndex) => {
            const cell = row[colIndex];
            const value = typeof cell === 'number' && (cell > 40000 && cell < 50000) ? formatDate(cell) : (cell === undefined || cell === null ? '' : cell);
            const isEditable = colIndex > 0;
            html += `<td contenteditable="${isEditable}" data-col="${colIndex}">${value}</td>`;
          });
          html += '</tr>';
        });
        html += '</tbody></table>';
        container.innerHTML = html;
        const table = container.querySelector('table');
        table.addEventListener('input', handleCellEdit);
      }

      function handleCellEdit(event) {
        const target = event.target;
        if (target.tagName === 'TD' && target.hasAttribute('contenteditable')) {
          const rowIndex = parseInt(target.parentElement.getAttribute('data-row'), 10);
          const colIndex = parseInt(target.getAttribute('data-col'), 10);
          const sheetType = target.parentElement.getAttribute('data-sheet');
          const newValue = target.textContent.trim();
          if (sheetType === 'gstr2b') {
            gstr2bData[rowIndex][colIndex] = newValue;
            localStorage.setItem('gstr2bData', JSON.stringify(gstr2bData));
          } else if (sheetType === 'gstr3b') {
            gstr3bData[rowIndex][colIndex] = newValue;
            localStorage.setItem('gstr3bData', JSON.stringify(gstr3bData));
          }
          reconcileData();
        }
      }

      function reconcileData() {
        const diffInput = document.getElementById('diff-allowed').value;
        const diffAllowed = diffInput === '' ? 0 : Number(diffInput) || 1;
        const gstr2bTable = document.querySelector('#gstr2b-container table tbody');
        const gstr3bTable = document.querySelector('#gstr3b-container table tbody');
        const reconciled2bData = [];
        const reconciled3bData = [];
        gstr2bData.forEach((row, index) => {
          const match = findMatch(row, gstr2bData, gstr3bData, false, diffAllowed);
          const newRow = [match, ...row.slice(1)];
          reconciled2bData.push(newRow);
          if (gstr2bTable && gstr2bTable.rows[index]) updateRow(gstr2bTable.rows[index], newRow);
        });
        gstr3bData.forEach((row, index) => {
          const match = findMatch(row, gstr3bData, gstr2bData, true, diffAllowed);
          const newRow = [match, ...row.slice(1)];
          reconciled3bData.push(newRow);
          if (gstr3bTable && gstr3bTable.rows[index]) updateRow(gstr3bTable.rows[index], newRow);
        });
        displaySummary(reconciled2bData, reconciled3bData);
        generateOutput(reconciled2bData, reconciled3bData);
      }

      function updateRow(rowElement, newRow) {
        const match = newRow[0];
        Array.from(rowElement.cells).forEach((cell, index) => {
          cell.textContent = newRow[index];
        });
        colorRow(rowElement, match);
      }

      function findMatch(row, sourceData, compareData, is3b, diffAllowed) {
        const sourceHeaders = is3b ? gstr3bHeaders() : gstr2bHeaders();
        const compareHeaders = is3b ? gstr2bHeaders() : gstr3bHeaders();
        const invDateIdx = sourceHeaders.indexOf('Invoice Date');
        const gstnIdx = sourceHeaders.indexOf('GSTN');
        const invNumIdx = sourceHeaders.indexOf('Invoice Number');
        const compareGstnIdx = compareHeaders.indexOf('GSTN');
        const invDate = String(row[invDateIdx]).toLowerCase();
        const gstn = String(row[gstnIdx]).toLowerCase();
        const invNum = String(row[invNumIdx]).toLowerCase();

        if (detailedReconciliationCheckbox.checked) {
          const sourceTotals = calculateTotals(sourceData, invDate, gstn, invNum, is3b);
          const compareTotals = calculateTotals(compareData, invDate, gstn, invNum, !is3b);
          if (sourceTotals.count > 0 && compareTotals.count > 0) {
            if (checkTotals(sourceTotals, compareTotals, diffAllowed)) {
              return 'Match - GSTN, Invoice No., Date';
            }
          }
          const invTotals = calculateTotalsByInv(sourceData, gstn, invNum, is3b);
          const compareInvTotals = calculateTotalsByInv(compareData, gstn, invNum, !is3b);
          if (invTotals.count > 0 && compareInvTotals.count > 0) {
            if (checkTotals(invTotals, compareInvTotals, diffAllowed)) {
              return 'Match - GSTN, Invoice No.';
            }
          }
          const gstnDateTotals = calculateTotalsByGstnDate(sourceData, invDate, gstn, is3b);
          const compareGstnDateTotals = calculateTotalsByGstnDate(compareData, invDate, gstn, !is3b);
          if (gstnDateTotals.count > 0 && compareGstnDateTotals.count > 0) {
            if (checkTotals(gstnDateTotals, compareGstnDateTotals, diffAllowed)) {
              return 'Match - GSTN, Date';
            }
          }
          const gstnTotals = calculateTotalsByGstn(sourceData, gstn, is3b);
          const compareGstnTotals = calculateTotalsByGstn(compareData, gstn, !is3b);
          if (gstnTotals.count > 0 && compareGstnTotals.count > 0) {
            if (checkTotals(gstnTotals, compareGstnTotals, diffAllowed)) {
              return 'Match - GSTN';
            }
          }
          const gstnExistsInCompare = compareData.some(r => String(r[compareGstnIdx]).toLowerCase() === gstn);
          if (!gstnExistsInCompare) {
            return 'Unmatch - GSTN Not Exist';
          }
          return 'Unmatch';
        } else {
          const sourceTotals = calculateTotals(sourceData, invDate, gstn, invNum, is3b);
          const compareTotals = calculateTotals(compareData, invDate, gstn, invNum, !is3b);
          if (sourceTotals.count > 0 && compareTotals.count > 0) {
            if (checkTotals(sourceTotals, compareTotals, diffAllowed)) {
              return 'Match';
            }
          }
          const invTotals = calculateTotalsByInv(sourceData, gstn, invNum, is3b);
          const compareInvTotals = calculateTotalsByInv(compareData, gstn, invNum, !is3b);
          if (invTotals.count > 0 && compareInvTotals.count > 0) {
            if (checkTotals(invTotals, compareInvTotals, diffAllowed)) {
              return 'Match';
            }
          }
          const gstnDateTotals = calculateTotalsByGstnDate(sourceData, invDate, gstn, is3b);
          const compareGstnDateTotals = calculateTotalsByGstnDate(compareData, invDate, gstn, !is3b);
          if (gstnDateTotals.count > 0 && compareGstnDateTotals.count > 0) {
            if (checkTotals(gstnDateTotals, compareGstnDateTotals, diffAllowed)) {
              return 'Match';
            }
          }
          const gstnTotals = calculateTotalsByGstn(sourceData, gstn, is3b);
          const compareGstnTotals = calculateTotalsByGstn(compareData, gstn, !is3b);
          if (gstnTotals.count > 0 && compareGstnTotals.count > 0) {
            if (checkTotals(gstnTotals, compareGstnTotals, diffAllowed)) {
              return 'Match';
            }
          }
          const gstnExistsInCompare = compareData.some(r => String(r[compareGstnIdx]).toLowerCase() === gstn);
          if (!gstnExistsInCompare) {
            return 'Unmatch - GSTN Not Exist';
          }
          return 'Unmatch';
        }
      }

      function calculateTotals(data, invDate, gstn, invNum, is3b) {
        const headers = is3b ? gstr3bHeaders() : gstr2bHeaders();
        const invDateIdx = headers.indexOf('Invoice Date');
        const gstnIdx = headers.indexOf('GSTN');
        const invNumIdx = headers.indexOf('Invoice Number');
        const taxableIdx = headers.indexOf('Taxable Value');
        const igstIdx = headers.indexOf('IGST');
        const cgstIdx = headers.indexOf('CGST');
        const sgstIdx = headers.indexOf('SGST');
        let count = 0, taxable = 0, igst = 0, cgst = 0, sgst = 0;
        data.forEach(row => {
          if (String(row[invDateIdx]).toLowerCase() === invDate && 
              String(row[gstnIdx]).toLowerCase() === gstn && 
              String(row[invNumIdx]).toLowerCase() === invNum) {
            count++;
            taxable += Number(row[taxableIdx]) || 0;
            igst += Number(row[igstIdx]) || 0;
            cgst += Number(row[cgstIdx]) || 0;
            sgst += Number(row[sgstIdx]) || 0;
          }
        });
        return { count, taxable, igst, cgst, sgst };
      }

      function calculateTotalsByInv(data, gstn, invNum, is3b) {
        const headers = is3b ? gstr3bHeaders() : gstr2bHeaders();
        const gstnIdx = headers.indexOf('GSTN');
        const invNumIdx = headers.indexOf('Invoice Number');
        const taxableIdx = headers.indexOf('Taxable Value');
        const igstIdx = headers.indexOf('IGST');
        const cgstIdx = headers.indexOf('CGST');
        const sgstIdx = headers.indexOf('SGST');
        let count = 0, taxable = 0, igst = 0, cgst = 0, sgst = 0;
        data.forEach(row => {
          if (String(row[gstnIdx]).toLowerCase() === gstn && 
              String(row[invNumIdx]).toLowerCase() === invNum) {
            count++;
            taxable += Number(row[taxableIdx]) || 0;
            igst += Number(row[igstIdx]) || 0;
            cgst += Number(row[cgstIdx]) || 0;
            sgst += Number(row[sgstIdx]) || 0;
          }
        });
        return { count, taxable, igst, cgst, sgst };
      }

      function calculateTotalsByGstnDate(data, invDate, gstn, is3b) {
        const headers = is3b ? gstr3bHeaders() : gstr2bHeaders();
        const invDateIdx = headers.indexOf('Invoice Date');
        const gstnIdx = headers.indexOf('GSTN');
        const taxableIdx = headers.indexOf('Taxable Value');
        const igstIdx = headers.indexOf('IGST');
        const cgstIdx = headers.indexOf('CGST');
        const sgstIdx = headers.indexOf('SGST');
        let count = 0, taxable = 0, igst = 0, cgst = 0, sgst = 0;
        data.forEach(row => {
          if (String(row[invDateIdx]).toLowerCase() === invDate && 
              String(row[gstnIdx]).toLowerCase() === gstn) {
            count++;
            taxable += Number(row[taxableIdx]) || 0;
            igst += Number(row[igstIdx]) || 0;
            cgst += Number(row[cgstIdx]) || 0;
            sgst += Number(row[sgstIdx]) || 0;
          }
        });
        return { count, taxable, igst, cgst, sgst };
      }

      function calculateTotalsByGstn(data, gstn, is3b) {
        const headers = is3b ? gstr3bHeaders() : gstr2bHeaders();
        const gstnIdx = headers.indexOf('GSTN');
        const taxableIdx = headers.indexOf('Taxable Value');
        const igstIdx = headers.indexOf('IGST');
        const cgstIdx = headers.indexOf('CGST');
        const sgstIdx = headers.indexOf('SGST');
        let count = 0, taxable = 0, igst = 0, cgst = 0, sgst = 0;
        data.forEach(row => {
          if (String(row[gstnIdx]).toLowerCase() === gstn) {
            count++;
            taxable += Number(row[taxableIdx]) || 0;
            igst += Number(row[igstIdx]) || 0;
            cgst += Number(row[cgstIdx]) || 0;
            sgst += Number(row[sgstIdx]) || 0;
          }
        });
        return { count, taxable, igst, cgst, sgst };
      }

      function checkTotals(source, compare, diffAllowed) {
        return Math.abs(source.taxable - compare.taxable) <= diffAllowed &&
               Math.abs(source.igst - compare.igst) <= diffAllowed &&
               Math.abs(source.cgst - compare.cgst) <= diffAllowed &&
               Math.abs(source.sgst - compare.sgst) <= diffAllowed;
      }

      function colorRow(rowElement, match) {
        rowElement.className = '';
        if (detailedReconciliationCheckbox.checked) {
          switch (match) {
            case 'Match - GSTN, Invoice No., Date': rowElement.classList.add('match-gstn-inv-date'); break;
            case 'Match - GSTN, Invoice No.': rowElement.classList.add('match-inv'); break;
            case 'Match - GSTN, Date': rowElement.classList.add('match-gstn-date'); break;
            case 'Match - GSTN': rowElement.classList.add('match-gstn'); break;
            case 'Unmatch - GSTN Not Exist': rowElement.classList.add('gstn-not-match'); break;
            default: rowElement.classList.add('no-match'); break;
          }
        } else {
          switch (match) {
            case 'Match': rowElement.classList.add('match'); break;
            case 'Unmatch - GSTN Not Exist': rowElement.classList.add('gstn-not-match'); break;
            default: rowElement.classList.add('no-match'); break;
          }
        }
      }

      function calculateSummary(data, is3b) {
        const headers = is3b ? gstr3bHeaders() : gstr2bHeaders();
        const taxableIdx = headers.indexOf('Taxable Value');
        const igstIdx = headers.indexOf('IGST');
        const cgstIdx = headers.indexOf('CGST');
        const sgstIdx = headers.indexOf('SGST');
        const criteria = detailedReconciliationCheckbox.checked ?
          ['Match - GSTN, Invoice No., Date', 'Match - GSTN, Invoice No.', 'Match - GSTN, Date', 'Match - GSTN', 'Unmatch - GSTN Not Exist', 'Unmatch'] :
          ['Match', 'Unmatch - GSTN Not Exist', 'Unmatch'];
        const summary = {};
        criteria.forEach(criterion => {
          summary[criterion] = { taxable: 0, igst: 0, cgst: 0, sgst: 0 };
        });
        data.forEach(row => {
          let match = row[0];
          if (!detailedReconciliationCheckbox.checked && 
              ['Match - GSTN, Invoice No., Date', 'Match - GSTN, Invoice No.', 'Match - GSTN, Date', 'Match - GSTN'].includes(match)) {
            match = 'Match';
          }
          summary[match].taxable += Number(row[taxableIdx]) || 0;
          summary[match].igst += Number(row[igstIdx]) || 0;
          summary[match].cgst += Number(row[cgstIdx]) || 0;
          summary[match].sgst += Number(row[sgstIdx]) || 0;
        });
        const total = { taxable: 0, igst: 0, cgst: 0, sgst: 0 };
        criteria.forEach(criterion => {
          total.taxable += summary[criterion].taxable;
          total.igst += summary[criterion].igst;
          total.cgst += summary[criterion].cgst;
          total.sgst += summary[criterion].sgst;
        });
        return { summary, total };
      }

      function displaySummary(reconciled2bData, reconciled3bData) {
        const gstr2bSummary = calculateSummary(reconciled2bData, false);
        const gstr3bSummary = calculateSummary(reconciled3bData, true);
        const container = document.getElementById('summary-container');
        let html = '<table><thead><tr>';
        html += '<th rowspan="2">Particulars</th>';
        html += '<th colspan="4">GST Portal</th>';
        html += '<th colspan="4">Client Data</th>';
        html += '</tr><tr>';
        ['Taxable Value', 'IGST', 'CGST', 'SGST'].forEach(header => {
          html += `<th>${header}</th>`;
        });
        ['Taxable Value', 'IGST', 'CGST', 'SGST'].forEach(header => {
          html += `<th>${header}</th>`;
        });
        html += '</tr></thead><tbody>';
        const criteria = detailedReconciliationCheckbox.checked ?
          ['Match - GSTN, Invoice No., Date', 'Match - GSTN, Invoice No.', 'Match - GSTN, Date', 'Match - GSTN', 'Unmatch - GSTN Not Exist', 'Unmatch'] :
          ['Match', 'Unmatch - GSTN Not Exist', 'Unmatch'];
        criteria.forEach(criterion => {
          html += '<tr>';
          html += `<td>${criterion}</td>`;
          html += `<td>${gstr2bSummary.summary[criterion].taxable.toFixed(2)}</td>`;
          html += `<td>${gstr2bSummary.summary[criterion].igst.toFixed(2)}</td>`;
          html += `<td>${gstr2bSummary.summary[criterion].cgst.toFixed(2)}</td>`;
          html += `<td>${gstr2bSummary.summary[criterion].sgst.toFixed(2)}</td>`;
          html += `<td>${gstr3bSummary.summary[criterion].taxable.toFixed(2)}</td>`;
          html += `<td>${gstr3bSummary.summary[criterion].igst.toFixed(2)}</td>`;
          html += `<td>${gstr3bSummary.summary[criterion].cgst.toFixed(2)}</td>`;
          html += `<td>${gstr3bSummary.summary[criterion].sgst.toFixed(2)}</td>`;
          html += '</tr>';
        });
        html += '<tr>';
        html += '<td><strong>Total</strong></td>';
        html += `<td><strong>${gstr2bSummary.total.taxable.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr2bSummary.total.igst.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr2bSummary.total.cgst.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr2bSummary.total.sgst.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr3bSummary.total.taxable.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr3bSummary.total.igst.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr3bSummary.total.cgst.toFixed(2)}</strong></td>`;
        html += `<td><strong>${gstr3bSummary.total.sgst.toFixed(2)}</strong></td>`;
        html += '</tr>';
        html += '</tbody></table>';
        container.innerHTML = html;
      }

      async function generateOutput(reconciled2bData, reconciled3bData) {
        const workbook = new ExcelJS.Workbook();
        const ws1 = workbook.addWorksheet('GST Portal');
        const headerRow1 = ws1.addRow(gstr2bHeaders());
        headerRow1.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0FFFF' } };
        });
        reconciled2bData.forEach(row => {
          const excelRow = row.map(cell => cell === undefined || cell === null ? '' : cell);
          const addedRow = ws1.addRow(excelRow);
          applyExcelRowColor(addedRow, row[0], gstr2bHeaders().length);
        });
        const ws2 = workbook.addWorksheet('Client Data');
        const headerRow2 = ws2.addRow(gstr3bHeaders());
        headerRow2.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0FFFF' } };
        });
        reconciled3bData.forEach(row => {
          const excelRow = row.map(cell => cell === undefined || cell === null ? '' : cell);
          const addedRow = ws2.addRow(excelRow);
          applyExcelRowColor(addedRow, row[0], gstr3bHeaders().length);
        });
        const ws3 = workbook.addWorksheet('Summary');
        const summaryHeader1 = ws3.addRow(['Particulars', 'GST Portal', '', '', '', 'Client Data', '', '', '']);
        const summaryHeader2 = ws3.addRow(['', 'Taxable Value', 'IGST', 'CGST', 'SGST', 'Taxable Value', 'IGST', 'CGST', 'SGST']);
        ws3.mergeCells('A1:A2');
        ws3.mergeCells('B1:E1');
        ws3.mergeCells('F1:I1');
        [summaryHeader1, summaryHeader2].forEach(row => {
          row.eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0FFFF' } };
          });
        });
        const gstr2bSummary = calculateSummary(reconciled2bData, false);
        const gstr3bSummary = calculateSummary(reconciled3bData, true);
        const criteria = detailedReconciliationCheckbox.checked ?
          ['Match - GSTN, Invoice No., Date', 'Match - GSTN, Invoice No.', 'Match - GSTN, Date', 'Match - GSTN', 'Unmatch - GSTN Not Exist', 'Unmatch'] :
          ['Match', 'Unmatch - GSTN Not Exist', 'Unmatch'];
        criteria.forEach(criterion => {
          ws3.addRow([
            criterion,
            gstr2bSummary.summary[criterion].taxable,
            gstr2bSummary.summary[criterion].igst,
            gstr2bSummary.summary[criterion].cgst,
            gstr2bSummary.summary[criterion].sgst,
            gstr3bSummary.summary[criterion].taxable,
            gstr3bSummary.summary[criterion].igst,
            gstr3bSummary.summary[criterion].cgst,
            gstr3bSummary.summary[criterion].sgst
          ]);
        });
       
        const totalRow = ws3.addRow([
          'Total',
          gstr2bSummary.total.taxable,
          gstr2bSummary.total.igst,
          gstr2bSummary.total.cgst,
          gstr2bSummary.total.sgst,
          gstr3bSummary.total.taxable,
          gstr3bSummary.total.igst,
          gstr3bSummary.total.cgst,
          gstr3bSummary.total.sgst
        ]);
        totalRow.eachCell(cell => { cell.font = { bold: true }; });
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.getElementById('download-output');
        link.href = url;
        link.download = 'Reconciled_GST_Data.xlsx';
        document.getElementById('output-link').style.display = 'block';
      }

      function applyExcelRowColor(row, match, columnCount) {
        const colors = detailedReconciliationCheckbox.checked ? {
          'Match - GSTN, Invoice No., Date': 'FF00CED1',
          'Match - GSTN, Invoice No.': 'FF4B0082',
          'Match - GSTN, Date': 'FF32CD32',
          'Match - GSTN': 'FFFFBF00',
          'Unmatch - GSTN Not Exist': 'FFDC143C',
          'Unmatch': 'FFFF00FF'
        } : {
          'Match': 'FF00CED1',
          'Unmatch - GSTN Not Exist': 'FFDC143C',
          'Unmatch': 'FFFF00FF'
        };
        const color = colors[match] || 'FFFF00FF';
        for (let i = 1; i <= columnCount; i++) {
          const cell = row.getCell(i);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
          };
          if ((detailedReconciliationCheckbox.checked && 
              ['Match - GSTN, Invoice No., Date', 'Match - GSTN, Invoice No.', 'Match - GSTN, Date', 'Match - GSTN', 'Unmatch - GSTN Not Exist', 'Unmatch'].includes(match)) ||
              (!detailedReconciliationCheckbox.checked && 
              ['Match', 'Unmatch - GSTN Not Exist', 'Unmatch'].includes(match))) {
            cell.font = { color: { argb: 'FFFFFFFF' } };
          }
        }
      }

//      }   else      {       alert("Don't waste your time for copying. This file is fully secured by Sumit Garg. If any query, Contact - Sumit Garg, Ph. No. - 9716804520, Email - SumitGarg100000@Gmail.com ");     }
      
  
