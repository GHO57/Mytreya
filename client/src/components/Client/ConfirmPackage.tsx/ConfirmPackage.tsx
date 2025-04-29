import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
} from "@mui/material";
import CustomTable, { Column } from "../../../layouts/CustomTable/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useRef, useState } from "react";
import { getVendorByCategory } from "../../../features/client/clientThunks";
import { IRecommendedServices } from "../../../interfaces/clientFeatures";

const ConfirmPackage = () => {
    return (
        <>
            <div className="w-full flex justify-center my-20">
                <div className="max-w-[1280px] w-full flex justify-center">
                    <VendorSelectionComponent />
                </div>
            </div>
        </>
    );
};

const VendorSelectionComponent = () => {
    const dispatch = useDispatch<AppDispatch>();

    const isTransferredPackageInfo = useRef(false);

    const { pricings, packageInformation } = useSelector(
        (state: RootState) => state.client,
    );

    const [selectVendorModalOpen, setSelectVendorModalOpen] =
        useState<boolean>(false);

    const [vendors, setVendors] = useState<string>([]);
    const [localPackageInfo, setLocalPackageInfo] =
        useState<IRecommendedServices>([]);

    const handleSelectVendorModalOpen = (category: string) => {
        dispatch(getVendorByCategory({ category }))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    const vendorInfo = response.vendors;
                    setVendors(vendorInfo);
                    setSelectVendorModalOpen(true);
                }
            });
    };

    const handleSelectVendorModalClose = () => {
        setSelectVendorModalOpen(false);
    };

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
            id: "price",
            label: "Price",
            render: (row) => (
                <span style={{ color: "green", fontWeight: "500" }}>
                    ₹{pricings.find((info) => row.pricingId === info.id)?.price}
                    /session
                </span>
            ),
        },
        {
            id: "totalAmount",
            label: "Total Amount",
            render: (row) => (
                <span style={{ color: "green", fontWeight: "500" }}>
                    ₹
                    {Number(
                        pricings.find((info) => row.pricingId === info.id)
                            ?.price,
                    ) * row.sessionCount}
                </span>
            ),
        },

        {
            id: "actions",
            label: "",
            render: (row) => (
                <span>
                    <Button
                        onClick={() =>
                            handleSelectVendorModalOpen(row.serviceName)
                        }
                        variant="outlined"
                        color="secondary"
                    >
                        Select Vendor
                    </Button>
                </span>
            ),
        },
    ];

    useEffect(() => {
        if (
            !isTransferredPackageInfo.current &&
            packageInformation.length > 0
        ) {
            setLocalPackageInfo(packageInformation);
        }
    }, [isTransferredPackageInfo, packageInformation]);

    return (
        <>
            <CustomTable
                columns={packageInformationColumns}
                rows={packageInformation}
                emptyMessage="  No packages"
            />
            <SelectVendorModal
                availableVendors={vendors}
                formFunction={}
                packageInformation={packageInformation}
                onClose={handleSelectVendorModalClose}
                open={selectVendorModalOpen}
            />
        </>
    );
};

const SelectVendorModal = ({
    formFunction,
    onClose,
    open,
    availableVendors,
    packageInformation,
}) => {
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
                <DialogTitle>Select Vendor</DialogTitle>
                <DialogContent sx={{ width: "100%", maxHeight: "400px" }}>
                    <DialogContentText sx={{ mb: "0.5rem" }}>
                        select a vendor from the below options
                    </DialogContentText>
                    <Select
                        fullWidth
                        labelId="available-vendor-select"
                        value={selectedVendorId}
                        onChange={handleVendorSelectionChange}
                        displayEmpty
                        size="small"
                        required
                    >
                        <MenuItem value="">Choose a Vendor</MenuItem>
                        {availableVendors.map((vendor) => (
                            <MenuItem value={vendor.id} key={vendor.id}>
                                {vendor.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary" variant="text">
                        Cancel
                    </Button>
                    <Button type="submit" color="secondary" variant="contained">
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default ConfirmPackage;
