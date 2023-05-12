import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const logOutHandler =()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("balance")
        history.push("/")
        window.location.reload();
  }

    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon" onClick={()=>{history.push("/")}}></img>
        </Box>
        <Box width="50%">
        { !hasHiddenAuthButtons && children}
        </Box>
       <Box>
        { hasHiddenAuthButtons && <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>history.push("/")}
        >
          Back to explore
        </Button>}
        { !hasHiddenAuthButtons && !localStorage.getItem("username") && (<Stack direction="row" spacing={2}>
        <Button className="button" variant="text" onClick={()=>history.push("/login", {from:"Products"})}>
           Login
        </Button>
        <Button className="button" variant="contained" onClick={()=>history.push("/register", {from:"Products"})}>
           Register
        </Button>     
        </Stack>)}
        { !hasHiddenAuthButtons && localStorage.getItem("username") &&(<Stack alignItems="center" direction="row" spacing={2}>
          <Avatar src="avatar.png" alt={localStorage.getItem("username")}/>
          <div>{localStorage.getItem("username")}</div>
          <Button className="button" variant="text" onClick={()=>logOutHandler()}>
            LOGOUT
          </Button>   
          </Stack>)}
          </Box>
      </Box>
    );
};

export default Header;
