import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import { Container } from "@mui/system";
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
      {/* <Container
           component="main"
           sx={{
             flexGrow: 1,
             p: 3,
             marginLeft: drawerWidth, // Add margin to create space for the drawer
             backgroundColor: 'background.default', // Set background color for the main content
             display: 'flex',
             flexDirection: 'column'
           }}
        >
          <Toolbar />

        </Container> */}
    </Box>
  );
};
export default DrawerComponent;
