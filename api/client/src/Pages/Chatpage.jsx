import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/MyChats";
import ChatBox from "../Components/ChatBox";
const Chatpage = () => {
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false);
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
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
