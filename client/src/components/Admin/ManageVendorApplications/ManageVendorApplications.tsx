import { FormEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
    approveVendorApplications,
    getAllVendorApplications,
    rejectVendorApplications,
} from "../../../features/admin/adminThunks";
import CustomTable, { Column } from "../../../layouts/CustomTable/CustomTable";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Tooltip,
} from "@mui/material";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { IVendorApplications } from "../../../interfaces/adminFeatures";
import { toast } from "react-toastify";

const ManageVendorApplications = () => {
    const dispatch = useDispatch<AppDispatch>();

    const isFetchedApplications = useRef(false);

    const { vendorApplications } = useSelector(
        (state: RootState) => state.admin,
    );

    const [moreInfoModalOpen, setMoreInfoModalOpen] = useState<boolean>(false);
    const [moreInformation, setMoreInformation] = useState<IVendorApplications>(
        {},
    );
    const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);

    const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);

    const [currentVendorApplicationId, setCurrentVendorApplicationId] =
        useState<string>("");

    const handleMoreInfoModalOpen = (information: IVendorApplications) => {
        setMoreInformation(information);
        setMoreInfoModalOpen(true);
    };

    const handlMoreInfoModalClose = () => {
        setMoreInfoModalOpen(false);
        setMoreInformation({});
    };

    const handleApproveVendor = (event: FormEvent) => {
        event.preventDefault();

        const vendor_application_id = currentVendorApplicationId;

        if (!vendor_application_id) {
            toast.error("Something went wrong, try reloading");
        }

        dispatch(approveVendorApplications({ vendor_application_id }))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setApproveModalOpen(false);
                    setCurrentVendorApplicationId("");
                }
            });
    };

    const handleRejectVendor = (event: FormEvent) => {
        event.preventDefault();

        const vendor_application_id = currentVendorApplicationId;

        if (!vendor_application_id) {
            toast.error("Something went wrong, try reloading the page");
        }

        dispatch(rejectVendorApplications({ vendor_application_id }))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setRejectModalOpen(false);
                    setCurrentVendorApplicationId("");
                }
            });
    };

    const handleApproveModalOpen = (vendor_application_id: string) => {
        setCurrentVendorApplicationId(vendor_application_id);
        setApproveModalOpen(true);
    };

    const handleApproveModalClose = () => {
        setCurrentVendorApplicationId("");
        setApproveModalOpen(false);
    };

    const handleRejectModalOpen = (vendor_application_id: string) => {
        setCurrentVendorApplicationId(vendor_application_id);
        setRejectModalOpen(true);
    };

    const handleRejectModalClose = () => {
        setCurrentVendorApplicationId("");
        setRejectModalOpen(false);
    };

    const vendorApplicationsColumns: Column[] = [
        // { id: "id", label: "Id" },
        { id: "fullName", label: "Full Name" },
        { id: "email", label: "Email" },
        { id: "mobileNumber", label: "Mobile Number" },
        {
            id: "status",
            label: "Status",
            render: (row) => (
                <span style={{ color: "green" }}>{row.status}</span>
            ),
        },
        {
            id: "moreInfo",
            label: "More Info",
            render: (row) => (
                <Tooltip title="More info" arrow placement="bottom">
                    <IconButton onClick={() => handleMoreInfoModalOpen(row)}>
                        <InfoRoundedIcon />
                    </IconButton>
                </Tooltip>
            ),
        },
        {
            id: "actions",
            label: "",
            render: (row) => (
                <span className="flex gap-x-4">
                    <Button
                        onClick={() => handleApproveModalOpen(row.id)}
                        color="secondary"
                        variant="contained"
                    >
                        Approve
                    </Button>
                    <Button
                        onClick={() => handleRejectModalOpen(row.id)}
                        color="secondary"
                        variant="outlined"
                    >
                        Reject
                    </Button>
                </span>
            ),
        },
    ];

    useEffect(() => {
        if (!isFetchedApplications.current) {
            dispatch(getAllVendorApplications({ status: "PENDING" }));
            isFetchedApplications.current = true;
        }
    }, [isFetchedApplications, dispatch]);

    return (
        <>
            <CustomTable
                columns={vendorApplicationsColumns}
                rows={vendorApplications}
                emptyMessage="No vendor applications"
            />
            <MoreInfoModal
                open={moreInfoModalOpen}
                onClose={handlMoreInfoModalClose}
                applicationInfo={moreInformation}
            />
            <ApproveModal
                open={approveModalOpen}
                onClose={handleApproveModalClose}
                formFunction={handleApproveVendor}
            />
            <RejectModal
                open={rejectModalOpen}
                onClose={handleRejectModalClose}
                formFunction={handleRejectVendor}
            />
        </>
    );
};

const MoreInfoModal = ({ open, onClose, applicationInfo }) => {
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: { padding: "1rem" },
                    },
                }}
            >
                <DialogTitle width={"100%"} color="gray">
                    Vendor Application Information
                </DialogTitle>
                <DialogContent
                    sx={{
                        width: "100%",
                        maxHeight: "600px",
                    }}
                >
                    <div>
                        <p>Name: {applicationInfo.fullName}</p>
                        <p>Email: {applicationInfo.email}</p>
                        <p>Mobile Number: {applicationInfo.mobileNumber}</p>
                        <p>Business Name: {applicationInfo.businessName}</p>
                        <p>Pincode: {applicationInfo.pincode}</p>
                        <p>State: {applicationInfo.state}</p>
                        <p>City: {applicationInfo.city}</p>
                        <p>
                            Complete Address: {applicationInfo.completeAddress}
                        </p>
                        <p>Category: {applicationInfo.category}</p>
                        <p>Qualification: {applicationInfo.qualifications}</p>
                        {applicationInfo.certificationName && (
                            <p>
                                Certification Name:{" "}
                                {applicationInfo.certificationName}
                            </p>
                        )}
                        {applicationInfo.issuingAuthority && (
                            <p>
                                Issuing Authority:{" "}
                                {applicationInfo.issuingAuthority}
                            </p>
                        )}
                        {applicationInfo.certificationNumber && (
                            <p>
                                Certification Number:{" "}
                                {applicationInfo.certificationNumber}
                            </p>
                        )}
                        {applicationInfo.expirationDate && (
                            <p>
                                Expiration Date:{" "}
                                {applicationInfo.expirationDate}
                            </p>
                        )}
                        {applicationInfo.experience && (
                            <p>Experience: {applicationInfo.experience}</p>
                        )}
                        <p>
                            Registration Number:{" "}
                            {applicationInfo.registrationNumber}
                        </p>
                        <p>
                            Proof Of Certification:{" "}
                            {applicationInfo.proofOfCertificationUrl}
                        </p>
                        <p>Contact Method: {applicationInfo.contactMethod}</p>
                        <p>Availability: {applicationInfo.availability}</p>
                        {applicationInfo.description && (
                            <p>Description: {applicationInfo.description}</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const ApproveModal = ({ formFunction, onClose, open }) => {
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: { component: "form", onSubmit: formFunction },
                }}
            >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent sx={{ width: "100%", maxHeight: "400px" }}>
                    <DialogContentText sx={{ mb: "0.5rem" }}>
                        Are you sure about approving vendor?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="text">
                        Cancel
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const RejectModal = ({ formFunction, onClose, open }) => {
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: { component: "form", onSubmit: formFunction },
                }}
            >
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent sx={{ width: "100%", maxHeight: "400px" }}>
                    <DialogContentText sx={{ mb: "0.5rem" }}>
                        Are you sure about rejecting vendor?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="text">
                        Cancel
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ManageVendorApplications;
