import styles from "@/components/router/login/Login.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import ButtonComponent from "@/components/atoms/button/ButtonComponent";
import { useState } from "react";
import Input from "@/components/atoms/input/Input";
import PasswordInput from "@/components/atoms/input/PasswordInput";
import { loginUser } from "@/store/authSlice";
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
    try {
      setLoading(true);
      setError(null);

      const payload = await dispatch(
        loginUser({ username, password }),
      ).unwrap();
      localStorage.setItem("userInfo", JSON.stringify(payload));
      navigate("/home");
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : err?.message || "Error al iniciar sesión";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
