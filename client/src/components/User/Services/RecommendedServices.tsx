import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import CustomTable, { Column } from "../../../layouts/CustomTable/CustomTable";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getRecommendedServicesByPackageId } from "../../../features/client/clientThunks";
import { useNavigate } from "react-router-dom";

const RecommendedServices = ({ packages, pricings }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [serviceModalOpen, setServiceModalOpen] = useState<boolean>(false);
    const [currentPackageId, setCurrentPackageId] = useState<string>("");

    const { packageInformation } = useSelector(
        (state: RootState) => state.client,
    );

    const handleServicesModalOpen = (packageId: string) => {
        dispatch(getRecommendedServicesByPackageId({ packageId }))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setCurrentPackageId(packageId);
                    setServiceModalOpen(true);
                }
            });
    };

    const handleServicesModalClose = () => {
        setCurrentPackageId("");
        setServiceModalOpen(false);
    };

    const recommendedPackagesColumns: Column[] = [
        { id: "id", label: "Id" },
        {
            id: "notes",
            label: "Notes",
            render: (row) => (
                <span style={{ color: "gray" }}>
                    {!row.notes ? "No notes saved" : row.notes}
                </span>
            ),
        },
        {
            id: "totalAmount",
            label: "Total Amount",
            render: (row) => <span>₹{row.totalAmount}</span>,
        },
        {
            id: "status",
            label: "Status",
            render: (row) => (
                <span style={{ color: "green" }}>{row.status}</span>
            ),
        },
        {
            id: "actions",
            label: "",
            render: (row) => (
                <Button
                    onClick={() => handleServicesModalOpen(row.id)}
                    variant="outlined"
                    color="secondary"
                    size="small"
                >
                    View Services
                </Button>
            ),
        },
    ];

    return (
        <>
            <CustomTable
                columns={recommendedPackagesColumns}
                rows={packages}
                emptyMessage="No recommended services"
            />
            <ViewServicesModal
                packageInformation={packageInformation}
                open={serviceModalOpen}
                onClose={handleServicesModalClose}
                pricings={pricings}
                packageId={currentPackageId}
            />
        </>
    );
};

const ViewServicesModal = ({
    packageInformation,
    open,
    onClose,
    pricings,
    packageId,
}) => {
    const navigate = useNavigate();

    const packageInformationColumns: Column[] = [
        // { id: "id", label: "Id" },
        {
            id: "serviceName",
            label: "Service Name",
            render: (row) => (
                <span>
                    {
                        pricings.find((info) => row.pricingId === info.id)
                            ?.serviceName
                    }
                </span>
            ),
        },
        { id: "monthNumber", label: "Month Number" },
        { id: "sessionCount", label: "Session Count" },
        {
            id: "notes",
            label: "Notes",
            render: (row) => (
                <span style={{ color: "gray" }}>
                    {!row.notes ? "No notes saved" : row.notes}
                </span>
            ),
        },
    ];

    const handleProceed = () => {
        navigate(`/packages/${packageId}/confirm`);
        return;
    };

    return (
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
                Recommended Services
            </DialogTitle>
            <DialogContent
                sx={{
                    width: "100%",
                    maxHeight: "600px",
                }}
            >
                <CustomTable
                    columns={packageInformationColumns}
                    rows={packageInformation}
                    emptyMessage="No services recommended"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="text" color="secondary">
                    Close
                </Button>
                <Button
                    onClick={handleProceed}
                    variant="contained"
                    color="secondary"
                >
                    Proceed
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RecommendedServices;
