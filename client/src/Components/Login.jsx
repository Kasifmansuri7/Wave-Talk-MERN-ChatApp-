import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPass, setShowPass] = useState(false);

  const submitHandler = () => {};
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

      <Button colorScheme="blue" width="100%" mt="15px" onClick={submitHandler}>
        Login
      </Button>

      <Button
        colorScheme="red"
        width="100%"
        mt="15px"
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
