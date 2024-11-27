import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ChakraProvider,
  Box,
  Heading,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Tooltip,
  Button,
  useToast,
  Text,
  IconButton,
  VStack,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { InfoIcon, EditIcon, ViewIcon, CalendarIcon } from '@chakra-ui/icons';
import AnalysisModal from '../../components/AnalysisModal';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const currentMonth = new Date().getMonth();

// Mover o componente TableRow para fora de App
const TableRow = ({
  label,
  type,
  formData,
  handleInputChange,
  valorCalculado,
  openEditModal,
  openViewModal,
  selectedIndicator,
  meta,
  setMeta,
}) => (
  <Tr>
    {type === 'prescrito' && (
      <Td
        rowSpan="4"
        p="1"
        textAlign="center"
        border="1px solid"
        borderColor="gray.300"
      >
        <Text fontWeight="bold">
          {selectedIndicator || 'Selecione um Indicador'}
        </Text>
      </Td>
    )}
    <Td
      p="1"
      textAlign="left"
      border="1px solid"
      borderColor="gray.300"
    >
      <Tooltip label={`Informações sobre ${label}`} aria-label="Tooltip">
        <Text>
          <InfoIcon mr="2" />
          {label}
        </Text>
      </Tooltip>
    </Td>
    {months.map((month, index) => (
      <Td
        key={`${type}-${index}`}
        textAlign="center"
        p="1"
        border="1px solid"
        borderColor="gray.300"
        bgColor={index === currentMonth ? 'gray.200' : 'white'}
        fontWeight={index === currentMonth ? 'medium' : 'normal'}
      >
        {type === 'calculado' ? (
          <Text>{valorCalculado[index].toFixed(2)}%</Text>
        ) : type === 'analise' ? (
          <Stack direction="row" spacing={2} justify="center" align="center">
            <IconButton
              size="xs"
              icon={<EditIcon />}
              aria-label="Editar Análise"
              onClick={() => openEditModal(index)}
              isDisabled={index >= currentMonth}
            />
            <IconButton
              size="xs"
              icon={<ViewIcon />}
              aria-label="Visualizar Análise"
              onClick={() => openViewModal(index)}
              isDisabled={!formData.analiseMensal[index]}
            />
          </Stack>
        ) : (
          <Input
            size="sm"
            variant="outline"
            textAlign="center"
            value={formData[type][index]}
            onChange={e =>
              handleInputChange(type, index, e.target.value)
            }
            placeholder="0,00"
            isDisabled={index >= currentMonth}
          />
        )}
      </Td>
    ))}
    {type === 'prescrito' && (
      <Td
        rowSpan="4"
        p="1"
        textAlign="center"
        border="1px solid"
        borderColor="gray.300"
      >
        <Input
          size="sm"
          variant="outline"
          textAlign="center"
          value={meta}
          onChange={e => setMeta(e.target.value)}
        />
      </Td>
    )}
  </Tr>
);

const App = () => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [meta, setMeta] = useState('0%');
  const [formData, setFormData] = useState({
    prescrito: Array(12).fill(''),
    finalizado: Array(12).fill(''),
    analiseMensal: Array(12).fill(''),
  });
  const [indicators, setIndicators] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedMonthText, setSelectedMonthText] = useState('');
  const [modalMode, setModalMode] = useState(''); // "edit" ou "view"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch('http://localhost:8000/indicadores/')
      .then((response) => response.json())
      .then((data) => setIndicators(data))
      .catch((error) => {
        console.error('Erro ao carregar indicadores:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os indicadores.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData.formData || {});
      setSelectedIndicator(parsedData.selectedIndicator || '');
      setMeta(parsedData.meta || '0%');
    }
  }, []);

  const handleInputChange = (type, index, value) => {
    const sanitizedValue = value.replace(/[^0-9.,]/g, '');
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? sanitizedValue : item)),
    }));
  };

  const valorCalculado = formData.prescrito.map((value, index) => {
    const prescrito = parseFloat(value.replace(',', '.')) || 0;
    const finalizado = parseFloat(formData.finalizado[index].replace(',', '.')) || 0;

    return prescrito === 0 ? 0 : (finalizado / prescrito) * 100;
  });

  const handleSave = () => {
    localStorage.setItem(
      'formData',
      JSON.stringify({ selectedIndicator, meta, formData })
    );
    toast({
      title: 'Dados salvos com sucesso!',
      description: 'Suas informações foram armazenadas.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const openEditModal = (index) => {
    setSelectedMonth(index);
    setSelectedMonthText(formData.analiseMensal[index] || '');
    setModalMode('edit');
    onOpen();
  };

  const openViewModal = (index) => {
    setSelectedMonth(index);
    setSelectedMonthText(formData.analiseMensal[index] || '');
    setModalMode('view');
    onOpen();
  };

  const saveAnalysis = () => {
    setFormData((prev) => ({
      ...prev,
      analiseMensal: prev.analiseMensal.map((item, i) =>
        i === selectedMonth ? selectedMonthText : item
      ),
    }));
    toast({
      title: 'Análise salva!',
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
        {/* Seletor de Indicador e Data */}
        <Box mb="4" textAlign="center">
          <Box mb="4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showMonthYearPicker
              minDate={new Date(2024, 0, 1)}
              dateFormat="MM/yyyy"
              customInput={
                <Button leftIcon={<CalendarIcon />} variant="outline">
                  {selectedDate.toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric',
                  })}
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
            borderColor="gray.500"
            _hover={{ borderColor: 'gray.600' }}
            _focus={{
              borderColor: 'gray.600',
              boxShadow: '0 0 0 1px gray.600',
            }}
          >
            {indicators.map((indicator) => (
              <option key={indicator.id} value={indicator.nomeIndicador}>
                {indicator.nomeIndicador}
              </option>
            ))}
          </Select>
        </Box>

        {/* Tabela */}
        <Box overflowX="auto">
          <Heading as="h3" size="sm" mb="4" textAlign="center">
            Prescrição de Processos Administrativos Disciplinares (PAD)
          </Heading>
          <Table variant="simple" size="sm" colorScheme="gray">
            <Thead>
              <Tr>
                <Th rowSpan="2" p="1" textAlign="center">
                  Indicador
                </Th>
                <Th rowSpan="2" p="1" textAlign="center">
                  Valores
                </Th>
                {months.map((month) => (
                  <Th key={month} textAlign="center" p="1">
                    {month}
                  </Th>
                ))}
                <Th rowSpan="2" p="1" textAlign="center">
                  Meta 2024
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Linhas da Tabela */}
              <TableRow
                label="Número de Processos Administrativos Disciplinares prescritos"
                type="prescrito"
                formData={formData}
                handleInputChange={handleInputChange}
                valorCalculado={valorCalculado}
                openEditModal={openEditModal}
                openViewModal={openViewModal}
                selectedIndicator={selectedIndicator}
                meta={meta}
                setMeta={setMeta}
              />
              <TableRow
                label="Número de Processos Administrativos Disciplinares finalizados no período"
                type="finalizado"
                formData={formData}
                handleInputChange={handleInputChange}
                valorCalculado={valorCalculado}
                openEditModal={openEditModal}
                openViewModal={openViewModal}
              />
              <TableRow
                label="Valor Calculado"
                type="calculado"
                formData={formData}
                valorCalculado={valorCalculado}
              />
              <TableRow
                label="Análise Mensal"
                type="analise"
                formData={formData}
                openEditModal={openEditModal}
                openViewModal={openViewModal}
              />
            </Tbody>
          </Table>
        </Box>

        {/* Botão Salvar */}
        <Box textAlign="center" mt="4">
          <Button bg="red.600" colorScheme="red" onClick={handleSave}>
            Salvar Dados
          </Button>
        </Box>

        {/* Modal */}
        <AnalysisModal
          isOpen={isOpen}
          onClose={onClose}
          selectedMonth={months[selectedMonth]}
          selectedMonthText={selectedMonthText}
          setSelectedMonthText={setSelectedMonthText}
          modalMode={modalMode}
          saveAnalysis={saveAnalysis}
        />
      </Box>
    </ChakraProvider>
  );
};

export default App;
