import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatContextProvider from "./Context/ChatProvider";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import axios from "axios";
import "./App.css";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/chats", element: <Chatpage /> },
]);

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  return (
    <ChatContextProvider>
      <div className="App">
        <RouterProvider router={router} />;
      </div>
    </ChatContextProvider>
  );
}

export default App;
