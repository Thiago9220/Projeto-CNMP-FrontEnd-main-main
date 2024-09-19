"use client";

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiUserPlus, 
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

// Importing images
import cnmpffImage from "../../assets/cnmpff.png";
import logoImage from "../../assets/logo.png";

const LinkItems = [
  { name: "Indicadores", icon: FiHome, route: "/HomePageLogada" },
  { name: "Medições de indicador", icon: FiTrendingUp, route: "" },
  {
    name: "Cadastrar usuários",
    icon: FiUserPlus, // Change the icon here
    route: "/Cadastramentodeusuário",
  },
  { name: "Incluir indicadores", icon: FiStar, route: "/administracao" },
 
];

const SidebarContent = ({ onClose, onOpenHelpForm, ...rest }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    navigate("/HomePageLogada");
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image
          src={logoImage}
          h="16"
          w="auto"
          cursor="pointer"
          onClick={handleLogoClick}
        />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          route={link.route}
          isActive={location.pathname === link.route}
        >
          {link.name}
        </NavItem>
      ))}
      <Box position="absolute" bottom="8" w="full" px="4">
        <Button
          onClick={onOpenHelpForm}
          colorScheme="gray"
          background={"white"}
          size="sm"
          width="full"
        >
          Precisa de ajuda? Fale conosco
        </Button>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, route, isActive, children, ...rest }) => {
  const navigate = useNavigate();

  const onClickNavigate = () => {
    navigate(route);
  };
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? "0" : "transparent"}
        color={isActive ? "red" : "inherit"}
        _hover={{
          bg: "gray.300",
          color: "black",
        }}
        onClick={onClickNavigate}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "black",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/HomePageLogada");
  };
  const handleSair = (e) => {
    navigate("/login");
  };
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Image
        display={{ base: "flex", md: "none" }}
        src={logoImage}
        h="12"
        w="auto"
        cursor="pointer"
        onClick={handleLogoClick}
      />

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar size={"sm"} src={cnmpffImage} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Thiago Ramos Duarte</Text>
                  <Text fontSize="xs" color="gray.600">
                    Gestor
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => navigate("/administracao")}>
                Incluir indicadores
              </MenuItem>
              <MenuDivider borderColor="gray.400" />
              <MenuItem onClick={() => navigate("/Cadastramentodeusuário")}>
                Incluir usuários
              </MenuItem>
              <MenuDivider borderColor="gray.400" />
              <MenuItem onClick={handleSair} icon={<FiLogOut />}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

const HelpFormModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    problem: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const remainingCharacters = 600 - formData.problem.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Fale Conosco</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nome completo</FormLabel>
            <Input
              placeholder="Digite seu nome completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Digite seu email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Relatar o problema</FormLabel>
            <Textarea
              placeholder="Descreva o problema"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              maxLength={600}
            />
            <Text fontSize="sm" color="gray.500">
              Máximo de 600 caracteres. Restantes: {remainingCharacters}
            </Text>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Enviar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const SidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isHelpFormOpen,
    onOpen: onOpenHelpForm,
    onClose: onCloseHelpForm,
  } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        onOpenHelpForm={onOpenHelpForm}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} onOpenHelpForm={onOpenHelpForm} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
        {children}
      </Box>
      <HelpFormModal isOpen={isHelpFormOpen} onClose={onCloseHelpForm} />
    </Box>
  );
};

export default SidebarWithHeader;
