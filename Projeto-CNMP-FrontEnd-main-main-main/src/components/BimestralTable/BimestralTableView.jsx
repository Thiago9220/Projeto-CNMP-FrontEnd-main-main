import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Box, Button, Heading } from '@chakra-ui/react';
import BimestralTableRow from './BimestralTableRow';
import AnalysisModal from '../AnalysisModal';

const bimestres = [
  '1º Bimestre', 
  '2º Bimestre', 
  '3º Bimestre', 
  '4º Bimestre', 
  '5º Bimestre', 
  '6º Bimestre'
];

// Cálculo do bimestre atual com base no mês atual (0 = janeiro)
// Cada bimestre corresponde a 2 meses: 
// jan-fev(0), mar-abr(1), mai-jun(2), jul-ago(3), set-out(4), nov-dez(5)
const currentBimestre = Math.floor(new Date().getMonth() / 2);

const BimestralTableView = ({
  selectedDate,
  selectedIndicator,
  meta,
  setMeta,
  formData,
  handleInputChange,
  valorCalculado,
  openEditModal,
  openViewModal,
  isOpen,
  onClose,
  modalMode,
  selectedMonth,
  selectedMonthText,
  setSelectedMonthText,
  saveAnalysis,
  salvarDados
}) => {
  // Verificação se formData está pronto para bimestral
  // Esperamos que formData tenha arrays como formData.prescrito, formData.finalizado, 
  // formData.analiseBimestral, cada um com length = 6
  if (
    !formData ||
    !formData.prescrito ||
    formData.prescrito.length !== 6 ||
    !formData.finalizado ||
    formData.finalizado.length !== 6 ||
    !formData.analiseBimestral ||
    formData.analiseBimestral.length !== 6
  ) {
    return <p>Carregando dados bimestrais...</p>;
  }

  return (
    <>
      <Heading as="h3" size="sm" mb="4" textAlign="center">
        Prescrição de Processos Administrativos Disciplinares (PAD) - Bimestral
      </Heading>
      <Table variant="simple" size="sm" colorScheme="gray">
        <Thead>
          <Tr>
            <Th rowSpan="2" p="1" textAlign="center">Indicador</Th>
            <Th rowSpan="2" p="1" textAlign="center">Valores</Th>
            {bimestres.map((bim, idx) => (
              <Th key={idx} textAlign="center" p="1">
                {bim}
              </Th>
            ))}
            <Th rowSpan="2" p="1" textAlign="center">
              Meta {selectedDate.getFullYear()}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <BimestralTableRow
            label="Número de PAD prescritos"
            type="prescrito"
            formData={formData}
            handleInputChange={handleInputChange}
            valorCalculado={valorCalculado}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
            selectedIndicator={selectedIndicator}
            meta={meta}
            setMeta={setMeta}
            bimestres={bimestres}
            currentBimestre={currentBimestre}
          />
          <BimestralTableRow
            label="Número de PAD finalizados no período"
            type="finalizado"
            formData={formData}
            handleInputChange={handleInputChange}
            valorCalculado={valorCalculado}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
            bimestres={bimestres}
            currentBimestre={currentBimestre}
          />
          <BimestralTableRow
            label="Valor Calculado"
            type="calculado"
            formData={formData}
            valorCalculado={valorCalculado}
            bimestres={bimestres}
            currentBimestre={currentBimestre}
          />
          <BimestralTableRow
            label="Análise Bimestral"
            type="analise"
            formData={formData}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
            bimestres={bimestres}
            currentBimestre={currentBimestre}
          />
        </Tbody>
      </Table>
      <Box textAlign="center" mt="4">
        <Button bg="red.600" colorScheme="red" onClick={salvarDados}>
          Salvar Dados Bimestrais
        </Button>
      </Box>
      <AnalysisModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMonth={bimestres[selectedMonth]}
        selectedMonthText={selectedMonthText}
        setSelectedMonthText={setSelectedMonthText}
        modalMode={modalMode}
        saveAnalysis={saveAnalysis}
      />
    </>
  );
};

export default BimestralTableView;
