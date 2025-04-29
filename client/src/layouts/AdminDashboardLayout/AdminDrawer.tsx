// VendorDrawer.tsx
import { Collapse, Drawer, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import { adminLinks } from "./data";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

type AdminIconKey =
    | "SpaceDashboardIcon"
    | "EventAvailableRoundedIcon"
    | "PeopleAltRoundedIcon"
    | "DescriptionRoundedIcon";

const adminIconMap: Record<AdminIconKey, ReactNode> = {
    SpaceDashboardIcon: <SpaceDashboardIcon fontSize="small" />,
    EventAvailableRoundedIcon: <EventAvailableRoundedIcon fontSize="small" />,
    PeopleAltRoundedIcon: <PeopleAltRoundedIcon fontSize="small" />,
    DescriptionRoundedIcon: <DescriptionRoundedIcon fontSize="small" />,
};

interface Props {
    drawerOpen: boolean;
    openMenus: string[];
    toggleMenu: (path: string) => void;
    drawerWidth: number;
    collapsedWidth: number;
}

const AdminDrawer = ({
    drawerOpen,
    openMenus,
    toggleMenu,
    drawerWidth,
    collapsedWidth,
}: Props) => {
    const location = useLocation();

    const { user } = useSelector((state: RootState) => state.user);

    const isPathActive = (path: string) =>
        location.pathname === `/admin/${path}`;
    const isSubpathActive = (
        subpaths: { name: string; path: string }[] | undefined,
    ) => subpaths?.some((sp) => location.pathname === `/admin/${sp.path}`);

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
                {adminLinks
                    // .filter((link) => link.accessTo === user.roleName)
                    .map((link) => {
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
                                        to={`/admin/${link.path}`}
                                        onClick={() =>
                                            link.subpaths &&
                                            toggleMenu(link.path)
                                        }
                                        className={`flex items-center gap-3 p-3 rounded-md transition-colors cursor-pointer ${
                                            active
                                                ? "bg-black-bg text-white"
                                                : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        <span>
                                            {
                                                adminIconMap[
                                                    link.icon as AdminIconKey
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
                                                    to={`/admin/${sub.path}`}
                                                    className={`block px-3 py-1 text-sm rounded-md ${
                                                        location.pathname ===
                                                        `/admin/${sub.path}`
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

export default AdminDrawer;
