import React, { useState } from 'react';
import { ChakraProvider, Box, Select, Button, useDisclosure, useToast } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@chakra-ui/icons';

import { useIndicadorData } from '../../hooks/useIndicadorData';
import MonthlyTableView from '../../components/MonthlyTable/MonthlyTableView';
import SemestralTableView from '../../components/SemestralTable/SemestralTableView';

const IndicadoresPage = () => {
  const [viewType, setViewType] = useState('mensal');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    indicators,
    selectedIndicator,
    setSelectedIndicator,
    meta,
    setMeta,
    formData,
    setFormData,
    handleInputChange,
    valorCalculado,
    salvarDados
  } = useIndicadorData(viewType);

  const [modalMode, setModalMode] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthText, setSelectedMonthText] = useState('');

  const openEditModal = (index) => {
    setSelectedMonth(index);
    const analysisField = viewType === 'mensal' ? 'analiseMensal' : 'analiseSemestral';
    setSelectedMonthText(formData[analysisField][index] || '');
    setModalMode('edit');
    onOpen();
  };

  const openViewModal = (index) => {
    setSelectedMonth(index);
    const analysisField = viewType === 'mensal' ? 'analiseMensal' : 'analiseSemestral';
    setSelectedMonthText(formData[analysisField][index] || '');
    setModalMode('view');
    onOpen();
  };

  const saveAnalysis = () => {
    const analysisField = viewType === 'mensal' ? 'analiseMensal' : 'analiseSemestral';
    setFormData((prev) => ({
      ...prev,
      [analysisField]: prev[analysisField].map((item, i) =>
        i === selectedMonth ? selectedMonthText : item
      ),
    }));
    toast({
      title: `Análise ${viewType === 'mensal' ? 'Mensal' : 'Semestral'} salva!`,
      description: 'O conteúdo foi atualizado.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <ChakraProvider>
      <Box padding="4" maxW="100%" margin="auto">
        <Box mb="4" textAlign="center">
          <Box mb="4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showYearPicker={viewType === 'semestral'}
              dateFormat={viewType === 'mensal' ? "MM/yyyy" : "yyyy"}
              customInput={
                <Button leftIcon={<CalendarIcon />} variant="outline">
                  {viewType === 'mensal'
                    ? selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                    : selectedDate.getFullYear()
                  }
                </Button>
              }
            />
          </Box>
          <Select
            placeholder="Escolha um indicador"
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            size="md"
            variant="outline"
            maxW="300px"
            margin="auto"
            mb="4"
          >
            {indicators.map((indicator) => (
              <option key={indicator.id} value={indicator.nomeIndicador}>
                {indicator.nomeIndicador}
              </option>
            ))}
          </Select>

          <Select
            placeholder="Escolha a Visualização"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            size="md"
            variant="outline"
            maxW="300px"
            margin="auto"
          >
            <option value="mensal">Mensal</option>
            <option value="semestral">Semestral</option>
          </Select>
        </Box>

        <Box overflowX="auto">
          {viewType === 'mensal' && (
            <MonthlyTableView
              selectedDate={selectedDate}
              selectedIndicator={selectedIndicator}
              meta={meta}
              setMeta={setMeta}
              formData={formData}
              handleInputChange={handleInputChange}
              valorCalculado={valorCalculado}
              openEditModal={openEditModal}
              openViewModal={openViewModal}
              isOpen={isOpen}
              onClose={onClose}
              modalMode={modalMode}
              selectedMonth={selectedMonth}
              selectedMonthText={selectedMonthText}
              setSelectedMonthText={setSelectedMonthText}
              saveAnalysis={saveAnalysis}
              salvarDados={salvarDados}
            />
          )}
          {viewType === 'semestral' && (
            <SemestralTableView
              selectedDate={selectedDate}
              selectedIndicator={selectedIndicator}
              meta={meta}
              setMeta={setMeta}
              formData={formData}
              handleInputChange={handleInputChange}
              valorCalculado={valorCalculado}
              openEditModal={openEditModal}
              openViewModal={openViewModal}
              isOpen={isOpen}
              onClose={onClose}
              modalMode={modalMode}
              selectedMonth={selectedMonth}
              selectedMonthText={selectedMonthText}
              setSelectedMonthText={setSelectedMonthText}
              saveAnalysis={saveAnalysis}
              salvarDados={salvarDados}
            />
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default IndicadoresPage;
