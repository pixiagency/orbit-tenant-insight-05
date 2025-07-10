
import * as XLSX from 'xlsx';

// CSV export function
export const exportToCSV = (data: any[], filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export.');
    return;
  }

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return `"${value ? String(value).replace(/"/g, '""') : ''}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Excel export function
export const exportToExcel = (data: any[], filename = 'export.xlsx') => {
  if (!data || data.length === 0) {
    console.warn('No data to export.');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
};

// Enhanced JSON export function
export const exportToJSON = (data: any[], filename = 'export.json') => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting JSON:', error);
    throw error;
  }
};

// Enhanced PDF export function
export const exportToPDF = (data: any[], filename = 'export.pdf', title = 'Export Data') => {
  try {
    // Create a simple HTML table for PDF content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9f9f9; }
          .metadata { color: #666; font-size: 12px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="metadata">
          Generated on: ${new Date().toLocaleString()}<br>
          Total Records: ${data.length}
        </div>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${Object.values(item).map(value => `<td>${String(value || '')}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Create a new window and print to PDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      };
    } else {
      // Fallback: create downloadable HTML file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('.pdf', '.html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

// Updated main export function for packages
export const exportPackages = (packages: any[], format: 'csv' | 'excel' | 'pdf' | 'json') => {
  const filename = `packages-export-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'csv':
      exportToCSV(packages, `${filename}.csv`);
      break;
    case 'excel':
      exportToExcel(packages, `${filename}.xlsx`);
      break;
    case 'json':
      exportToJSON(packages, `${filename}.json`);
      break;
    case 'pdf':
      exportToPDF(packages, `${filename}.pdf`, 'Packages Export');
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Subscriptions export function
export const exportSubscriptions = (subscriptions: any[], format: 'csv' | 'excel' | 'pdf' | 'json') => {
  const filename = `subscriptions-export-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'csv':
      exportToCSV(subscriptions, `${filename}.csv`);
      break;
    case 'excel':
      exportToExcel(subscriptions, `${filename}.xlsx`);
      break;
    case 'json':
      exportToJSON(subscriptions, `${filename}.json`);
      break;
    case 'pdf':
      exportToPDF(subscriptions, `${filename}.pdf`, 'Subscriptions Export');
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

// Users export function
export const exportUsers = (users: any[], format: 'csv' | 'excel' | 'pdf' | 'json') => {
  const filename = `users-export-${new Date().toISOString().split('T')[0]}`;
  
  switch (format) {
    case 'csv':
      exportToCSV(users, `${filename}.csv`);
      break;
    case 'excel':
      exportToExcel(users, `${filename}.xlsx`);
      break;
    case 'json':
      exportToJSON(users, `${filename}.json`);
      break;
    case 'pdf':
      exportToPDF(users, `${filename}.pdf`, 'Users Export');
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};
