import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatContext } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const SideDrawer = () => {
  // const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const search = useRef(null);
  const [delay, setDelay] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  useEffect(() => {
    const handleSearch = async () => {
      setSearchResult([]);
      setLoading(true);
      try {
        if (search.current?.value) {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(
            `/api/user?search=${search.current.value}`,
            config
          );
          setSearchResult(data);
        }
      } catch (error) {
        console.log("Search user error: ", error);
        toast({
          title: "Failed to load search result!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    };
    const searchDelay = setTimeout(handleSearch, 300);

    return () => {
      return clearTimeout(searchDelay);
    };
  }, [search, delay]);

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats((prevChats) => [data, ...prevChats]);
      }
      setSelectedChat(data);
      onClose();
    } catch (error) {
      console.log("access chat error:", error);
      setLoadingChat(false);
      toast({
        title: "Failed to load chat!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        py="5px"
        px="10px"
        borderWidth="5px"
      >
        <Tooltip label="Search a user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px="4" mx="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="work sans" fontWeight="600">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <BellIcon boxSize={6} mx={3} />
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create your account
          </DrawerHeader>

          <DrawerBody>
            <Box display="flex" paddingBottom="2px">
              <Input
                placeholder="search by name or email"
                mr={2}
                // value={search}
                onChange={(e) => setDelay(e.target.value)}
                ref={search}
                // onChange={(e) => setSearch(e.target.value)}
              />
              {/* <Button onClick={handleSearch}>Go</Button> */}
            </Box>
            <div style={{ marginTop: "10px" }}>
              {loading && <ChatLoading />}

              {searchResult.length > 0 &&
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleChat={() => accessChat(user._id)}
                  />
                ))}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
