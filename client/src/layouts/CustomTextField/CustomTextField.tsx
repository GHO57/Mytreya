import {
    InputLabel,
    TextField,
    TextFieldPropsSizeOverrides,
    TextFieldVariants,
} from "@mui/material";
import { ChangeEventHandler } from "react";
import { OverridableStringUnion } from "@mui/types";

interface ICustomTextField {
    label?: string;
    labelId: string;
    type: string;
    variant?: TextFieldVariants;
    size?: OverridableStringUnion<
        "small" | "medium",
        TextFieldPropsSizeOverrides
    >;
    value?: string | number | null | File;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    required: boolean;
    multiline?: boolean;
    minRows?: number;
    maxLength?: number;
    placeholder?: string;
}

const CustomTextField = ({
    label,
    labelId,
    type,
    variant = "outlined",
    size = "small",
    value,
    onChange,
    required,
    multiline = false,
    minRows = 1,
    placeholder,
    maxLength,
}: ICustomTextField) => {
    return (
        <>
            <div className="w-full flex flex-col gap-2">
                <InputLabel
                    htmlFor={labelId}
                    sx={{
                        color: "#555",
                        fontSize: "15px",
                        fontWeight: 400,
                        fontFamily: "Inter, sans-serif",
                    }}
                    required={required}
                >
                    {label}
                </InputLabel>
                <TextField
                    sx={{
                        bgcolor: value ? "#fff" : "#f7f7f7",
                    }}
                    fullWidth
                    id={labelId}
                    type={type}
                    variant={variant}
                    size={size}
                    {...(type === "file" ? {} : { value: value ?? "" })}
                    onChange={onChange}
                    required={required}
                    multiline={multiline}
                    minRows={minRows}
                    placeholder={placeholder}
                    slotProps={{
                        htmlInput: {
                            ...((type === "text" || type === "email") &&
                            maxLength !== undefined
                                ? { maxLength }
                                : {}),
                        },
                    }}
                />
            </div>
        </>
    );
};

export default CustomTextField;
