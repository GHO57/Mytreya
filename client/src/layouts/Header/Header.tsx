import { useState } from "react";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { Avatar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Header = () => {
    const { width } = useWindowDimensions();

    const [toggleMenu, setToggleMenu] = useState<boolean>(false);

    const { isAuthenticated, user } = useSelector(
        (state: RootState) => state.user,
    );

    const roleName = String(user?.roleName).toUpperCase();
    const fullName = user?.fullName;
    const baseLocation =
        roleName !== "CLIENT"
            ? roleName === "VENDOR"
                ? "vendor"
                : "admin"
            : "";

    const handleMenuToggle = () => {
        setToggleMenu((prev) => !prev);
    };

    return (
        <>
            <div className="w-full flex-center py-4 px-4 sm:px-8 lg:px-12">
                <div className="max-w-[1280px] w-full h-auto flex justify-between items-center">
                    <div>
                        <div className="flex-center gap-x-4">
                            {width <= 1024 &&
                                (toggleMenu ? (
                                    <>
                                        <CloseRoundedIcon
                                            onClick={handleMenuToggle}
                                            className="cursor-pointer"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <MenuRoundedIcon
                                            onClick={handleMenuToggle}
                                            className="cursor-pointer"
                                        />
                                    </>
                                ))}
                            <img
                                src="/logo.svg"
                                alt="mytreya"
                                className="max-w-32 lg:max-w-40"
                            />
                        </div>
                    </div>
                    {width > 1024 && (
                        <>
                            <div className="font-mulish text-md font-semibold text-paragraph flex gap-x-8 xl:gap-x-12">
                                <Link
                                    to="/"
                                    className="hover:text-primary transition-colors duration-100"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/services"
                                    className="hover:text-primary transition-colors duration-100"
                                >
                                    Services
                                </Link>
                                <Link
                                    to="/about"
                                    className="hover:text-primary transition-colors duration-100"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/pricing"
                                    className="hover:text-primary transition-colors duration-100"
                                >
                                    Pricing
                                </Link>
                                <Link
                                    to="/partner"
                                    className="hover:text-primary transition-colors duration-100"
                                >
                                    Partner
                                </Link>
                                <Link
                                    to="/blog"
                                    className="hover:text-primary transition-colors duration-100"
                                >
                                    Blog
                                </Link>
                            </div>
                        </>
                    )}
                    {isAuthenticated ? (
                        <>
                            <Link
                                to={`${baseLocation}/dashboard`}
                                className="flex-center"
                            >
                                <Avatar alt={fullName}>
                                    <PersonRoundedIcon />
                                </Avatar>
                            </Link>
                        </>
                    ) : (
                        <div className="flex gap-4 lg:gap-6">
                            <Link to="/login">
                                <Button
                                    variant={`${width > 540 ? "outlined" : "text"}`}
                                    color="secondary"
                                >
                                    Login
                                </Button>
                            </Link>
                            {width > 720 && (
                                <Link to="/signup">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
