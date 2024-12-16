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
  columns: {
    header: string; // Título da coluna
    key: string;    // Caminho no objeto (suporta propriedades aninhadas)
  }[];
}

const GeradorRelatorioProcessos: React.FC<ReportGeneratorProps> = ({ data, fileName, columns }) => {
  const parseNestedProperty = (item: any, key: string) => {
    return key.split('.').reduce((value, part) => value?.[part], item) || '';
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`${fileName} - Relatório`, 10, 10);
    doc.setFontSize(12);

    const tableHeaders = columns.map((col) => col.header);
    const tableData = data.map((item) =>
      columns.map((col) => parseNestedProperty(item, col.key))
    );

    doc.autoTable({ head: [tableHeaders], body: tableData });
    doc.save(`${fileName}.pdf`);
  };

  const generateXLSX = () => {
    const formattedData = data.map((item) =>
      columns.reduce((row, col) => {
        row[col.header] = parseNestedProperty(item, col.key);
        return row;
      }, {} as Record<string, any>)
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
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

export default GeradorRelatorioProcessos;
