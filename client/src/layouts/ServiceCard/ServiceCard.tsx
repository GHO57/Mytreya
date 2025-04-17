import Button from "@mui/material/Button";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import React from "react";
import { Link } from "react-router-dom";

interface IServiceProps {
    iconUrl: string;
    title: string;
    description: string;
}

const ServiceCard: React.FC<IServiceProps> = ({
    iconUrl,
    title,
    description,
}) => {
    return (
        <>
            <div className="w-88 h-88 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-100 px-10 py-8 flex flex-col justify-between border-1 border-stroke cursor-pointer">
                <div className="flex flex-col gap-4">
                    <img
                        src={iconUrl}
                        alt={`${title} icon`}
                        className="max-w-16"
                    />
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bricolage font-bold text-xl text-title">
                            {title}
                        </h2>
                        <p className="font-inter font-light text-sm text-paragraph2 leading-6">
                            {description}
                        </p>
                    </div>
                </div>
                <Link to={iconUrl}>
                    <Button
                        variant="contained"
                        color="secondary"
                        endIcon={<KeyboardArrowRightRoundedIcon />}
                    >
                        Learn More
                    </Button>
                </Link>
            </div>
        </>
    );
};

export default ServiceCard;
