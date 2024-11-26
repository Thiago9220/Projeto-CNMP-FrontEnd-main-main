// src/pages/AdminPage/index.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs as ChakraTabs,
  Textarea,
  VStack,
  Heading,
  useToast,
  Text,
} from '@chakra-ui/react';
import Header from '../../components/Header';

// Importar o componente FormulaEditor
import FormulaEditor from '../../components/FormulaEditor/FormulaEditor';

const FormGroup = ({ label, children }) => (
  <FormControl isRequired>
    <FormLabel>{label}</FormLabel>
    {children}
  </FormControl>
);

const AdminPage = () => {
  const toast = useToast();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    codigoIndicador: '',
    nomeIndicador: '',
    objetivoEstrategico: '',
    perspectivaEstrategica: '',
    descricaoObjetivoEstrategico: '',
    descricaoIndicador: '',
    finalidadeIndicador: '',
    dimensaoDesempenho: '',
    formula: '',
    fonteFormaColeta: '',
    pesoIndicador: '',
    interpretacaoIndicador: '',
    areaResponsavel: '',
    meta: '',
    tiposAcumulacao: '',
    polaridade: '',
    periodicidadeColeta: '',
    frequenciaMeta: '',
    unidadeMedida: '',
    numeroComponentes: '',
    componentes: [],
  });

  // Estados para controlar a edição dos componentes
  const [editingComponents, setEditingComponents] = useState([]);
  const [componentOriginalValues, setComponentOriginalValues] = useState([]);

  // Estado para controlar o modal da fórmula
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);

  // Função para abrir o modal da fórmula
  const openFormulaModal = () => setIsFormulaModalOpen(true);

  // Função para fechar o modal da fórmula
  const closeFormulaModal = () => setIsFormulaModalOpen(false);

  // Função para salvar a fórmula
  const saveFormula = (latexFormula) => {
    setFormData({ ...formData, formula: latexFormula });
    closeFormulaModal();
  };

  // Função para lidar com mudanças nos campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Se o campo é 'numeroComponentes', atualiza o número de componentes e reseta os valores anteriores
    if (name === 'numeroComponentes') {
      const numComponents = parseInt(value, 10) || 0;
      const newComponents = Array(numComponents).fill({ valor: '' });
      setFormData({ ...formData, [name]: value, componentes: newComponents });
      setEditingComponents(Array(numComponents).fill(false));
      setComponentOriginalValues(Array(numComponents).fill(''));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Função para lidar com mudanças nos valores dos componentes
  const handleComponentChange = (index, e) => {
    const { name, value } = e.target;
    const newComponents = [...formData.componentes];
    newComponents[index] = { ...newComponents[index], [name]: value };
    setFormData({ ...formData, componentes: newComponents });
  };

  // Funções para manipulação dos componentes
  const startComponentEdit = (index) => {
    setComponentOriginalValues((prev) => {
      const updated = [...prev];
      updated[index] = formData.componentes[index].valor;
      return updated;
    });
    setEditingComponents((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  const saveComponentValue = (index) => {
    setEditingComponents((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setComponentOriginalValues((prev) => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
  };

  const cancelComponentEdit = (index) => {
    const originalValue = componentOriginalValues[index];
    setFormData((prev) => {
      const updatedComponents = [...prev.componentes];
      updatedComponents[index] = { ...updatedComponents[index], valor: originalValue };
      return { ...prev, componentes: updatedComponents };
    });
    setEditingComponents((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    setComponentOriginalValues((prev) => {
      const updated = [...prev];
      updated[index] = '';
      return updated;
    });
  };

  // Função para validar e enviar os dados para o backend
  const handleSave = async () => {
    if (!formData.codigoIndicador || !formData.nomeIndicador) {
      toast({
        title: 'Erro',
        description: 'Preencha os campos obrigatórios.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/indicadores/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao enviar dados');
      }

      const data = await response.json();
      console.log('Dados enviados com sucesso:', data);
      toast({
        title: 'Sucesso',
        description: 'Indicador cadastrado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível cadastrar o indicador.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderGeneralTab = () => (
    <VStack spacing={4} align="stretch">
      {/* POSICIONAMENTO NO MAPA ESTRATÉGICO */}
      <Heading as="h2" size="lg">
        Posicionamento no Mapa Estratégico
      </Heading>
      <FormGroup label="Código do Indicador">
        <Input
          type="text"
          name="codigoIndicador"
          value={formData.codigoIndicador}
          onChange={handleChange}
          placeholder="Digite o código do indicador"
        />
      </FormGroup>
      <FormGroup label="Nome do Indicador">
        <Input
          type="text"
          name="nomeIndicador"
          value={formData.nomeIndicador}
          onChange={handleChange}
          placeholder="Digite o nome do indicador"
        />
      </FormGroup>
      <FormGroup label="Objetivo Estratégico Associado">
        <Input
          type="text"
          name="objetivoEstrategico"
          value={formData.objetivoEstrategico}
          onChange={handleChange}
          placeholder="Digite o objetivo estratégico"
        />
      </FormGroup>
      <FormGroup label="Perspectiva Estratégica">
        <Input
          type="text"
          name="perspectivaEstrategica"
          value={formData.perspectivaEstrategica}
          onChange={handleChange}
          placeholder="Digite a perspectiva estratégica"
        />
      </FormGroup>
      <FormGroup label="Descrição do Objetivo Estratégico">
        <Textarea
          name="descricaoObjetivoEstrategico"
          value={formData.descricaoObjetivoEstrategico}
          onChange={handleChange}
          placeholder="Descreva o objetivo estratégico"
        />
      </FormGroup>

      {/* INFORMAÇÕES GERAIS */}
      <Heading as="h2" size="lg">
        Informações Gerais
      </Heading>
      <FormGroup label="Descrição do Indicador">
        <Textarea
          name="descricaoIndicador"
          value={formData.descricaoIndicador}
          onChange={handleChange}
          placeholder="Descreva o indicador"
        />
      </FormGroup>
      <FormGroup label="Finalidade do Indicador">
        <Textarea
          name="finalidadeIndicador"
          value={formData.finalidadeIndicador}
          onChange={handleChange}
          placeholder="Descreva a finalidade do indicador"
        />
      </FormGroup>
      <FormGroup label="Dimensão do Desempenho">
        <Select
          name="dimensaoDesempenho"
          value={formData.dimensaoDesempenho}
          onChange={handleChange}
          placeholder="Selecione a dimensão do desempenho"
        >
          <option value="E1">Efetividade (E1)</option>
          <option value="E2">Eficácia (E2)</option>
          <option value="E3">Eficiência (E3)</option>
          <option value="E4">Execução (E4)</option>
          <option value="E5">Excelência (E5)</option>
          <option value="E6">Economicidade (E6)</option>
        </Select>
      </FormGroup>

      {/* COMPONENTES */}
      <FormGroup label="Número de componentes">
        <Select
          name="numeroComponentes"
          value={formData.numeroComponentes}
          onChange={handleChange}
          placeholder="Selecione o número de componentes"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </Select>
      </FormGroup>

      {/* Campos para os valores dos componentes */}
      {formData.componentes.map((component, index) => (
        <FormGroup key={index} label={`Componente ${index + 1}`}>
          {editingComponents[index] ? (
            <>
              <Input
                type="text"
                name="valor"
                value={component.valor}
                onChange={(e) => handleComponentChange(index, e)}
                placeholder={`Descreva o componente ${index + 1}`}
              />
              <ButtonGroup mt={2}>
                <Button
                  size="sm"
                  bg="red.600"
                  colorScheme="red"
                  onClick={() => saveComponentValue(index)}
                >
                  Salvar
                </Button>
                <Button size="sm" bg="red.200" onClick={() => cancelComponentEdit(index)}>
                  Cancelar
                </Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              <Text>{component.valor || 'Sem descrição'}</Text>
              <Button
                size="sm"
                mt={2}
                colorScheme="red"
                bg="red.600"
                onClick={() => startComponentEdit(index)}
              >
                Editar
              </Button>
            </>
          )}
        </FormGroup>
      ))}

      {/* Campo de Fórmula com modal */}
      <FormGroup label="Fórmula">
        <Input
          type="text"
          name="formula"
          value={formData.formula}
          onClick={openFormulaModal}
          placeholder="Clique para inserir a fórmula"
          readOnly
        />
      </FormGroup>

      {/* Renderizar o componente FormulaEditor */}
      <FormulaEditor
        isOpen={isFormulaModalOpen}
        onClose={closeFormulaModal}
        onSave={saveFormula}
        initialFormula={formData.formula}
        componentes={formData.componentes}
      />

      <FormControl>
        <FormLabel>Fonte/Forma de Coleta dos Dados</FormLabel>
        <Textarea
          name="fonteFormaColeta"
          value={formData.fonteFormaColeta}
          onChange={handleChange}
          placeholder="Descreva a fonte e forma de coleta"
        />
      </FormControl>
      <FormGroup label="Peso do Indicador">
        <Input
          type="number"
          name="pesoIndicador"
          value={formData.pesoIndicador}
          onChange={handleChange}
          placeholder="Digite o peso do indicador"
        />
      </FormGroup>
      <FormControl>
        <FormLabel>Interpretação do Indicador/Recomendações</FormLabel>
        <Textarea
          name="interpretacaoIndicador"
          value={formData.interpretacaoIndicador}
          onChange={handleChange}
          placeholder="Descreva a interpretação ou recomendações"
        />
      </FormControl>
      <FormGroup label="Área Responsável">
        <Input
          type="text"
          name="areaResponsavel"
          value={formData.areaResponsavel}
          onChange={handleChange}
          placeholder="Digite a área responsável"
        />
      </FormGroup>

      <Heading as="h2" size="lg">
        Desempenho
      </Heading>
      <FormGroup label="Meta">
        <Input
          type="number"
          name="meta"
          value={formData.meta}
          onChange={handleChange}
          placeholder="Digite a meta"
        />
      </FormGroup>
      <FormGroup label="Tipos de Acumulação">
        <Select
          name="tiposAcumulacao"
          value={formData.tiposAcumulacao}
          onChange={handleChange}
          placeholder="Selecione o tipo de acumulação"
        >
          <option value="saldo">Saldo</option>
          <option value="soma">Soma</option>
          <option value="media">Média</option>
        </Select>
      </FormGroup>
      <FormGroup label="Polaridade">
        <Select
          name="polaridade"
          value={formData.polaridade}
          onChange={handleChange}
          placeholder="Selecione a polaridade"
        >
          <option value="negativa">Negativa</option>
          <option value="positiva">Positiva</option>
          <option value="estavel">Estável</option>
        </Select>
      </FormGroup>
      <FormGroup label="Periodicidade de Coleta">
        <Select
          name="periodicidadeColeta"
          value={formData.periodicidadeColeta}
          onChange={handleChange}
          placeholder="Selecione a periodicidade de coleta"
        >
          <option value="mensal">Mensal</option>
          <option value="bimestral">Bimestral</option>
          <option value="trimestral">Trimestral</option>
          <option value="quadrimestral">Quadrimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
          <option value="bianual">Bianual</option>
          <option value="trianual">Trianual</option>
        </Select>
      </FormGroup>
      <FormGroup label="Frequência da Meta">
        <Select
          name="frequenciaMeta"
          value={formData.frequenciaMeta}
          onChange={handleChange}
          placeholder="Selecione a frequência da meta"
        >
          <option value="mensal">Mensal</option>
          <option value="bimestral">Bimestral</option>
          <option value="trimestral">Trimestral</option>
          <option value="quadrimestral">Quadrimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
          <option value="bianual">Bianual</option>
          <option value="trianual">Trianual</option>
        </Select>
      </FormGroup>
      <FormGroup label="Unidade de Medida">
        <Input
          type="text"
          name="unidadeMedida"
          value={formData.unidadeMedida}
          onChange={handleChange}
          placeholder="Digite a unidade de medida"
        />
      </FormGroup>

      <Button colorScheme="red" background={'red.600'} onClick={handleSave}>
        Salvar
      </Button>
    </VStack>
  );

  return (
    <Header>
      <Box p={4}>
        <ChakraTabs variant="enclosed">
          <TabList>
            <Tab color="red.500">Geral</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{renderGeneralTab()}</TabPanel>
          </TabPanels>
        </ChakraTabs>
      </Box>
    </Header>
  );
};

export default AdminPage;
