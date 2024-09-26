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
  InputRightElement,
  Stack,
  Image,
  Box,
  CloseButton,
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'; 
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Verificar se as senhas correspondem
    if (password !== repeatPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não correspondem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Fazer a requisição ao backend para registrar o usuário
      const response = await fetch('http://localhost:8000/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Sucesso',
          description: 'Cadastro realizado com sucesso!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/Login');
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

  return (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={4} w={'full'} maxW={'md'}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Heading fontSize={'4xl'} color="gray.700">Cadastre-se</Heading>
            <CloseButton />
          </Box>
          <Text fontSize="md" color="gray.600" mb={4}>É rápido e fácil.</Text>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Senha</FormLabel>
            <InputGroup>
              <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputRightElement h={'full'}>
                <Button variant={'ghost'} onClick={handlePasswordVisibility}>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="repeat-password">
            <FormLabel>Confirme a senha</FormLabel>
            <InputGroup>
              <Input type={showRepeatPassword ? 'text' : 'password'} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
              <InputRightElement h={'full'}>
                <Button variant={'ghost'} onClick={handleRepeatPasswordVisibility}>
                  {showRepeatPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={6}>
            <Button colorScheme={'red'} background={'red.600'} variant={'solid'} onClick={handleRegister}>
              Cadastrar
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Register Image'}
          objectFit={'cover'}
          src={
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
          }
        />
      </Flex>
    </Stack>
  );
}







// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { LayoutComponents } from "../../components/LayoutComponents"
// import React from 'react';
// import cnmpIMG from '../../assets/cnmp.jpg'


// export const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("")

//   return (
//     <LayoutComponents >
//       <form className="login-form">
        
//         <span className="login-form-title">
//           <img src={cnmpIMG} alt="Usuário do CNMP" />
//         </span>

//         <span className="login-form-title"> Criar conta </span>

//         <div className="wrap-input">
//           <input
//             className={name !== "" ? "has-val input" : "input"}
//             type="email"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <span className="focus-input" data-placeholder="Nome"></span>
//         </div>

//         <div className="wrap-input">
//           <input
//             className={email !== "" ? "has-val input" : "input"}
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <span className="focus-input" data-placeholder="Email"></span>
//         </div>

//         <div className="wrap-input">
//           <input
//             className={password !== "" ? "has-val input" : "input"}
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <span className="focus-input" data-placeholder="Password"></span>
        
//         </div>
//         <div className="container-login-form-btn">
//           <button className="login-form-btn">Login</button>
//         </div>

//         <div className="text-center">
//           <span className="txt1">Já possui conta? </span>
//           <Link className="txt2" to="/login">
//             Acessar com email e senha.
//           </Link>
//         </div>
//       </form>
//     </LayoutComponents>
//   )
// }

// export default Register;