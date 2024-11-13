import React, { useState, useEffect } from 'react';
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
  Text
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const App = () => {
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [meta, setMeta] = useState('0%');
  const [analysis, setAnalysis] = useState('');
  const [formData, setFormData] = useState({
    prescrito: Array(12).fill(''),
    finalizado: Array(12).fill(''),
  });
  const [indicators, setIndicators] = useState([]); // Presta atenção Bob: Estado para armazenar indicadores do backend
  const toast = useToast();

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  // Hook para buscar indicadores do backend (Memorize os hooks do React BOB VIADO)
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
  }, []);

  // Carrega os dados salvos no localStorage ao montar o componente
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedIndicator(parsedData.selectedIndicator || '');
      setMeta(parsedData.meta || '0%');
      setAnalysis(parsedData.analysis || '');
      setFormData(parsedData.formData || {
        prescrito: Array(12).fill(''),
        finalizado: Array(12).fill(''),
      });
    }
  }, []);

  const handleInputChange = (type, index, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[type][index] = value;
      return updated;
    });
  };

  // Cálculo do Valor Calculado
  const valorCalculado = formData.prescrito.map((value, index) => {
    const prescrito = Number(value);
    const finalizado = Number(formData.finalizado[index]);
    const calc = (finalizado / prescrito) * 100;
    return isNaN(calc) || !isFinite(calc) ? 0 : calc;
  });

  // Função para salvar os dados no localStorage e exibir o toast
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

  const TableRow = ({ label, type }) => (
    <Tr>
      {type === 'prescrito' && (
        <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
          <Text fontWeight="bold">
            {selectedIndicator || 'Selecione um Indicador'}
          </Text>
        </Td>
      )}
      <Td p="1" textAlign="left" border="1px solid" borderColor="gray.300">
        <Tooltip label={`Informações sobre ${label}`} aria-label="Tooltip">
          <Text>
            <InfoIcon mr="2" />
            {label}
          </Text>
        </Tooltip>
      </Td>
      {months.map((month, index) => (
        <Td key={`${type}-${index}`} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
          {type !== 'calculado' ? (
            <Input
              size="sm"
              variant="outline"
              textAlign="center"
              value={formData[type][index]}
              onChange={(e) => handleInputChange(type, index, e.target.value)}
              placeholder="-"
            />
          ) : (
            <Text>{valorCalculado[index].toFixed(2)}%</Text>
          )}
        </Td>
      ))}
      {type === 'prescrito' && (
        <>
          <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
            <Input
              size="sm"
              variant="outline"
              textAlign="center"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />
          </Td>
          <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
            <Textarea
              size="sm"
              variant="outline"
              resize="vertical"
              placeholder=""
              value={analysis}
              onChange={(e) => setAnalysis(e.target.value)}
            />
          </Td>
        </>
      )}
    </Tr>
  );

  return (
    <ChakraProvider>
      <Box padding="4" maxW="100%" margin="auto">
        <Box mb="4" textAlign="center">
          <Heading as="h2" size="md" mb="4">
            Selecione o Indicador
          </Heading>
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
            _focus={{ borderColor: 'gray.600', boxShadow: '0 0 0 1px gray.600' }}
          >
            {indicators.map((indicator) => (
              <option key={indicator.id} value={indicator.nomeIndicador}>
                {indicator.nomeIndicador}
              </option>
            ))}
          </Select>
        </Box>

        <Box overflowX="auto">
          <Heading as="h3" size="sm" mb="4" textAlign="center">
            Prescrição de Processos Administrativos Disciplinares (PAD)
          </Heading>
          <Table variant="simple" size="sm" colorScheme="gray">
            <Thead>
              <Tr>
                <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
                  Indicador
                </Th>
                <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
                  Valores
                </Th>
                {months.map((month) => (
                  <Th key={month} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
                    {month}
                  </Th>
                ))}
                <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
                  Meta 2024
                </Th>
                <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
                  Análise Crítica
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <TableRow label="Número de Processos Administrativos Disciplinares prescritos" type="prescrito" />
              <TableRow label="Número de Processos Administrativos Disciplinares finalizados no período" type="finalizado" />
              <TableRow label="Valor Calculado" type="calculado" />
            </Tbody>
          </Table>
        </Box>

        <Box textAlign="center" mt="4">
          <Button colorScheme="teal" onClick={handleSave}>
            Salvar Dados
          </Button>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default App;
