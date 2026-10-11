import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CandidatDetail from "./pages/CandidatDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidats/:id" element={<CandidatDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
