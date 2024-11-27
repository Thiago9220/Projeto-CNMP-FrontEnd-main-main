import React from 'react';
import { AppRouter } from './AppRouter';
 import { ChakraProvider } from '@chakra-ui/react';


export const App = () => {
 return (
  <ChakraProvider>
    <AppRouter />
  </ChakraProvider>
)
}
