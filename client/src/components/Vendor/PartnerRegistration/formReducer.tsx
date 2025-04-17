const initialState = {
    fullName: "",
    businessName: "",
    email: "",
    mobileNumber: null as number | null,
    pincode: null as number | null,
    state: "",
    city: "",
    completeAddress: "",
    category: "",
    qualifications: "",
    certificationName: "",
    issuingAuthority: "",
    certificationNumber: null as number | null,
    expirationDate: "",
    experience: "",
    registrationNumber: null as number | null,
    proofOfCertification: null as File | null,
    contactMethod: "",
    availability: "",
};

type Action =
    | { type: "SET_FIELD"; field: string; value: string | number | File }
    | { type: "RESET_FORM" };

const formReducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
        case "SET_FIELD":
            return { ...state, [action.field]: action.value };
        case "RESET_FORM":
            return initialState;
        default:
            return state;
    }
};

export { formReducer, initialState };
