import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./Auth"
import Home from "./Home"
import cors from 'cors'

function App() {
  return (
      <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
