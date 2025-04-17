import React from "react";

interface IWorkProps {
    title: string;
    description: string;
    imageUrl: string;
    reverse: boolean;
    stepNumber: number;
}

const WorkCard: React.FC<IWorkProps> = ({
    title,
    description,
    imageUrl,
    reverse,
    stepNumber,
}) => {
    return (
        <>
            <div
                className={`w-full flex ${reverse && "flex-row-reverse"} justify-between`}
            >
                <div className="flex flex-col justify-center gap-2">
                    <div className="bg-primary max-w-8 max-h-8 flex-center text-white font-black text-lg p-5 rounded-sm">
                        0{stepNumber}
                    </div>
                    <h2 className="font-bold text-4xl font-bricolage text-title max-w-96 leading-9">
                        {title}
                    </h2>
                    <p className="font-inter font-light text-xl leading-7 text-paragraph2 max-w-[500px] mt-2">
                        {description}
                    </p>
                </div>
                <img
                    src={imageUrl}
                    alt={`${title} image`}
                    className="max-w-lg"
                />
            </div>
        </>
    );
};

export default WorkCard;
