import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  Box,
  Text,
  IconButton,
  Button,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;

let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => {
      setIsTyping(true);
    });

    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  //fetch messages function
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log("fetch messages error:", error);
      toast({
        title: "Failed to load messages.",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  //send and create message in db
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.log("send message error:", error);
        toast({
          title: "Failed to send message.",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } finally {
        setNewMessage("");
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    //debouncing function to stop typing if user is not typing
    let lastTypingTime = Date.now();
    let timeLength = 1500;

    setTimeout(() => {
      let timeNow = Date.now();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat?.isGroupChat ? (
              <>
                {getSender(user, selectedChat?.users)}
                <ProfileModal user={getSenderFull(user, selectedChat?.users)}>
                  <Button>Info</Button>
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat?.chatName?.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="lg"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && (
                <div>
                  <Lottie
                    options={defaultOptions}
                    //   height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
