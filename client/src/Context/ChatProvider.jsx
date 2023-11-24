import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext({});

const ChatContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const { data } = userInfo;

    if (data) {
      setUser(data);
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
