import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./components/auth/Auth"
import Home from "./components/layout/Home"
import CourseDetail from "./components/CourseDetail"

function App() {
  return (
      <BrowserRouter>
      <Routes>
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/courses/:id" element={<CourseDetail />}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
