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
import AdminDashboardLayout from "./layouts/AdminDashboardLayout/AdminDashboardLayout";
import AdminDashboardHome from "./components/Admin/AdminDashboardHome/AdminDashboardHome";
import PackageRecommendation from "./components/Admin/PackageRecommendation/PackageRecommendation";
import CounsellingRequest from "./components/Admin/CounsellingRequest/CounsellingRequest";
import {
    clearClientError,
    clearClientMessage,
} from "./features/client/clientSlice";
import {
    clearAdminError,
    clearAdminMessage,
} from "./features/admin/adminSlice";
import ManageVendorApplications from "./components/Admin/ManageVendorApplications/ManageVendorApplications";
import ConfirmPackage from "./components/Client/ConfirmPackage.tsx/ConfirmPackage";

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

    const { clientLoading, clientMessage, clientError } = useSelector(
        (state: RootState) => state.client,
    );

    const { adminLoading, adminMessage, adminError } = useSelector(
        (state: RootState) => state.admin,
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
            (!vendorLoading && vendorMessage) ||
            (!clientLoading && clientMessage) ||
            (!adminLoading && adminMessage)
        ) {
            toast.dismiss();
            toast.success(
                message || vendorMessage || clientMessage || adminMessage,
            );

            if (message) dispatch(clearUserMessage());
            if (vendorMessage) dispatch(clearVendorMessage());
            if (clientMessage) dispatch(clearClientMessage());
            if (adminMessage) dispatch(clearAdminMessage());
        } else if (
            (!loadingLogin && error) ||
            (!loading && error) ||
            (!vendorLoading && vendorError) ||
            (!clientLoading && clientError) ||
            (!adminLoading && adminError)
        ) {
            if (error) {
                toast.dismiss();
                toast.error(error);
                dispatch(clearUserError());
            } else if (vendorError) {
                toast.dismiss();
                toast.error(vendorError);
                dispatch(clearVendorError());
            } else if (clientError) {
                toast.dismiss();
                toast.error(clientError);
                dispatch(clearClientError());
            } else if (adminError) {
                toast.dismiss();
                toast.error(adminError);
                dispatch(clearAdminError());
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
        clientLoading,
        clientMessage,
        clientError,
        adminLoading,
        adminMessage,
        adminError,
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
                        <Route path="packages" element={<Services />} />
                    </Route>
                    <Route
                        path="packages/:packageId/confirm"
                        element={<ConfirmPackage />}
                    />

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

                    {/* admin routes */}
                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboardLayout />}
                    >
                        <Route index element={<AdminDashboardHome />} />
                        <Route
                            path="package-recommendation"
                            element={<PackageRecommendation />}
                        />
                        <Route
                            path="counselling-request"
                            element={<CounsellingRequest />}
                        />
                        <Route
                            path="vendor-applications"
                            element={<ManageVendorApplications />}
                        />
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
