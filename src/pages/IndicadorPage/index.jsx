import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  IconButton,
  Button,
  HStack,
  Checkbox,
} from '@chakra-ui/react'
import { FaSearch, FaRegEdit } from "react-icons/fa";

export default function IndicadorPage() {
  return (
    <TableContainer>
      <Table variant='striped'>
        <Thead>
          <Tr>
            <Th><Checkbox colorScheme="green" /></Th> {/* Adicionei a cor verde aqui */}
            <Th>ID</Th>
            <Th>Código</Th>
            <Th>Nome</Th>
            <Th>Área</Th>
            <Th>Unid. Med.</Th>
            <Th>Classificador</Th>
            <Th>Grupo</Th>
            <Th>Responsável</Th>
            <Th>Ações</Th>
          </Tr>
          <Tr>
            <Th><Checkbox colorScheme="green" /></Th> 
            <Th><Input size="sm" placeholder="ID" /></Th>
            <Th><Input size="sm" placeholder="Código" /></Th>
            <Th><Input size="sm" placeholder="Nome" /></Th>
            <Th>
              <Select size="sm" placeholder="Todas">
                <option value="opcao1">Opção 1</option>

              </Select>
            </Th>
            <Th><Input size="sm" placeholder="Unid. Med." /></Th>
            <Th>
              <Select size="sm" placeholder="Todos">
                <option value="opcao1">Opção 1</option>
              </Select>
            </Th>
            <Th>
              <Select size="sm" placeholder="Todos">
                <option value="opcao1">Opção 1</option>
              </Select>
            </Th>
            <Th>
              <Select size="sm" placeholder="Responsável">
                <option value="opcao1">Opção 1</option>
              </Select>
            </Th>
            <Th>
              <HStack>
                <Button size="sm" colorScheme="gray">Limpar</Button>
                <Button size="sm" colorScheme="blue">Filtrar</Button>
              </HStack>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>89</Td>
            <Td>BIBLIO I.1</Td>
            <Td>Quantidade de Empréstimos</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>Qtd.</Td>
            <Td>Monitoramento Operacional</Td>
            <Td>-</Td>
            <Td>Igor Guevara</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>90</Td>
            <Td>BIBLIO I.2</Td>
            <Td>Quantidade de Demanda Reprimida</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>Qtd.</Td>
            <Td>Monitoramento Operacional</Td>
            <Td>-</Td>
            <Td>Sávio Neves do Nascimento</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
          {/* Add new rows here */}
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>91</Td>
            <Td>BIBLIO I.3</Td>
            <Td>Quantidade de Renovações</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>Qtd.</Td>
            <Td>-</Td>
            <Td>-</Td>
            <Td>Sávio Neves do Nascimento</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>92</Td>
            <Td>BIBLIO I.4</Td>
            <Td>Quantidade de Devoluções com Atraso</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>Qtd.</Td>
            <Td>-</Td>
            <Td>-</Td>
            <Td>Sávio Neves do Nascimento</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>93</Td>
            <Td>BIBLIO I.5</Td>
            <Td>Quantidade de Doações Recebidas</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>Qtd.</Td>
            <Td>-</Td>
            <Td>-</Td>
            <Td>Sávio Neves do Nascimento</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>94</Td>
            <Td>BIBLIO I.6</Td>
            <Td>Quantidade de Sugestões de Aquisição</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>Qtd.</Td>
            <Td>-</Td>
            <Td>-</Td>
            <Td>Sávio Neves do Nascimento</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
          <Tr>
            <Td><Checkbox colorScheme="green" /></Td> 
            <Td>95</Td>
            <Td>BIBLIO I.7</Td>
            <Td>Percentual de Sugestões de Aquisição Atendidas</Td>
            <Td>BIBLIO Biblioteca</Td>
            <Td>%</Td>
            <Td>Índice</Td>
            <Td>-</Td>
            <Td>Sávio Neves do Nascimento</Td>
            <Td>
              <IconButton aria-label='Search database' icon={<FaSearch />} size="sm" />
              <IconButton aria-label='Edit entry' icon={<FaRegEdit />} size="sm" />
            </Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}