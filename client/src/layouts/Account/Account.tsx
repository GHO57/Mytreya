import {
    Avatar,
    Divider,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/user/userThunks";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
const Account = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.user);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        dispatch(logoutUser())
            .unwrap()
            .then((response) => {
                if (response.success) {
                    navigate("/");
                    location.reload();
                }
            });
    };
    return (
        <>
            <Tooltip title="Account">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar
                        sx={{ bgcolor: "#f00000" }}
                        alt={user?.fullName}
                        src="/user"
                    />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,

                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <Link
                    to={
                        user?.roleName.toUpperCase() !== "CLIENT"
                            ? user?.roleName.toUpperCase() === "VENDOR"
                                ? "/vendor/dashboard"
                                : "/admin/dashboard"
                            : "/dashboard"
                    }
                    className="w-full"
                >
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <SpaceDashboardIcon fontSize="medium" />
                        </ListItemIcon>{" "}
                        Dashboard
                    </MenuItem>
                </Link>
                <Link to={"/account"}>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <SettingsRoundedIcon fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                </Link>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default Account;
