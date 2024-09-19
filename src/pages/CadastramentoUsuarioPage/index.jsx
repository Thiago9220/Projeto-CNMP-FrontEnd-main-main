import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Heading,
  Select // Adicionado aqui
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

function CadastramentoUsuarioPage() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/HomePageLogada');
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
        <form>
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
              <FormControl id="senha" isRequired>
                <FormLabel>Senha</FormLabel>
                <Input type="password" />
              </FormControl>
              <FormControl id="confirmaSenha" isRequired>
                <FormLabel>Confirma Senha</FormLabel>
                <Input type="password" />
              </FormControl>
            </HStack>
            <HStack spacing={4} width="100%">
              <FormControl id="perfil">
                <FormLabel>Perfil</FormLabel>
                <Select placeholder="Selecione o perfil">
                  <option value="gerente">Gestor</option>
                  <option value="gestor">Usuário</option>
                </Select>
              </FormControl>
              <FormControl id="areaResponsavel" isRequired>
                <FormLabel>Área Responsável</FormLabel>
                {/* Alterado para Input para entrada manual */}
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
    </Header>
  );
}

export default CadastramentoUsuarioPage;
