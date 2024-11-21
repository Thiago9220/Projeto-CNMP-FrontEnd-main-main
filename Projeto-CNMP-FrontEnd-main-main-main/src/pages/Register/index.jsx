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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; 
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const toast = useToast();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Valida se todos os campos estão preenchidos
    if (!nome || !email || !password || !repeatPassword) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        status: 'error',
        duration: 3000,  // Tempo ajustado para um feedback mais rápido
        isClosable: true,
      });
      return;
    }

    // Verificar se as senhas correspondem
    if (password !== repeatPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não correspondem.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Fazer a requisição ao backend para registrar o usuário com perfil de gestor
      const response = await fetch('http://localhost:8000/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: password,
          perfil: 'gestor' // Adiciona o perfil como gestor/admin automaticamente
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Sucesso',
          description: 'Cadastro realizado com sucesso! Por favor, faça o login.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/Login'); // Redireciona para a página de login
      } else {
        const errorData = await response.json();
        toast({
          title: 'Erro',
          description: errorData.detail || 'Falha ao registrar',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Falha ao registrar. Tente novamente.',
        status: 'error',
        duration: 3000,
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
          <FormControl id="nome">
            <FormLabel>Nome</FormLabel>
            <Input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
          </FormControl>
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


// 'use client'

// import React, { useState } from 'react';
// import {
//   Button,
//   Flex,
//   Text,
//   FormControl,
//   FormLabel,
//   Heading,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Stack,
//   Image,
//   Box,
//   CloseButton,
//   useToast
// } from '@chakra-ui/react';
// import { useNavigate } from 'react-router-dom'; 
// import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

// export default function RegisterScreen() {
//   const navigate = useNavigate();
//   const toast = useToast();

//   const [nome, setNome] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [repeatPassword, setRepeatPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showRepeatPassword, setShowRepeatPassword] = useState(false);

//   const handlePasswordVisibility = () => setShowPassword(!showPassword);
//   const handleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     // Verificar se as senhas correspondem
//     if (password !== repeatPassword) {
//       toast({
//         title: 'Erro',
//         description: 'As senhas não correspondem.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//       return;
//     }

//     try {
//       // Fazer a requisição ao backend para registrar o usuário com perfil de gestor
//       const response = await fetch('http://localhost:8000/usuarios/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           nome: nome,
//           email: email,
//           senha: password,
//           perfil: 'gestor' // Adiciona o perfil como gestor/admin automaticamente
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         toast({
//           title: 'Sucesso',
//           description: 'Cadastro realizado com sucesso!',
//           status: 'success',
//           duration: 5000,
//           isClosable: true,
//         });
//         navigate('/Login');
//       } else {
//         const errorData = await response.json();
//         toast({
//           title: 'Erro',
//           description: errorData.detail || 'Falha ao registrar',
//           status: 'error',
//           duration: 5000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       toast({
//         title: 'Erro',
//         description: 'Falha ao registrar. Tente novamente.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
//       <Flex p={8} flex={1} align={'center'} justify={'center'}>
//         <Stack spacing={4} w={'full'} maxW={'md'}>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//             <Heading fontSize={'4xl'} color="gray.700">Cadastre-se</Heading>
//             <CloseButton />
//           </Box>
//           <Text fontSize="md" color="gray.600" mb={4}>É rápido e fácil.</Text>
//           <FormControl id="nome">
//             <FormLabel>Nome</FormLabel>
//             <Input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
//           </FormControl>
//           <FormControl id="email">
//             <FormLabel>Email</FormLabel>
//             <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           </FormControl>
//           <FormControl id="password">
//             <FormLabel>Senha</FormLabel>
//             <InputGroup>
//               <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
//               <InputRightElement h={'full'}>
//                 <Button variant={'ghost'} onClick={handlePasswordVisibility}>
//                   {showPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 </Button>
//               </InputRightElement>
//             </InputGroup>
//           </FormControl>
//           <FormControl id="repeat-password">
//             <FormLabel>Confirme a senha</FormLabel>
//             <InputGroup>
//               <Input type={showRepeatPassword ? 'text' : 'password'} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
//               <InputRightElement h={'full'}>
//                 <Button variant={'ghost'} onClick={handleRepeatPasswordVisibility}>
//                   {showRepeatPassword ? <ViewOffIcon /> : <ViewIcon />}
//                 </Button>
//               </InputRightElement>
//             </InputGroup>
//           </FormControl>
//           <Stack spacing={6}>
//             <Button colorScheme={'red'} background={'red.600'} variant={'solid'} onClick={handleRegister}>
//               Cadastrar
//             </Button>
//           </Stack>
//         </Stack>
//       </Flex>
//       <Flex flex={1}>
//         <Image
//           alt={'Register Image'}
//           objectFit={'cover'}
//           src={
//             'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
//           }
//         />
//       </Flex>
//     </Stack>
//   );
// }
