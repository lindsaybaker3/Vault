import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Navbar from "./Navbar";
import Background from "../images/background.png";

const drawerWidth = 240;

const DrawerComponent = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: "#05391F",
        }}
      >
        <Box
          component="img"
          sx={{
          height: 64,
          }}
          alt="Green header background"
          src={Background}
        />
      </AppBar>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#05391F",
          color: "#F5F5F5"
        },
      }}
      variant="permanent"
      anchor="left"
    >
        <Toolbar />
        <Divider />
          <List>
            <Navbar />
          </List>
        <Divider />
      </Drawer>
    </Box>
  );
};
export default DrawerComponent;
