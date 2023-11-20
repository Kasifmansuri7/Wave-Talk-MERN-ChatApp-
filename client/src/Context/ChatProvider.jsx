import { createContext, useEffect, useState } from "react";

export const ChatContext = createContext({});

const ChatContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("userInfo: ", userInfo);

    setUser(userInfo);
  }, []);

  return (
    <ChatContext.Provider value={{ user, setUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
