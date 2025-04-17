import { useState } from "react";
import { Outlet } from "react-router-dom";
import VendorAppBar from "../VendorAppBar/VendorAppBar";
import VendorDrawer from "./VendorDrawer";

const drawerWidth = 300;
const collapsedWidth = 62;

const VendorDashboardLayout = () => {
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(true);

    const toggleMenu = (path: string) => {
        setOpenMenus((prev) =>
            prev.includes(path)
                ? prev.filter((item) => item !== path)
                : [...prev, path],
        );
    };

    return (
        <div className="w-full h-screen flex overflow-hidden bg-white">
            <VendorAppBar
                open={drawerOpen}
                toggleDrawer={() => setDrawerOpen(!drawerOpen)}
            />

            <VendorDrawer
                drawerOpen={drawerOpen}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                drawerWidth={drawerWidth}
                collapsedWidth={collapsedWidth}
            />
            {/* Main Content */}
            <main
                className="transition-all duration-300 p-4 overflow-y-auto"
                style={{
                    marginTop: 64,
                    marginLeft: drawerOpen ? drawerWidth : collapsedWidth,
                    width: `calc(100% - ${drawerOpen ? drawerWidth : collapsedWidth}px)`,
                }}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default VendorDashboardLayout;
