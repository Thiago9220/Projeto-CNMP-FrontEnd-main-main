// src/components/FormulaEditor.jsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs as ChakraTabs,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

// Importar o MathQuill, KaTeX e os estilos necessários
import 'mathquill/build/mathquill.css';
import { addStyles, EditableMathField } from 'react-mathquill';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Adicionar estilos do MathQuill
addStyles();

const FormulaEditor = ({
  isOpen,
  onClose,
  onSave,
  initialFormula,
  componentes,
}) => {
  // Estado para a fórmula em LaTeX
  const [latexFormula, setLatexFormula] = useState(initialFormula || '');

  // Referência ao MathField
  const [mathField, setMathField] = useState(null);

  // Arrays de símbolos organizados por categorias
  const operators = [
    { symbol: '+', label: '+' },
    { symbol: '-', label: '-' },
    { symbol: '*', label: '×' },
    { symbol: '/', label: '÷' },
    { symbol: '^', label: '^' },
    { symbol: '_', label: '_' },
    { symbol: '\\sqrt{}', label: '√' },
    { symbol: '\\frac{}{}', label: 'Frac' },
    { symbol: '\\int', label: '∫' },
    { symbol: '\\sum', label: '∑' },
    { symbol: '\\prod', label: '∏' },
    { symbol: '\\lim', label: 'lim' },
    { symbol: '\\ln', label: 'ln' },
    { symbol: '\\log', label: 'log' },
    { symbol: '\\exp', label: 'exp' },
    { symbol: '\\sin', label: 'sin' },
    { symbol: '\\cos', label: 'cos' },
    { symbol: '\\tan', label: 'tan' },
    { symbol: '(', label: '(' },
    { symbol: ')', label: ')' },
  ];

  const greekLetters = [
    { symbol: '\\alpha', label: 'α' },
    { symbol: '\\beta', label: 'β' },
    { symbol: '\\gamma', label: 'γ' },
    { symbol: '\\delta', label: 'δ' },
    { symbol: '\\epsilon', label: 'ε' },
    { symbol: '\\theta', label: 'θ' },
    { symbol: '\\lambda', label: 'λ' },
    { symbol: '\\mu', label: 'μ' },
    { symbol: '\\sigma', label: 'σ' },
    { symbol: '\\phi', label: 'φ' },
    { symbol: '\\omega', label: 'ω' },
  ];

  const relations = [
    { symbol: '=', label: '=' },
    { symbol: '\\ne', label: '≠' },
    { symbol: '<', label: '<' },
    { symbol: '>', label: '>' },
    { symbol: '\\leq', label: '≤' },
    { symbol: '\\geq', label: '≥' },
    { symbol: '\\approx', label: '≈' },
    { symbol: '\\propto', label: '∝' },
  ];

  const arrows = [
    { symbol: '\\leftarrow', label: '←' },
    { symbol: '\\rightarrow', label: '→' },
    { symbol: '\\leftrightarrow', label: '↔' },
    { symbol: '\\uparrow', label: '↑' },
    { symbol: '\\downarrow', label: '↓' },
  ];

  // Função para inserir símbolos no MathField
  const insertSymbol = (symbol) => {
    if (mathField) {
      mathField.write(symbol);
      mathField.focus();
      setLatexFormula(mathField.latex());
    }
  };

  // Função para salvar a fórmula
  const saveFormula = () => {
    onSave(latexFormula);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Inserir Fórmula</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
          <ChakraTabs variant="enclosed" defaultIndex={0}>
            <TabList>
                <Tab>Componentes</Tab>
                <Tab>Operadores</Tab>
                <Tab>Letras Gregas</Tab>
                <Tab>Relações</Tab>
                <Tab>Setas</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                {/* Componentes */}
                <VStack align="stretch" spacing={2}>
                    {componentes.map((component, index) => (
                    <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => insertSymbol(`Componente${index + 1}`)}
                    >
                        {`Componente ${index + 1}: ${component.valor || 'Sem Valor'}`}
                    </Button>
                    ))}
                </VStack>
                </TabPanel>
                <TabPanel>
                {/* Operadores */}
                <Wrap spacing={2}>
                    {operators.map((item, index) => (
                    <WrapItem key={index}>
                        <Button onClick={() => insertSymbol(item.symbol)}>
                        {item.label}
                        </Button>
                    </WrapItem>
                    ))}
                </Wrap>
                </TabPanel>
                <TabPanel>
                {/* Letras Gregas */}
                <Wrap spacing={2}>
                    {greekLetters.map((item, index) => (
                    <WrapItem key={index}>
                        <Button onClick={() => insertSymbol(item.symbol)}>
                        {item.label}
                        </Button>
                    </WrapItem>
                    ))}
                </Wrap>
                </TabPanel>
                <TabPanel>
                {/* Relações */}
                <Wrap spacing={2}>
                    {relations.map((item, index) => (
                    <WrapItem key={index}>
                        <Button onClick={() => insertSymbol(item.symbol)}>
                        {item.label}
                        </Button>
                    </WrapItem>
                    ))}
                </Wrap>
                </TabPanel>
                <TabPanel>
                {/* Setas */}
                <Wrap spacing={2}>
                    {arrows.map((item, index) => (
                    <WrapItem key={index}>
                        <Button onClick={() => insertSymbol(item.symbol)}>
                        {item.label}
                        </Button>
                    </WrapItem>
                    ))}
                </Wrap>
                </TabPanel>
            </TabPanels>
            </ChakraTabs>


            {/* Campo do MathField */}
            <Box mt={4}>
              <EditableMathField
                latex={latexFormula}
                onChange={(mathField) => {
                  setLatexFormula(mathField.latex());
                }}
                mathquillDidMount={(mathFieldRef) => {
                  setMathField(mathFieldRef);
                }}
                style={{
                  minHeight: '50px',
                  fontSize: '1.4em',
                  border: '1px solid #ccc',
                  padding: '10px',
                }}
              />
            </Box>

            {/* Pré-visualização */}
            <Box mt={4}>
              <Text fontWeight="bold">Pré-visualização:</Text>
              <Box border="1px solid #ccc" padding="10px" minHeight="50px">
                {latexFormula ? (
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: katex.renderToString(latexFormula, {
                        throwOnError: false,
                      }),
                    }}
                  />
                ) : (
                  <Text>Digite uma fórmula para ver a pré-visualização</Text>
                )}
              </Box>
            </Box>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={saveFormula}>
            Salvar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormulaEditor;
