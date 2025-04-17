import { Tab, Tabs, Box } from "@mui/material";
import { useState } from "react";

interface IData {
    id: string;
    [key: string]: any;
}

interface ITabView<T> {
    data: T[];
    tabs: string[];
    filterFunction: (tab: string, data: T[]) => T[];
    renderContent: (filteredData: T[]) => React.ReactNode;
}

const TabView = <T extends IData>({
    data,
    tabs,
    filterFunction,
    renderContent,
}: ITabView<T>) => {
    const [tabValue, setTabValue] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const currentTab = tabs[tabValue];
    const filteredData = filterFunction(currentTab, data);

    return (
        <Box>
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

            <Box mt={2}>{renderContent(filteredData)}</Box>
        </Box>
    );
};

export default TabView;
