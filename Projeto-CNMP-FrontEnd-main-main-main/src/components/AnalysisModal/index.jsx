import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Textarea,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

const AnalysisModal = ({
  isOpen,
  onClose,
  selectedMonth,
  selectedMonthText,
  setSelectedMonthText,
  modalMode,
  saveAnalysis,
}) => {
  const toast = useToast();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {modalMode === 'edit'
            ? `Editar Análise - ${selectedMonth}`
            : `Visualizar Análise - ${selectedMonth}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {modalMode === 'edit' ? (
            <Textarea
              value={selectedMonthText}
              onChange={e => setSelectedMonthText(e.target.value)}
              placeholder="Escreva sua análise..."
              size="sm"
            />
          ) : (
            <VStack spacing={4}>
              <Text
                whiteSpace="pre-wrap"
                wordBreak="break-word"
              >
                {selectedMonthText || 'Nenhum conteúdo disponível.'}
              </Text>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedMonthText) {
                    navigator.clipboard.writeText(selectedMonthText)
                      .then(() => {
                        toast({
                          title: 'Conteúdo copiado!',
                          description: 'Texto copiado para a área de transferência.',
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        });
                      });
                  }
                }}
              >
                Copiar Conteúdo
              </Button>
            </VStack>
          )}
        </ModalBody>
        {modalMode === 'edit' && (
          <ModalFooter>
            <Button bg="red.600" colorScheme="red" mr={3} onClick={saveAnalysis}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AnalysisModal;
