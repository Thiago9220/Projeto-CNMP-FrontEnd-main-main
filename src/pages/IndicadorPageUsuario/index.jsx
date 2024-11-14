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
import { InfoIcon, EditIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';

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
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  // Obter o mês atual (0 = Janeiro, 1 = Fevereiro, ..., 11 = Dezembro)
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
    setFormData((prev) => {
      const updated = { ...prev };
      updated[type] = [...updated[type]];
      updated[type][index] = value;
      return updated;
    });
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

  const toggleEditingMonth = (index) => {
    setEditingMonths((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Função para abrir o modal e definir o mês selecionado
  const openAnalysisModal = (index) => {
    setSelectedMonth(index); // Define o mês selecionado
    onOpen();
  };

  const TableRow = ({ label, type }) => (
    <Tr>
      {type === 'prescrito' && (
        <Td rowSpan="4" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
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
          {type === 'calculado' ? (
            <Text>{valorCalculado[index].toFixed(2)}%</Text>
          ) : type === 'analise' ? (
            <VStack spacing={1}>
              {editingMonths[index] ? (
                <>
                  <Textarea
                    key={`textarea-${index}`}
                    size="xs"
                    value={formData.analiseMensal[index]}
                    onChange={(e) => handleInputChange('analiseMensal', index, e.target.value)}
                    autoFocus
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
                    isDisabled={index > currentMonth} // Desabilitar ícone de edição para meses futuros
                  />
                  <IconButton
                    size="xs"
                    icon={<ViewIcon />}
                    aria-label="Ver Análise Crítica"
                    onClick={() => openAnalysisModal(index)}
                    isDisabled={index > currentMonth} // Desabilitar ícone de visualização para meses futuros
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
              onChange={(e) => handleInputChange(type, index, e.target.value)}
              placeholder="-"
              isDisabled={index > currentMonth} // Desabilitar input para meses futuros
            />
          )}
        </Td>
      ))}
      {type === 'prescrito' && (
        <>
          <Td rowSpan="4" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
            <Input
              size="sm"
              variant="outline"
              textAlign="center"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
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
              </Tr>
            </Thead>
            <Tbody>
              <TableRow label="Número de Processos Administrativos Disciplinares prescritos" type="prescrito" />
              <TableRow label="Número de Processos Administrativos Disciplinares finalizados no período" type="finalizado" />
              <TableRow label="Valor Calculado" type="calculado" />
              <TableRow label="Análise Mensal" type="analise" />
            </Tbody>
          </Table>
        </Box>

        <Box textAlign="center" mt="4">
          <Button colorScheme="teal" onClick={handleSave}>
            Salvar Dados
          </Button>
        </Box>

        {/* Modal para exibir a Análise Crítica do mês selecionado */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Análise Crítica - {selectedMonth !== null ? months[selectedMonth] : ''}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>{selectedMonth !== null ? formData.analiseMensal[selectedMonth] : ''}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default App;



// import React, { useState, useEffect } from 'react';
// import {
//   ChakraProvider,
//   Box,
//   Heading,
//   Text,
//   Input,
//   Select,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Textarea,
//   Tooltip,
//   Button,
//   useToast, // Importação do useToast
// } from '@chakra-ui/react';
// import { InfoIcon } from '@chakra-ui/icons';

// const App = () => {
//   const [selectedIndicator, setSelectedIndicator] = useState('');
//   const [meta, setMeta] = useState('0%');
//   const [analysis, setAnalysis] = useState('');
//   const [formData, setFormData] = useState({
//     prescrito: Array(12).fill(''),
//     finalizado: Array(12).fill(''),
//   });

//   const indicators = [
//     'Indicador 1 - Prescrição de Processos',
//     'Indicador 2 - Monitoramento de Atividades',
//     'Indicador 3 - Controle de Qualidade',
//   ];

//   const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

//   // Hook do Chakra UI para exibir toasts
//   const toast = useToast();

//   // Carrega os dados salvos no localStorage ao montar o componente
//   useEffect(() => {
//     const savedData = localStorage.getItem('formData');
//     if (savedData) {
//       const parsedData = JSON.parse(savedData);
//       setSelectedIndicator(parsedData.selectedIndicator || '');
//       setMeta(parsedData.meta || '0%');
//       setAnalysis(parsedData.analysis || '');
//       setFormData(parsedData.formData || {
//         prescrito: Array(12).fill(''),
//         finalizado: Array(12).fill(''),
//       });
//     }
//   }, []);

//   const handleInputChange = (type, index, value) => {
//     setFormData((prev) => {
//       const updated = { ...prev };
//       updated[type][index] = value;
//       return updated;
//     });
//   };

//   // Cálculo do Valor Calculado
//   const valorCalculado = formData.prescrito.map((value, index) => {
//     const prescrito = Number(value);
//     const finalizado = Number(formData.finalizado[index]);
//     const calc = (finalizado / prescrito) * 100;
//     return isNaN(calc) || !isFinite(calc) ? 0 : calc;
//   });

//   // Função para salvar os dados no localStorage e exibir o toast
//   const handleSave = () => {
//     const dataToSave = {
//       selectedIndicator,
//       meta,
//       analysis,
//       formData,
//     };
//     localStorage.setItem('formData', JSON.stringify(dataToSave));
//     toast({
//       title: 'Dados salvos com sucesso!',
//       description: 'Suas informações foram armazenadas.',
//       status: 'success',
//       duration: 3000,
//       isClosable: true,
//     });
//   };

//   const TableRow = ({ label, type }) => (
//     <Tr>
//       {type === 'prescrito' && (
//         <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//           <Text fontWeight="bold">
//             {selectedIndicator || 'Selecione um Indicador'}
//           </Text>
//         </Td>
//       )}
//       <Td p="1" textAlign="left" border="1px solid" borderColor="gray.300">
//         <Tooltip label={`Informações sobre ${label}`} aria-label="Tooltip">
//           <Text>
//             <InfoIcon mr="2" />
//             {label}
//           </Text>
//         </Tooltip>
//       </Td>
//       {months.map((month, index) => (
//         <Td key={`${type}-${index}`} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
//           {type !== 'calculado' ? (
//             <Input
//               size="sm"
//               variant="outline"
//               textAlign="center"
//               value={formData[type][index]}
//               onChange={(e) => handleInputChange(type, index, e.target.value)}
//               placeholder="-"
//             />
//           ) : (
//             <Text>{valorCalculado[index].toFixed(2)}%</Text>
//           )}
//         </Td>
//       ))}
//       {type === 'prescrito' && (
//         <>
//           <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//             <Input
//               size="sm"
//               variant="outline"
//               textAlign="center"
//               value={meta}
//               onChange={(e) => setMeta(e.target.value)}
//             />
//           </Td>
//           <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//             <Textarea
//               size="sm"
//               variant="outline"
//               resize="vertical"
//               placeholder=""
//               value={analysis}
//               onChange={(e) => setAnalysis(e.target.value)}
//             />
//           </Td>
//         </>
//       )}
//     </Tr>
//   );

//   return (
//     <ChakraProvider>
//       <Box padding="4" maxW="100%" margin="auto">
//         <Box mb="4" textAlign="center">
//           <Heading as="h2" size="md" mb="4">
//             Selecione o Indicador
//           </Heading>
//           <Select
//             placeholder="Escolha um indicador"
//             value={selectedIndicator}
//             onChange={(e) => setSelectedIndicator(e.target.value)}
//             size="md"
//             variant="outline"
//             maxW="300px"
//             margin="auto"
//             borderColor="gray.500"
//             _hover={{ borderColor: 'gray.600' }}
//             _focus={{ borderColor: 'gray.600', boxShadow: '0 0 0 1px gray.600' }}
//           >
//             {indicators.map((indicator, index) => (
//               <option key={index} value={indicator}>
//                 {indicator}
//               </option>
//             ))}
//           </Select>
//         </Box>

//         <Box overflowX="auto">
//           <Heading as="h3" size="sm" mb="4" textAlign="center">
//             Prescrição de Processos Administrativos Disciplinares (PAD)
//           </Heading>
//           <Table variant="simple" size="sm" colorScheme="gray">
//             <Thead>
//               <Tr>
//                 <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                   Indicador
//                 </Th>
//                 <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                   Valores
//                 </Th>
//                 {months.map((month) => (
//                   <Th key={month} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
//                     {month}
//                   </Th>
//                 ))}
//                 <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                   Meta 2024
//                 </Th>
//                 <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                   Análise Crítica
//                 </Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               <TableRow label="Número de Processos Administrativos Disciplinares prescritos" type="prescrito" />
//               <TableRow label="Número de Processos Administrativos Disciplinares finalizados no período" type="finalizado" />
//               <TableRow label="Valor Calculado" type="calculado" />
//             </Tbody>
//           </Table>
//         </Box>

//         {/* Botão de Salvar */}
//         <Box textAlign="center" mt="4">
//           <Button colorScheme="teal" onClick={handleSave}>
//             Salvar Dados
//           </Button>
//         </Box>
//       </Box>
//     </ChakraProvider>
//   );
// };

// export default App;





// import React, { useState } from 'react';
// import {
//   ChakraProvider,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Box,
//   Text,
//   Input,
//   Textarea,
//   Select,
// } from '@chakra-ui/react';

// const App = () => {
//   // Estado para armazenar o indicador selecionado e outros valores
//   const [selectedIndicator, setSelectedIndicator] = useState('');
//   const [meta, setMeta] = useState('0%');
//   const [analysis, setAnalysis] = useState('');

//   // Exemplo de indicadores (adicione os indicadores reais quando tiver)
//   const indicators = [
//     'Indicador 1 - Prescrição de Processos',
//     'Indicador 2 - Monitoramento de Atividades',
//     'Indicador 3 - Controle de Qualidade',
//   ];

//   return (
//     <ChakraProvider>
//       <Box padding="4" maxW="100%" margin="auto">
//         {/* Seletor de Indicador */}
//         <Box mb="4" textAlign="center">
//           <Text fontSize="lg" mb="2" fontWeight="bold">
//             Selecione o Indicador
//           </Text>
//           <Select
//             placeholder="Escolha um indicador"
//             value={selectedIndicator}
//             onChange={(e) => setSelectedIndicator(e.target.value)}
//             size="md"
//             variant="outline"
//             maxW="300px"
//             margin="auto"
//             borderColor="gray.400"
//             _hover={{ borderColor: 'gray.500' }}
//             _focus={{ borderColor: 'teal.500', boxShadow: '0 0 0 1px teal.500' }}
//           >
//             {indicators.map((indicator, index) => (
//               <option key={index} value={indicator}>
//                 {indicator}
//               </option>
//             ))}
//           </Select>
//         </Box>

//         {/* Tabela de Dados */}
//         <Text fontSize="lg" mb="4" textAlign="center" fontWeight="bold">
//           Prescrição de Processos Administrativos Disciplinares (PAD)
//         </Text>
//         <Table variant="simple" size="sm" width="100%" colorScheme="gray" border="1px" borderColor="gray.300">
//           <Thead>
//             <Tr>
//               <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Indicador
//               </Th>
//               <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Valores
//               </Th>
//               {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((month) => (
//                 <Th key={month} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
//                   {month}
//                 </Th>
//               ))}
//               <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Meta 2024
//               </Th>
//               <Th rowSpan="2" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Análise Crítica
//               </Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             <Tr>
//               <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 <Text fontWeight="bold">
//                   {selectedIndicator || 'Selecione um Indicador'}
//                 </Text>
//               </Td>
//               <Td p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Número de Processos Administrativos Disciplinares prescritos
//               </Td>
//               {Array.from({ length: 12 }).map((_, index) => (
//                 <Td key={`prescrito-${index}`} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
//                   <Input size="xs" variant="flushed" textAlign="center" placeholder="-" />
//                 </Td>
//               ))}
//               <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 <Input
//                   size="xs"
//                   variant="flushed"
//                   textAlign="center"
//                   value={meta}
//                   onChange={(e) => setMeta(e.target.value)}
//                 />
//               </Td>
//               <Td rowSpan="3" p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 <Textarea
//                   size="xs"
//                   variant="flushed"
//                   resize="vertical"
//                   placeholder="Escreva a análise crítica..."
//                   value={analysis}
//                   onChange={(e) => setAnalysis(e.target.value)}
//                 />
//               </Td>
//             </Tr>
//             <Tr>
//               <Td p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Número de Processos Administrativos Disciplinares finalizados no período
//               </Td>
//               {Array.from({ length: 12 }).map((_, index) => (
//                 <Td key={`finalizado-${index}`} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
//                   <Input size="xs" variant="flushed" textAlign="center" placeholder="-" />
//                 </Td>
//               ))}
//             </Tr>
//             <Tr>
//               <Td p="1" textAlign="center" border="1px solid" borderColor="gray.300">
//                 Valor Calculado
//               </Td>
//               {Array.from({ length: 12 }).map((_, index) => (
//                 <Td key={`calculado-${index}`} textAlign="center" p="1" border="1px solid" borderColor="gray.300">
//                   <Input size="xs" variant="flushed" textAlign="center" placeholder="-" />
//                 </Td>
//               ))}
//             </Tr>
//           </Tbody>
//         </Table>
//       </Box>
//     </ChakraProvider>
//   );
// };

// export default App;





// import React, { useState, useEffect } from 'react';
// import {
//   ChakraProvider,
//   Box,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Heading,
//   IconButton,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   Input,
//   useDisclosure,
//   FormControl,
//   FormLabel,
//   HStack,
//   Checkbox,
//   useToast,
// } from '@chakra-ui/react';
// import { EditIcon } from '@chakra-ui/icons';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { format } from 'date-fns';
// import { jsPDF } from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// function FichaIndicadores() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [selectedIndicador, setSelectedIndicador] = useState(null);
//   const [meta, setMeta] = useState('');
//   const [valorMedido, setValorMedido] = useState('');
//   const [minValor, setMinValor] = useState('');
//   const [maxValor, setMaxValor] = useState('');
//   const [medidoNumerador, setMedidoNumerador] = useState('');
//   const [medidoDenominador, setMedidoDenominador] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [selectedIndicators, setSelectedIndicators] = useState([]);
//   const toast = useToast();

//   const [indicadores, setIndicadores] = useState([]);

//   useEffect(() => {
//     // Dados iniciais dos indicadores
//     const dadosIndicadores = [
//       {
//         periodo: 'Janeiro/2023',
//         codigo: 'BIBLIO I.1',
//         nomeIndicador: 'Quantidade de Empréstimos',
//         unidade: 'Qtd.',
//         area: 'BIBLIO Biblioteca',
//         meta: '500',
//         minMax: '-',
//         medido: '-',
//       },
//       {
//         periodo: 'Fevereiro/2023',
//         codigo: 'FIN I.2',
//         nomeIndicador: 'Receita Mensal',
//         unidade: 'R$',
//         area: 'Financeiro',
//         meta: '100000',
//         minMax: '-',
//         medido: '-',
//       },
//       // Adicione mais dados conforme necessário
//     ];

//     setIndicadores(dadosIndicadores);
//   }, []);

//   const handleEdit = (indicador) => {
//     setSelectedIndicador(indicador);
//     setMeta(indicador.meta !== '-' ? indicador.meta : '');
//     setMinValor(indicador.minValor || '');
//     setMaxValor(indicador.maxValor || '');
//     setMedidoNumerador('');
//     setMedidoDenominador('');
//     setDate(new Date());
//     onOpen();
//   };

//   const handleSave = () => {
//     if (selectedIndicador) {
//       const updatedIndicadores = indicadores.map((indicador) => {
//         if (indicador === selectedIndicador) {
//           const valorMedidoCalc = (medidoNumerador / medidoDenominador) * 100;

//           return {
//             ...indicador,
//             meta: meta,
//             periodo: format(date, 'MMMM/yyyy'),
//             minMax: `Mínimo: ${parseFloat(minValor).toFixed(2)}%, Máximo: ${parseFloat(maxValor).toFixed(2)}%`,
//             medido: `${valorMedidoCalc.toFixed(2)}%`,
//             minValor: minValor,
//             maxValor: maxValor,
//           };
//         }
//         return indicador;
//       });

//       setIndicadores(updatedIndicadores);
//       setSelectedIndicador(null);
//     }
//     onClose();
//   };

//   // Função para lidar com a seleção de indicadores
//   const handleCheckboxChange = (codigo) => {
//     setSelectedIndicators((prevSelected) => {
//       if (prevSelected.includes(codigo)) {
//         return prevSelected.filter((item) => item !== codigo);
//       } else {
//         return [...prevSelected, codigo];
//       }
//     });
//   };

//   // Função para selecionar todos
//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       const allCodes = indicadores.map((item) => item.codigo);
//       setSelectedIndicators(allCodes);
//     } else {
//       setSelectedIndicators([]);
//     }
//   };

//   // Função para exportar para PDF
//   const exportarSelecionadosParaPDF = () => {
//     if (selectedIndicators.length === 0) {
//       toast({
//         title: 'Nenhum indicador selecionado',
//         description: 'Por favor, selecione pelo menos um indicador para exportar.',
//         status: 'warning',
//         duration: 5000,
//         isClosable: true,
//       });
//       return;
//     }

//     const doc = new jsPDF();
//     const colunas = [
//       { header: 'Código', dataKey: 'codigo' },
//       { header: 'Nome Indicador', dataKey: 'nomeIndicador' },
//       { header: 'Área', dataKey: 'area' },
//       { header: 'Unidade', dataKey: 'unidade' },
//       { header: 'Meta', dataKey: 'meta' },
//     ];

//     const dados = indicadores
//       .filter((item) => selectedIndicators.includes(item.codigo))
//       .map((item) => ({
//         codigo: item.codigo,
//         nomeIndicador: item.nomeIndicador,
//         area: item.area,
//         unidade: item.unidade,
//         meta: item.meta,
//       }));

//     autoTable(doc, {
//       columns: colunas,
//       body: dados,
//       styles: { fontSize: 8 },
//       headStyles: { fillColor: [22, 160, 133] },
//     });

//     doc.save('indicadores_selecionados.pdf');
//   };

//   // Função para exportar para Excel
//   const exportarSelecionadosParaExcel = () => {
//     if (selectedIndicators.length === 0) {
//       toast({
//         title: 'Nenhum indicador selecionado',
//         description: 'Por favor, selecione pelo menos um indicador para exportar.',
//         status: 'warning',
//         duration: 5000,
//         isClosable: true,
//       });
//       return;
//     }

//     const dados = indicadores
//       .filter((item) => selectedIndicators.includes(item.codigo))
//       .map((item) => ({
//         Código: item.codigo,
//         'Nome Indicador': item.nomeIndicador,
//         Área: item.area,
//         Unidade: item.unidade,
//         Meta: item.meta,
//       }));

//     const ws = XLSX.utils.json_to_sheet(dados);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Indicadores Selecionados');

//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'indicadores_selecionados.xlsx');
//   };

//   return (
//     <ChakraProvider>
//       <Box p={5}>
//         <Heading as="h2" size="lg" mb={5}>
//           Medições de Indicadores
//         </Heading>

//         {/* Botões de exportação */}
//         <HStack spacing={4} mb={4}>
//           <Button colorScheme="red" onClick={exportarSelecionadosParaPDF}>
//             Exportar Selecionados para PDF
//           </Button>
//           <Button colorScheme="green" onClick={exportarSelecionadosParaExcel}>
//             Exportar Selecionados para Excel
//           </Button>
//         </HStack>

//         <Table variant="striped" bg="red.150" size="md">
//           <Thead>
//             <Tr>
//               <Th>
//                 <Checkbox
//                   colorScheme="green"
//                   isChecked={selectedIndicators.length === indicadores.length && indicadores.length > 0}
//                   isIndeterminate={selectedIndicators.length > 0 && selectedIndicators.length < indicadores.length}
//                   onChange={handleSelectAll}
//                 />
//               </Th>
//               <Th>Código</Th>
//               <Th>Nome Indicador</Th>
//               <Th>Área</Th>
//               <Th>Período</Th>
//               <Th>Un. Medida</Th>
//               <Th>Meta</Th>
//               <Th>Valor Medido (mensal)</Th>
//               <Th>Ações</Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {indicadores.map((indicador, index) => (
//               <Tr key={index}>
//                 <Td>
//                   <Checkbox
//                     colorScheme="green"
//                     isChecked={selectedIndicators.includes(indicador.codigo)}
//                     onChange={() => handleCheckboxChange(indicador.codigo)}
//                   />
//                 </Td>
//                 <Td>{indicador.codigo}</Td>
//                 <Td>{indicador.nomeIndicador}</Td>
//                 <Td>{indicador.area}</Td>
//                 <Td>{indicador.periodo}</Td>
//                 <Td>{indicador.unidade}</Td>
//                 <Td>{indicador.meta}</Td>
//                 <Td>{indicador.medido}</Td>
//                 <Td>
//                   <IconButton
//                     aria-label="Editar"
//                     icon={<EditIcon />}
//                     size="sm"
//                     onClick={() => handleEdit(indicador)}
//                     colorScheme="red"
//                   />
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>

//         {/* Modal de Edição */}
//         <Modal isOpen={isOpen} onClose={onClose}>
//           <ModalOverlay />
//           <ModalContent>
//             <ModalHeader>Editar Indicador</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               {/* Seletor de Data */}
//               <FormControl mb={3}>
//                 <FormLabel>Período (Mês e Ano)</FormLabel>
//                 <DatePicker
//                   selected={date}
//                   onChange={(newDate) => setDate(newDate)}
//                   dateFormat="MM/yyyy"
//                   showMonthYearPicker
//                   showFullMonthYearPicker
//                   locale="pt-BR"
//                   customInput={<Input />}
//                 />
//               </FormControl>

//               <FormControl mb={3}>
//                 <FormLabel>Valor Mínimo (%)</FormLabel>
//                 <Input
//                   placeholder="Valor Mínimo"
//                   type="number"
//                   value={minValor}
//                   onChange={(e) => setMinValor(e.target.value)}
//                 />
//               </FormControl>

//               <FormControl mb={3}>
//                 <FormLabel>Valor Máximo (%)</FormLabel>
//                 <Input
//                   placeholder="Valor Máximo"
//                   type="number"
//                   value={maxValor}
//                   onChange={(e) => setMaxValor(e.target.value)}
//                 />
//               </FormControl>

//               <FormControl mb={3}>
//                 <FormLabel>Meta</FormLabel>
//                 <Input
//                   placeholder="Meta mensal"
//                   value={meta}
//                   onChange={(e) => setMeta(e.target.value)}
//                 />
//               </FormControl>

//               <FormControl mb={3}>
//                 <FormLabel>Valor Medido (mensal)</FormLabel>
//                 <HStack>
//                   <Input
//                     placeholder="Numerador"
//                     type="number"
//                     value={medidoNumerador}
//                     onChange={(e) => setMedidoNumerador(e.target.value)}
//                   />
//                   <span>/</span>
//                   <Input
//                     placeholder="Denominador"
//                     type="number"
//                     value={medidoDenominador}
//                     onChange={(e) => setMedidoDenominador(e.target.value)}
//                   />
//                 </HStack>
//                 <Box mt={2}>
//                   {medidoNumerador && medidoDenominador && (
//                     <span>
//                       Valor Medido: {((medidoNumerador / medidoDenominador) * 100).toFixed(2)}%
//                     </span>
//                   )}
//                 </Box>
//               </FormControl>
//             </ModalBody>
//             <ModalFooter>
//               <Button colorScheme="red" mr={3} onClick={handleSave}>
//                 Salvar
//               </Button>
//               <Button variant="ghost" onClick={onClose}>
//                 Cancelar
//               </Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </Box>
//     </ChakraProvider>
//   );
// }

// export default FichaIndicadores;
