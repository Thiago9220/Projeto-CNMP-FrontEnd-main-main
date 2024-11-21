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
  Textarea,
  Tooltip,
  Button,
  useToast,
  Text,
  IconButton,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';
import { InfoIcon, EditIcon, CheckIcon, ViewIcon, CalendarIcon } from '@chakra-ui/icons';

const App = () => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [meta, setMeta] = useState('0%');
  const [analysis, setAnalysis] = useState('');
  const [formData, setFormData] = useState({
    prescrito: Array(12).fill(''),
    finalizado: Array(12).fill(''),
    analiseMensal: Array(12).fill(''),
  });
  const [indicators, setIndicators] = useState([]);
  const [editingMonths, setEditingMonths] = useState(Array(12).fill(false));
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const currentMonth = new Date().getMonth();

  useEffect(() => {
    fetch('http://localhost:8000/indicadores/')
      .then(response => response.json())
      .then(data => setIndicators(data))
      .catch(error => {
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

      const updatedFormData = {
        prescrito: parsedData.formData?.prescrito || Array(12).fill(''),
        finalizado: parsedData.formData?.finalizado || Array(12).fill(''),
        analiseMensal: parsedData.formData?.analiseMensal || Array(12).fill(''),
      };

      setSelectedIndicator(parsedData.selectedIndicator || '');
      setMeta(parsedData.meta || '0%');
      setAnalysis(parsedData.analysis || '');
      setFormData(updatedFormData);
      setEditingMonths(Array(12).fill(false));
    }
  }, []);

  const handleInputChange = (type, index, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? value : item)),
    }));
  };

  const valorCalculado = formData.prescrito.map((value, index) => {
    const prescrito = Number(value);
    const finalizado = Number(formData.finalizado[index]);
    const calc = (finalizado / prescrito) * 100;
    return isNaN(calc) || !isFinite(calc) ? 0 : calc;
  });

  const handleSave = () => {
    const dataToSave = {
      selectedIndicator,
      meta,
      analysis,
      formData,
    };
    localStorage.setItem('formData', JSON.stringify(dataToSave));
    toast({
      title: 'Dados salvos com sucesso!',
      description: 'Suas informações foram armazenadas.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleEditingMonth = index => {
    setEditingMonths(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });

    setTimeout(() => {
      const textarea = document.querySelector(`#analise-${index}`);
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
    }, 0);
  };

  const openAnalysisModal = index => {
    setSelectedMonth(index);
    onOpen();
  };

  const TableRow = ({ label, type }) => (
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
            <VStack spacing={1}>
              {editingMonths[index] ? (
                <>
                  <Textarea
                    id={`analise-${index}`}
                    size="xs"
                    value={formData.analiseMensal[index] || ''}
                    onChange={e =>
                      handleInputChange('analiseMensal', index, e.target.value)
                    }
                    isReadOnly={!editingMonths[index]}
                    autoFocus={editingMonths[index]}
                    onFocus={e => {
                      const value = e.target.value;
                      e.target.setSelectionRange(
                        value.length,
                        value.length
                      );
                    }}
                    borderColor={
                      editingMonths[index] ? 'blue.400' : 'gray.300'
                    }
                    _focus={{
                      borderColor: 'blue.600',
                      boxShadow: '0 0 0 1px blue.600',
                    }}
                  />
                  <IconButton
                    size="xs"
                    icon={<CheckIcon />}
                    aria-label="Salvar Análise"
                    onClick={() => toggleEditingMonth(index)}
                  />
                </>
              ) : (
                <Stack spacing={1} isInline>
                  <IconButton
                    size="xs"
                    icon={<EditIcon />}
                    aria-label="Editar Análise"
                    onClick={() => toggleEditingMonth(index)}
                    isDisabled={index >= currentMonth}
                  />
                  <IconButton
                    size="xs"
                    icon={<ViewIcon />}
                    aria-label="Ver Análise Crítica"
                    onClick={() => openAnalysisModal(index)}
                    isDisabled={index >= currentMonth}
                  />
                </Stack>
              )}
            </VStack>
          ) : (
            <Input
              size="sm"
              variant="outline"
              textAlign="center"
              value={formData[type][index]}
              onChange={e =>
                handleInputChange(type, index, e.target.value)
              }
              placeholder="-"
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

  return (
    <ChakraProvider>
      <Box padding="4" maxW="100%" margin="auto">
        <Box mb="4" textAlign="center">
          <Box mb="4">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              showMonthYearPicker
              minDate={new Date(2024, 0, 1)}
              dateFormat="MM/yyyy"
              customInput={
                <Button
                  leftIcon={<CalendarIcon />}
                  variant="outline"
                >
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
            onChange={e => setSelectedIndicator(e.target.value)}
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
            {indicators.map(indicator => (
              <option
                key={indicator.id}
                value={indicator.nomeIndicador}
              >
                {indicator.nomeIndicador}
              </option>
            ))}
          </Select>
        </Box>

        <Box overflowX="auto">
          <Heading
            as="h3"
            size="sm"
            mb="4"
            textAlign="center"
          >
            Prescrição de Processos Administrativos Disciplinares
            (PAD)
          </Heading>
          <Table variant="simple" size="sm" colorScheme="gray">
            <Thead>
              <Tr>
                <Th
                  rowSpan="2"
                  p="1"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.300"
                >
                  Indicador
                </Th>
                <Th
                  rowSpan="2"
                  p="1"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.300"
                >
                  Valores
                </Th>
                {months.map(month => (
                  <Th
                    key={month}
                    textAlign="center"
                    p="1"
                    border="1px solid"
                    borderColor="gray.300"
                  >
                    {month}
                  </Th>
                ))}
                <Th
                  rowSpan="2"
                  p="1"
                  textAlign="center"
                  border="1px solid"
                  borderColor="gray.300"
                >
                  Meta 2024
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <TableRow
                label="Número de Processos Administrativos Disciplinares prescritos"
                type="prescrito"
              />
              <TableRow
                label="Número de Processos Administrativos Disciplinares finalizados no período"
                type="finalizado"
              />
              <TableRow label="Valor Calculado" type="calculado" />
              <TableRow label="Análise Mensal" type="analise" />
            </Tbody>
          </Table>
        </Box>

        <Box textAlign="center" mt="4">
          <Button bg="red.600" colorScheme="red" onClick={handleSave}>
            Salvar Dados
          </Button>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Análise Crítica -{' '}
              {selectedMonth !== null
                ? months[selectedMonth]
                : ''}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                {selectedMonth !== null
                  ? formData.analiseMensal[selectedMonth]
                  : ''}
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default App;
