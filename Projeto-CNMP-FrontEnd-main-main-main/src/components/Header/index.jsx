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
  InputGroup,
  InputRightElement,
  Textarea,
  Select,
  useToast,
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
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiCamera,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Importando imagens
import cnmpffImage from "../../assets/cnmpff.png";
import logoImage from "../../assets/logo.png";

// Definição do componente NavItem
const NavItem = ({ icon, route, isActive, children, ...rest }) => {
  const navigate = useNavigate();

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
        onClick={() => navigate(route)}
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

// Definição do componente SidebarContent
const SidebarContent = ({
  onClose,
  onOpenHelpForm,
  isNormalUser,
  ...rest
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const LinkItems = isNormalUser
    ? [{ name: "Medições de indicador", icon: FiTrendingUp, route: "/medicoes" }]
    : [
        { name: "Indicadores", icon: FiHome, route: "/HomePageLogada" },
        {
          name: "Medições de indicador",
          icon: FiTrendingUp,
          route: "/medicoes",
        },
        {
          name: "Cadastrar usuários",
          icon: FiUserPlus,
          route: "/Cadastramentodeusuario",
        },
        {
          name: "Incluir indicadores",
          icon: FiStar,
          route: "/administracao",
        },
      ];

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
          onClick={() => navigate("/HomePageLogada")}
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

// Definição do componente MobileNav
const MobileNav = ({
  onOpen,
  isNormalUser,
  onOpenEditProfile,
  profileImage,
  ...rest
}) => {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const nome = localStorage.getItem("nomeUsuario");
    if (nome) {
      setNomeUsuario(nome);
    }
  }, []);

  const handleSair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("profileImage");
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
                <Avatar size={"sm"} src={profileImage || cnmpffImage} />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{nomeUsuario || "Usuário"}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {isNormalUser ? "Usuário" : "Gestor"}
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
              <MenuItem icon={<FiEdit3 />} onClick={onOpenEditProfile}>
                Editar Perfil
              </MenuItem>
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

// Componente principal SidebarWithHeader
const SidebarWithHeader = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isHelpFormOpen,
    onOpen: onOpenHelpForm,
    onClose: onCloseHelpForm,
  } = useDisclosure();
  const {
    isOpen: isEditProfileOpen,
    onOpen: onOpenEditProfile,
    onClose: onCloseEditProfile,
  } = useDisclosure();

  const [isNormalUser, setIsNormalUser] = useState(false);
  const [helpType, setHelpType] = useState("");
  const [helpMessage, setHelpMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const toast = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const perfilUsuario = localStorage.getItem("perfilUsuario");
    setIsNormalUser(perfilUsuario === "usuario");

    const nomeUsuario = localStorage.getItem("nomeUsuario");
    if (nomeUsuario) {
      setUserName(nomeUsuario);
    }

    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImagePreview(savedProfileImage);
    }
  }, [isEditProfileOpen]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendHelpRequest = () => {
    console.log("Tipo de ajuda:", helpType);
    console.log("Mensagem:", helpMessage);
    onCloseHelpForm();
  };

  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("nome", userName);
      formData.append("senha_antiga", oldPassword);
      formData.append("nova_senha", password);
      if (profileImage) {
        formData.append("foto_perfil", profileImage);
      }

      await axios.put(
        `http://localhost:8000/usuarios/${localStorage.getItem(
          "userId"
        )}/atualizar_perfil`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("nomeUsuario", userName);
      if (profileImagePreview) {
        localStorage.setItem("profileImage", profileImagePreview);
      }

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onCloseEditProfile();
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error.response.data.detail || "Erro ao atualizar o perfil",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={useColorModeValue("white", "gray.900")}>
      <SidebarContent
        onClose={onClose}
        onOpenHelpForm={onOpenHelpForm}
        isNormalUser={isNormalUser}
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
          <SidebarContent
            onClose={onClose}
            onOpenHelpForm={onOpenHelpForm}
            isNormalUser={isNormalUser}
          />
        </DrawerContent>
      </Drawer>
      <MobileNav
        onOpen={onOpen}
        isNormalUser={isNormalUser}
        onOpenEditProfile={onOpenEditProfile}
        profileImage={profileImagePreview}
      />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>

      {/* Modal para o formulário de ajuda */}
      <Modal isOpen={isHelpFormOpen} onClose={onCloseHelpForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Solicitar ajuda</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="help-type" mb={4}>
              <FormLabel>Tipo de ajuda</FormLabel>
              <Select
                placeholder="Selecione o tipo de ajuda"
                value={helpType}
                onChange={(e) => setHelpType(e.target.value)}
              >
                <option value="problema-tecnico">Problema técnico</option>
                <option value="duvida-sistema">Dúvida sobre o sistema</option>
                <option value="sugestao-melhoria">Sugestão de melhoria</option>
                <option value="outros">Outros</option>
              </Select>
            </FormControl>
            <FormControl id="help-message">
              <FormLabel>Mensagem</FormLabel>
              <Textarea
                placeholder="Descreva sua solicitação"
                value={helpMessage}
                onChange={(e) => setHelpMessage(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSendHelpRequest}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={onCloseHelpForm}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para editar perfil */}
      <Modal isOpen={isEditProfileOpen} onClose={onCloseEditProfile}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="profile-image" mb={4} textAlign="center">
              <FormLabel>Foto de Perfil</FormLabel>
              <Box position="relative" display="inline-block">
                <Avatar size="xl" src={profileImagePreview || cnmpffImage} />
                <IconButton
                  icon={<FiCamera />}
                  position="absolute"
                  bottom="0"
                  right="0"
                  rounded="full"
                  onClick={() => document.getElementById("file-input").click()}
                />
              </Box>
              <Input
                id="file-input"
                type="file"
                accept="image/*"
                display="none"
                onChange={handleProfileImageChange}
              />
            </FormControl>

            <FormControl id="user-name" mb={4}>
              <FormLabel>Nome de Usuário</FormLabel>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>

            {/* Campo para senha antiga */}
            <FormControl id="old-password" mb={4}>
              <FormLabel>Senha antiga</FormLabel>
              <InputGroup>
                <Input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Digite sua senha antiga"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    icon={showOldPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Campo para nova senha */}
            <FormControl id="user-password">
              <FormLabel>Nova senha</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateProfile}>
              Salvar Alterações
            </Button>
            <Button variant="ghost" onClick={onCloseEditProfile}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SidebarWithHeader;
