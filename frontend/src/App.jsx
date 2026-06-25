import { Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "@/components/router/login/Login";
import Home from "@/components/router/home/Home";
import Reports from "@/components/router/reports/Reports";
import Movements from "@/components/router/movements/Movements";
import LoguedLayout from "@/components/layout/LoguedLayout";

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Login />
          }
        />
        <Route
          element={
            isAuthenticated ? <LoguedLayout /> : <Navigate to="/" replace />
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
