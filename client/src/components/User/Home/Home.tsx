import { Link } from "react-router-dom";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import Button from "@mui/material/Button";
import { howWeWorkInfo, serviceInfo } from "./data";
import ServiceCard from "../../../layouts/ServiceCard/ServiceCard";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import WorkCard from "../../../layouts/WorkCard/WorkCard";

const Home = () => {
    const { width } = useWindowDimensions();
    return (
        <>
            <div className="w-full flex justify-center min-h-[90vh] pb-12">
                <div className="w-full flex-center flex-col gap-30 sm:gap-50">
                    <div className="w-full flex-center py-12 sm:pt-30 sm:pb-54">
                        <div className="max-w-[1280px] w-full h-fit relative lg:flex justify-between px-4 sm:px-8 lg:px-12 xl:px-0">
                            <div className="flex flex-col gap-0 sm:gap-16 md:justify-between my-6 xl:my-10">
                                <div className="flex flex-col gap-4 justify-center">
                                    <h1 className="font-bricolage text-[32px] sm:text-[46px] xl:text-[54px] font-extrabold leading-[110%] text-title">
                                        Redefining Your Wellness,
                                        <br />
                                        Style and Relationships.
                                    </h1>
                                    <p className="font-inter text-[8px] sm:text-[18px] font-light text-paragraph2 leading-5 md:leading-6 invisible sm:visible">
                                        From mental health to nutrition and
                                        legal consulting,
                                        <br /> we provide holistic solutions for
                                        every prospect of your life.
                                    </p>
                                </div>
                                <Link to="/partner/registration">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        endIcon={
                                            <KeyboardArrowRightRoundedIcon />
                                        }
                                    >
                                        Partner with Us
                                    </Button>
                                </Link>
                            </div>
                            {width > 1024 && (
                                <img
                                    src="/hero-img.png"
                                    alt="image"
                                    className="max-w-[410px] xl:max-w-[550px] h-fit z-10 rounded-[100px_100px_100px_5px] invisible lg:visible"
                                />
                            )}
                            <div className="bg-primary/50 w-[430px] h-[430px] absolute right-1/24 top-1/40 rounded-full blur-[300px] invisible lg:visible"></div>
                        </div>
                    </div>
                    <div className="max-w-[1280px] flex flex-col justify-center w-full gap-y-22 px-4 sm:px-8 lg:px-12 xl:px-0">
                        <div className="flex-center flex-col gap-3">
                            <div className="flex-center flex-col">
                                <p className="text-paragraph2 font-light text-sm">
                                    SERVICES
                                </p>
                                <h1 className="font-bricolage text-[32px] sm:text-[46px] xl:text-[54px] font-extrabold text-title leading-13">
                                    Explore What We Offer
                                </h1>
                            </div>
                            <p className="text-paragraph2 font-light text-md">
                                Unlock Your True Potential With Our Tailored
                                Services
                            </p>
                        </div>
                        <div className="w-full flex-center">
                            <div className="grid grid-cols-2 xl:grid-cols-3 gap-8">
                                {serviceInfo.map((service) => (
                                    <ServiceCard
                                        key={service.title}
                                        iconUrl={service.iconUrl}
                                        title={service.title}
                                        description={service.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-center flex-col w-full gap-y-22 bg-gray-bg py-30">
                        <div className="max-w-[1280px] w-full flex flex-col gap-y-22">
                            <div className="flex-center flex-col gap-3">
                                <div className="flex-center flex-col">
                                    <p className="text-paragraph2 font-light text-sm">
                                        HOW WE WORK
                                    </p>
                                    <h1 className="font-bricolage text-[32px] sm:text-[46px] xl:text-[54px] font-extrabold text-title leading-13">
                                        The Roadmap for a Better You
                                    </h1>
                                </div>
                                <p className="text-paragraph2 font-light text-md max-w-xl text-center">
                                    Understand the journey ahead with a
                                    personalized roadmap designed to help you
                                    reach your goals at your own pace
                                </p>
                            </div>
                            <div className="flex flex-col gap-24">
                                {howWeWorkInfo.map((step, index) => (
                                    <WorkCard
                                        key={step.title}
                                        title={step.title}
                                        description={step.description}
                                        imageUrl={step.imageUrl}
                                        reverse={index % 2 === 0 ? false : true}
                                        stepNumber={index + 1}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-center w-full px-4 sm:px-8 lg:px-12">
                        <div className="bg-black-bg max-w-[1400px] rounded-3xl w-full text-white px-10 sm:px-22 xl:px-34 py-14 sm:py-22 xl:py-30 flex flex-col lg:flex-row gap-8 lg:gap-16">
                            <div className="flex justify-between flex-col w-full">
                                <div className="flex flex-col w-full">
                                    <p className="text-white font-light text-md">
                                        ABOUT
                                    </p>
                                    <h2 className="font-bricolage text-[32px] sm:text-[46px] xl:text-[54px] font-extrabold text-white   leading-9 sm:leading-12 max-w-[500px]">
                                        Who We Are And What We Stand For
                                    </h2>
                                </div>
                                {width > 1024 && (
                                    <Button
                                        variant="outlined"
                                        endIcon={
                                            <KeyboardArrowRightRoundedIcon />
                                        }
                                        sx={{
                                            bgcolor: "white",
                                            color: "black",
                                            border: "none",
                                            "&:hover": { bgcolor: "#eaeaea" },
                                        }}
                                    >
                                        Know More
                                    </Button>
                                )}
                            </div>
                            <p className="text-white text-md sm:text-xl xl:text-2xl font-inter font-light leading-7 sm:leading-8 xl:leading-9 w-full">
                                Mytreya is a dynamic tech driven company
                                inspired by the 'Blue Zone' regions across the
                                world, dedicated to addressing mental health and
                                wellness through holistic techniques, innovative
                                approaches, and strong community support. Our
                                mission is to support individuals and corporate
                                employees in achieving optimal well-being.
                            </p>
                            {width < 1024 && (
                                <Button
                                    variant="outlined"
                                    endIcon={<KeyboardArrowRightRoundedIcon />}
                                    sx={{
                                        bgcolor: "white",
                                        color: "black",
                                        border: "none",
                                        "&:hover": { bgcolor: "#eaeaea" },
                                    }}
                                >
                                    Know More
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
