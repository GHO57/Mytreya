import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../../../features/user/userThunks";
import { AppDispatch } from "../../../store";
import { IUserSignupForm } from "../../../interfaces/userFeatures";
import { toast } from "react-toastify";

const Signup = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { width } = useWindowDimensions();

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    //update fullname field
    const handleFullNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setFullName(event.target.value);
    };

    //update email field
    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    //update password field
    const handlePasswordChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setPassword(event.target.value);
    };

    //handle login form submit
    const handleSignupFormSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (!fullName || !email || !password) {
            toast.error("Enter your full name, email and password");
            return;
        }

        const signupForm: IUserSignupForm = {
            fullName: fullName,
            email: email,
            password: password,
        };

        dispatch(signup(signupForm))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    navigate("/login");
                    return;
                }
            });
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-white z-100 flex-center flex-row-reverse">
                <div
                    className={`${width <= 1024 ? "bg-gray-bg" : "bg-white"} w-full h-full flex-center`}
                >
                    <div
                        className={`flex-center flex-col gap-8  w-full ${width <= 1024 ? "border-1 border-stroke p-10 rounded-lg max-w-96 shadow-lg bg-white" : "max-w-86"}`}
                    >
                        <div className="flex-center flex-col gap-2">
                            <h2 className="text-title font-inter font-bold text-2xl">
                                Create account
                            </h2>
                            {/* <p className="text-paragraph2 font-inter font-light text-sm">
                                Enter your email below to login to your account
                            </p> */}
                        </div>
                        <form
                            onSubmit={handleSignupFormSubmit}
                            action="POST"
                            className={`w-full flex flex-col gap-6`}
                        >
                            <div className="flex flex-col gap-8 w-full">
                                <div className="w-full flex flex-col gap-2">
                                    <InputLabel
                                        htmlFor="fullName"
                                        sx={{
                                            color: "black",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        Full Name
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="fullName"
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={fullName}
                                        onChange={handleFullNameChange}
                                        required
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <InputLabel
                                        htmlFor="email"
                                        sx={{
                                            color: "black",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            fontFamily: "Inter, sans-serif",
                                        }}
                                    >
                                        Email
                                    </InputLabel>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        type="email"
                                        variant="outlined"
                                        size="small"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={handleEmailChange}
                                        required
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-2">
                                    <span className="flex w-full justify-between">
                                        <InputLabel
                                            htmlFor="password"
                                            sx={{
                                                color: "black",
                                                fontSize: "14px",
                                                fontWeight: 500,
                                                fontFamily: "Inter, sans-serif",
                                            }}
                                        >
                                            Password
                                        </InputLabel>
                                        <Link
                                            to="/forgot-password"
                                            className="text-black text-[14px] hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </span>
                                    <TextField
                                        fullWidth
                                        id="password"
                                        type="password"
                                        variant="outlined"
                                        size="small"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col text-center gap-4 w-full">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{ width: "100%" }}
                                        type="submit"
                                        // disabled={!isPasswordMatch && true}
                                    >
                                        Sign up
                                    </Button>
                                </div>
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-y-gray-300">
                                <span className="relative z-10 bg-white px-2 text-paragraph2">
                                    or
                                </span>
                            </div>

                            <span className="flex-center text-sm gap-2">
                                <p className="text-black text-md whitespace-nowrap">
                                    Already an user?
                                </p>
                                <Link
                                    to="/login"
                                    className="text-blue-700 hover:underline whitespace-nowrap"
                                >
                                    Log in
                                </Link>
                            </span>
                        </form>
                    </div>
                </div>
                {width > 1024 && (
                    <div className="w-full h-full flex-center bg-gray-bg bg-[url(/mytreya-tree.svg)] bg-center bg-no-repeat bg-[auto_500px]"></div>
                )}
            </div>
        </>
    );
};

export default Signup;
