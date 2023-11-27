import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction, groupAdmin = false }) => {
  console.log("groupAdmin: ", groupAdmin);
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="#2196F3"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user._id === groupAdmin?._id
        ? user.name.split(" ")[0] + "(Admin)"
        : user.name.split(" ")[0]}

      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
