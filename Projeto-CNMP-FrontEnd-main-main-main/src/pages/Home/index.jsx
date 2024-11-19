import React from 'react';
import { Box, Button, Heading, Text, VStack, HStack, Image } from '@chakra-ui/react';
import logoImage from '../../assets/logo.png'; 

function HomePage() {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box className="homepage-container" minH="100vh" display="flex" flexDirection="column">
      <Box as="header" className="header" bg="gray.100" color="white" p={4}>
        <Image src={logoImage} alt="Logo" h="16" w="auto" />
      </Box>

      <Box as="main" className="main" flex="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4}>
        <VStack className="hero" spacing={4} textAlign="center">
          <Text fontSize="lg">Brasília - {currentDate}</Text>
          <Box w="100%" borderBottom="1px" borderColor="gray.300" />
          <Heading as="h2" size="lg">Bem-vindo!</Heading>
          <Text fontSize="lg">Acesse os indicadores.</Text>
        </VStack>
        
        <HStack className="cta" spacing={4} mt={8}>
          <Button bg="#9e3127" color="white" className="login-btn" onClick={() => window.location.href = '/login'}>
            Login
          </Button>
          <Button colorScheme="red" variant="outline" className="register-btn" onClick={() => window.location.href = '/register'}>
            Registrar
          </Button>
        </HStack>
      </Box>

      <Box as="footer" className="footer" bg="#9e3127" color="white" p={4} textAlign="center">
        <Text>&copy; {new Date().getFullYear()}. Todos os direitos reservados.</Text>
      </Box>
    </Box>
  );
}

export default HomePage;
