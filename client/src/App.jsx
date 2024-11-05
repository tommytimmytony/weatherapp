import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'
import "./App.css";

//Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/DashBoard";
import Profile from "./pages/Profile";

//Layouts
import RootLayout from './Layouts/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="login" element={<Login />} />
      <Route path="sign-up" element={<Signup />} />
    </Route>
  )
)

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
