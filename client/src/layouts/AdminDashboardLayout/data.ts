interface IAdminLinks {
    name: string;
    path: string;
    icon: string;
    accessTo?: string;
    subpaths?: {
        name: string;
        path: string;
    }[];
}

export const adminLinks: IAdminLinks[] = [
    {
        name: "Dashboard",
        path: "dashboard",
        icon: "SpaceDashboardIcon",
    },
    {
        name: "Package Recommendation",
        path: "dashboard/package-recommendation",
        icon: "EventAvailableRoundedIcon",
        accessTo: "COUNSELLING_ADMIN",
    },
    {
        name: "Client Counselling Request",
        path: "dashboard/counselling-request",
        icon: "PeopleAltRoundedIcon",
        accessTo: "SUPERADMIN",
    },
    {
        name: "Sessions",
        path: "dashboard/sessions",
        icon: "PeopleAltRoundedIcon",
    },
    {
        name: "Vendor applications",
        path: "dashboard/vendor-applications",
        icon: "DescriptionRoundedIcon",
    },
];
