"use client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Private from "./private/page";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/private" element={<Private />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
