import { Routes, Route } from "react-router-dom";
import Login from "./components/router/login/Login";
import Home from "./components/router/home/Home";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
