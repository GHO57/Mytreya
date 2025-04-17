import { Link } from "react-router-dom";

const quickLinks: string[] = ["Home", "About", "Contact", "Blog", "Pricing"];

const communityLinks: string[] = [
    "FAQ",
    "Gallery",
    "Services",
    "Partner Registration",
];

const termsLinks: string[] = ["Terms", "Privacy", "Support"];

const Footer = () => {
    return (
        <>
            <div className="w-full flex-center flex-col font-mulish bg-gray-bg py-16">
                <div className="max-w-[1280px] w-full">
                    <div className="w-full flex flex-col gap-y-12 border-b-[#ddd] border-b-1 pb-8">
                        <div className="max-w-[1280px] w-full flex justify-between">
                            <div className="flex flex-col gap-y-8">
                                <img
                                    src="/logo.svg"
                                    alt="mytreya"
                                    className="max-w-44"
                                />
                                <p className="text-md text-paragraph2 font-mulish font-medium leading-7">
                                    WeWork, Prestige Atlanta, <br /> 80 Feet Rd,
                                    Koramangala 1A Block, <br /> Koramangala 3
                                    Block, <br /> Karnataka 560034
                                </p>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[#555] text-xl font-bold">
                                    Quick Links
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {quickLinks.map((ql, key) => (
                                        <Link
                                            to={ql}
                                            key={key}
                                            className="text-paragraph text-md font-regular hover:text-black duration-150"
                                        >
                                            {ql}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-paragraph text-xl    font-extrabold">
                                    Community
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {communityLinks.map((cl, key) => (
                                        <Link
                                            to={cl}
                                            key={key}
                                            className="text-paragraph text-md font-regular hover:text-black"
                                        >
                                            {cl}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-paragraph text-xl    font-extrabold">
                                    Subscribe for Newsletters
                                </h3>
                                <span className="flex-center">
                                    <input
                                        type="text"
                                        className="border-1 border-[#CACACA] border-r-0 px-6 py-2 rounded-[4px_0_0_4px] focus:outline-none"
                                        placeholder="Email Address"
                                    />
                                    <button className="bg-black text-white h-[43px] text-xs font-bold flex-center border-1 border-l-0 px-4 rounded-[0_5px_5px_0] cursor-pointer">
                                        SUBSCRIBE
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div className="text-paragraph2 text-md">
                            +91 9150168306 | support@mytreya.com
                        </div>
                    </div>
                    <div className="mt-8 flex-center gap-8 border-b-1 border-b-[#ddd] pb-8">
                        <p className="text-paragraph2 text-md">
                            MyTreya does not deal with medical or psychological
                            emergencies. We are not designed to offer support in
                            crisis situations - including when an individual is
                            experiencing thoughts of self-harm or suicide, or is
                            showing symptoms of severe clinical disorders such
                            as schizophrenia and other psychotic conditions. In
                            these cases, in-person medical intervention is the
                            most appropriate form of help.
                            <br /> <br />
                            If you feel you are experiencing any of these
                            difficulties, we would urge you to seek help at the
                            nearest hospital or emergency room where you can
                            connect with a psychiatrist, social worker,
                            counsellor or therapist in person. We recommend you
                            to involve a close family member or a friend who can
                            offer support.
                            <br /> <br />
                            You can also reach out to a suicide hotline in India
                            Call or text the 080 4611 0007 and also contact a
                            suicide hotline in your own country for assistance.
                        </p>
                        <img src="/nimhans.svg" alt="nimhans" />
                    </div>
                    <div className="flex justify-between mt-8">
                        <p className="text-paragraph2">
                            © Copyright 2025. All Rights Reserved by Mytreya
                            Lifestyle & wellness Private Limited
                        </p>
                        <div className="flex gap-8">
                            {termsLinks.map((link, key) => (
                                <Link
                                    to={link}
                                    key={key}
                                    className="text-black underline hover:text-paragraph2 duration-150"
                                >
                                    {link}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;
