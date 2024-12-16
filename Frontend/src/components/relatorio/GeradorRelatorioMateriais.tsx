import React from 'react';
import { Button, Box } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
  }
  

interface ReportGeneratorProps {
  data: any[];
  fileName: string; 
  columns: string[]; 
}

const GeradorRelatorio: React.FC<ReportGeneratorProps> = ({ data, fileName, columns }) => {

  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`${fileName} - Relatório`, 10, 10);
    doc.setFontSize(12);

    const tableData = data.map((item) => columns.map((col) => item[col] || ''));
    const tableHeaders = columns.map((col) => col.toUpperCase());
    doc.autoTable({ head: [tableHeaders], body: tableData });

    doc.save(`${fileName}.pdf`);
  };

  const generateXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columns });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <Button variant="contained" color="primary" onClick={generatePDF}>
        Baixar PDF
      </Button>
      <Button variant="contained" color="success" onClick={generateXLSX}>
        Baixar XLSX
      </Button>
    </Box>
  );
};

export default GeradorRelatorio;
