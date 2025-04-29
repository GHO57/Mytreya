const initialState = {
    name: "",
    mobileNumber: null as number | null,
    email: "",
    ageGroup: "",
    concern: "",
    otherConcern: "",
    goal: "",
    otherGoal: "",
    preferredDate: "",
    startTime: "",
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
