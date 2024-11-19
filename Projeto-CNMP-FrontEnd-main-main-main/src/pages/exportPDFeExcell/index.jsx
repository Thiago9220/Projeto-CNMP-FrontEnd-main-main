import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportarSelecionadosParaPDF = (selectedIndicators, indicadores, toast) => {
  if (selectedIndicators.length === 0) {
    toast({
      title: 'Nenhum indicador selecionado',
      description: 'Por favor, selecione pelo menos um indicador para exportar.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  const doc = new jsPDF();

  // Obter os dados dos indicadores selecionados
  const dados = indicadores.filter((item) => selectedIndicators.includes(item.codigo));

  dados.forEach((item, index) => {
    if (index > 0) {
      doc.addPage();
    }

    doc.setFontSize(12);
    doc.text(`Código do Indicador: ${item.codigo}`, 10, 10);

    autoTable(doc, {
      startY: 20,
      body: [
        ['Nome do Indicador', item.nomeIndicador],
        ['Objetivo Estratégico Associado', item.objetivoEstrategico],
        ['Perspectiva Estratégica', item.perspectivaEstrategica],
        ['Descrição do Objetivo Estratégico', item.descricaoObjetivoEstrategico || ''],
        ['Descrição do Indicador', item.descricaoIndicador || ''],
        ['Finalidade do Indicador', item.finalidadeIndicador || ''],
        ['Dimensão do Desempenho', item.dimensaoDesempenho || ''],
        ['Fórmula', item.formula || ''],
        ['Fonte/Forma de Coleta dos Dados', item.fonteFormaColeta || ''],
        ['Peso do Indicador', item.pesoIndicador || ''],
        ['Interpretação do Indicador/Recomendações', item.interpretacaoIndicador || ''],
        ['Área Responsável', item.area || ''],
        ['Meta', item.meta || ''],
        ['Tipos de Acumulação', item.tiposAcumulacao || ''],
        ['Polaridade', item.polaridade || ''],
        ['Periodicidade de Coleta', item.periodicidadeColeta || ''],
        ['Frequência da Meta', item.frequenciaMeta || ''],
        ['Unidade de Medida', item.unidadeMedida || '']
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      bodyStyles: { textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });
  });

  doc.save('indicadores_selecionados.pdf');
};

export const exportarSelecionadosParaExcel = (selectedIndicators, indicadores, toast) => {
  if (selectedIndicators.length === 0) {
    toast({
      title: 'Nenhum indicador selecionado',
      description: 'Por favor, selecione pelo menos um indicador para exportar.',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  const dados = indicadores
    .filter((item) => selectedIndicators.includes(item.codigo))
    .map((item) => ({
      'Código do Indicador': item.codigo,
      'Nome do Indicador': item.nomeIndicador,
      'Objetivo Estratégico Associado': item.objetivoEstrategico,
      'Perspectiva Estratégica': item.perspectivaEstrategica,
      'Descrição do Objetivo Estratégico': item.descricaoObjetivoEstrategico,
      'Descrição do Indicador': item.descricaoIndicador,
      'Finalidade do Indicador': item.finalidadeIndicador,
      'Dimensão do Desempenho': item.dimensaoDesempenho,
      'Fórmula': item.formula,
      'Fonte/Forma de Coleta dos Dados': item.fonteFormaColeta,
      'Peso do Indicador': item.pesoIndicador,
      'Interpretação do Indicador/Recomendações': item.interpretacaoIndicador,
      'Área Responsável': item.area,
      'Meta': item.meta,
      'Tipos de Acumulação': item.tiposAcumulacao,
      'Polaridade': item.polaridade,
      'Periodicidade de Coleta': item.periodicidadeColeta,
      'Frequência da Meta': item.frequenciaMeta,
      'Unidade de Medida': item.unidadeMedida,
    }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Indicadores Selecionados');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'indicadores_selecionados.xlsx');
};



