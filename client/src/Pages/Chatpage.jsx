import React, { useEffect, useState } from "react";
import axios from "axios";

const Chatpage = () => {
  const [chats, setChats] = useState(null);

  const fetchChats = async () => {
    const { data } = await axios.get("/chats");
    console.log("data: ", data.kashif);

    setChats(data);
  };
  useEffect(() => {
    fetchChats();
  }, []);

  return <div>{chats?.kashif}</div>;
};

export default Chatpage;
