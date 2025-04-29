import { FormEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { CustomTab, CustomTabPanel } from "../../../layouts/TabView/TabView";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Tooltip,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CustomTable, { Column } from "../../../layouts/CustomTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
    addRecommendedServicesToPackage,
    getPendingClientRecommendations,
    getRecommendedServicesByPackageId,
} from "../../../features/admin/adminThunks";
import { toast } from "react-toastify";
import { monthNumbers, sessionCounts } from "./data";
import CustomTextField from "../../../layouts/CustomTextField/CustomTextField";
import { IRecommendedServices } from "../../../interfaces/adminFeatures";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import UpdateRoundedIcon from "@mui/icons-material/UpdateRounded";

const tabs = ["Pending Recommendations", "Completed Recommendations"];

const PackageRecommendation = () => {
    const dispatch = useDispatch<AppDispatch>();

    const isFetchedRecommendations = useRef<boolean>(false);

    const {
        pendingRecommendations,
        packageInformation,
        allServices: pricings,
    } = useSelector((state: RootState) => state.admin);

    const [tabValue, setTabValue] = useState<number>(0);
    const [currentPackageId, setCurrentPackageId] = useState<string>("");
    const [assignServicesModalOpen, setAssignServicesModalOpen] =
        useState<boolean>(false);
    const [assignServicesChildModalOpen, setAssignServicesChildModalOpen] =
        useState<boolean>(false);
    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    const [confirmRecommendationsModal, setConfirmRecommendationsModal] =
        useState<boolean>(false);

    const [allAddedServices, setAllAddedServices] = useState<
        IRecommendedServices[]
    >([]);

    const handleRecommendServiceByPackageId = (packageId: string) => {
        dispatch(getRecommendedServicesByPackageId({ packageId }))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setAllAddedServices(response.recommendedServices ?? []);
                    setCurrentPackageId(packageId);
                    setAssignServicesModalOpen(true);
                }
            });
    };

    const handleAssignServicesModalClose = () => {
        setAssignServicesModalOpen(false);
        setCurrentPackageId("");
    };

    const handleAssignServicesChildModalOpen = () => {
        setAssignServicesChildModalOpen(true);
    };

    const handleAssignServicesChildModalClose = () => {
        setAssignServicesChildModalOpen(false);
    };

    const handleAssignServicesFormSubmit = (event: FormEvent) => {
        event.preventDefault();

        const packageId = currentPackageId;
        const services = [...allAddedServices];

        if (!packageId) {
            toast.error("Something went wrong. Try again");
        }

        const payload = {
            packageId: packageId,
            services: services,
        };

        dispatch(addRecommendedServicesToPackage(payload))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setAssignServicesModalOpen(false);
                    setConfirmRecommendationsModal(false);
                    setCurrentPackageId("");
                    setAllAddedServices([]);
                }
            });
    };

    const deleteServiceRecommendation = (serviceId: string) => {
        const services = [...allAddedServices];

        const updated = services.filter((service) => service.id !== serviceId);

        setAllAddedServices(updated);
    };

    const confirmSaveRecommendationsModalOpen = (event: FormEvent) => {
        event.preventDefault();

        setConfirmRecommendationsModal(true);
    };

    const confirmSaveRecommendationsModalClose = () => {
        setConfirmRecommendationsModal(false);
    };

    const pendingColumns: Column[] = [
        { id: "id", label: "Id" },
        { id: "userId", label: "User Id" },
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
                    onClick={() => handleRecommendServiceByPackageId(row.id)}
                    variant="outlined"
                    color="secondary"
                    size="small"
                >
                    Recommend Services
                </Button>
            ),
        },
    ];

    const temporaryServicesColumn: Column[] = [
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
        {
            id: "",
            label: "Action",
            render: (row) => (
                <span style={{ display: "flex", gap: "0.5rem" }}>
                    <Tooltip title="update" arrow placement="bottom">
                        <IconButton>
                            <UpdateRoundedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="delete" arrow placement="bottom">
                        <IconButton
                            onClick={() => deleteServiceRecommendation(row.id)}
                        >
                            <DeleteRoundedIcon />
                        </IconButton>
                    </Tooltip>
                </span>
            ),
        },
    ];

    useEffect(() => {
        if (!isFetchedRecommendations.current) {
            dispatch(getPendingClientRecommendations());
            isFetchedRecommendations.current = true;
        }
    }, [dispatch, isFetchedRecommendations]);

    return (
        <>
            <div>
                <CustomTab
                    tabs={tabs}
                    handleTabChange={handleTabChange}
                    tabValue={tabValue}
                />
                <CustomTabPanel index={0} value={tabValue}>
                    <CustomTable
                        columns={pendingColumns}
                        rows={pendingRecommendations}
                        emptyMessage="No pending recommendations"
                    />
                </CustomTabPanel>
                <CustomTabPanel index={1} value={tabValue}>
                    completed recommendations
                </CustomTabPanel>
            </div>
            <Dialog
                open={assignServicesModalOpen}
                onClose={handleAssignServicesModalClose}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: confirmSaveRecommendationsModalOpen,
                    },
                }}
            >
                <DialogTitle
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    Recommend Services
                    <Button
                        onClick={handleAssignServicesChildModalOpen}
                        variant="outlined"
                        endIcon={<AddRoundedIcon />}
                        color="secondary"
                    >
                        Add Service
                    </Button>
                </DialogTitle>
                <DialogContent
                    sx={{
                        width: "100%",
                        minHeight: "600px",
                    }}
                >
                    <DialogContentText sx={{ mb: "0.5rem" }}>
                        Add appropriate services with no. of required sessions
                        and the month
                    </DialogContentText>
                    {allAddedServices.length > 0 && (
                        <CustomTable
                            columns={temporaryServicesColumn}
                            rows={allAddedServices}
                            emptyMessage="No services recommended"
                        />
                    )}
                    <AddServiceModal
                        childOpen={assignServicesChildModalOpen}
                        handleChildClose={handleAssignServicesChildModalClose}
                        allAddedServices={allAddedServices}
                        setAllAddedServices={setAllAddedServices}
                        packageId={currentPackageId}
                        pricings={pricings}
                    />
                    <ConfirmationModal
                        open={confirmRecommendationsModal}
                        onClose={confirmSaveRecommendationsModalClose}
                        saveFormFunction={handleAssignServicesFormSubmit}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={handleAssignServicesModalClose}
                        variant="text"
                        color="secondary"
                    >
                        Close
                    </Button>
                    <div className="flex justify-center gap-x-3">
                        <Button
                            type="submit"
                            variant="outlined"
                            color="secondary"
                        >
                            Draft
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Done
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    );
};

const AddServiceModal = ({
    childOpen,
    handleChildClose,
    allAddedServices,
    setAllAddedServices,
    pricings,
    packageId,
}) => {
    const [pricingId, setPricingId] = useState<string>("");
    const [monthNumber, setMonthNumber] = useState<number>(0);
    const [sessionCount, setSessionCount] = useState<number>(0);
    const [notes, setNotes] = useState<string>("");

    const handleAddNewService = (event: FormEvent) => {
        event.preventDefault();
        const updated = [...allAddedServices];

        if (!pricingId || monthNumber === 0 || sessionCount === 0) {
            toast.error("Provide all the fields");
            return;
        }

        const existingRecord = updated.filter(
            (record) =>
                record.pricingId === pricingId &&
                record.monthNumber === monthNumber,
        );

        if (existingRecord.length > 0) {
            toast.error("Service with same month number exists");
            return;
        }

        updated.push({
            id: crypto.randomUUID(),
            pricingId: pricingId,
            monthNumber: monthNumber,
            sessionCount: sessionCount,
            notes: notes ?? null,
        });

        setAllAddedServices(updated);

        handleChildClose();
        setPricingId("");
        setMonthNumber(0);
        setSessionCount(0);
    };

    return (
        <>
            <Dialog
                open={childOpen}
                onClose={handleChildClose}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: {
                        sx: { padding: "1rem" },
                    },
                }}
            >
                <DialogTitle width={"100%"} color="gray">
                    Add a service
                </DialogTitle>
                <DialogContent
                    sx={{
                        width: "100%",
                        maxHeight: "600px",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "1rem",
                    }}
                >
                    <div className="w-full flex flex-col">
                        <InputLabel
                            variant="standard"
                            id="category-select"
                            sx={{
                                color: "#555",
                                fontSize: "15px",
                                fontWeight: 400,
                                fontFamily: "Inter, sans-serif",
                                marginBottom: -4.8,
                            }}
                            required
                        >
                            Service
                        </InputLabel>
                        <Select
                            fullWidth
                            labelId="pricing-select"
                            value={pricingId}
                            onChange={(e) => setPricingId(e.target.value)}
                            displayEmpty
                            size="small"
                            required
                        >
                            <MenuItem value="">Choose a Service</MenuItem>
                            {pricings.map((pricing) => (
                                <MenuItem value={pricing.id} key={pricing.id}>
                                    {pricing.serviceName}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full flex flex-col">
                        <InputLabel
                            variant="standard"
                            id="category-select"
                            sx={{
                                color: "#555",
                                fontSize: "15px",
                                fontWeight: 400,
                                fontFamily: "Inter, sans-serif",
                                marginBottom: -4.8,
                            }}
                            required
                        >
                            Month Number
                        </InputLabel>
                        <Select
                            fullWidth
                            labelId="month-number-select"
                            value={monthNumber}
                            onChange={(e) =>
                                setMonthNumber(Number(e.target.value))
                            }
                            displayEmpty
                            size="small"
                            required
                        >
                            <MenuItem value={0}>Choose a Month Number</MenuItem>
                            {monthNumbers.map((number) => (
                                <MenuItem value={number} key={number}>
                                    {number}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full flex flex-col">
                        <InputLabel
                            variant="standard"
                            id="category-select"
                            sx={{
                                color: "#555",
                                fontSize: "15px",
                                fontWeight: 400,
                                fontFamily: "Inter, sans-serif",
                                marginBottom: -4.8,
                            }}
                            required
                        >
                            Session Count
                        </InputLabel>
                        <Select
                            fullWidth
                            labelId="session-count-select"
                            value={sessionCount}
                            onChange={(e) =>
                                setSessionCount(Number(e.target.value))
                            }
                            displayEmpty
                            size="small"
                            required
                        >
                            <MenuItem value={0}>
                                Choose No. of Sessions
                            </MenuItem>
                            {sessionCounts.map((count) => (
                                <MenuItem value={count} key={count}>
                                    {count}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <CustomTextField
                        label="Notes"
                        labelId="notes"
                        type="text"
                        size="small"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        multiline={true}
                        minRows={4}
                        required={false}
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Button
                        onClick={handleChildClose}
                        variant="text"
                        color="secondary"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleAddNewService}
                        variant="contained"
                        color="secondary"
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const ConfirmationModal = ({ saveFormFunction, onClose, open }) => {
    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: { component: "form", onSubmit: saveFormFunction },
                }}
            >
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent sx={{ width: "100%", maxHeight: "400px" }}>
                    <DialogContentText sx={{ mb: "0.5rem" }}>
                        Are you sure about saving the recommendations? cannot
                        modify the services after saving.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="text">
                        Cancel
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PackageRecommendation;
