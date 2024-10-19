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
  Text,
} from '@chakra-ui/react';
import Header from '../../components/Header';
import { evaluate } from 'mathjs'; // Import mathjs for formula evaluation
import axios from 'axios'; // Import axios

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
    componentes: [], // Now each component will have a name and a value
    formula: '',
    formulaResult: null, // To store the result of the formula
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

  // Função para adicionar um novo componente (até 4)
  const handleAddComponent = () => {
    if (formData.componentes.length < 4) {
      setFormData({
        ...formData,
        componentes: [...formData.componentes, { name: '', value: '' }],
      });
    } else {
      alert('Você só pode adicionar até 4 componentes.');
    }
  };

  // Função para lidar com mudanças nos campos de componentes
  const handleComponentChange = (index, field, value) => {
    const newComponentes = [...formData.componentes];
    newComponentes[index][field] = value;
    setFormData({ ...formData, componentes: newComponentes });
  };

  // Função para deletar um componente específico
  const handleDeleteComponent = (index) => {
    const newComponentes = formData.componentes.filter((_, i) => i !== index);
    setFormData({ ...formData, componentes: newComponentes });
  };

  // Função para avaliar a fórmula
  const evaluateFormula = () => {
    try {
      // Criar um objeto com as variáveis da fórmula
      const variables = {};
      formData.componentes.forEach((component) => {
        if (component.name && component.value !== '') {
          variables[component.name] = parseFloat(component.value);
        }
      });

      // Avaliar a fórmula usando as variáveis
      const result = evaluate(formData.formula, variables);
      setFormData({ ...formData, formulaResult: result });
    } catch (error) {
      alert('Erro ao avaliar a fórmula. Verifique se a fórmula está correta e se todas as variáveis estão definidas.');
    }
  };

  // Função para salvar os dados no backend
  const handleSave = async () => {
    try {
      // Enviar os dados para o backend
      const response = await axios.post('URL_DO_SEU_ENDPOINT', formData);
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Ocorreu um erro ao salvar os dados.');
    }
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

      {/* Componentes */}
      <Heading as="h3" size="md">Componentes</Heading>
      {/* Botão para adicionar componentes */}
      <Button onClick={handleAddComponent}>Adicionar Componente</Button>

      {/* Renderizar campos de nome e valor dos componentes */}
      {formData.componentes.map((component, index) => (
        <Box key={index} borderWidth="1px" borderRadius="md" p={4}>
          <FormGroup label={`Nome do Componente ${index + 1}`}>
            <Input
              value={component.name}
              onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
              placeholder={`Nome do Componente ${index + 1}`}
            />
          </FormGroup>
          <FormGroup label={`Valor do Componente ${index + 1}`}>
            <Input
              type="number"
              value={component.value}
              onChange={(e) => handleComponentChange(index, 'value', e.target.value)}
              placeholder={`Valor do Componente ${index + 1}`}
            />
          </FormGroup>
          <Button colorScheme="red" onClick={() => handleDeleteComponent(index)}>
            Excluir Componente
          </Button>
        </Box>
      ))}

      <FormGroup label="Fórmula (use os nomes dos componentes)">
        <Input 
          type="text" 
          name="formula" 
          value={formData.formula} 
          onChange={handleChange} 
          placeholder="Exemplo: (processo / totalProcessos) * 100"
        />
      </FormGroup>
      <Button onClick={evaluateFormula}>Calcular Fórmula</Button>
      {formData.formulaResult !== null && (
        <Text>Resultado da Fórmula: {formData.formulaResult}</Text>
      )}

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
