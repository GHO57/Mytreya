import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Account from "../Account/Account";

const drawerWidth = 240;
const collapsedWidth = 64;

const AdminAppBar = ({
    open,
    toggleDrawer,
}: {
    open: boolean;
    toggleDrawer: () => void;
}) => {
    return (
        <AppBar
            position="fixed"
            color="default"
            elevation={0}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                transition: "all 0.3s ease",
                width: "100%",
                ml: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
                background: "#fff",
                borderBottom: "1px solid #ddd",
            }}
        >
            <Toolbar className="flex justify-between items-center">
                <div className="flex items-center">
                    <IconButton
                        onClick={toggleDrawer}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        {open ? <MenuOpenRoundedIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Mytreya
                    </Typography>
                </div>
                <Account />
            </Toolbar>
        </AppBar>
    );
};

export default AdminAppBar;
