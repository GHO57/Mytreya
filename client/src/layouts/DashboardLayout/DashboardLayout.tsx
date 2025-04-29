import { useLocation, Link, Outlet } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { clientLinks } from "./data";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import { Breadcrumbs } from "@mui/material";

type ClientIconKey =
    | "SpaceDashboardIcon"
    | "CalendarMonthIcon"
    | "AssignmentIcon"
    | "CurrencyRupeeRoundedIcon";

const clientIconMap: Record<ClientIconKey, ReactNode> = {
    SpaceDashboardIcon: <SpaceDashboardIcon />,
    CalendarMonthIcon: <CalendarMonthIcon />,
    AssignmentIcon: <AssignmentIcon />,
    CurrencyRupeeRoundedIcon: <CurrencyRupeeRoundedIcon />,
};

const DashboardLayout = () => {
    const location = useLocation();
    const [locationPaths, setLocationPaths] = useState<string[]>([]);
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const currentPath = location.pathname;

    useEffect(() => {
        const paths: string[] = currentPath.slice(11).split("/");
        setLocationPaths(paths);
    }, [currentPath]);

    const toggleMenu = (path: string) => {
        setOpenMenus((prev) =>
            prev.includes(path)
                ? prev.filter((item) => item !== path)
                : [...prev, path],
        );
    };

    const handleToggleMenu = (path: string, hasSubpaths: boolean) => {
        if (hasSubpaths) toggleMenu(path);
    };

    const isPathActive = (path: string) => location.pathname === `/${path}`;
    const isSubpathActive = (
        subpaths: { name: string; path: string }[] | undefined,
    ) => subpaths?.some((sp) => location.pathname === `/${sp.path}`);

    return (
        <>
            <div className="flex justify-center w-full max-h-screen min-h-screen">
                <div
                    className={`xl:max-w-[1280px] w-full flex flex-1 overflow-hidden`}
                >
                    {/* Sidebar */}
                    <div
                        className={`h-full bg-white max-w-[250px] w-full py-4 mr-4 overflow-y-hidden`}
                    >
                        <div className="w-full h-full flex justify-between flex-col gap-16">
                            <div className="w-full flex flex-col gap-8">
                                <div className="flex flex-col">
                                    {clientLinks.map((link) => {
                                        const isOpen = openMenus.includes(
                                            link.path,
                                        );
                                        const active =
                                            isPathActive(link.path) ||
                                            isSubpathActive(link.subpaths);

                                        return (
                                            <div
                                                key={link.path}
                                                className="flex flex-col gap-y-2"
                                            >
                                                <Link
                                                    to={`/${link.path}`}
                                                    className={`flex items-center justify-between gap-[1rem] p-[1.2rem] cursor-pointer ${
                                                        active
                                                            ? "bg-black-fg text-white rounded-lg"
                                                            : "hover:bg-gray-bg duration-100 rounded-lg"
                                                    }`}
                                                >
                                                    {
                                                        clientIconMap[
                                                            link.icon as ClientIconKey
                                                        ]
                                                    }
                                                    <div className="flex-1 flex items-center gap-[1rem]">
                                                        <p className="text-[15px] overflow-hidden whitespace-nowrap text-mediumGray font-normal">
                                                            {link.name}
                                                        </p>
                                                    </div>
                                                    {link.subpaths && (
                                                        <span
                                                            className={`rounded-full flex-center ${active ? "hover:bg-white/10" : "hover:bg-black/10"}`}
                                                            onClick={() =>
                                                                handleToggleMenu(
                                                                    link.path,
                                                                    !!link.subpaths,
                                                                )
                                                            }
                                                        >
                                                            {isOpen ? (
                                                                <KeyboardArrowUpIcon />
                                                            ) : (
                                                                <KeyboardArrowDownIcon />
                                                            )}
                                                        </span>
                                                    )}
                                                </Link>

                                                {/* Subpaths */}
                                                {isOpen && link.subpaths && (
                                                    <div className="ml-8 pl-2 border-l-[2px] border-gray-300">
                                                        {link.subpaths.map(
                                                            (sub) => (
                                                                <Link
                                                                    key={
                                                                        sub.path
                                                                    }
                                                                    to={`/${sub.path}`}
                                                                    className={`block py-2 px-3 text-[14px] rounded-md ${
                                                                        isPathActive(
                                                                            sub.path,
                                                                        )
                                                                            ? "bg-gray-200 text-black"
                                                                            : "text-mediumGray hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 px-2 py-4 overflow-y-auto">
                        <Breadcrumbs>
                            {locationPaths.map((path) => (
                                <div key={path}>{path}</div>
                            ))}
                        </Breadcrumbs>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardLayout;
