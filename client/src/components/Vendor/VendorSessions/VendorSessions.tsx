import { useState } from "react";
import { Button } from "@mui/material";
import CustomTable, { Column } from "../../../layouts/CustomTable/CustomTable";
import { CustomTab, CustomTabPanel } from "../../../layouts/TabView/TabView";

const columns: Column[] = [
    { id: "id", label: "Id" },
    { id: "sessionDate", label: "Date" },
    { id: "startTimeUtc", label: "Start Time" },
    { id: "endTimeUtc", label: "End Time" },
    {
        id: "status",
        label: "Status",
        render: (row) => <span style={{ color: "green" }}>{row.status}</span>,
    },
    {
        id: "actions",
        label: "",
        render: () => (
            <span className="flex-center gap-x-5">
                <Button variant="contained" color="secondary">
                    start
                </Button>
                <Button variant="outlined" color="secondary">
                    reschedule
                </Button>
            </span>
        ),
    },
];

const sampleData = [
    {
        id: "1",
        userId: "user1",
        vendorId: "vendor1",
        sessionDate: "2025-04-20",
        startTimeUtc: "2025-04-20T05:30:00.000Z",
        endTimeUtc: "2025-04-20T06:00:00.000Z",
        status: "BOOKED",
    },
    {
        id: "2",
        userId: "user2",
        vendorId: "vendor2",
        sessionDate: "2025-04-20",
        startTimeUtc: "2025-04-20T06:00:00.000Z",
        endTimeUtc: "2025-04-20T06:30:00.000Z",
        status: "BOOKED",
    },
    {
        id: "3",
        userId: "user3",
        vendorId: "vendor3",
        sessionDate: "2025-04-20",
        startTimeUtc: "2025-04-20T10:30:00.000Z",
        endTimeUtc: "2025-04-20T11:00:00.000Z",
        status: "BOOKED",
    },
    {
        id: "4",
        userId: "user4",
        vendorId: "vendor4",
        sessionDate: "2025-04-21",
        startTimeUtc: "2025-04-21T12:00:00.000Z",
        endTimeUtc: "2025-04-21T12:30:00.000Z",
        status: "BOOKED",
    },
    {
        id: "5",
        userId: "user5",
        vendorId: "vendor5",
        sessionDate: "2025-04-15",
        startTimeUtc: "2025-04-15T05:30:00.000Z",
        endTimeUtc: "2025-04-15T06:00:00.000Z",
        status: "COMPLETED",
    },
    {
        id: "6",
        userId: "user6",
        vendorId: "vendor6",
        sessionDate: "2025-04-15",
        startTimeUtc: "2025-04-15T09:30:00.000Z",
        endTimeUtc: "2025-04-15T10:00:00.000Z",
        status: "COMPLETED",
    },
    {
        id: "7",
        userId: "user7",
        vendorId: "vendor7",
        sessionDate: "2025-04-16",
        startTimeUtc: "2025-04-16T07:30:00.000Z",
        endTimeUtc: "2025-04-16T08:00:00.000Z",
        status: "COMPLETED",
    },
];

const tabs = ["Upcoming Sessions", "Completed Sessions"];

const VendorSessions = () => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    return (
        <>
            <div>
                <CustomTab
                    tabValue={tabValue}
                    handleTabChange={handleTabChange}
                    tabs={tabs}
                />
                <CustomTabPanel index={0} value={tabValue}>
                    <CustomTable
                        columns={columns}
                        rows={sampleData}
                        emptyMessage="No Sessions"
                    />
                </CustomTabPanel>

                <CustomTabPanel index={1} value={tabValue}>
                    completed sessions
                </CustomTabPanel>
            </div>
        </>
    );
};

export default VendorSessions;
