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
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado de carregamento

  // Função para gerar senha aleatória mais forte
  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = upper + lower + numbers + special;

    let password = '';
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < 12; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    return password;
  };

  const handleCancel = () => {
    navigate('/HomePageLogada');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Ativa o estado de carregamento

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

    // Valida se todos os campos obrigatórios foram preenchidos
    if (!formData.nome || !formData.email || !formData.areaResponsavel || !formData.perfil) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
      return;
    }

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
    } finally {
      setIsSubmitting(false); // Desativa o estado de carregamento
    }
  };

  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
    navigate('/medicoes'); // Redirecionar o usuário para a página de medições de indicadores
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast({
      title: 'Sucesso',
      description: 'Senha copiada para a área de transferência!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
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
              <FormControl id="perfil" isRequired>
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
                isLoading={isSubmitting} // Adiciona o estado de carregamento
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
            <Button onClick={copyPasswordToClipboard} mr={3}>Copiar Senha</Button>
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

