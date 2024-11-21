// IndicadorPage.js
import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  IconButton,
  Button,
  HStack,
  Checkbox,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { exportarSelecionadosParaPDF, exportarSelecionadosParaExcel } from '../exportPDFeExcell';
import { toPng } from 'html-to-image';

export default function IndicadorPage() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [indicadores, setIndicadores] = useState([]);
  const [filtros, setFiltros] = useState({
    codigo: '',
    nomeIndicador: '',
    area: '',
    unidadeMedida: '',
    classificador: '',
    responsavel: '',
  });
  const [dadosFiltrados, setDadosFiltrados] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [indicadorSelecionado, setIndicadorSelecionado] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false); // Define o modo de visualização
  const toast = useToast();

  useEffect(() => {
    const nome = localStorage.getItem('nomeUsuario');
    if (nome) {
      setNomeUsuario(nome);
    }

    const dadosIniciais = [
      {
        codigo: 'BIBLIO I.1',
        nomeIndicador: 'Quantidade de Empréstimos',
        area: 'BIBLIO Biblioteca',
        unidadeMedida: 'Qtd.',
        classificador: 'Monitoramento Operacional',
        responsavel: 'Igor Guevara',
        objetivoEstrategico: 'Aumentar o número de empréstimos',
        perspectivaEstrategica: 'Crescimento',
        descricaoObjetivoEstrategico: 'Melhorar o engajamento dos usuários',
        descricaoIndicador: 'Número total de empréstimos realizados',
        finalidadeIndicador: 'Medir a utilização da biblioteca',
        dimensaoDesempenho: 'Efetividade (E1)',
        formula: 'Total de empréstimos no período',
        fonteFormaColeta: 'Sistema de empréstimos',
        pesoIndicador: '1',
        interpretacaoIndicador: 'Valores maiores indicam melhor desempenho',
        meta: '500',
        tiposAcumulacao: 'Soma',
        polaridade: 'Positiva',
        periodicidadeColeta: 'Mensal',
        frequenciaMeta: 'Mensal',
      },
      // Adicione mais itens conforme necessário
    ];

    setIndicadores(dadosIniciais);
    setDadosFiltrados(dadosIniciais);
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  const handleFiltrar = () => {
    const filtrados = indicadores.filter((item) => {
      return (
        (filtros.codigo === '' || item.codigo.toLowerCase().includes(filtros.codigo.toLowerCase())) &&
        (filtros.nomeIndicador === '' || item.nomeIndicador.toLowerCase().includes(filtros.nomeIndicador.toLowerCase())) &&
        (filtros.area === '' || item.area === filtros.area) &&
        (filtros.unidadeMedida === '' || item.unidadeMedida.toLowerCase().includes(filtros.unidadeMedida.toLowerCase())) &&
        (filtros.classificador === '' || item.classificador === filtros.classificador) &&
        (filtros.responsavel === '' || item.responsavel === filtros.responsavel)
      );
    });
    setDadosFiltrados(filtrados);
    setSelectedIndicators([]);
  };

  const handleLimpar = () => {
    setFiltros({
      codigo: '',
      nomeIndicador: '',
      area: '',
      unidadeMedida: '',
      classificador: '',
      responsavel: '',
    });
    setDadosFiltrados(indicadores);
    setSelectedIndicators([]);
  };

  const handleViewClick = (indicador) => {
    setIndicadorSelecionado(indicador);
    setIsViewMode(true); // Define o modal como modo de visualização
    setIsModalOpen(true);
  };

  const handleEditClick = (indicador) => {
    setIndicadorSelecionado(indicador);
    setIsViewMode(false); // Define o modal como modo de edição
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIndicadorSelecionado(null);
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIndicadorSelecionado({
      ...indicadorSelecionado,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    const updatedIndicadores = indicadores.map((item) =>
      item.codigo === indicadorSelecionado.codigo ? indicadorSelecionado : item
    );
    setIndicadores(updatedIndicadores);
    setDadosFiltrados(updatedIndicadores);
    setIsModalOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Indicador atualizado com sucesso.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handlePrint = () => {
    const elemento = document.getElementById('modal-content');
    if (elemento) {
      toPng(elemento)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${indicadorSelecionado.codigo}-visualizacao.png`;
          link.click();
        })
        .catch((err) => {
          console.error('Erro ao capturar imagem:', err);
          toast({
            title: 'Erro',
            description: 'Erro ao gerar a imagem do indicador.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const FormGroup = ({ label, children }) => (
    <FormControl mb={3}>
      <FormLabel>{label}</FormLabel>
      {children}
    </FormControl>
  );

  return (
    <Box>
      <Box mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Bem-vindo, {nomeUsuario ? nomeUsuario : 'Usuário'}!
        </Text>
      </Box>

      <HStack spacing={4} mb={4}>
        <Button size="sm" bg="red.600" colorScheme="red" onClick={() => exportarSelecionadosParaPDF(selectedIndicators, indicadores, toast)}>
          Exportar Selecionados para PDF
        </Button>
        <Button size="sm" colorScheme="green" onClick={() => exportarSelecionadosParaExcel(selectedIndicators, indicadores, toast)}>
          Exportar Selecionados para Excel
        </Button>
      </HStack>

      <TableContainer>
        <Table variant='striped'>
          <Thead>
            <Tr>
              <Th>
                <Checkbox
                  colorScheme="green"
                  isChecked={selectedIndicators.length === dadosFiltrados.length && dadosFiltrados.length > 0}
                  isIndeterminate={selectedIndicators.length > 0 && selectedIndicators.length < dadosFiltrados.length}
                  onChange={(e) => {
                    setSelectedIndicators(e.target.checked ? dadosFiltrados.map((item) => item.codigo) : []);
                  }}
                />
              </Th>
              <Th>Código</Th>
              <Th>Nome Indicador</Th>
              <Th>Área</Th>
              <Th>Unid. Med.</Th>
              <Th>Classificador</Th>
              <Th>Responsável</Th>
              <Th>Ações</Th>
            </Tr>
            <Tr>
              <Th></Th>
              <Th>
                <Input
                  size="sm"
                  placeholder="Código"
                  name="codigo"
                  value={filtros.codigo}
                  onChange={handleFiltroChange}
                />
              </Th>
              <Th>
                <Input
                  size="sm"
                  placeholder="Nome Indicador"
                  name="nomeIndicador"
                  value={filtros.nomeIndicador}
                  onChange={handleFiltroChange}
                />
              </Th>
              <Th>
                <Select
                  size="sm"
                  placeholder="Todas"
                  name="area"
                  value={filtros.area}
                  onChange={handleFiltroChange}
                >
                  <option value="BIBLIO Biblioteca">BIBLIO Biblioteca</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Engenharia">Engenharia</option>
                  <option value="Marketing">Marketing</option>
                </Select>
              </Th>
              <Th>
                <Input
                  size="sm"
                  placeholder="Unid. Med."
                  name="unidadeMedida"
                  value={filtros.unidadeMedida}
                  onChange={handleFiltroChange}
                />
              </Th>
              <Th>
                <Select
                  size="sm"
                  placeholder="Todos"
                  name="classificador"
                  value={filtros.classificador}
                  onChange={handleFiltroChange}
                >
                  <option value="Monitoramento Operacional">Monitoramento Operacional</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="RH">RH</option>
                  <option value="Projetos">Projetos</option>
                  <option value="Marketing Digital">Marketing Digital</option>
                </Select>
              </Th>
              <Th>
                <Select
                  size="sm"
                  placeholder="Responsável"
                  name="responsavel"
                  value={filtros.responsavel}
                  onChange={handleFiltroChange}
                >
                  <option value="Igor Guevara">Igor Guevara</option>
                  <option value="Maria Silva">Maria Silva</option>
                  <option value="José Santos">José Santos</option>
                  <option value="Ana Oliveira">Ana Oliveira</option>
                  <option value="Pedro Lima">Pedro Lima</option>
                </Select>
              </Th>
              <Th>
                <HStack>
                  <Button size="sm" colorScheme="gray" onClick={handleLimpar}>
                    Limpar
                  </Button>
                  <Button size="sm" colorScheme="blue" onClick={handleFiltrar}>
                    Filtrar
                  </Button>
                </HStack>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {dadosFiltrados.map((item, index) => (
              <Tr key={index}>
                <Td>
                  <Checkbox
                    colorScheme="green"
                    isChecked={selectedIndicators.includes(item.codigo)}
                    onChange={() => {
                      setSelectedIndicators((prevSelected) =>
                        prevSelected.includes(item.codigo)
                          ? prevSelected.filter((codigo) => codigo !== item.codigo)
                          : [...prevSelected, item.codigo]
                      );
                    }}
                  />
                </Td>
                <Td>{item.codigo}</Td>
                <Td>{item.nomeIndicador}</Td>
                <Td>{item.area}</Td>
                <Td>{item.unidadeMedida}</Td>
                <Td>{item.classificador}</Td>
                <Td>{item.responsavel}</Td>
                <Td>
                  <IconButton
                    aria-label="Visualizar"
                    icon={<FaSearch />}
                    size="sm"
                    mr={2}
                    onClick={() => handleViewClick(item)}
                  />
                  <IconButton
                    aria-label="Editar"
                    icon={<FaRegEdit />}
                    size="sm"
                    onClick={() => handleEditClick(item)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot></Tfoot>
        </Table>
      </TableContainer>

      {indicadorSelecionado && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} size="xl">
          <ModalOverlay />
          <ModalContent maxH="80vh" overflowY="auto" id="modal-content">
            <ModalHeader>{isViewMode ? 'Visualizar Indicador' : 'Editar Indicador'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <Heading as="h2" size="md">Posicionamento no Mapa Estratégico</Heading>
                <FormGroup label="Código do Indicador">
                  <Input
                    type="text"
                    name="codigo"
                    value={indicadorSelecionado.codigo}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Nome do Indicador">
                  <Input
                    type="text"
                    name="nomeIndicador"
                    value={indicadorSelecionado.nomeIndicador}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Objetivo Estratégico Associado">
                  <Input
                    type="text"
                    name="objetivoEstrategico"
                    value={indicadorSelecionado.objetivoEstrategico || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Perspectiva Estratégica">
                  <Input
                    type="text"
                    name="perspectivaEstrategica"
                    value={indicadorSelecionado.perspectivaEstrategica || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Descrição do Objetivo Estratégico">
                  <Textarea
                    name="descricaoObjetivoEstrategico"
                    value={indicadorSelecionado.descricaoObjetivoEstrategico || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>

                <Heading as="h2" size="md">Informações Gerais</Heading>
                <FormGroup label="Descrição do Indicador">
                  <Textarea
                    name="descricaoIndicador"
                    value={indicadorSelecionado.descricaoIndicador || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Finalidade do Indicador">
                  <Textarea
                    name="finalidadeIndicador"
                    value={indicadorSelecionado.finalidadeIndicador || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Dimensão do Desempenho">
                  <Select
                    name="dimensaoDesempenho"
                    value={indicadorSelecionado.dimensaoDesempenho || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione a dimensão do desempenho"
                    isDisabled={isViewMode}
                  >
                    <option value="Efetividade (E1)">Efetividade (E1)</option>
                    <option value="Eficácia (E2)">Eficácia (E2)</option>
                    <option value="Eficiência (E3)">Eficiência (E3)</option>
                    <option value="Execução (E4)">Execução (E4)</option>
                    <option value="Excelência (E5)">Excelência (E5)</option>
                    <option value="Economicidade (E6)">Economicidade (E6)</option>
                  </Select>
                </FormGroup>

                <FormGroup label="Fórmula">
                  <Input
                    type="text"
                    name="formula"
                    value={indicadorSelecionado.formula || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Fonte/Forma de Coleta dos Dados">
                  <Textarea
                    name="fonteFormaColeta"
                    value={indicadorSelecionado.fonteFormaColeta || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Peso do Indicador">
                  <Input
                    type="number"
                    name="pesoIndicador"
                    value={indicadorSelecionado.pesoIndicador || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Interpretação do Indicador/Recomendações">
                  <Textarea
                    name="interpretacaoIndicador"
                    value={indicadorSelecionado.interpretacaoIndicador || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Área Responsável">
                  <Input
                    type="text"
                    name="area"
                    value={indicadorSelecionado.area || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>

                <Heading as="h2" size="md">Desempenho</Heading>
                <FormGroup label="Meta">
                  <Input
                    type="number"
                    name="meta"
                    value={indicadorSelecionado.meta || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
                <FormGroup label="Tipos de Acumulação">
                  <Select
                    name="tiposAcumulacao"
                    value={indicadorSelecionado.tiposAcumulacao || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione o tipo de acumulação"
                    isDisabled={isViewMode}
                  >
                    <option value="Saldo">Saldo</option>
                    <option value="Soma">Soma</option>
                    <option value="Média">Média</option>
                  </Select>
                </FormGroup>
                <FormGroup label="Polaridade">
                  <Select
                    name="polaridade"
                    value={indicadorSelecionado.polaridade || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione a polaridade"
                    isDisabled={isViewMode}
                  >
                    <option value="Negativa">Negativa</option>
                    <option value="Positiva">Positiva</option>
                    <option value="Estável">Estável</option>
                  </Select>
                </FormGroup>
                <FormGroup label="Periodicidade de Coleta">
                  <Select
                    name="periodicidadeColeta"
                    value={indicadorSelecionado.periodicidadeColeta || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione a periodicidade de coleta"
                    isDisabled={isViewMode}
                  >
                    <option value="Mensal">Mensal</option>
                    <option value="Bimestral">Bimestral</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Quadrimestral">Quadrimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                    <option value="Bianual">Bianual</option>
                    <option value="Trianual">Trianual</option>
                  </Select>
                </FormGroup>
                <FormGroup label="Frequência da Meta">
                  <Select
                    name="frequenciaMeta"
                    value={indicadorSelecionado.frequenciaMeta || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione a frequência da meta"
                    isDisabled={isViewMode}
                  >
                    <option value="Mensal">Mensal</option>
                    <option value="Bimestral">Bimestral</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Quadrimestral">Quadrimestral</option>
                    <option value="Semestral">Semestral</option>
                    <option value="Anual">Anual</option>
                    <option value="Bianual">Bianual</option>
                    <option value="Trianual">Trianual</option>
                  </Select>
                </FormGroup>
                <FormGroup label="Unidade de Medida">
                  <Input
                    type="text"
                    name="unidadeMedida"
                    value={indicadorSelecionado.unidadeMedida || ''}
                    onChange={handleInputChange}
                    isReadOnly={isViewMode}
                  />
                </FormGroup>
              </VStack>
            </ModalBody>

            <ModalFooter>
              {isViewMode ? (
                <Button colorScheme="blue" onClick={handlePrint}>
                  Tirar Print
                </Button>
              ) : (
                <Button colorScheme="red" mr={3} onClick={handleSaveChanges}>
                  Salvar
                </Button>
              )}
              <Button variant="ghost" onClick={handleModalClose}>
                Cancelar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
