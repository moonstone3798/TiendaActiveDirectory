import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import DrawerListComponent from "../drawerList/DrawerListComponent";

const DrawerComponent = ({ open, toggleDrawer }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    typeof open === "boolean" && typeof toggleDrawer === "function";
  const currentOpen = isControlled ? open : internalOpen;
  const handleToggleDrawer = isControlled
    ? toggleDrawer
    : (newOpen) => () => {
        setInternalOpen(newOpen);
      };

  return (
    <div>
      <Drawer
        open={currentOpen}
        onClose={handleToggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",

            backgroundColor: "#ab846e",
          },
        }}
      >
        <DrawerListComponent toggleDrawer={handleToggleDrawer} />
      </Drawer>
    </div>
  );
};

export default DrawerComponent;
