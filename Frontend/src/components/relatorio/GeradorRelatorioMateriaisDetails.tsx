import React from 'react';
import { Button, Box } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Material, Processo } from '../enfermeiro/MaterialTab';

interface MaterialReportGeneratorProps {
  material: Material | null;
  processos: Processo[];
  fileName: string;
}

const GeradorRelatorioMateriaisDetails: React.FC<MaterialReportGeneratorProps> = ({ material, processos, fileName }) => {

  const generatePDF = () => {
    if (!material) return;

    const doc = new jsPDF();

    // Add material details to the PDF
    doc.setFontSize(16);
    doc.text(`${fileName} - Relatório`, 10, 10);

    doc.setFontSize(12);
    doc.text(`Nome: ${material.nome}`, 10, 20);
    doc.text(`Tipo: ${material.tipo}`, 10, 30);
    doc.text(`Serial: ${material.serial}`, 10, 40);
    doc.text(`Data de Validade: ${material.data_validade}`, 10, 50);
    doc.text(`Status: ${material.status}`, 10, 60);

    // Add processos table
    if (processos.length > 0) {
      const tableHeaders = ["ID", "Nome do Material", "Data Início", "Status", "Etapa Atual"];
      const tableData = processos.map((processo) => [
        processo.id,
        processo.material.nome,
        new Date(processo.data_inicio).toLocaleString(),
        processo.status,
        processo.etapa_atual ? processo.etapa_atual.tipo : 'Nenhuma',
      ]);

      doc.autoTable({ startY: 70, head: [tableHeaders], body: tableData });
    } else {
      doc.text('Nenhum processo registrado.', 10, 70);
    }

    doc.save(`${fileName}.pdf`);
  };

  const generateXLSX = () => {
    if (!material) return;

    // Create data for the XLSX
    const materialDetails = [
      { "Propriedade": "Nome", "Valor": material.nome },
      { "Propriedade": "Tipo", "Valor": material.tipo },
      { "Propriedade": "Serial", "Valor": material.serial },
      { "Propriedade": "Data de Validade", "Valor": material.data_validade },
      { "Propriedade": "Status", "Valor": material.status },
    ];

    const processosData = processos.map((processo) => ({
      "ID": processo.id,
      "Nome do Material": processo.material.nome,
      "Data Início": new Date(processo.data_inicio).toLocaleString(),
      "Status": processo.status,
      "Etapa Atual": processo.etapa_atual ? processo.etapa_atual.tipo : 'Nenhuma',
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    const materialSheet = XLSX.utils.json_to_sheet(materialDetails);
    const processosSheet = XLSX.utils.json_to_sheet(processosData);

    XLSX.utils.book_append_sheet(workbook, materialSheet, 'Detalhes do Material');
    XLSX.utils.book_append_sheet(workbook, processosSheet, 'Processos');

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

export default GeradorRelatorioMateriaisDetails;
