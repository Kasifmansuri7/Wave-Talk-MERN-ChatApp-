import React, { useState, useContext } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../Context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useContext(ChatContext);

  const submitHandler = async () => {
    try {
      const config = {
        header: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      setUser(data.data);
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Login Success!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      navigate("/chats");
    } catch (err) {
      console.log("Login err", err);
      toast({
        title: "Login failed.",
        description: "Login failed please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "text" : "password"}
            placeholder="Enter Your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement>
            <Button h="1.75em" onClick={(e) => setShowPass((prev) => !prev)}>
              {showPass ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        mt="15px"
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User
      </Button>
    </VStack>
  );
};

export default Login;
