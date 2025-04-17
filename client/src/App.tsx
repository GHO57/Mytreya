import {
    Routes,
    Route,
    BrowserRouter as Router,
    Navigate,
    useLocation,
} from "react-router-dom";
import Header from "./layouts/Header/Header";
import Footer from "./layouts/Footer/Footer";
import Home from "./components/User/Home/Home";
import Login from "./components/User/Login/Login";
import Signup from "./components/User/Signup/SIgnup";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { clearUserError, clearUserMessage } from "./features/user/userSlice";
import { loadUser } from "./features/user/userThunks";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import DashboardHome from "./components/User/DashboardHome/DashboardHome";
import Sessions from "./components/User/Sessions/Sessions";
import Services from "./components/User/Services/Services";
import PartnerRegistration from "./components/Vendor/PartnerRegistration/PartnerRegistration";
import {
    clearVendorError,
    clearVendorMessage,
} from "./features/vendor/vendorSlice";
import AvailabilityListing from "./components/Vendor/AvailabilityListing/AvailabilityListing";
import VendorDashboardHome from "./components/Vendor/VendorDashboardHome/VendorDashboardHome";
import VendorDashboardLayout from "./layouts/VendorDashboardLayout/VendorDashboardLayout";
import VendorSessions from "./components/Vendor/VendorSessions/VendorSessions";

const AppContent = () => {
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const hasLoadedUser = useRef(false);

    const { loading, loadingLogin, message, error } = useSelector(
        (state: RootState) => state.user,
    );
    const { vendorLoading, vendorMessage, vendorError } = useSelector(
        (state: RootState) => state.vendor,
    );

    const showHeaderFooter =
        !location.pathname.startsWith("/admin") &&
        !location.pathname.startsWith("/vendor");

    useEffect(() => {
        //conditionally dispatches the loading thunks and renders the message and errors
        if (!hasLoadedUser.current) {
            dispatch(loadUser());
            hasLoadedUser.current = true;
        }
        if (
            (!loadingLogin && message) ||
            (!loading && message) ||
            (!vendorLoading && vendorMessage)
        ) {
            toast.dismiss();
            toast.success(message || vendorMessage);

            if (message) dispatch(clearUserMessage());
            if (vendorMessage) dispatch(clearVendorMessage());
        } else if (
            (!loadingLogin && error) ||
            (!loading && error) ||
            (!vendorLoading && vendorError)
        ) {
            if (error) {
                toast.dismiss();
                toast.error(error);
                dispatch(clearUserError());
            } else if (vendorError) {
                toast.dismiss();
                toast.error(vendorError);
                dispatch(clearVendorError());
            }
        }
    }, [
        dispatch,
        loading,
        loadingLogin,
        message,
        error,
        vendorLoading,
        vendorMessage,
        vendorError,
    ]);
    return (
        <>
            <ToastContainer
                className={`z-[10000]`}
                position="bottom-center"
                autoClose={4000}
                hideProgressBar={true}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                transition={Slide}
                stacked
                limit={1}
                theme="light"
            />
            {showHeaderFooter && (
                <div className="fixed w-full z-100 bg-white">
                    <Header />
                </div>
            )}
            <div className={`${showHeaderFooter ? "pt-[82px]" : ""}  `}>
                <Routes>
                    {/* user routes  */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route path="sessions" element={<Sessions />} />
                        <Route path="services" element={<Services />} />
                    </Route>

                    {/* vendor routes */}
                    <Route
                        path="/partner/registration"
                        element={<PartnerRegistration />}
                    />
                    <Route
                        path="/vendor/dashboard"
                        element={<VendorDashboardLayout />}
                    >
                        <Route index element={<VendorDashboardHome />} />
                        <Route
                            path="availability"
                            element={<AvailabilityListing />}
                        />
                        <Route path="sessions" element={<VendorSessions />} />
                    </Route>
                </Routes>
            </div>
            {showHeaderFooter && (
                <div>
                    <Footer />
                </div>
            )}
        </>
    );
};

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;
