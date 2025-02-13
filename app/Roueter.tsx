"use client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Private from "./private/page";
import Index from "./Index/page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/private" element={<Private />} />
        <Route path="/Home" element={<Index />}/>       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
