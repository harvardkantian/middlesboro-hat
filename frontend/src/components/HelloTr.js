import { ArrowDownward, ArrowDropDown, Logout } from "@mui/icons-material";
import { useRequest } from "../hooks/useRequest";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, setProfileValue } from "../context/slices/profileSlice";

const HelloTr = () => {
  const profile = useSelector((state) => state.profile);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = (e) => setAnchorEl(null);
  const { request, isLoading, error } = useRequest();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = async () => {
    try {
      await request("post", "/api/logout");
    } finally {
      localStorage.removeItem("profile");
      dispatch(clearProfile());
      handleClose();
      location.reload();
      navigate("/login");
    }
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  return (
    <>
      <IconButton
        variant="standard"
        onClick={!!anchorEl ? handleClose : handleOpen}
      >
        {profile?.first_name && (
          <Avatar
            {...stringAvatar(`${profile.first_name} ${profile.surname}`)}
          />
        )}
      </IconButton>
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem>
          <Stack>
            <Typography variant="subtitle1">
              {profile?.first_name} {profile.surname}
            </Typography>
            <Typography variant="body2">{profile?.role}</Typography>
          </Stack>
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout}>
          <ListItemIcon>
            {isLoading ? <CircularProgress size={20} /> : <Logout />}
          </ListItemIcon>
          <ListItemText>{isLoading ? "Logging out..." : "Logout"}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
export default HelloTr;
