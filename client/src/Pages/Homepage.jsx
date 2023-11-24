import React, { useEffect, useContext } from "react";
import {
  Container,
  Center,
  Text,
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../Context/ChatProvider";

function Homepage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(ChatContext);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo.data);
      navigate("/chats");
    }
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Center
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
      </Center>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded" w="100%">
          <TabList>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
