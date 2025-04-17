import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store.tsx";

const theme = createTheme({
    palette: {
        primary: {
            main: "#fac000",
            dark: "#fa9f00",
            light: "#fbd44e",
        },
        secondary: {
            main: "#121212",
            dark: "#000",
        },
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableRipple: true,
            },
            styleOverrides: {
                root: {
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    borderRadius: "5px",
                    minWidth: "110px",
                    width: "fit-content",
                    textTransform: "none",
                    padding: "0.65rem 1.5rem",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "none",
                    },
                    "&:active": { boxShadow: "none" },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: "6px",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "15px",
                    padding: "0.2rem 0",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                        borderWidth: "1px",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                    },
                    "label + &": {
                        marginTop: "3rem",
                    },
                },
            },
        },
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
);
