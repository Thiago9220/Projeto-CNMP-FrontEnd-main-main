// src/pages/AdminPage.jsx

import React, { useState, useEffect } from 'react';
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
import { evaluate } from 'mathjs';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FormGroup = ({ label, children }) => (
  <FormControl>
    <FormLabel>{label}</FormLabel>
    {children}
  </FormControl>
);

const AdminPage = () => {
  const { id } = useParams(); // Obtém o ID da URL para edição
  const [formData, setFormData] = useState({
    codigoIndicador: '',
    nomeIndicador: '',
    objetivoEstrategico: '',
    perspectivaEstrategica: '',
    descricaoObjetivoEstrategico: '',
    descricaoIndicador: '',
    finalidadeIndicador: '',
    dimensaoDesempenho: '',
    componentes: [],
    currentComponent: { name: '', value: '' },
    formula: '',
    formulaResult: null,
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

  // Carregar dados do indicador se estiver em modo de edição
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/indicadores/${id}`)
        .then((response) => {
          setFormData({
            ...response.data,
            currentComponent: { name: '', value: '' },
            formulaResult: null,
          });
        })
        .catch((error) => {
          console.error('Erro ao buscar indicador:', error);
        });
    }
  }, [id]);

  // Função para lidar com mudanças nos campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para lidar com mudanças nos campos do componente atual
  const handleCurrentComponentChange = (field, value) => {
    setFormData({
      ...formData,
      currentComponent: {
        ...formData.currentComponent,
        [field]: value,
      },
    });
  };

  // Função para adicionar um novo componente (até 4)
  const handleAddComponent = () => {
    if (formData.componentes.length < 4) {
      setFormData({
        ...formData,
        componentes: [...formData.componentes, formData.currentComponent],
        currentComponent: { name: '', value: '' },
      });
    } else {
      alert('Você só pode adicionar até 4 componentes.');
    }
  };

  // Função para cancelar a adição do componente atual
  const handleCancelComponent = () => {
    setFormData({
      ...formData,
      currentComponent: { name: '', value: '' },
    });
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

      // Verificar se todas as variáveis da fórmula estão definidas
      const usedVariables = formData.formula.match(/[a-zA-Z_]\w*/g);
      const undefinedVariables = usedVariables.filter(
        (variable) => !(variable in variables)
      );

      if (undefinedVariables.length > 0) {
        alert(
          `As seguintes variáveis não estão definidas: ${undefinedVariables.join(
            ', '
          )}`
        );
        return;
      }

      // Avaliar a fórmula usando as variáveis
      const result = evaluate(formData.formula, variables);
      setFormData({ ...formData, formulaResult: result });
    } catch (error) {
      alert(
        'Erro ao avaliar a fórmula. Verifique se a fórmula está correta e se todas as variáveis estão definidas.'
      );
    }
  };

  // Função para salvar os dados no backend
  const handleSave = async () => {
    try {
      // Preparar os dados para envio
      const dataToSend = { ...formData };
      delete dataToSend.currentComponent;
      delete dataToSend.formulaResult;

      // Converter campos numéricos
      dataToSend.pesoIndicador = parseFloat(dataToSend.pesoIndicador);
      dataToSend.meta = parseFloat(dataToSend.meta);

      // Enviar os dados para o backend
      if (id) {
        // Atualizar indicador existente
        await axios.put(
          `http://localhost:8000/indicadores/${id}`,
          dataToSend
        );
      } else {
        // Criar novo indicador
        await axios.post('http://localhost:8000/indicadores/', dataToSend);
      }

      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      alert('Ocorreu um erro ao salvar os dados.');
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
      <Heading as="h2" size="lg">
        Informações Gerais
      </Heading>
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
      <Heading as="h3" size="md">
        Componentes
      </Heading>

      {/* Formulário para o Componente Atual */}
      <Box borderWidth="1px" borderRadius="md" p={4}>
        <Heading as="h3" size="md">
          Adicionar Componente
        </Heading>
        <FormGroup label="Nome do Componente">
          <Input
            value={formData.currentComponent.name}
            onChange={(e) =>
              handleCurrentComponentChange('name', e.target.value)
            }
            placeholder="Nome do Componente"
          />
        </FormGroup>
        <FormGroup label="Valor do Componente">
          <Input
            type="number"
            value={formData.currentComponent.value}
            onChange={(e) =>
              handleCurrentComponentChange('value', e.target.value)
            }
            placeholder="Valor do Componente"
          />
        </FormGroup>
        <Button colorScheme="green" onClick={handleAddComponent}>
          Salvar
        </Button>
        <Button onClick={handleCancelComponent} ml={2}>
          Cancelar
        </Button>
      </Box>

      {/* Lista de Componentes Adicionados */}
      {formData.componentes.length > 0 && (
        <Box>
          <Heading as="h3" size="md">
            Componentes Adicionados
          </Heading>
          {formData.componentes.map((component, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              p={4}
              mt={2}
            >
              <Text>
                <strong>Nome:</strong> {component.name}
              </Text>
              <Text>
                <strong>Valor:</strong> {component.value}
              </Text>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteComponent(index)}
                mt={2}
              >
                Excluir Componente
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Fórmula */}
      <FormGroup label="Fórmula (use os nomes dos componentes)">
        <Input
          type="text"
          name="formula"
          value={formData.formula}
          onChange={handleChange}
          placeholder="Exemplo: (componente1 + componente2) / componente3"
        />
      </FormGroup>

      {/* Exibir variáveis disponíveis */}
      {formData.componentes.length > 0 && (
        <Box>
          <Text>
            <strong>Componentes Disponíveis:</strong>{' '}
            {formData.componentes.map((c) => c.name).join(', ')}
          </Text>
        </Box>
      )}

      {/* Botões para calcular e limpar a fórmula */}
      <Button colorScheme="green" onClick={evaluateFormula}>
        Calcular Fórmula
      </Button>
      <Button
        onClick={() =>
          setFormData({ ...formData, formula: '', formulaResult: null })
        }
        ml={2}
      >
        Limpar Fórmula
      </Button>

      {/* Exibir resultado da fórmula */}
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
      <Heading as="h2" size="lg">
        Desempenho
      </Heading>
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
          <option value="estável">Estável</option>
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

      <Button
        colorScheme="red"
        background="red.600"
        onClick={handleSave}
      >
        Salvar
      </Button>
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



// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Select,
//   Tab,
//   TabList,
//   TabPanel,
//   TabPanels,
//   Tabs,
//   Textarea,
//   VStack,
//   Heading,
//   Text,
// } from '@chakra-ui/react';
// import Header from '../../components/Header';
// import { evaluate } from 'mathjs';
// import axios from 'axios';

// const FormGroup = ({ label, children }) => (
//   <FormControl>
//     <FormLabel>{label}</FormLabel>
//     {children}
//   </FormControl>
// );

// const AdminPage = () => {
//   const [formData, setFormData] = useState({
//     codigoIndicador: '',
//     nomeIndicador: '',
//     objetivoEstrategico: '',
//     perspectivaEstrategica: '',
//     descricaoObjetivoEstrategico: '',
//     descricaoIndicador: '',
//     finalidadeIndicador: '',
//     dimensaoDesempenho: '',
//     componentes: [],
//     currentComponent: { name: '', value: '' },
//     formula: '',
//     formulaResult: null,
//     fonteFormaColeta: '',
//     pesoIndicador: '',
//     interpretacaoIndicador: '',
//     areaResponsavel: '',
//     meta: '',
//     tiposAcumulacao: '',
//     polaridade: '',
//     periodicidadeColeta: '',
//     frequenciaMeta: '',
//     unidadeMedida: '',
//   });

//   // Função para lidar com mudanças nos campos de entrada
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Função para lidar com mudanças nos campos do componente atual
//   const handleCurrentComponentChange = (field, value) => {
//     setFormData({
//       ...formData,
//       currentComponent: {
//         ...formData.currentComponent,
//         [field]: value,
//       },
//     });
//   };

//   // Função para adicionar um novo componente (até 4)
//   const handleAddComponent = () => {
//     if (formData.componentes.length < 4) {
//       setFormData({
//         ...formData,
//         componentes: [...formData.componentes, formData.currentComponent],
//         currentComponent: { name: '', value: '' },
//       });
//     } else {
//       alert('Você só pode adicionar até 4 componentes.');
//     }
//   };

//   // Função para cancelar a adição do componente atual
//   const handleCancelComponent = () => {
//     setFormData({
//       ...formData,
//       currentComponent: { name: '', value: '' },
//     });
//   };

//   // Função para deletar um componente específico
//   const handleDeleteComponent = (index) => {
//     const newComponentes = formData.componentes.filter((_, i) => i !== index);
//     setFormData({ ...formData, componentes: newComponentes });
//   };

//   // Função para avaliar a fórmula
//   const evaluateFormula = () => {
//     try {
//       // Criar um objeto com as variáveis da fórmula
//       const variables = {};
//       formData.componentes.forEach((component) => {
//         if (component.name && component.value !== '') {
//           variables[component.name] = parseFloat(component.value);
//         }
//       });

//       // Verificar se todas as variáveis da fórmula estão definidas
//       const usedVariables = formData.formula.match(/[a-zA-Z_]\w*/g);
//       const undefinedVariables = usedVariables.filter(
//         (variable) => !(variable in variables)
//       );

//       if (undefinedVariables.length > 0) {
//         alert(
//           `As seguintes variáveis não estão definidas: ${undefinedVariables.join(', ')}`
//         );
//         return;
//       }

//       // Avaliar a fórmula usando as variáveis
//       const result = evaluate(formData.formula, variables);
//       setFormData({ ...formData, formulaResult: result });
//     } catch (error) {
//       alert(
//         'Erro ao avaliar a fórmula. Verifique se a fórmula está correta e se todas as variáveis estão definidas.'
//       );
//     }
//   };

//   // Função para salvar os dados no backend
//   const handleSave = async () => {
//     try {
//       // Enviar os dados para o backend
//       const response = await axios.post('URL_DO_SEU_ENDPOINT', formData);
//       alert('Dados salvos com sucesso!');
//     } catch (error) {
//       console.error('Erro ao salvar os dados:', error);
//       alert('Ocorreu um erro ao salvar os dados.');
//     }
//   };

//   const renderGeneralTab = () => (
//     <VStack spacing={4} align="stretch">
//       {/* POSICIONAMENTO NO MAPA ESTRATÉGICO */}
//       <Heading as="h2" size="lg">Posicionamento no Mapa Estratégico</Heading>
//       <FormGroup label="Código do Indicador">
//         <Input 
//           type="text" 
//           name="codigoIndicador" 
//           value={formData.codigoIndicador} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Nome do Indicador">
//         <Input 
//           type="text" 
//           name="nomeIndicador" 
//           value={formData.nomeIndicador} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Objetivo Estratégico Associado">
//         <Input 
//           type="text" 
//           name="objetivoEstrategico" 
//           value={formData.objetivoEstrategico} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Perspectiva Estratégica">
//         <Input 
//           type="text" 
//           name="perspectivaEstrategica" 
//           value={formData.perspectivaEstrategica} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Descrição do Objetivo Estratégico">
//         <Textarea 
//           name="descricaoObjetivoEstrategico" 
//           value={formData.descricaoObjetivoEstrategico} 
//           onChange={handleChange} 
//         />
//       </FormGroup>

//       {/* INFORMAÇÕES GERAIS */}
//       <Heading as="h2" size="lg">Informações Gerais</Heading>
//       <FormGroup label="Descrição do Indicador">
//         <Textarea 
//           name="descricaoIndicador" 
//           value={formData.descricaoIndicador} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Finalidade do Indicador">
//         <Textarea 
//           name="finalidadeIndicador" 
//           value={formData.finalidadeIndicador} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Dimensão do Desempenho">
//         <Select 
//           name="dimensaoDesempenho" 
//           value={formData.dimensaoDesempenho} 
//           onChange={handleChange}
//         >
//           <option value="E1">Efetividade (E1)</option>
//           <option value="E2">Eficácia (E2)</option>
//           <option value="E3">Eficiência (E3)</option>
//           <option value="E4">Execução (E4)</option>
//           <option value="E5">Excelência (E5)</option>
//           <option value="E6">Economicidade (E6)</option>
//         </Select>
//       </FormGroup>

//       {/* Componentes */}
//       <Heading as="h3" size="md">Componentes</Heading>
      
//       {/* Formulário para o Componente Atual */}
//       <Box borderWidth="1px" borderRadius="md" p={4}>
//         <Heading as="h3" size="md">Adicionar Componente</Heading>
//         <FormGroup label="Nome do Componente">
//           <Input
//             value={formData.currentComponent.name}
//             onChange={(e) => handleCurrentComponentChange('name', e.target.value)}
//             placeholder="Nome do Componente"
//           />
//         </FormGroup>
//         <FormGroup label="Valor do Componente">
//           <Input
//             type="number"
//             value={formData.currentComponent.value}
//             onChange={(e) => handleCurrentComponentChange('value', e.target.value)}
//             placeholder="Valor do Componente"
//           />
//         </FormGroup>
//         <Button colorScheme="green" onClick={handleAddComponent}>
//           Salvar
//         </Button>
//         <Button onClick={handleCancelComponent} ml={2}>
//           Cancelar
//         </Button>
//       </Box>

//       {/* Lista de Componentes Adicionados */}
//       {formData.componentes.length > 0 && (
//         <Box>
//           <Heading as="h3" size="md">Componentes Adicionados</Heading>
//           {formData.componentes.map((component, index) => (
//             <Box key={index} borderWidth="1px" borderRadius="md" p={4} mt={2}>
//               <Text><strong>Nome:</strong> {component.name}</Text>
//               <Text><strong>Valor:</strong> {component.value}</Text>
//               <Button colorScheme="red" onClick={() => handleDeleteComponent(index)} mt={2}>
//                 Excluir Componente
//               </Button>
//             </Box>
//           ))}
//         </Box>
//       )}

//       {/* Fórmula */}
//       <FormGroup label="Fórmula (use os nomes dos componentes)">
//         <Input 
//           type="text" 
//           name="formula" 
//           value={formData.formula} 
//           onChange={handleChange} 
//           placeholder="Exemplo: (componente1 + componente2) / componente3"
//         />
//       </FormGroup>

//       {/* Exibir variáveis disponíveis */}
//       {formData.componentes.length > 0 && (
//         <Box>
//           <Text><strong>Componentes Disponíveis:</strong> {formData.componentes.map(c => c.name).join(', ')}</Text>
//         </Box>
//       )}

//       {/* Botões para calcular e limpar a fórmula */}
//       <Button colorScheme="green" onClick={evaluateFormula}>
//         Calcular Fórmula
//       </Button>
//       <Button onClick={() => setFormData({ ...formData, formula: '', formulaResult: null })} ml={2}>
//         Limpar Fórmula
//       </Button>

//       {/* Exibir resultado da fórmula */}
//       {formData.formulaResult !== null && (
//         <Text>Resultado da Fórmula: {formData.formulaResult}</Text>
//       )}

//       <FormGroup label="Fonte/Forma de Coleta dos Dados">
//         <Textarea 
//           name="fonteFormaColeta" 
//           value={formData.fonteFormaColeta} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Peso do Indicador">
//         <Input 
//           type="number" 
//           name="pesoIndicador" 
//           value={formData.pesoIndicador} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Interpretação do Indicador/Recomendações">
//         <Textarea 
//           name="interpretacaoIndicador" 
//           value={formData.interpretacaoIndicador} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Área Responsável">
//         <Input 
//           type="text" 
//           name="areaResponsavel" 
//           value={formData.areaResponsavel} 
//           onChange={handleChange} 
//         />
//       </FormGroup>

//       {/* DESEMPENHO */}
//       <Heading as="h2" size="lg">Desempenho</Heading>
//       <FormGroup label="Meta">
//         <Input 
//           type="number" 
//           name="meta" 
//           value={formData.meta} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
//       <FormGroup label="Tipos de Acumulação">
//         <Select 
//           name="tiposAcumulacao" 
//           value={formData.tiposAcumulacao} 
//           onChange={handleChange}
//         >
//           <option value="saldo">Saldo</option>
//           <option value="soma">Soma</option>
//           <option value="media">Média</option>
//         </Select>
//       </FormGroup>
//       <FormGroup label="Polaridade">
//         <Select 
//           name="polaridade" 
//           value={formData.polaridade} 
//           onChange={handleChange}
//         >
//           <option value="negativa">Negativa</option>
//           <option value="positiva">Positiva</option>
//           <option value="estável">Estável</option>
//         </Select>
//       </FormGroup>
//       <FormGroup label="Periodicidade de Coleta">
//         <Select 
//           name="periodicidadeColeta" 
//           value={formData.periodicidadeColeta} 
//           onChange={handleChange}
//         >
//           <option value="mensal">Mensal</option>
//           <option value="bimestral">Bimestral</option>
//           <option value="trimestral">Trimestral</option>
//           <option value="quadrimestral">Quadrimestral</option>
//           <option value="semestral">Semestral</option>
//           <option value="anual">Anual</option>
//           <option value="bianual">Bianual</option>
//           <option value="trianual">Trianual</option>
//         </Select>
//       </FormGroup>
//       <FormGroup label="Frequência da Meta">
//         <Select 
//           name="frequenciaMeta" 
//           value={formData.frequenciaMeta} 
//           onChange={handleChange}
//         >
//           <option value="mensal">Mensal</option>
//           <option value="bimestral">Bimestral</option>
//           <option value="trimestral">Trimestral</option>
//           <option value="quadrimestral">Quadrimestral</option>
//           <option value="semestral">Semestral</option>
//           <option value="anual">Anual</option>
//           <option value="bianual">Bianual</option>
//           <option value="trianual">Trianual</option>
//         </Select>
//       </FormGroup>
//       <FormGroup label="Unidade de Medida">
//         <Input 
//           type="text" 
//           name="unidadeMedida" 
//           value={formData.unidadeMedida} 
//           onChange={handleChange} 
//         />
//       </FormGroup>
      
//       <Button colorScheme="red" background={'red.600'} onClick={handleSave}>Salvar</Button>
//     </VStack>
//   );

//   return (
//     <Header>
//       <Box p={4}>
//         <Tabs variant="enclosed">
//           <TabList>
//             <Tab>Geral</Tab>
//           </TabList>
//           <TabPanels>
//             <TabPanel>{renderGeneralTab()}</TabPanel>
//           </TabPanels>
//         </Tabs>
//       </Box>
//     </Header>
//   );
// };

// export default AdminPage;

