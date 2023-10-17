import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { logout as logoutAction } from "pages/auth/auth.redux";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LOGIN } from "src/const";
import { useAppDispatch, useAppSelector } from "src/core/hook";

export function Header() {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(logoutAction());
    navigate(ROUTE_LOGIN);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">ReactApp</Link>
          </Typography>
          {isLoggedIn && (
            <Button onClick={() => logout()} color="inherit" data-test-id="logout-btn">
              Logout
            </Button>
          )}
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
