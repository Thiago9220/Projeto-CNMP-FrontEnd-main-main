import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import Header from '../../components/Header';

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
  });

  // Estado para controlar a exibição da aba "Ficha"
  const [showFicha, setShowFicha] = useState(false);

  // Função para lidar com mudanças nos campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      setShowFicha(true); // Exibe a aba "Ficha" após salvar
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

      <FormGroup label="Fórmula">
        <Input
          type="text"
          name="formula"
          value={formData.formula}
          onChange={handleChange}
          placeholder="Digite a fórmula do indicador"
        />
      </FormGroup>
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

  const renderFichaTab = () => (
    <VStack spacing={4} align="stretch">
      <Heading as="h2" size="lg">
        Ficha do Indicador
      </Heading>
      <p><strong>Código do Indicador:</strong> {formData.codigoIndicador}</p>
      <p><strong>Nome do Indicador:</strong> {formData.nomeIndicador}</p>
      <p><strong>Objetivo Estratégico:</strong> {formData.objetivoEstrategico}</p>
      <p><strong>Perspectiva Estratégica:</strong> {formData.perspectivaEstrategica}</p>
      <p><strong>Descrição do Objetivo Estratégico:</strong> {formData.descricaoObjetivoEstrategico}</p>
      <p><strong>Descrição do Indicador:</strong> {formData.descricaoIndicador}</p>
      <p><strong>Finalidade do Indicador:</strong> {formData.finalidadeIndicador}</p>
      <p><strong>Dimensão do Desempenho:</strong> {formData.dimensaoDesempenho}</p>
      <p><strong>Fórmula:</strong> {formData.formula}</p>
      <p><strong>Fonte/Forma de Coleta:</strong> {formData.fonteFormaColeta}</p>
      <p><strong>Peso do Indicador:</strong> {formData.pesoIndicador}</p>
      <p><strong>Interpretação/Recomendações:</strong> {formData.interpretacaoIndicador}</p>
      <p><strong>Área Responsável:</strong> {formData.areaResponsavel}</p>
      <p><strong>Meta:</strong> {formData.meta}</p>
      <p><strong>Tipos de Acumulação:</strong> {formData.tiposAcumulacao}</p>
      <p><strong>Polaridade:</strong> {formData.polaridade}</p>
      <p><strong>Periodicidade de Coleta:</strong> {formData.periodicidadeColeta}</p>
      <p><strong>Frequência da Meta:</strong> {formData.frequenciaMeta}</p>
      <p><strong>Unidade de Medida:</strong> {formData.unidadeMedida}</p>
    </VStack>
  );

  return (
    <Header>
      <Box p={4}>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Geral</Tab>
            {showFicha && <Tab>Ficha</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>{renderGeneralTab()}</TabPanel>
            {showFicha && <TabPanel>{renderFichaTab()}</TabPanel>}
          </TabPanels>
        </Tabs>
      </Box>
    </Header>
  );
};

export default AdminPage;
