interface IVendorLinks {
    name: string;
    path: string;
    icon: string;
    subpaths?: {
        name: string;
        path: string;
    }[];
}

export const vendorLinks: IVendorLinks[] = [
    {
        name: "Dashboard",
        path: "dashboard",
        icon: "SpaceDashboardIcon",
    },
    {
        name: "Availability",
        path: "dashboard/availability",
        icon: "EventAvailableRoundedIcon",
    },
    {
        name: "Sessions",
        path: "dashboard/sessions",
        icon: "PeopleAltRoundedIcon",
    },
];
