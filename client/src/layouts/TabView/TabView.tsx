import { Tab, Tabs } from "@mui/material";

interface CustomTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface CustomTabProps {
    tabValue: number;
    handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
    tabs: string[];
}

const CustomTab = ({ tabValue, handleTabChange, tabs }: CustomTabProps) => {
    return (
        <>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
            >
                {tabs.map((tab, index) => (
                    <Tab key={tab} value={index} label={tab} id={tab} />
                ))}
            </Tabs>
        </>
    );
};

const CustomTabPanel = ({
    children,
    value,
    index,
    ...other
}: CustomTabPanelProps) => {
    return (
        <>
            <div role="tabpanel" hidden={value !== index} {...other}>
                {value === index && <>{children}</>}
            </div>
        </>
    );
};

export { CustomTab, CustomTabPanel };
