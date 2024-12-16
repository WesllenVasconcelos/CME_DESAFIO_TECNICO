import React from 'react';
import { Button, Box } from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Material } from '../enfermeiro/MaterialTab';

interface ProcessReportGeneratorProps {
  material: Material | null;
  etapas: any[];
  falhas: any[];
  fileName: string;
}

const GeradorRelatorioProcessoDetail: React.FC<ProcessReportGeneratorProps> = ({
  material,
  etapas,
  falhas,
  fileName,
}) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    let currentY = 10; // Posição inicial para o título

    // Título
    doc.setFontSize(16);
    doc.text('Relatório de Processo', 10, currentY);
    currentY += 10; // Ajuste após o título

    // Informações do Material
    doc.setFontSize(12);
    doc.text(`Material: ${material?.nome || 'N/A'}`, 10, currentY);
    currentY += 10;
    doc.text(`Tipo: ${material?.tipo || 'N/A'}`, 10, currentY);
    currentY += 10;
    doc.text(`Status do Material: ${material?.status || 'N/A'}`, 10, currentY);
    currentY += 20; // Ajuste após as informações do material

    // Gerar Tabela de Etapas
    if (etapas.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Tipo', 'Data Início', 'Data Conclusão', 'Técnico Responsável']],
        body: etapas.map((etapa: any) => [
          etapa.tipo,
          new Date(etapa.data_inicio).toLocaleString('pt-BR'),
          etapa.data_conclusao
            ? new Date(etapa.data_conclusao).toLocaleString('pt-BR')
            : 'Em andamento',
          etapa.tecnico_responsavel.username,
        ]),
      });

      // Calcular altura da tabela de etapas (baseada em número de linhas)
      const linhaAltura = 10; // Altura aproximada de uma linha na tabela
      const cabecalhoAltura = 10; // Altura do cabeçalho
      const tabelaAltura = cabecalhoAltura + etapas.length * linhaAltura;
      currentY += tabelaAltura + 10; // Espaço adicional
    } else {
      doc.text('Nenhuma etapa registrada.', 10, currentY);
      currentY += 10;
    }

    // Gerar Tabela de Falhas
    if (falhas.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [['Tipo de Falha', 'Descrição', 'Data', 'Etapa', 'Responsável']],
        body: falhas.map((falha: any) => [
          falha.tipo_falha,
          falha.descricao,
          new Date(falha.data_falha).toLocaleString('pt-BR'),
          falha.etapa_tipo,
          falha.responsavel.username,
        ]),
      });

      // Calcular altura da tabela de falhas (baseada em número de linhas)
      const linhaAltura = 10;
      const cabecalhoAltura = 10;
      const tabelaAltura = cabecalhoAltura + falhas.length * linhaAltura;
      currentY += tabelaAltura + 10; // Espaço adicional
    } else {
      doc.text('Nenhuma falha relatada.', 10, currentY);
      currentY += 10;
    }

    // Salvar PDF
    doc.save(`${fileName}.pdf`);
  };

  const generateXLSX = () => {
    const data = [
      {
        Seção: 'Material',
        Nome: material?.nome || 'N/A',
        Tipo: material?.tipo || 'N/A',
        Status: material?.status || 'N/A',
      },
      ...etapas.map((etapa: any) => ({
        Seção: 'Etapas',
        Tipo: etapa.tipo,
        'Data Início': new Date(etapa.data_inicio).toLocaleString('pt-BR'),
        'Data Conclusão': etapa.data_conclusao
          ? new Date(etapa.data_conclusao).toLocaleString('pt-BR')
          : 'Em andamento',
        'Técnico Responsável': etapa.tecnico_responsavel.username,
      })),
      ...falhas.map((falha: any) => ({
        Seção: 'Falhas',
        'Tipo de Falha': falha.tipo_falha,
        Descrição: falha.descricao,
        Data: new Date(falha.data_falha).toLocaleString('pt-BR'),
        Etapa: falha.etapa_tipo,
        Responsável: falha.responsavel.username,
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
      <Button variant="contained" color="primary"  onClick={generatePDF}>
        Baixar PDF
      </Button>
      <Button variant="contained" color="success" onClick={generateXLSX}>
        Baixar XLSX
      </Button>
    </Box>
  );
};

export default GeradorRelatorioProcessoDetail;
