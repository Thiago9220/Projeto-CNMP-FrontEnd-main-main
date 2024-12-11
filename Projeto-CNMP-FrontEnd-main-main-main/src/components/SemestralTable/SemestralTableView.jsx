import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Box, Button, Heading } from '@chakra-ui/react';
import SemestralTableRow from './SemestralTableRow';
import AnalysisModal from '../AnalysisModal';

const semestres = ['1º Semestre', '2º Semestre'];
const currentSemester = new Date().getMonth() < 6 ? 0 : 1;

const SemestralTableView = ({
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

  // Verificação se formData está pronto para semestral
  if (!formData || !formData.prescrito || formData.prescrito.length !== 2) {
    return <p>Carregando dados semestrais...</p>;
  }

  return (
    <>
      <Heading as="h3" size="sm" mb="4" textAlign="center">
        Prescrição de Processos Administrativos Disciplinares (PAD) - Semestral
      </Heading>
      <Table variant="simple" size="sm" colorScheme="gray">
        <Thead>
          <Tr>
            <Th rowSpan="2" p="1" textAlign="center">Indicador</Th>
            <Th rowSpan="2" p="1" textAlign="center">Valores</Th>
            {semestres.map((semestre) => (
              <Th key={semestre} textAlign="center" p="1">{semestre}</Th>
            ))}
            <Th rowSpan="2" p="1" textAlign="center">
              Meta {selectedDate.getFullYear()}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <SemestralTableRow
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
            semestres={semestres}
            currentSemester={currentSemester}
          />
          <SemestralTableRow
            label="Número de PAD finalizados no período"
            type="finalizado"
            formData={formData}
            handleInputChange={handleInputChange}
            valorCalculado={valorCalculado}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
            semestres={semestres}
            currentSemester={currentSemester}
          />
          <SemestralTableRow
            label="Valor Calculado"
            type="calculado"
            formData={formData}
            valorCalculado={valorCalculado}
            semestres={semestres}
            currentSemester={currentSemester}
          />
          <SemestralTableRow
            label="Análise Semestral"
            type="analise"
            formData={formData}
            openEditModal={openEditModal}
            openViewModal={openViewModal}
            semestres={semestres}
            currentSemester={currentSemester}
          />
        </Tbody>
      </Table>
      <Box textAlign="center" mt="4">
        <Button bg="red.600" colorScheme="red" onClick={salvarDados}>
          Salvar Dados Semestrais
        </Button>
      </Box>
      <AnalysisModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMonth={semestres[selectedMonth]}
        selectedMonthText={selectedMonthText}
        setSelectedMonthText={setSelectedMonthText}
        modalMode={modalMode}
        saveAnalysis={saveAnalysis}
      />
    </>
  );
};

export default SemestralTableView;
