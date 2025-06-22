import { Head } from "@inertiajs/react";
import { useState } from "react";
import ManagerLayout from "../../Layouts/ManagerLayout";

const LeaveOwnership = ({ projects, user, managers }) => {
    const token = localStorage.getItem("token");
    const session = localStorage.getItem("session");
    if (!session) {
        router.visit("/unauthorized");
    }
    if (!token) {
        router.visit("/unauthorized");
    }
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedManagerId, setSelectedManagerId] = useState(null);
    const [message, setMessage] = useState("");
    const [formErrors, setFormErrors] = useState({});

    // No need for separate availableProjects state - just derive it from props
    const selectedProject = selectedProjectId
        ? projects.find((proj) => proj.id === selectedProjectId)
        : null;
    const validateForm2 = () => {
        const errors = {};

        if (!message.trim()) {
            errors.subject = "Reasoning is required.";
        }
        if (!selectedProjectId) {
            errors.report = "You must select a project.";
        }

        return errors;
    };
    const handleSelectProject = (e) => {
        const projectId = e.target.value === "" ? null : Number(e.target.value);
        setSelectedProjectId(projectId);
    };
    const handleManager = (e) => {
        const managerId = e.target.value === "" ? null : Number(e.target.value);
        setSelectedManagerId(managerId);
    };
    const handleClick = async (event, projectId) => {
        event.preventDefault();
        console.log("Requesting takeover for project ID:", projectId);
        const errors = validateForm2();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            return;
        }
        try {
            const formData = {
                project_id: projectId,
                transfer_to: selectedManagerId,
                requested_by: user.id,
                status: "pending",
                message: message,
            };
            console.log("Form Data:", formData);
            const response = await axios.post(
                `http://127.0.0.1:8000/api/leave-ownership`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Response:", response);
            window.location.reload();
        } catch (error) {
            setFormErrors({
                submit: "Failed to submit request. Please try again.",
            });
        }
    };

    return (
        <>
            <Head>
                <title>Project Ownership Transfer</title>
                <meta name="description" content="Page description" />
            </Head>
            <ManagerLayout></ManagerLayout>
            <div className="heading text-2xl ml-7 lg:ml-90 mr-7 mt-25 flex justify-center items-center p-7 mb-20">
                <div className="heading text-2xl flex flex-col justify-center items-center md:flex-row lg:flex-row xl:flex-row flex-wrap w-full">
                    <div className="card bg-base-100 shadow-md m-4 p-7 w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl flex justify-center items-center">
                        <div className="w-full">
                            <div className="text-center text-2xl font-semibold mb-4">
                                Project Ownership Transfer
                            </div>

                            <div className="mb-4 mt-7">
                                {Object.keys(formErrors).length > 0 && (
                                    <div
                                        role="alert"
                                        className="alert alert-error mb-4 w-full"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 shrink-0 stroke-current"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div className="flex flex-col">
                                            {Object.values(formErrors)
                                                .filter((error) => error) // Filter out empty error messages
                                                .map((error, index) => (
                                                    <span
                                                        key={index}
                                                        className="text-sm"
                                                    >
                                                        {error}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>
                                )}
                                <label
                                    className="block text-gray-700 text-lg font-bold mb-2"
                                    htmlFor="title"
                                >
                                    Manager Name: {user.name}
                                </label>
                            </div>
                            <div className="mb-4 mt-2 w-full">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-3"
                                    htmlFor="title"
                                >
                                    Select Project
                                </label>
                                <select
                                    className="select w-full"
                                    value={selectedProjectId || ""}
                                    onChange={handleSelectProject}
                                >
                                    <option value="">-No Project-</option>
                                    {projects.map((project) => (
                                        <option
                                            value={project.id}
                                            key={project.id}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4 mt-2 w-full">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-3"
                                    htmlFor="title"
                                >
                                    If there is any manager to handover
                                    specifically
                                    <p className="text-gray-300">optional</p>
                                </label>
                                <select
                                    className="select w-full"
                                    value={selectedManagerId || ""}
                                    onChange={handleManager}
                                >
                                    <option value="">---</option>
                                    {managers.map((manager) => (
                                        <option
                                            value={manager.id}
                                            key={manager.id}
                                        >
                                            {manager.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4 mt-7">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="client"
                                >
                                    Write your reason
                                </label>
                                <textarea
                                    className="textarea w-full mt-2"
                                    placeholder="Write your message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="mb-4 mt-7">
                                <button
                                    className="btn btn-primary w-full"
                                    onClick={(e) => {
                                        handleClick(e, selectedProjectId);
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeaveOwnership;
