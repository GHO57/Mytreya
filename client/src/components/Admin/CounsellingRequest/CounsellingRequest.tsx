import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { CustomTab, CustomTabPanel } from "../../../layouts/TabView/TabView";
import CustomTable, { Column } from "../../../layouts/CustomTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
    assignExpertToClient,
    getAvailableCounsellingAdmins,
    getClientCounsellingRequests,
} from "../../../features/admin/adminThunks";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { toast } from "react-toastify";

const tabs = ["Pending Request", "Completed Request"];

const CounsellingRequest = () => {
    const dispatch = useDispatch<AppDispatch>();

    const isFetchedRequests = useRef<boolean>(false);

    const { clientCounsellingRequests, availableCounsellingAdmins } =
        useSelector((state: RootState) => state.admin);

    const [tabValue, setTabValue] = useState<number>(0);
    const [assignAdminModelOpen, setAssignAdminModelOpen] =
        useState<boolean>(false);

    const [userId, setUserId] = useState<string>("");
    const [selectedAdminId, setSelectedAdminId] = useState<string>("");
    const [preferredDate, setPreferredDate] = useState<string>("");
    const [startTimeUTC, setStartTimeUTC] = useState<string>("");
    const [timeZone, setTimeZone] = useState<string>("");

    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAssignExpert = (
        userId: string,
        preferredDate: string,
        startTimeUTC: string,
        timeZone: string,
    ) => {
        dispatch(getAvailableCounsellingAdmins({ preferredDate }))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setUserId(userId);
                    setPreferredDate(preferredDate);
                    setStartTimeUTC(startTimeUTC);
                    setTimeZone(timeZone);
                    setAssignAdminModelOpen(true);
                }
            });
    };

    const handleAssignAdminModelClose = () => {
        setUserId("");
        setSelectedAdminId("");
        setPreferredDate("");
        setStartTimeUTC("");
        setTimeZone("");
        setAssignAdminModelOpen(false);
    };

    const handleCAdminSelectChange = (event: SelectChangeEvent) => {
        setSelectedAdminId(event.target.value);
    };

    const handleAssignAdminFormSubmit = (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        if (
            !userId ||
            !selectedAdminId ||
            !preferredDate ||
            !startTimeUTC ||
            !timeZone
        ) {
            toast.error("Incomplete admin data. Try again");
            return;
        }

        const assignAdminForm = {
            userId,
            adminUserId: selectedAdminId,
            sessionDate: preferredDate,
            startTimeUTC,
            timeZone,
        };

        dispatch(assignExpertToClient(assignAdminForm))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    handleAssignAdminModelClose();
                    return;
                }
            });
    };

    const pendingColumns: Column[] = [
        { id: "id", label: "Id" },
        { id: "name", label: "Name" },
        { id: "email", label: "Email" },
        { id: "phoneNumber", label: "Phone Number" },
        { id: "preferredDate", label: "Date" },
        { id: "startTimeUtc", label: "Start Time" },
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
                    onClick={() =>
                        handleAssignExpert(
                            row.userId,
                            row.preferredDate,
                            row.startTimeUtc,
                            row.timeZone,
                        )
                    }
                    variant="outlined"
                    color="secondary"
                    size="small"
                >
                    Assign Expert
                </Button>
            ),
        },
    ];

    useEffect(() => {
        if (!isFetchedRequests.current) {
            dispatch(getClientCounsellingRequests());
            isFetchedRequests.current = true;
        }
    }, [dispatch, isFetchedRequests]);

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
                        rows={clientCounsellingRequests}
                        emptyMessage="No Sessions"
                    />
                </CustomTabPanel>
                <CustomTabPanel index={1} value={tabValue}>
                    completed Request
                </CustomTabPanel>
            </div>
            <Dialog
                open={assignAdminModelOpen}
                onClose={handleAssignAdminModelClose}
                slotProps={{
                    paper: {
                        component: "form",
                        onSubmit: handleAssignAdminFormSubmit,
                    },
                }}
            >
                <DialogTitle>Assign Expert</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: "0.5rem" }}>
                        Select from the list of experts who are available on{" "}
                        {preferredDate}
                    </DialogContentText>
                    <Select
                        fullWidth
                        labelId="cadmin-select"
                        value={selectedAdminId}
                        onChange={handleCAdminSelectChange}
                        displayEmpty
                        size="small"
                        required
                    >
                        <MenuItem value="">Choose Expert</MenuItem>
                        {availableCounsellingAdmins.map((admin) => (
                            <MenuItem value={admin.id} key={admin.id}>
                                {admin.fullName}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAssignAdminModelClose}
                        variant="text"
                        color="secondary"
                    >
                        Close
                    </Button>
                    <Button type="submit" variant="contained" color="secondary">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CounsellingRequest;
