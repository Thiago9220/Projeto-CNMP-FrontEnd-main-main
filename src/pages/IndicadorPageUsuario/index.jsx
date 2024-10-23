import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
  FormControl,
  FormLabel,
  HStack,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function FichaIndicadores() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedIndicador, setSelectedIndicador] = useState(null);
  const [meta, setMeta] = useState('');
  const [valorMedido, setValorMedido] = useState('');
  const [minValor, setMinValor] = useState('');
  const [maxValor, setMaxValor] = useState('');
  const [medidoNumerador, setMedidoNumerador] = useState('');
  const [medidoDenominador, setMedidoDenominador] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const toast = useToast();

  const [indicadores, setIndicadores] = useState([]);

  useEffect(() => {
    // Dados iniciais dos indicadores
    const dadosIndicadores = [
      {
        periodo: 'Janeiro/2023',
        codigo: 'BIBLIO I.1',
        nomeIndicador: 'Quantidade de Empréstimos',
        unidade: 'Qtd.',
        area: 'BIBLIO Biblioteca',
        meta: '500',
        minMax: '-',
        medido: '-',
      },
      {
        periodo: 'Fevereiro/2023',
        codigo: 'FIN I.2',
        nomeIndicador: 'Receita Mensal',
        unidade: 'R$',
        area: 'Financeiro',
        meta: '100000',
        minMax: '-',
        medido: '-',
      },
      // Adicione mais dados conforme necessário
    ];

    setIndicadores(dadosIndicadores);
  }, []);

  const handleEdit = (indicador) => {
    setSelectedIndicador(indicador);
    setMeta(indicador.meta !== '-' ? indicador.meta : '');
    setMinValor(indicador.minValor || '');
    setMaxValor(indicador.maxValor || '');
    setMedidoNumerador('');
    setMedidoDenominador('');
    setDate(new Date());
    onOpen();
  };

  const handleSave = () => {
    if (selectedIndicador) {
      const updatedIndicadores = indicadores.map((indicador) => {
        if (indicador === selectedIndicador) {
          const valorMedidoCalc = (medidoNumerador / medidoDenominador) * 100;

          return {
            ...indicador,
            meta: meta,
            periodo: format(date, 'MMMM/yyyy'),
            minMax: `Mínimo: ${parseFloat(minValor).toFixed(2)}%, Máximo: ${parseFloat(maxValor).toFixed(2)}%`,
            medido: `${valorMedidoCalc.toFixed(2)}%`,
            minValor: minValor,
            maxValor: maxValor,
          };
        }
        return indicador;
      });

      setIndicadores(updatedIndicadores);
      setSelectedIndicador(null);
    }
    onClose();
  };

  // Função para lidar com a seleção de indicadores
  const handleCheckboxChange = (codigo) => {
    setSelectedIndicators((prevSelected) => {
      if (prevSelected.includes(codigo)) {
        return prevSelected.filter((item) => item !== codigo);
      } else {
        return [...prevSelected, codigo];
      }
    });
  };

  // Função para selecionar todos
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCodes = indicadores.map((item) => item.codigo);
      setSelectedIndicators(allCodes);
    } else {
      setSelectedIndicators([]);
    }
  };

  // Função para exportar para PDF
  const exportarSelecionadosParaPDF = () => {
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
    const colunas = [
      { header: 'Código', dataKey: 'codigo' },
      { header: 'Nome Indicador', dataKey: 'nomeIndicador' },
      { header: 'Área', dataKey: 'area' },
      { header: 'Unidade', dataKey: 'unidade' },
      { header: 'Meta', dataKey: 'meta' },
    ];

    const dados = indicadores
      .filter((item) => selectedIndicators.includes(item.codigo))
      .map((item) => ({
        codigo: item.codigo,
        nomeIndicador: item.nomeIndicador,
        area: item.area,
        unidade: item.unidade,
        meta: item.meta,
      }));

    autoTable(doc, {
      columns: colunas,
      body: dados,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('indicadores_selecionados.pdf');
  };

  // Função para exportar para Excel
  const exportarSelecionadosParaExcel = () => {
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
        Código: item.codigo,
        'Nome Indicador': item.nomeIndicador,
        Área: item.area,
        Unidade: item.unidade,
        Meta: item.meta,
      }));

    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Indicadores Selecionados');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'indicadores_selecionados.xlsx');
  };

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading as="h2" size="lg" mb={5}>
          Medições de Indicadores
        </Heading>

        {/* Botões de exportação */}
        <HStack spacing={4} mb={4}>
          <Button colorScheme="red" onClick={exportarSelecionadosParaPDF}>
            Exportar Selecionados para PDF
          </Button>
          <Button colorScheme="green" onClick={exportarSelecionadosParaExcel}>
            Exportar Selecionados para Excel
          </Button>
        </HStack>

        <Table variant="striped" bg="red.150" size="md">
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  colorScheme="green"
                  isChecked={selectedIndicators.length === indicadores.length && indicadores.length > 0}
                  isIndeterminate={selectedIndicators.length > 0 && selectedIndicators.length < indicadores.length}
                  onChange={handleSelectAll}
                />
              </Th>
              <Th>Código</Th>
              <Th>Nome Indicador</Th>
              <Th>Área</Th>
              <Th>Período</Th>
              <Th>Un. Medida</Th>
              <Th>Meta</Th>
              <Th>Valor Medido (mensal)</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {indicadores.map((indicador, index) => (
              <Tr key={index}>
                <Td>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedIndicators.includes(indicador.codigo)}
                    onChange={() => handleCheckboxChange(indicador.codigo)}
                  />
                </Td>
                <Td>{indicador.codigo}</Td>
                <Td>{indicador.nomeIndicador}</Td>
                <Td>{indicador.area}</Td>
                <Td>{indicador.periodo}</Td>
                <Td>{indicador.unidade}</Td>
                <Td>{indicador.meta}</Td>
                <Td>{indicador.medido}</Td>
                <Td>
                  <IconButton
                    aria-label="Editar"
                    icon={<EditIcon />}
                    size="sm"
                    onClick={() => handleEdit(indicador)}
                    colorScheme="red"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Modal de Edição */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Indicador</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Seletor de Data */}
              <FormControl mb={3}>
                <FormLabel>Período (Mês e Ano)</FormLabel>
                <DatePicker
                  selected={date}
                  onChange={(newDate) => setDate(newDate)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  locale="pt-BR"
                  customInput={<Input />}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Valor Mínimo (%)</FormLabel>
                <Input
                  placeholder="Valor Mínimo"
                  type="number"
                  value={minValor}
                  onChange={(e) => setMinValor(e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Valor Máximo (%)</FormLabel>
                <Input
                  placeholder="Valor Máximo"
                  type="number"
                  value={maxValor}
                  onChange={(e) => setMaxValor(e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Meta</FormLabel>
                <Input
                  placeholder="Meta mensal"
                  value={meta}
                  onChange={(e) => setMeta(e.target.value)}
                />
              </FormControl>

              <FormControl mb={3}>
                <FormLabel>Valor Medido (mensal)</FormLabel>
                <HStack>
                  <Input
                    placeholder="Numerador"
                    type="number"
                    value={medidoNumerador}
                    onChange={(e) => setMedidoNumerador(e.target.value)}
                  />
                  <span>/</span>
                  <Input
                    placeholder="Denominador"
                    type="number"
                    value={medidoDenominador}
                    onChange={(e) => setMedidoDenominador(e.target.value)}
                  />
                </HStack>
                <Box mt={2}>
                  {medidoNumerador && medidoDenominador && (
                    <span>
                      Valor Medido: {((medidoNumerador / medidoDenominador) * 100).toFixed(2)}%
                    </span>
                  )}
                </Box>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleSave}>
                Salvar
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}

export default FichaIndicadores;
