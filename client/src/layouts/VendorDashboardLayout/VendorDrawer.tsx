// VendorDrawer.tsx
import { Collapse, Drawer, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";

import { vendorLinks } from "./data";
import { ReactNode } from "react";

type VendorIconKey =
    | "SpaceDashboardIcon"
    | "EventAvailableRoundedIcon"
    | "PeopleAltRoundedIcon";

const vendorIconMap: Record<VendorIconKey, ReactNode> = {
    SpaceDashboardIcon: <SpaceDashboardIcon fontSize="small" />,
    EventAvailableRoundedIcon: <EventAvailableRoundedIcon fontSize="small" />,
    PeopleAltRoundedIcon: <PeopleAltRoundedIcon fontSize="small" />,
};

interface Props {
    drawerOpen: boolean;
    openMenus: string[];
    toggleMenu: (path: string) => void;
    drawerWidth: number;
    collapsedWidth: number;
}

const VendorDrawer = ({
    drawerOpen,
    openMenus,
    toggleMenu,
    drawerWidth,
    collapsedWidth,
}: Props) => {
    const location = useLocation();

    const isPathActive = (path: string) =>
        location.pathname === `/vendor/${path}`;
    const isSubpathActive = (
        subpaths: { name: string; path: string }[] | undefined,
    ) => subpaths?.some((sp) => location.pathname === `/vendor/${sp.path}`);

    return (
        <Drawer
            variant="permanent"
            open={drawerOpen}
            slotProps={{
                paper: {
                    sx: {
                        top: "64px",
                        height: "calc(100vh - 64px)",
                        width: drawerOpen ? drawerWidth : collapsedWidth,
                        transition: "width 0.3s",
                        overflowX: "hidden",
                        boxShadow: 1,
                    },
                },
            }}
        >
            <div className="w-full h-full flex flex-col px-2 py-4">
                {vendorLinks.map((link) => {
                    const isOpen = openMenus.includes(link.path);
                    const active =
                        isPathActive(link.path) ||
                        isSubpathActive(link.subpaths);

                    return (
                        <div key={link.path}>
                            <Tooltip
                                title={!drawerOpen && link.name}
                                placement="right"
                            >
                                <Link
                                    to={`/vendor/${link.path}`}
                                    onClick={() =>
                                        link.subpaths && toggleMenu(link.path)
                                    }
                                    className={`flex items-center gap-3 p-3 rounded-md transition-colors cursor-pointer ${
                                        active
                                            ? "bg-black-bg text-white"
                                            : "hover:bg-gray-100 text-gray-700"
                                    }`}
                                >
                                    <span>
                                        {
                                            vendorIconMap[
                                                link.icon as VendorIconKey
                                            ]
                                        }
                                    </span>
                                    {drawerOpen && (
                                        <span
                                            className={`flex-1 text-sm font-normal ${active ? "text-white" : "text-paragraph2"}`}
                                        >
                                            {link.name}
                                        </span>
                                    )}
                                    {link.subpaths &&
                                        drawerOpen &&
                                        (isOpen ? (
                                            <KeyboardArrowUpIcon />
                                        ) : (
                                            <KeyboardArrowDownIcon />
                                        ))}
                                </Link>
                            </Tooltip>

                            {/* Subpaths */}
                            {link.subpaths && (
                                <Collapse
                                    in={isOpen && drawerOpen}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <div className="ml-8 mt-1 border-l-2 border-l-gray-200">
                                        {link.subpaths.map((sub) => (
                                            <Link
                                                key={sub.path}
                                                to={`/vendor/${sub.path}`}
                                                className={`block px-3 py-1 text-sm rounded-md ${
                                                    location.pathname ===
                                                    `/vendor/${sub.path}`
                                                        ? "bg-gray-200 text-black"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                </Collapse>
                            )}
                        </div>
                    );
                })}
            </div>
        </Drawer>
    );
};

export default VendorDrawer;
