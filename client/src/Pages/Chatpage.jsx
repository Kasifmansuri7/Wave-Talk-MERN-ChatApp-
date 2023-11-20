import { useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { ChatContext } from "../Context/ChatProvider";

const Chatpage = () => {
  const navigate = useNavigate();
  const { user } = useContext(ChatContext);


  
  useEffect(() => {
    console.log("user: ", user);

    if (!user) {
      navigate("/");
    }
  }, []);

  return <div>Chat Page</div>;
};

export default Chatpage;
