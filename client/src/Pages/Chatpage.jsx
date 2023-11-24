import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
const Chatpage = () => {
  const navigate = useNavigate();
  const { user } = useContext(ChatContext);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="92vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;
