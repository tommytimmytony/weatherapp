import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'
import "./App.css";
import "./styles/DashBoard.css"
//Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import Radar from "./pages/Radar";

//Layouts
import RootLayout from './Layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="/:citySelected" element={<Dashboard />} />
      <Route path="radar" element={<Radar />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<Signup />} />
    </Route>
  )
);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
