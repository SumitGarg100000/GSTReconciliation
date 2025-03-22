from flask import Flask, request, jsonify, send_file, render_template_string
import pandas as pd
from io import BytesIO
import xlsxwriter
import os

app = Flask(__name__)

# HTML Template with Embedded CSS and JavaScript
html_template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GST Reconciliation Tool</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px; 
            color: #333; 
        }
        h1 { 
            text-align: center; 
            color: #2c3e50; 
            margin-bottom: 20px; 
            font-size: 2.5em; 
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1); 
        }
        .controls { 
            text-align: center; 
            margin-bottom: 30px; 
            background: #fff; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
        }
        .controls input, .controls button { 
            padding: 10px; 
            margin: 5px; 
            border-radius: 5px; 
            border: 1px solid #ddd; 
        }
        .controls button { 
            background: #3498db; 
            color: white; 
            border: none; 
            cursor: pointer; 
            transition: background 0.3s; 
        }
        .controls button:hover { background: #2980b9; }
        .container { 
            display: flex; 
            justify-content: space-around; 
            flex-wrap: wrap; 
            gap: 20px; 
        }
        .section { 
            width: 48%; 
            background: #fff; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            min-width: 300px; 
        }
        .section h2 { 
            color: #2c3e50; 
            margin-bottom: 15px; 
            font-size: 1.5em; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 0.9em; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 10px; 
            text-align: left; 
        }
        th { 
            background: #34495e; 
            color: white; 
        }
        .green { background-color: #2ecc71; color: white; }
        .brown { background-color: #8d5524; color: white; }
        .pink { background-color: #ff6b81; color: white; }
        #result { 
            text-align: center; 
            margin-top: 20px; 
            font-weight: bold; 
        }
        @media (max-width: 768px) { 
            .section { width: 100%; } 
        }
    </style>
</head>
<body>
    <h1>GST Reconciliation Tool</h1>
    <div class="controls">
        <a href="/download_sample"><button>Download Sample Sheet</button></a>
        <form id="uploadForm" enctype="multipart/form-data" style="display:inline;">
            <input type="file" name="file" accept=".xlsx" required>
            <button type="submit">Upload</button>
        </form>
        <br>
        <label for="difference">Allowable Difference (Rs):</label>
        <input type="number" id="difference" name="difference" min="0" required>
        <button onclick="reconcile()">Reconcile</button>
        <div id="result"></div>
    </div>
    <div class="container">
        <div class="section" id="gstr2b">
            <h2>GSTR-2B</h2>
            <table id="gstr2bTable">
                <thead>
                    <tr>
                        <th>GSTN</th>
                        <th>Invoice Number</th>
                        <th>Date</th>
                        <th>Taxable Value</th>
                        <th>IGST</th>
                        <th>CGST</th>
                        <th>SGST</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class="section" id="gstr3b">
            <h2>GSTR-3B</h2>
            <table id="gstr3bTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Particulars</th>
                        <th>Invoice Number</th>
                        <th>GSTN</th>
                        <th>GST Rate</th>
                        <th>Taxable Value</th>
                        <th>IGST</th>
                        <th>CGST</th>
                        <th>SGST</th>
                        <th>Other</th>
                        <th>Invoice Value</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <script>
        let gstr2bData = [];
        let gstr3bData = [];

        document.getElementById('uploadForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }
                gstr2bData = data.gstr2b;
                gstr3bData = data.gstr3b;
                displayData(gstr2bData, 'gstr2bTable');
                displayData(gstr3bData, 'gstr3bTable');
                document.getElementById('result').innerHTML = 'Data uploaded successfully.';
            });
        });

        function displayData(data, tableId) {
            const table = document.getElementById(tableId).getElementsByTagName('tbody')[0];
            table.innerHTML = '';
            data.forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        }

        function reconcile() {
            const difference = parseFloat(document.getElementById('difference').value);
            if (!difference || difference < 0) {
                alert('Please enter a valid allowable difference.');
                return;
            }
            fetch('/reconcile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gstr2b: gstr2bData, gstr3b: gstr3bData, difference: difference })
            })
            .then(response => response.json())
            .then(data => {
                displayData(data.gstr2b, 'gstr2bTable');
                displayData(data.gstr3b, 'gstr3bTable');
                document.getElementById('result').innerHTML = '<a href="/download_result"><button>Download Reconciliation Result</button></a>';
            });
        }
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    return render_template_string(html_template)

@app.route('/download_sample')
def download_sample():
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        gstr2b_headers = ['GSTN', 'Invoice Number', 'Date', 'Taxable Value', 'IGST', 'CGST', 'SGST']
        pd.DataFrame(columns=gstr2b_headers).to_excel(writer, sheet_name='GSTR-2B', index=False)
        
        gstr3b_headers = ['Date', 'Particulars', 'Invoice Number', 'GSTN', 'GST Rate', 'Taxable Value', 
                          'IGST', 'CGST', 'SGST', 'Other', 'Invoice Value']
        pd.DataFrame(columns=gstr3b_headers).to_excel(writer, sheet_name='GSTR-3B', index=False)
    
    output.seek(0)
    return send_file(output, download_name='GST_Sample_Sheet.xlsx', as_attachment=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400
    
    try:
        df = pd.read_excel(file, sheet_name=['GSTR-2B', 'GSTR-3B'])
        gstr2b = df['GSTR-2B'].fillna('').values.tolist()
        gstr3b = df['GSTR-3B'].fillna('').values.tolist()
        return jsonify({'gstr2b': gstr2b, 'gstr3b': gstr3b})
    except Exception as e:
        return jsonify({'error': f'Error reading file: {str(e)}'}), 400

@app.route('/reconcile', methods=['POST'])
def reconcile():
    data = request.get_json()
    gstr2b = pd.DataFrame(data['gstr2b'], columns=['GSTN', 'Invoice Number', 'Date', 'Taxable Value', 'IGST', 'CGST', 'SGST'])
    gstr3b = pd.DataFrame(data['gstr3b'], columns=['Date', 'Particulars', 'Invoice Number', 'GSTN', 'GST Rate', 
                                                   'Taxable Value', 'IGST', 'CGST', 'SGST', 'Other', 'Invoice Value'])
    difference_allowed = data['difference']

    for col in ['Taxable Value', 'IGST', 'CGST', 'SGST']:
        gstr2b[col] = pd.to_numeric(gstr2b[col], errors='coerce').fillna(0)
        gstr3b[col] = pd.to_numeric(gstr3b[col], errors='coerce').fillna(0)

    gstr2b['Color'] = ''
    gstr3b['Color'] = ''

    for i, row2b in gstr2b.iterrows():
        matched = False
        for j, row3b in gstr3b.iterrows():
            if (row2b['GSTN'] == row3b['GSTN'] and 
                row2b['Invoice Number'] == row3b['Invoice Number'] and 
                row2b['Date'] == row3b['Date']):
                if (abs(row2b['Taxable Value'] - row3b['Taxable Value']) <= difference_allowed and
                    abs(row2b['IGST'] - row3b['IGST']) <= difference_allowed and
                    abs(row2b['CGST'] - row3b['CGST']) <= difference_allowed and
                    abs(row2b['SGST'] - row3b['SGST']) <= difference_allowed):
                    gstr2b.at[i, 'Color'] = 'green'
                    gstr3b.at[j, 'Color'] = 'green'
                    matched = True
                    break
        
        if not matched:
            for j, row3b in gstr3b.iterrows():
                if (row2b['GSTN'] == row3b['GSTN'] and 
                    row2b['Invoice Number'] == row3b['Invoice Number']):
                    gstr2b.at[i, 'Color'] = 'pink'
                    gstr3b.at[j, 'Color'] = 'pink'
                    matched = True
                    break
        
        if not matched:
            if row2b['GSTN'] in gstr3b['GSTN'].values:
                gstr2b.at[i, 'Color'] = 'pink'
            else:
                gstr2b.at[i, 'Color'] = 'brown'

    for j, row3b in gstr3b.iterrows():
        if row3b['Color'] == '':
            if row3b['GSTN'] not in gstr2b['GSTN'].values:
                gstr3b.at[j, 'Color'] = 'brown'
            else:
                gstr3b.at[j, 'Color'] = 'pink'

    gstr2b_list = gstr2b.drop(columns=['Color']).values.tolist()
    gstr3b_list = gstr3b.drop(columns=['Color']).values.tolist()

    app.config['reconciled_gstr2b'] = gstr2b
    app.config['reconciled_gstr3b'] = gstr3b

    return jsonify({'gstr2b': gstr2b_list, 'gstr3b': gstr3b_list})

@app.route('/download_result')
def download_result():
    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        workbook = writer.book
        green_format = workbook.add_format({'bg_color': '#2ecc71', 'font_color': '#ffffff'})
        brown_format = workbook.add_format({'bg_color': '#8d5524', 'font_color': '#ffffff'})
        pink_format = workbook.add_format({'bg_color': '#ff6b81', 'font_color': '#ffffff'})

        gstr2b = app.config['reconciled_gstr2b']
        gstr2b.to_excel(writer, sheet_name='GSTR-2B', index=False)
        worksheet = writer.sheets['GSTR-2B']
        for i, row in gstr2b.iterrows():
            format_dict = {'green': green_format, 'brown': brown_format, 'pink': pink_format}
            if row['Color'] in format_dict:
                worksheet.set_row(i + 1, None, format_dict[row['Color']])

        gstr3b = app.config['reconciled_gstr3b']
        gstr3b.to_excel(writer, sheet_name='GSTR-3B', index=False)
        worksheet = writer.sheets['GSTR-3B']
        for i, row in gstr3b.iterrows():
            if row['Color'] in format_dict:
                worksheet.set_row(i + 1, None, format_dict[row['Color']])

    output.seek(0)
    return send_file(output, download_name='GST_Reconciliation_Result.xlsx', as_attachment=True)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
