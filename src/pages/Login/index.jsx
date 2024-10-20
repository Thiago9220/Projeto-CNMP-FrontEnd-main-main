import React, { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Image,
  Text
} from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Verifica se os campos de email e senha estão preenchidos
    if (!email || !password) {
      setErrorMessage('Por favor, preencha ambos os campos.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/login/', {
        email,
        senha: password,  // Corrigir o nome do campo para 'senha'
      });
  
      const { access_token, nome } = response.data;  // Certifique-se de que o backend retorna o nome do usuário também
      localStorage.setItem('token', access_token);
      localStorage.setItem('nomeUsuario', nome);  // Armazena o nome do usuário
      navigate('/HomePageLogada');
    } catch (error) {
      setErrorMessage('Login falhou. Verifique suas credenciais.');
    }
  };
  
  

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'} as="form" onSubmit={handleLogin}>
          <Heading fontSize={'4xl'} color="gray.700">Entrar na sua conta</Heading>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaUser color="gray.300" />
              </InputLeftElement>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
          </FormControl>
          <FormControl id="password">
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock color="gray.300" />
              </InputLeftElement>
              <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputRightElement h={'full'}>
                <Button variant={'ghost'} onClick={handlePasswordVisibility}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          {errorMessage && <Text color="red.500">{errorMessage}</Text>}
          <Stack spacing={6}>
            <Button colorScheme={'red'} background='red.600' variant={'solid'} type="submit">
              Entrar
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'}
        />
      </Flex>
    </Stack>
  );
}
