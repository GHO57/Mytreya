import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import userReducer from "./features/user/userSlice";
import vendorReducer from "./features/vendor/vendorSlice";

//combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    vendor: vendorReducer,
});

//configure store

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: import.meta.env.VITE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
