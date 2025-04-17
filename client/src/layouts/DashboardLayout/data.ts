interface IClientLinks {
    name: string;
    path: string;
    icon: string;
    subpaths?: {
        name: string;
        path: string;
    }[];
}

export const clientLinks: IClientLinks[] = [
    {
        name: "Dashboard",
        path: "dashboard",
        icon: "SpaceDashboardIcon",
    },
    {
        name: "Sessions",
        path: "dashboard/sessions",
        icon: "CalendarMonthIcon",
        subpaths: [
            {
                name: "Ongoing Sessions",
                path: "dashboard/sessions/ongoing",
            },
            {
                name: "Completed Sessions",
                path: "dashboard/sessions/completed",
            },
        ],
    },
    {
        name: "Services",
        path: "dashboard/services",
        icon: "AssignmentIcon",
        subpaths: [
            {
                name: "Recommended Services",
                path: "dashboard/services/completed",
            },
            {
                name: "Ongoing Services",
                path: "dashboard/services/ongoing",
            },
            {
                name: "Completed Services",
                path: "dashboard/services/completed",
            },
        ],
    },
    {
        name: "Transactions",
        path: "dashboard/transactions",
        icon: "CurrencyRupeeRoundedIcon",
    },
];
