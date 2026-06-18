import styles from "./Login.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Input from "../../molecules/input/Input";
import PasswordInput from "../../molecules/input/PasswordInput";
import ButtonComponent from "../../molecules/button/ButtonComponent";
import { useState } from "react";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className={styles.login}>
      <Card className={styles.loginCard} sx={{ borderRadius: "1rem" }}>
        <CardContent className={styles.loginCardContent}>
          <h1
            className={`text-gray-800 text-2xl font-bold text-center ${styles.textoFuego}`}
          >
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
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <ButtonComponent
              color="#FF8FAB"
              type="submit"
              text="Iniciar sesión"
            />
            <ButtonComponent
              type="reset"
              color="#78909C"
              onClick={() => {
                setUsername("");
                setPassword("");
              }}
              text="Restablecer"
            />
          </form>
        </CardContent>
      </Card>
    </section>
  );
};
export default Login;
