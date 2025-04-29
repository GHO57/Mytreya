import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import userReducer from "./features/user/userSlice";
import vendorReducer from "./features/vendor/vendorSlice";
import adminReducer from "./features/admin/adminSlice";
import clientReducer from "./features/client/clientSlice";

//combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    client: clientReducer,
    vendor: vendorReducer,
    admin: adminReducer,
});

//configure store

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
    devTools: import.meta.env.VITE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
