import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RuleIcon from "@mui/icons-material/Rule";
import CrueltyFreeIcon from "@mui/icons-material/CrueltyFree";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { Link } from "react-router-dom";
const DrawerListComponent = ({ toggleDrawer }) => {
  const routeList = [
    { text: "Productos", icon: <CrueltyFreeIcon />, route: "/home" },
    { text: "Movimientos", icon: <RuleIcon />, route: "/movements" },
    { text: "Reportes", icon: <AssessmentIcon />, route: "/reports" },
  ];

  return (
    <Box
      sx={{
        width: { md: "20vw", sm: "30vw", xs: "80vw" },
        backgroundColor: "#ab846e",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List sx={{ color: "white" }}>
        {routeList.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.route}>
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
export default DrawerListComponent;
