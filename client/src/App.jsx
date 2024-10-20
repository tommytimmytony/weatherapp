import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ShowCreators from "./pages/ShowCreators";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ShowCreators />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
