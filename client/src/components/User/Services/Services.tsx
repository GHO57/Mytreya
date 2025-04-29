import { useEffect, useRef, useState } from "react";
import { CustomTab, CustomTabPanel } from "../../../layouts/TabView/TabView";
import RecommendedServices from "./RecommendedServices";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getAllRecommendedPackagesForClient } from "../../../features/client/clientThunks";

const tabs = ["Recommended Packages", "Ongoing Packages", "Completed Packages"];

const Services = () => {
    const dispatch = useDispatch<AppDispatch>();

    const isFetchedPackages = useRef<boolean>(false);

    const { allRecommendedPackages, pricings } = useSelector(
        (state: RootState) => state.client,
    );
    const [tabValue, setTabValue] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        if (!isFetchedPackages.current) {
            dispatch(getAllRecommendedPackagesForClient());
            isFetchedPackages.current = true;
        }
    }, [dispatch, isFetchedPackages]);

    return (
        <>
            <CustomTab
                tabs={tabs}
                tabValue={tabValue}
                handleTabChange={handleTabChange}
            />
            <CustomTabPanel index={0} value={tabValue}>
                <RecommendedServices
                    packages={allRecommendedPackages}
                    pricings={pricings}
                />
            </CustomTabPanel>
            <CustomTabPanel index={1} value={tabValue}>
                ongoing services
            </CustomTabPanel>
            <CustomTabPanel index={2} value={tabValue}>
                completed services
            </CustomTabPanel>
        </>
    );
};

export default Services;
