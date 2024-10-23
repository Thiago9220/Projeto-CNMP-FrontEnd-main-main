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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const toast = useToast();

  useEffect(() => {
    // Buscar nome do usuário no localStorage
    const nome = localStorage.getItem('nomeUsuario');
    if (nome) {
      setNomeUsuario(nome);
    }

    // Dados iniciais (fictícios)
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
      {
        codigo: 'FIN I.2',
        nomeIndicador: 'Receita Mensal',
        area: 'Financeiro',
        unidadeMedida: 'R$',
        classificador: 'Financeiro',
        responsavel: 'Maria Silva',
        objetivoEstrategico: 'Aumentar a lucratividade',
        perspectivaEstrategica: 'Financeira',
        descricaoObjetivoEstrategico: 'Maximizar os lucros da empresa',
        descricaoIndicador: 'Total de receitas geradas no mês',
        finalidadeIndicador: 'Avaliar o desempenho financeiro',
        dimensaoDesempenho: 'Eficiência (E3)',
        formula: 'Soma das receitas no período',
        fonteFormaColeta: 'Sistema financeiro',
        pesoIndicador: '2',
        interpretacaoIndicador: 'Valores maiores indicam melhor desempenho',
        meta: '100000',
        tiposAcumulacao: 'Soma',
        polaridade: 'Positiva',
        periodicidadeColeta: 'Mensal',
        frequenciaMeta: 'Mensal',
      },
      {
        codigo: 'HR I.3',
        nomeIndicador: 'Número de Contratações',
        area: 'Recursos Humanos',
        unidadeMedida: 'Qtd.',
        classificador: 'RH',
        responsavel: 'José Santos',
        objetivoEstrategico: 'Expandir a equipe',
        perspectivaEstrategica: 'Crescimento',
        descricaoObjetivoEstrategico: 'Aumentar o quadro de funcionários',
        descricaoIndicador: 'Quantidade de novas contratações',
        finalidadeIndicador: 'Medir a expansão da equipe',
        dimensaoDesempenho: 'Eficácia (E2)',
        formula: 'Total de contratações no período',
        fonteFormaColeta: 'Sistema de RH',
        pesoIndicador: '1',
        interpretacaoIndicador: 'Valores maiores indicam crescimento',
        meta: '10',
        tiposAcumulacao: 'Soma',
        polaridade: 'Positiva',
        periodicidadeColeta: 'Mensal',
        frequenciaMeta: 'Mensal',
      },
      {
        codigo: 'ENG I.4',
        nomeIndicador: 'Projetos Concluídos',
        area: 'Engenharia',
        unidadeMedida: 'Qtd.',
        classificador: 'Projetos',
        responsavel: 'Ana Oliveira',
        objetivoEstrategico: 'Melhorar a eficiência',
        perspectivaEstrategica: 'Processos Internos',
        descricaoObjetivoEstrategico: 'Aumentar a taxa de conclusão de projetos',
        descricaoIndicador: 'Número de projetos finalizados',
        finalidadeIndicador: 'Avaliar a produtividade da equipe',
        dimensaoDesempenho: 'Eficiência (E3)',
        formula: 'Total de projetos concluídos no período',
        fonteFormaColeta: 'Sistema de gerenciamento de projetos',
        pesoIndicador: '1.5',
        interpretacaoIndicador: 'Valores maiores indicam maior produtividade',
        meta: '5',
        tiposAcumulacao: 'Soma',
        polaridade: 'Positiva',
        periodicidadeColeta: 'Mensal',
        frequenciaMeta: 'Mensal',
      },
      {
        codigo: 'MKT I.5',
        nomeIndicador: 'Engajamento em Redes Sociais',
        area: 'Marketing',
        unidadeMedida: '%',
        classificador: 'Marketing Digital',
        responsavel: 'Pedro Lima',
        objetivoEstrategico: 'Aumentar a visibilidade da marca',
        perspectivaEstrategica: 'Clientes',
        descricaoObjetivoEstrategico: 'Melhorar a interação com o público',
        descricaoIndicador: 'Taxa de engajamento nas redes sociais',
        finalidadeIndicador: 'Avaliar a eficácia das campanhas digitais',
        dimensaoDesempenho: 'Eficácia (E2)',
        formula: '(Total de interações / Total de seguidores) * 100',
        fonteFormaColeta: 'Ferramentas de análise de redes sociais',
        pesoIndicador: '1',
        interpretacaoIndicador: 'Valores maiores indicam melhor engajamento',
        meta: '15',
        tiposAcumulacao: 'Média',
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
    setSelectedIndicators([]); // Limpar seleção após filtrar
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
    setSelectedIndicators([]); // Limpar seleção após limpar filtros
  };

  const handleEditClick = (indicador) => {
    setIndicadorSelecionado(indicador);
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
    // Atualizar o indicador no array de indicadores
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

  const FormGroup = ({ label, children }) => (
    <FormControl isRequired mb={3}>
      <FormLabel>{label}</FormLabel>
      {children}
    </FormControl>
  );

  // Função para lidar com a seleção de indicadores
  const handleCheckboxChange = (codigo) => {
    setSelectedIndicators((prevSelected) => {
      if (prevSelected.includes(codigo)) {
        // Remover do selecionado
        return prevSelected.filter((item) => item !== codigo);
      } else {
        // Adicionar ao selecionado
        return [...prevSelected, codigo];
      }
    });
  };

  // Função para selecionar/desmarcar todos
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCodes = dadosFiltrados.map((item) => item.codigo);
      setSelectedIndicators(allCodes);
    } else {
      setSelectedIndicators([]);
    }
  };

  // Função para exportar indicadores selecionados para PDF
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

    // Definir as colunas
    const colunas = [
      { header: 'Código', dataKey: 'codigo' },
      { header: 'Nome Indicador', dataKey: 'nomeIndicador' },
      { header: 'Área', dataKey: 'area' },
      { header: 'Unid. Med.', dataKey: 'unidadeMedida' },
      { header: 'Classificador', dataKey: 'classificador' },
      { header: 'Responsável', dataKey: 'responsavel' },
    ];

    // Obter os dados dos indicadores selecionados
    const dados = indicadores
      .filter((item) => selectedIndicators.includes(item.codigo))
      .map((item) => ({
        codigo: item.codigo,
        nomeIndicador: item.nomeIndicador,
        area: item.area,
        unidadeMedida: item.unidadeMedida,
        classificador: item.classificador,
        responsavel: item.responsavel,
      }));

    // Gerar a tabela no PDF usando autoTable
    autoTable(doc, {
      columns: colunas,
      body: dados,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Salvar o PDF
    doc.save('indicadores_selecionados.pdf');
  };

  // Função para exportar indicadores selecionados para Excel
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

    // Obter os dados dos indicadores selecionados
    const dados = indicadores
      .filter((item) => selectedIndicators.includes(item.codigo))
      .map((item) => ({
        Código: item.codigo,
        'Nome Indicador': item.nomeIndicador,
        Área: item.area,
        'Unid. Med.': item.unidadeMedida,
        Classificador: item.classificador,
        Responsável: item.responsavel,
      }));

    // Criar uma nova planilha
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Indicadores Selecionados');

    // Gerar o arquivo Excel
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'indicadores_selecionados.xlsx');
  };

  return (
    <Box>
      <Box mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Bem-vindo, {nomeUsuario ? nomeUsuario : 'Usuário'}!
        </Text>
      </Box>

      {/* Botões de exportação dos indicadores selecionados */}
      <HStack spacing={4} mb={4}>
        <Button colorScheme="red" onClick={exportarSelecionadosParaPDF}>
          Exportar Selecionados para PDF
        </Button>
        <Button colorScheme="green" onClick={exportarSelecionadosParaExcel}>
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
                  onChange={handleSelectAll}
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
                    onChange={() => handleCheckboxChange(item.codigo)}
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
                    aria-label='Visualizar'
                    icon={<FaSearch />}
                    size="sm"
                    mr={2}
                    onClick={() => handleEditClick(item)}
                  />
                  <IconButton
                    aria-label='Editar'
                    icon={<FaRegEdit />}
                    size="sm"
                    onClick={() => handleEditClick(item)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            {/* ... */}
          </Tfoot>
        </Table>
      </TableContainer>

      {/* Modal de Edição */}
      {indicadorSelecionado && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose} size="xl">
          <ModalOverlay />
          <ModalContent maxH="80vh" overflowY="auto">
            <ModalHeader>Editar Indicador</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                {/* POSICIONAMENTO NO MAPA ESTRATÉGICO */}
                <Heading as="h2" size="md">
                  Posicionamento no Mapa Estratégico
                </Heading>
                <FormGroup label="Código do Indicador">
                  <Input
                    type="text"
                    name="codigo"
                    value={indicadorSelecionado.codigo}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Nome do Indicador">
                  <Input
                    type="text"
                    name="nomeIndicador"
                    value={indicadorSelecionado.nomeIndicador}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Objetivo Estratégico Associado">
                  <Input
                    type="text"
                    name="objetivoEstrategico"
                    value={indicadorSelecionado.objetivoEstrategico || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Perspectiva Estratégica">
                  <Input
                    type="text"
                    name="perspectivaEstrategica"
                    value={indicadorSelecionado.perspectivaEstrategica || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Descrição do Objetivo Estratégico">
                  <Textarea
                    name="descricaoObjetivoEstrategico"
                    value={indicadorSelecionado.descricaoObjetivoEstrategico || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                {/* INFORMAÇÕES GERAIS */}
                <Heading as="h2" size="md">
                  Informações Gerais
                </Heading>
                <FormGroup label="Descrição do Indicador">
                  <Textarea
                    name="descricaoIndicador"
                    value={indicadorSelecionado.descricaoIndicador || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Finalidade do Indicador">
                  <Textarea
                    name="finalidadeIndicador"
                    value={indicadorSelecionado.finalidadeIndicador || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Dimensão do Desempenho">
                  <Select
                    name="dimensaoDesempenho"
                    value={indicadorSelecionado.dimensaoDesempenho || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione a dimensão do desempenho"
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
                  />
                </FormGroup>
                <FormGroup label="Fonte/Forma de Coleta dos Dados">
                  <Textarea
                    name="fonteFormaColeta"
                    value={indicadorSelecionado.fonteFormaColeta || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Peso do Indicador">
                  <Input
                    type="number"
                    name="pesoIndicador"
                    value={indicadorSelecionado.pesoIndicador || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Interpretação do Indicador/Recomendações">
                  <Textarea
                    name="interpretacaoIndicador"
                    value={indicadorSelecionado.interpretacaoIndicador || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Área Responsável">
                  <Input
                    type="text"
                    name="area"
                    value={indicadorSelecionado.area || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                {/* DESEMPENHO */}
                <Heading as="h2" size="md">
                  Desempenho
                </Heading>
                <FormGroup label="Meta">
                  <Input
                    type="number"
                    name="meta"
                    value={indicadorSelecionado.meta || ''}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup label="Tipos de Acumulação">
                  <Select
                    name="tiposAcumulacao"
                    value={indicadorSelecionado.tiposAcumulacao || ''}
                    onChange={handleInputChange}
                    placeholder="Selecione o tipo de acumulação"
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
                  />
                </FormGroup>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleSaveChanges}>
                Salvar
              </Button>
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




// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   Thead,
//   Tbody,
//   Tfoot,
//   Tr,
//   Th,
//   Td,
//   TableContainer,
//   Input,
//   Select,
//   IconButton,
//   Button,
//   HStack,
//   Checkbox,
//   Box,
//   Text,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   VStack,
//   FormControl,
//   FormLabel,
//   Textarea,
//   Heading,
//   useToast,
// } from '@chakra-ui/react';
// import { FaSearch, FaRegEdit } from "react-icons/fa";

// export default function IndicadorPage() {
//   const [nomeUsuario, setNomeUsuario] = useState('');
//   const [indicadores, setIndicadores] = useState([]);
//   const [filtros, setFiltros] = useState({
//     codigo: '',
//     nomeIndicador: '',
//     area: '',
//     unidadeMedida: '',
//     classificador: '',
//     responsavel: '',
//   });
//   const [dadosFiltrados, setDadosFiltrados] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [indicadorSelecionado, setIndicadorSelecionado] = useState(null);
//   const toast = useToast();

//   useEffect(() => {
//     // Buscar nome do usuário no localStorage
//     const nome = localStorage.getItem('nomeUsuario');
//     if (nome) {
//       setNomeUsuario(nome);
//     }

//     // Dados iniciais (fictícios)
//     const dadosIniciais = [
//       {
//         codigo: 'BIBLIO I.1',
//         nomeIndicador: 'Quantidade de Empréstimos',
//         area: 'BIBLIO Biblioteca',
//         unidadeMedida: 'Qtd.',
//         classificador: 'Monitoramento Operacional',
//         responsavel: 'Igor Guevara',
//         objetivoEstrategico: 'Aumentar o número de empréstimos',
//         perspectivaEstrategica: 'Crescimento',
//         descricaoObjetivoEstrategico: 'Melhorar o engajamento dos usuários',
//         descricaoIndicador: 'Número total de empréstimos realizados',
//         finalidadeIndicador: 'Medir a utilização da biblioteca',
//         dimensaoDesempenho: 'Efetividade (E1)',
//         formula: 'Total de empréstimos no período',
//         fonteFormaColeta: 'Sistema de empréstimos',
//         pesoIndicador: '1',
//         interpretacaoIndicador: 'Valores maiores indicam melhor desempenho',
//         meta: '500',
//         tiposAcumulacao: 'Soma',
//         polaridade: 'Positiva',
//         periodicidadeColeta: 'Mensal',
//         frequenciaMeta: 'Mensal',
//       },
//       {
//         codigo: 'FIN I.2',
//         nomeIndicador: 'Receita Mensal',
//         area: 'Financeiro',
//         unidadeMedida: 'R$',
//         classificador: 'Financeiro',
//         responsavel: 'Maria Silva',
//         objetivoEstrategico: 'Aumentar a lucratividade',
//         perspectivaEstrategica: 'Financeira',
//         descricaoObjetivoEstrategico: 'Maximizar os lucros da empresa',
//         descricaoIndicador: 'Total de receitas geradas no mês',
//         finalidadeIndicador: 'Avaliar o desempenho financeiro',
//         dimensaoDesempenho: 'Eficiência (E3)',
//         formula: 'Soma das receitas no período',
//         fonteFormaColeta: 'Sistema financeiro',
//         pesoIndicador: '2',
//         interpretacaoIndicador: 'Valores maiores indicam melhor desempenho',
//         meta: '100000',
//         tiposAcumulacao: 'Soma',
//         polaridade: 'Positiva',
//         periodicidadeColeta: 'Mensal',
//         frequenciaMeta: 'Mensal',
//       },
//       {
//         codigo: 'HR I.3',
//         nomeIndicador: 'Número de Contratações',
//         area: 'Recursos Humanos',
//         unidadeMedida: 'Qtd.',
//         classificador: 'RH',
//         responsavel: 'José Santos',
//         objetivoEstrategico: 'Expandir a equipe',
//         perspectivaEstrategica: 'Crescimento',
//         descricaoObjetivoEstrategico: 'Aumentar o quadro de funcionários',
//         descricaoIndicador: 'Quantidade de novas contratações',
//         finalidadeIndicador: 'Medir a expansão da equipe',
//         dimensaoDesempenho: 'Eficácia (E2)',
//         formula: 'Total de contratações no período',
//         fonteFormaColeta: 'Sistema de RH',
//         pesoIndicador: '1',
//         interpretacaoIndicador: 'Valores maiores indicam crescimento',
//         meta: '10',
//         tiposAcumulacao: 'Soma',
//         polaridade: 'Positiva',
//         periodicidadeColeta: 'Mensal',
//         frequenciaMeta: 'Mensal',
//       },
//       {
//         codigo: 'ENG I.4',
//         nomeIndicador: 'Projetos Concluídos',
//         area: 'Engenharia',
//         unidadeMedida: 'Qtd.',
//         classificador: 'Projetos',
//         responsavel: 'Ana Oliveira',
//         objetivoEstrategico: 'Melhorar a eficiência',
//         perspectivaEstrategica: 'Processos Internos',
//         descricaoObjetivoEstrategico: 'Aumentar a taxa de conclusão de projetos',
//         descricaoIndicador: 'Número de projetos finalizados',
//         finalidadeIndicador: 'Avaliar a produtividade da equipe',
//         dimensaoDesempenho: 'Eficiência (E3)',
//         formula: 'Total de projetos concluídos no período',
//         fonteFormaColeta: 'Sistema de gerenciamento de projetos',
//         pesoIndicador: '1.5',
//         interpretacaoIndicador: 'Valores maiores indicam maior produtividade',
//         meta: '5',
//         tiposAcumulacao: 'Soma',
//         polaridade: 'Positiva',
//         periodicidadeColeta: 'Mensal',
//         frequenciaMeta: 'Mensal',
//       },
//       {
//         codigo: 'MKT I.5',
//         nomeIndicador: 'Engajamento em Redes Sociais',
//         area: 'Marketing',
//         unidadeMedida: '%',
//         classificador: 'Marketing Digital',
//         responsavel: 'Pedro Lima',
//         objetivoEstrategico: 'Aumentar a visibilidade da marca',
//         perspectivaEstrategica: 'Clientes',
//         descricaoObjetivoEstrategico: 'Melhorar a interação com o público',
//         descricaoIndicador: 'Taxa de engajamento nas redes sociais',
//         finalidadeIndicador: 'Avaliar a eficácia das campanhas digitais',
//         dimensaoDesempenho: 'Eficácia (E2)',
//         formula: '(Total de interações / Total de seguidores) * 100',
//         fonteFormaColeta: 'Ferramentas de análise de redes sociais',
//         pesoIndicador: '1',
//         interpretacaoIndicador: 'Valores maiores indicam melhor engajamento',
//         meta: '15',
//         tiposAcumulacao: 'Média',
//         polaridade: 'Positiva',
//         periodicidadeColeta: 'Mensal',
//         frequenciaMeta: 'Mensal',
//       },
//       // Adicione mais itens conforme necessário
//     ];

//     setIndicadores(dadosIniciais);
//     setDadosFiltrados(dadosIniciais);
//   }, []);

//   const handleFiltroChange = (e) => {
//     const { name, value } = e.target;
//     setFiltros({ ...filtros, [name]: value });
//   };

//   const handleFiltrar = () => {
//     const filtrados = indicadores.filter((item) => {
//       return (
//         (filtros.codigo === '' || item.codigo.toLowerCase().includes(filtros.codigo.toLowerCase())) &&
//         (filtros.nomeIndicador === '' || item.nomeIndicador.toLowerCase().includes(filtros.nomeIndicador.toLowerCase())) &&
//         (filtros.area === '' || item.area === filtros.area) &&
//         (filtros.unidadeMedida === '' || item.unidadeMedida.toLowerCase().includes(filtros.unidadeMedida.toLowerCase())) &&
//         (filtros.classificador === '' || item.classificador === filtros.classificador) &&
//         (filtros.responsavel === '' || item.responsavel === filtros.responsavel)
//       );
//     });
//     setDadosFiltrados(filtrados);
//   };

//   const handleLimpar = () => {
//     setFiltros({
//       codigo: '',
//       nomeIndicador: '',
//       area: '',
//       unidadeMedida: '',
//       classificador: '',
//       responsavel: '',
//     });
//     setDadosFiltrados(indicadores);
//   };

//   const handleEditClick = (indicador) => {
//     setIndicadorSelecionado(indicador);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIndicadorSelecionado(null);
//     setIsModalOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setIndicadorSelecionado({
//       ...indicadorSelecionado,
//       [name]: value,
//     });
//   };

//   const handleSaveChanges = () => {
//     // Atualizar o indicador no array de indicadores
//     const updatedIndicadores = indicadores.map((item) =>
//       item.codigo === indicadorSelecionado.codigo ? indicadorSelecionado : item
//     );
//     setIndicadores(updatedIndicadores);
//     setDadosFiltrados(updatedIndicadores);
//     setIsModalOpen(false);
//     toast({
//       title: 'Sucesso',
//       description: 'Indicador atualizado com sucesso.',
//       status: 'success',
//       duration: 5000,
//       isClosable: true,
//     });
//   };

//   const FormGroup = ({ label, children }) => (
//     <FormControl isRequired mb={3}>
//       <FormLabel>{label}</FormLabel>
//       {children}
//     </FormControl>
//   );

//   return (
//     <Box>
//       <Box mb={4}>
//         <Text fontSize="2xl" fontWeight="bold">
//           Bem-vindo, {nomeUsuario ? nomeUsuario : 'Usuário'}!
//         </Text>
//       </Box>
//       <TableContainer>
//         <Table variant='striped'>
//           <Thead>
//             <Tr>
//               <Th><Checkbox colorScheme="green" /></Th>
//               <Th>Código</Th>
//               <Th>Nome Indicador</Th>
//               <Th>Área</Th>
//               <Th>Unid. Med.</Th>
//               <Th>Classificador</Th>
//               <Th>Responsável</Th>
//               <Th>Ações</Th>
//             </Tr>
//             <Tr>
//               <Th><Checkbox colorScheme="green" /></Th>
//               <Th>
//                 <Input
//                   size="sm"
//                   placeholder="Código"
//                   name="codigo"
//                   value={filtros.codigo}
//                   onChange={handleFiltroChange}
//                 />
//               </Th>
//               <Th>
//                 <Input
//                   size="sm"
//                   placeholder="Nome Indicador"
//                   name="nomeIndicador"
//                   value={filtros.nomeIndicador}
//                   onChange={handleFiltroChange}
//                 />
//               </Th>
//               <Th>
//                 <Select
//                   size="sm"
//                   placeholder="Todas"
//                   name="area"
//                   value={filtros.area}
//                   onChange={handleFiltroChange}
//                 >
//                   <option value="BIBLIO Biblioteca">BIBLIO Biblioteca</option>
//                   <option value="Financeiro">Financeiro</option>
//                   <option value="Recursos Humanos">Recursos Humanos</option>
//                   <option value="Engenharia">Engenharia</option>
//                   <option value="Marketing">Marketing</option>
//                 </Select>
//               </Th>
//               <Th>
//                 <Input
//                   size="sm"
//                   placeholder="Unid. Med."
//                   name="unidadeMedida"
//                   value={filtros.unidadeMedida}
//                   onChange={handleFiltroChange}
//                 />
//               </Th>
//               <Th>
//                 <Select
//                   size="sm"
//                   placeholder="Todos"
//                   name="classificador"
//                   value={filtros.classificador}
//                   onChange={handleFiltroChange}
//                 >
//                   <option value="Monitoramento Operacional">Monitoramento Operacional</option>
//                   <option value="Financeiro">Financeiro</option>
//                   <option value="RH">RH</option>
//                   <option value="Projetos">Projetos</option>
//                   <option value="Marketing Digital">Marketing Digital</option>
//                 </Select>
//               </Th>
//               <Th>
//                 <Select
//                   size="sm"
//                   placeholder="Responsável"
//                   name="responsavel"
//                   value={filtros.responsavel}
//                   onChange={handleFiltroChange}
//                 >
//                   <option value="Igor Guevara">Igor Guevara</option>
//                   <option value="Maria Silva">Maria Silva</option>
//                   <option value="José Santos">José Santos</option>
//                   <option value="Ana Oliveira">Ana Oliveira</option>
//                   <option value="Pedro Lima">Pedro Lima</option>
//                 </Select>
//               </Th>
//               <Th>
//                 <HStack>
//                   <Button size="sm" colorScheme="gray" onClick={handleLimpar}>
//                     Limpar
//                   </Button>
//                   <Button size="sm" colorScheme="blue" onClick={handleFiltrar}>
//                     Filtrar
//                   </Button>
//                 </HStack>
//               </Th>
//             </Tr>
//           </Thead>
//           <Tbody>
//             {dadosFiltrados.map((item, index) => (
//               <Tr key={index}>
//                 <Td><Checkbox colorScheme="green" /></Td>
//                 <Td>{item.codigo}</Td>
//                 <Td>{item.nomeIndicador}</Td>
//                 <Td>{item.area}</Td>
//                 <Td>{item.unidadeMedida}</Td>
//                 <Td>{item.classificador}</Td>
//                 <Td>{item.responsavel}</Td>
//                 <Td>
//                   <IconButton
//                     aria-label='Visualizar'
//                     icon={<FaSearch />}
//                     size="sm"
//                     mr={2}
//                   />
//                   <IconButton
//                     aria-label='Editar'
//                     icon={<FaRegEdit />}
//                     size="sm"
//                     onClick={() => handleEditClick(item)}
//                   />
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//           <Tfoot>
//             <Tr>
//               <Th></Th>
//               <Th></Th>
//               <Th></Th>
//               <Th></Th>
//               <Th></Th>
//               <Th></Th>
//               <Th></Th>
//               <Th></Th>
//             </Tr>
//           </Tfoot>
//         </Table>
//       </TableContainer>

//       {/* Modal de Edição */}
//       {indicadorSelecionado && (
//         <Modal isOpen={isModalOpen} onClose={handleModalClose} size="xl">
//           <ModalOverlay />
//           <ModalContent maxH="80vh" overflowY="auto">
//             <ModalHeader>Editar Indicador</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody>
//               <VStack spacing={4} align="stretch">
//                 {/* POSICIONAMENTO NO MAPA ESTRATÉGICO */}
//                 <Heading as="h2" size="md">
//                   Posicionamento no Mapa Estratégico
//                 </Heading>
//                 <FormGroup label="Código do Indicador">
//                   <Input
//                     type="text"
//                     name="codigo"
//                     value={indicadorSelecionado.codigo}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Nome do Indicador">
//                   <Input
//                     type="text"
//                     name="nomeIndicador"
//                     value={indicadorSelecionado.nomeIndicador}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Objetivo Estratégico Associado">
//                   <Input
//                     type="text"
//                     name="objetivoEstrategico"
//                     value={indicadorSelecionado.objetivoEstrategico || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Perspectiva Estratégica">
//                   <Input
//                     type="text"
//                     name="perspectivaEstrategica"
//                     value={indicadorSelecionado.perspectivaEstrategica || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Descrição do Objetivo Estratégico">
//                   <Textarea
//                     name="descricaoObjetivoEstrategico"
//                     value={indicadorSelecionado.descricaoObjetivoEstrategico || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>

//                 {/* INFORMAÇÕES GERAIS */}
//                 <Heading as="h2" size="md">
//                   Informações Gerais
//                 </Heading>
//                 <FormGroup label="Descrição do Indicador">
//                   <Textarea
//                     name="descricaoIndicador"
//                     value={indicadorSelecionado.descricaoIndicador || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Finalidade do Indicador">
//                   <Textarea
//                     name="finalidadeIndicador"
//                     value={indicadorSelecionado.finalidadeIndicador || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Dimensão do Desempenho">
//                   <Select
//                     name="dimensaoDesempenho"
//                     value={indicadorSelecionado.dimensaoDesempenho || ''}
//                     onChange={handleInputChange}
//                     placeholder="Selecione a dimensão do desempenho"
//                   >
//                     <option value="Efetividade (E1)">Efetividade (E1)</option>
//                     <option value="Eficácia (E2)">Eficácia (E2)</option>
//                     <option value="Eficiência (E3)">Eficiência (E3)</option>
//                     <option value="Execução (E4)">Execução (E4)</option>
//                     <option value="Excelência (E5)">Excelência (E5)</option>
//                     <option value="Economicidade (E6)">Economicidade (E6)</option>
//                   </Select>
//                 </FormGroup>

//                 <FormGroup label="Fórmula">
//                   <Input
//                     type="text"
//                     name="formula"
//                     value={indicadorSelecionado.formula || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Fonte/Forma de Coleta dos Dados">
//                   <Textarea
//                     name="fonteFormaColeta"
//                     value={indicadorSelecionado.fonteFormaColeta || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Peso do Indicador">
//                   <Input
//                     type="number"
//                     name="pesoIndicador"
//                     value={indicadorSelecionado.pesoIndicador || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Interpretação do Indicador/Recomendações">
//                   <Textarea
//                     name="interpretacaoIndicador"
//                     value={indicadorSelecionado.interpretacaoIndicador || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Área Responsável">
//                   <Input
//                     type="text"
//                     name="area"
//                     value={indicadorSelecionado.area || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>

//                 {/* DESEMPENHO */}
//                 <Heading as="h2" size="md">
//                   Desempenho
//                 </Heading>
//                 <FormGroup label="Meta">
//                   <Input
//                     type="number"
//                     name="meta"
//                     value={indicadorSelecionado.meta || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//                 <FormGroup label="Tipos de Acumulação">
//                   <Select
//                     name="tiposAcumulacao"
//                     value={indicadorSelecionado.tiposAcumulacao || ''}
//                     onChange={handleInputChange}
//                     placeholder="Selecione o tipo de acumulação"
//                   >
//                     <option value="Saldo">Saldo</option>
//                     <option value="Soma">Soma</option>
//                     <option value="Média">Média</option>
//                   </Select>
//                 </FormGroup>
//                 <FormGroup label="Polaridade">
//                   <Select
//                     name="polaridade"
//                     value={indicadorSelecionado.polaridade || ''}
//                     onChange={handleInputChange}
//                     placeholder="Selecione a polaridade"
//                   >
//                     <option value="Negativa">Negativa</option>
//                     <option value="Positiva">Positiva</option>
//                     <option value="Estável">Estável</option>
//                   </Select>
//                 </FormGroup>
//                 <FormGroup label="Periodicidade de Coleta">
//                   <Select
//                     name="periodicidadeColeta"
//                     value={indicadorSelecionado.periodicidadeColeta || ''}
//                     onChange={handleInputChange}
//                     placeholder="Selecione a periodicidade de coleta"
//                   >
//                     <option value="Mensal">Mensal</option>
//                     <option value="Bimestral">Bimestral</option>
//                     <option value="Trimestral">Trimestral</option>
//                     <option value="Quadrimestral">Quadrimestral</option>
//                     <option value="Semestral">Semestral</option>
//                     <option value="Anual">Anual</option>
//                     <option value="Bianual">Bianual</option>
//                     <option value="Trianual">Trianual</option>
//                   </Select>
//                 </FormGroup>
//                 <FormGroup label="Frequência da Meta">
//                   <Select
//                     name="frequenciaMeta"
//                     value={indicadorSelecionado.frequenciaMeta || ''}
//                     onChange={handleInputChange}
//                     placeholder="Selecione a frequência da meta"
//                   >
//                     <option value="Mensal">Mensal</option>
//                     <option value="Bimestral">Bimestral</option>
//                     <option value="Trimestral">Trimestral</option>
//                     <option value="Quadrimestral">Quadrimestral</option>
//                     <option value="Semestral">Semestral</option>
//                     <option value="Anual">Anual</option>
//                     <option value="Bianual">Bianual</option>
//                     <option value="Trianual">Trianual</option>
//                   </Select>
//                 </FormGroup>
//                 <FormGroup label="Unidade de Medida">
//                   <Input
//                     type="text"
//                     name="unidadeMedida"
//                     value={indicadorSelecionado.unidadeMedida || ''}
//                     onChange={handleInputChange}
//                   />
//                 </FormGroup>
//               </VStack>
//             </ModalBody>

//             <ModalFooter>
//               <Button colorScheme="red" mr={3} onClick={handleSaveChanges}>
//                 Salvar
//               </Button>
//               <Button variant="ghost" onClick={handleModalClose}>
//                 Cancelar
//               </Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       )}
//     </Box>
//   );
// }
