'use client'

import React, { useState } from 'react';
import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Image
} from '@chakra-ui/react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUser, FaLock } from 'react-icons/fa';

export default function SplitScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    e.preventDefault();
    if (token) {
      // Login usando o token
      localStorage.setItem('token', token);
      navigate('/HomePageLogada');
    } else {
      // Realizar autenticação regular com email e senha
      // Requisição para seu backend para validar o email e a senha
      localStorage.setItem('token', 'seuTokenDeAutenticacao'); // Substituir pelo token real recebido do backend
      navigate('/HomePageLogada');
    }
  };

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'} as="form" onSubmit={handleLogin}>
          <Heading fontSize={'4xl'} color="gray.700">Entrar na sua conta</Heading>
          <FormControl id="email">
            <FormLabel>Usuário</FormLabel>
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
          <Text textAlign="center" color="black.600" fontSize="lg" mb={2}>ou</Text>
          <FormControl id="token">
            <FormLabel>Token de Autenticação</FormLabel>
            <Input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
          </FormControl>
          <Stack spacing={6}>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}>
              <Button variant='link' colorScheme='red'>
                Esqueceu a senha?
              </Button>
            </Stack>
            <Button colorScheme={'red'} background='red.600' variant={'solid'} type="submit">
              Entrar
            </Button>
            <Button colorScheme='red' variant='outline'>
              <Link to="/register">
                Registrar
              </Link>
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Login Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  )
}


