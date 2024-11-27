import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";

const HelpForm = ({ isOpen, onClose }) => {
  const [helpType, setHelpType] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const toast = useToast();

  const handleSendHelpRequest = () => {
    console.log("Tipo de ajuda:", helpType);
    console.log("Mensagem:", helpMessage);

    toast({
      title: "Solicitação enviada!",
      description: "Sua solicitação de ajuda foi enviada com sucesso.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setHelpType("");
    setHelpMessage("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Solicitar ajuda</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="help-type" mb={4}>
            <FormLabel>Tipo de ajuda</FormLabel>
            <Select
              placeholder="Selecione o tipo de ajuda"
              value={helpType}
              onChange={(e) => setHelpType(e.target.value)}
            >
              <option value="problema-tecnico">Problema técnico</option>
              <option value="duvida-sistema">Dúvida sobre o sistema</option>
              <option value="sugestao-melhoria">Sugestão de melhoria</option>
              <option value="outros">Outros</option>
            </Select>
          </FormControl>
          <FormControl id="help-message">
            <FormLabel>Mensagem</FormLabel>
            <Textarea
              placeholder="Descreva sua solicitação"
              value={helpMessage}
              onChange={(e) => setHelpMessage(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" bg="red.600" colorScheme="red" mr={3} onClick={handleSendHelpRequest}>
            Enviar
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HelpForm;
