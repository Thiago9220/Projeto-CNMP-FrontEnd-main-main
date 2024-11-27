import React, { useState, useEffect } from 'react';
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
  Text,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
  useToast,
  Flex,
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
  const [mathField, setMathField] = useState(null);
  const toast = useToast();

  // Array de operadores
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

  // Função para inserir símbolos no MathField
  const insertSymbol = (symbol) => {
    if (mathField) {
      mathField.write(symbol);
      mathField.focus();
      setLatexFormula(mathField.latex());
    }
  };

  // Validação de entrada para fórmulas
  const validateFormula = () => {
    try {
      katex.renderToString(latexFormula, { throwOnError: true });
      return true;
    } catch (error) {
      toast({
        title: 'Erro de Fórmula',
        description:
          'A fórmula contém erros. Por favor, corrija antes de salvar.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  // Função para salvar a fórmula
  const saveFormula = () => {
    if (validateFormula()) {
      onSave(latexFormula);
      onClose();
    }
  };

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (mathField) {
        switch (event.key) {
          case '+':
          case '-':
          case '*':
          case '/':
          case '^':
            mathField.write(event.key);
            setLatexFormula(mathField.latex());
            break;
          case 'Enter':
            event.preventDefault();
            saveFormula();
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mathField, latexFormula]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('black', 'white')}
        maxWidth="900px"
      >
        <ModalHeader>Inserir Fórmula</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            {/* Lado esquerdo: Componentes */}
            <Box width="30%" pr={4} maxHeight="400px" overflowY="auto">
              <VStack align="stretch" spacing={2}>
                {componentes.map((component, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => insertSymbol(component.valor || '')}
                  >
                    {`Componente ${index + 1}: ${component.valor || 'Sem Valor'}`}
                  </Button>
                ))}
              </VStack>
            </Box>
            {/* Lado direito: Operadores no topo, campo de texto e pré-visualização abaixo */}
            <Box width="70%">
              {/* Operadores */}
              <Wrap spacing={2} mb={4}>
                {operators.map((item, index) => (
                  <WrapItem key={index}>
                    <Button onClick={() => insertSymbol(item.symbol)}>
                      {item.label}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
              {/* Campo do MathField */}
              <Box>
                <EditableMathField
                  latex={latexFormula}
                  onChange={(mathField) => {
                    setLatexFormula(mathField.latex());
                  }}
                  mathquillDidMount={(mathFieldRef) => {
                    setMathField(mathFieldRef);
                  }}
                  style={{
                    minHeight: '200px',
                    fontSize: '1.4em',
                    border: '1px solid #ccc',
                    padding: '10px',
                    width: '100%',
                  }}
                />
              </Box>
              {/* Pré-visualização */}
              <Box mt={4}>
                <Text fontWeight="bold">Pré-visualização:</Text>
                <Box
                  border="1px solid #ccc"
                  padding="10px"
                  minHeight="50px"
                  overflowX="auto"
                >
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
            </Box>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button bg="red.600" colorScheme="red" mr={3} onClick={saveFormula}>
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
