import styles from "./Login.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ButtonComponent from "../../atoms/button/ButtonComponent";
import { useState } from "react";
import Input from "../../atoms/input/Input";
import PasswordInput from "../../atoms/input/PasswordInput";
import { loginUser } from "../../../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const response = await dispatch(loginUser({ username, password }));
    if (response.payload.error) {
      setError(response.payload.error || "Error al iniciar sesión");
    } else {
      localStorage.setItem("userInfo", JSON.stringify(response.payload));
      navigate("/home");
    }
    setLoading(false);
  };
  const resetForm = () => {
    setUsername("");
    setPassword("");
    setError(null);
  };
  return (
    <section className={styles.login}>
      <Card className={styles.loginCard} sx={{ borderRadius: "1rem" }}>
        <CardContent className={styles.loginCardContent}>
          <h1 className="text-gray-800 text-2xl font-bold text-center">
            Bienvenido a tienda de peluches
          </h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            className={styles.loginForm}
          >
            <Input
              id="username"
              label="nombre de usuario"
              required={true}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
              helperText={error}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
            />
            <ButtonComponent
              color="#FF8FAB"
              type="submit"
              text="Iniciar sesión"
              onClick={handleLogin}
              loading={loading}
              disabled={loading || !username || !password}
            />
            <ButtonComponent
              type="reset"
              color="#78909C"
              onClick={resetForm}
              text="Restablecer"
            />
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
export default Login;
