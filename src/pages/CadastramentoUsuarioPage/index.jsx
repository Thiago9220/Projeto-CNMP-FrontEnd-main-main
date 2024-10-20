import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function CadastramentoUsuarioPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState(''); // Armazena a senha gerada

  // Função para gerar senha aleatória
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const handleCancel = () => {
    navigate('/HomePageLogada');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gerar a senha automaticamente
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);

    const formData = {
      nome: e.target.nome.value,
      cargo: e.target.cargo.value,
      email: e.target.email.value,
      perfil: e.target.perfil.value,
      areaResponsavel: e.target.areaResponsavel.value,
      senha: generatedPassword // Enviar a senha gerada automaticamente
    };

    try {
      // Fazer a requisição ao backend para registrar o usuário
      const response = await fetch('http://localhost:8000/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Usuário cadastrado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        // Exibir modal com a senha gerada
        setIsPasswordModalOpen(true);
      } else {
        const errorData = await response.json();
        toast({
          title: 'Erro',
          description: errorData.detail || 'Falha ao registrar',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao registrar. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
    navigate('/medicoes'); // Redirecionar o usuário para a página de medições de indicadores
  };

  return (
    <Header>
      <Box
        maxW="md"
        mx="auto"
        mt={8}
        p={6}
        borderWidth={1}
        borderRadius="md"
        boxShadow="lg"
      >
        <Heading as="h2" size="lg" mb={6}>
          Cadastro de Usuário
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <HStack spacing={4} width="100%">
              <FormControl id="nome" isRequired>
                <FormLabel>Nome</FormLabel>
                <Input type="text" />
              </FormControl>
              <FormControl id="cargo">
                <FormLabel>Cargo</FormLabel>
                <Input type="text" />
              </FormControl>
            </HStack>
            <HStack spacing={4} width="100%">
              <FormControl id="email" isRequired>
                <FormLabel>Email (Login)</FormLabel>
                <Input type="email" />
              </FormControl>
            </HStack>
            <HStack spacing={4} width="100%">
              <FormControl id="perfil">
                <FormLabel>Perfil</FormLabel>
                <Select placeholder="Selecione o perfil">
                  <option value="gerente">Gestor</option>
                  <option value="usuario">Usuário</option>
                </Select>
              </FormControl>
              <FormControl id="areaResponsavel" isRequired>
                <FormLabel>Área Responsável</FormLabel>
                <Input type="text" placeholder="Digite a área responsável" />
              </FormControl>
            </HStack>
            <HStack spacing={4} width="100%">
              <Button
                colorScheme="red"
                background={'red.600'}
                type="submit"
                width="full"
              >
                Cadastrar
              </Button>
              <Button
                colorScheme="red"
                background={'red.600'}
                type="button"
                width="full"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>

      {/* Modal de Senha Gerada */}
      <Modal isOpen={isPasswordModalOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Senha Gerada</ModalHeader>
          <ModalBody>
            <Text>Sua senha gerada é: <strong>{password}</strong></Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Header>
  );
}

export default CadastramentoUsuarioPage;
