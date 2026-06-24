import Navbar from "../molecules/nav/Navbar";
import { Outlet } from "react-router-dom";

const LoguedLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default LoguedLayout;
