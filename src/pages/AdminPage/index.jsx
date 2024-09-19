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
} from '@chakra-ui/react';
import Header from '../../components/Header';

const FormGroup = ({ label, children }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    {children}
  </FormControl>
);

const AdminPage = () => {
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
    quantidadeComponentes: '',
    componentes: [],
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

  // Função para lidar com mudanças nos campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para lidar com mudanças na quantidade de componentes
  const handleQuantidadeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setFormData({
        ...formData,
        quantidadeComponentes: value,
        componentes: Array(value).fill(''),
      });
    }
  };

  // Função para lidar com mudanças nos campos de componentes
  const handleComponentChange = (index, value) => {
    const newComponentes = [...formData.componentes];
    newComponentes[index] = value;
    setFormData({ ...formData, componentes: newComponentes });
  };

  // Função para simular o envio dos dados
  const handleSave = () => {
    // Aqui você pode verificar os dados do formulário
    console.log('Dados do formulário:', formData);
    alert('Dados capturados com sucesso! Confira o console para ver os detalhes.');
  };

  const renderGeneralTab = () => (
    <VStack spacing={4} align="stretch">
      {/* POSICIONAMENTO NO MAPA ESTRATÉGICO */}
      <Heading as="h2" size="lg">Posicionamento no Mapa Estratégico</Heading>
      <FormGroup label="Código do Indicador">
        <Input 
          type="text" 
          name="codigoIndicador" 
          value={formData.codigoIndicador} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Nome do Indicador">
        <Input 
          type="text" 
          name="nomeIndicador" 
          value={formData.nomeIndicador} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Objetivo Estratégico Associado">
        <Input 
          type="text" 
          name="objetivoEstrategico" 
          value={formData.objetivoEstrategico} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Perspectiva Estratégica">
        <Input 
          type="text" 
          name="perspectivaEstrategica" 
          value={formData.perspectivaEstrategica} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Descrição do Objetivo Estratégico">
        <Textarea 
          name="descricaoObjetivoEstrategico" 
          value={formData.descricaoObjetivoEstrategico} 
          onChange={handleChange} 
        />
      </FormGroup>

      {/* INFORMAÇÕES GERAIS */}
      <Heading as="h2" size="lg">Informações Gerais</Heading>
      <FormGroup label="Descrição do Indicador">
        <Textarea 
          name="descricaoIndicador" 
          value={formData.descricaoIndicador} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Finalidade do Indicador">
        <Textarea 
          name="finalidadeIndicador" 
          value={formData.finalidadeIndicador} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Dimensão do Desempenho">
        <Select 
          name="dimensaoDesempenho" 
          value={formData.dimensaoDesempenho} 
          onChange={handleChange}
        >
          <option value="E1">Efetividade (E1)</option>
          <option value="E2">Eficácia (E2)</option>
          <option value="E3">Eficiência (E3)</option>
          <option value="E4">Execução (E4)</option>
          <option value="E5">Excelência (E5)</option>
          <option value="E6">Economicidade (E6)</option>
        </Select>
      </FormGroup>
      <FormGroup label="Quantidade de Componentes da Fórmula">
        <Input 
          type="number" 
          name="quantidadeComponentes" 
          value={formData.quantidadeComponentes} 
          onChange={handleQuantidadeChange}
          placeholder="Digite o número de componentes"
        />
      </FormGroup>

      {/* Renderizar campos de descrição dos componentes com base na quantidade */}
      {Array.from({ length: formData.quantidadeComponentes }).map((_, index) => (
        <FormGroup key={index} label={`Descrição do Componente ${index + 1}`}>
          <Textarea
            value={formData.componentes[index] || ''}
            onChange={(e) => handleComponentChange(index, e.target.value)}
            placeholder={`Descrição do Componente ${index + 1}`}
          />
        </FormGroup>
      ))}

      <FormGroup label="Fórmula">
        <Input 
          type="text" 
          name="formula" 
          value={formData.formula} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Fonte/Forma de Coleta dos Dados">
        <Textarea 
          name="fonteFormaColeta" 
          value={formData.fonteFormaColeta} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Peso do Indicador">
        <Input 
          type="number" 
          name="pesoIndicador" 
          value={formData.pesoIndicador} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Interpretação do Indicador/Recomendações">
        <Textarea 
          name="interpretacaoIndicador" 
          value={formData.interpretacaoIndicador} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Área Responsável">
        <Input 
          type="text" 
          name="areaResponsavel" 
          value={formData.areaResponsavel} 
          onChange={handleChange} 
        />
      </FormGroup>

      {/* DESEMPENHO */}
      <Heading as="h2" size="lg">Desempenho</Heading>
      <FormGroup label="Meta">
        <Input 
          type="number" 
          name="meta" 
          value={formData.meta} 
          onChange={handleChange} 
        />
      </FormGroup>
      <FormGroup label="Tipos de Acumulação">
        <Select 
          name="tiposAcumulacao" 
          value={formData.tiposAcumulacao} 
          onChange={handleChange}
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
        />
      </FormGroup>
      
      <Button colorScheme="red" background={'red.600'} onClick={handleSave}>Salvar</Button>
    </VStack>
  );

  return (
    <Header>
      <Box p={4}>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Geral</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{renderGeneralTab()}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Header>
  );
};

export default AdminPage;

