import React, { useContext, useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  FormControl,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ChatContext } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import axios from "axios";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  //Search handler
  useEffect(() => {
    if (!search) {
      return;
    }
    setSearchResults([]);
    setLoading(true);
    const handleSearch = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        setSearchResults(data);
      } catch (error) {
        console.log("Search group members error :", error);
        toast({
          title: "Failed Search Members!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } finally {
        setLoading(false);
      }
    };
    const searchMemberTimeOut = setTimeout(handleSearch, 300);

    return () => {
      return clearTimeout(searchMemberTimeOut);
    };
  }, [search]);

  //Remove group member
  const handleRemoveMember = async (userTobeRemoved) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can remove from group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/group/remove",
        {
          chatId: selectedChat._id,
          removeMemberId: userTobeRemoved._id,
        },
        config
      );

      userTobeRemoved._id === user._id
        ? setSelectedChat()
        : setSelectedChat(data);

      fetchMessages();
      setFetchAgain((prev) => !prev);
    } catch (error) {
      console.log("Remove member in group error:", error);
      toast({
        title: "Remove Group Member Error!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSearch("");
      setLoading(false);
    }
  };

  //add group member
  const handleAddMember = async (userTobeAdded) => {
    if (
      selectedChat.users.some((selected) => selected._id === userTobeAdded._id)
    ) {
      toast({
        title: "User already added!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/group/add",
        {
          chatId: selectedChat._id,
          newMemberId: userTobeAdded._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain((prev) => !prev);
    } catch (error) {
      console.log("Add member in group error:", error);
      toast({
        title: "Add Group Member Error!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSearch("");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Enter Group Name!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/group/rename",
        {
          chatId: selectedChat._id,
          name: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain((prev) => !prev);
    } catch (error) {
      console.log("Rename group error:", error);
      toast({
        title: "Rename Group Name!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setRenameLoading(false);
    }
  };

  return (
    <>
      <Button d={{ base: "flex" }} onClick={onOpen}>
        Group Info
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedChat?.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  groupAdmin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemoveMember(u)}
                />
              ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                value={groupChatName}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => setSearch(e.target.value)}
              />
            </FormControl>
            <Box width="100%" textAlign="center">
              {loading && <Spinner my={1} />}
              {searchResults.length > 0 &&
                searchResults
                  .slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddMember(user)}
                    />
                  ))}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemoveMember(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
