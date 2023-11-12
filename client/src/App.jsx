import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import axios from "axios";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/chats", element: <Chatpage /> },
]);
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
