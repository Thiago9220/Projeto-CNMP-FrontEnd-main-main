import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

export function useIndicadorData(viewType) {
  const toast = useToast();

  // Indicador selecionado e meta
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [meta, setMeta] = useState('0%');

  // Estados iniciais
  const initialStateMensal = {
    prescrito: Array(12).fill(''),
    finalizado: Array(12).fill(''),
    analiseMensal: Array(12).fill('')
  };

  const initialStateSemestral = {
    prescrito: Array(2).fill(''),
    finalizado: Array(2).fill(''),
    analiseSemestral: Array(2).fill('')
  };

  // Novo estado inicial para bimestral
  const initialStateBimestral = {
    prescrito: Array(6).fill(''),
    finalizado: Array(6).fill(''),
    analiseBimestral: Array(6).fill('')
  };

  const initialState = 
    viewType === 'mensal' 
      ? initialStateMensal
      : viewType === 'semestral'
        ? initialStateSemestral
        : initialStateBimestral; // Se for bimestral, usa o inicial bimestral

  const [formData, setFormData] = useState(initialState);
  const [indicators, setIndicators] = useState([]);

  // Carrega indicadores da API
  useEffect(() => {
    fetch('http://localhost:8000/indicadores/')
      .then((response) => response.json())
      .then((data) => setIndicators(data))
      .catch((error) => {
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

  // Carrega dados do localStorage de acordo com o tipo de visualização
  useEffect(() => {
    let storageKey;
    if (viewType === 'mensal') {
      storageKey = 'formDataMensal';
    } else if (viewType === 'semestral') {
      storageKey = 'formDataSemestral';
    } else {
      storageKey = 'formDataBimestral';
    }

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData.formData || initialState);
      setSelectedIndicator(parsedData.selectedIndicator || '');
      setMeta(parsedData.meta || '0%');
    } else {
      // Se não houver dados salvos, reinicia com o estado inicial
      setFormData(initialState);
      setSelectedIndicator('');
      setMeta('0%');
    }
  }, [viewType]);

  const handleInputChange = (field, index, value) => {
    const sanitizedValue = value.replace(/[^0-9.,]/g, '');
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? sanitizedValue : item)),
    }));
  };

  // Cálculo do valorCalculado, adaptado para qualquer um dos tipos (mensal, bimestral, semestral)
  let valorCalculado = [];
  if (formData && formData.prescrito && formData.finalizado && formData.prescrito.length === formData.finalizado.length) {
    valorCalculado = formData.prescrito.map((value, index) => {
      const prescrito = parseFloat((value || '').replace(',', '.')) || 0;
      const finalizado = parseFloat((formData.finalizado[index] || '').replace(',', '.')) || 0;
      return prescrito === 0 ? 0 : (finalizado / prescrito) * 100;
    });
  }

  const salvarDados = () => {
    let storageKey;
    if (viewType === 'mensal') {
      storageKey = 'formDataMensal';
    } else if (viewType === 'semestral') {
      storageKey = 'formDataSemestral';
    } else {
      storageKey = 'formDataBimestral';
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({ selectedIndicator, meta, formData })
    );
    toast({
      title: `Dados ${viewType === 'mensal' ? 'Mensais' : viewType === 'semestral' ? 'Semestrais' : 'Bimestrais'} salvos!`,
      description: `Suas informações foram armazenadas.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return {
    indicators,
    selectedIndicator,
    setSelectedIndicator,
    meta,
    setMeta,
    formData,
    setFormData,
    handleInputChange,
    valorCalculado,
    salvarDados
  };
}
