import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import ManagerLayout from "../../Layouts/ManagerLayout.jsx";
const MyProjects = ({ projects, searchPast = null, category = "All" }) => {
    const data = [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
    ];
    const COLORS = ["#63d4a3", "#61aced", "#FFBB28", "#fa64a0"];
    const [temparr, setTemparr] = useState(projects);
    const token = localStorage.getItem("token");
    const session = localStorage.getItem("session");
    if (!session) {
        router.visit("/unauthorized");
    }
    if (!token) {
        router.visit("/unauthorized");
    }
    const checkAuth = async () => {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };
    if (!checkAuth()) {
        router.visit("/unauthorized");
    }
    const [selectedCategory, setSelectedCategory] = useState(
        category ? category : "All"
    );
    const settingText = (e) => {
        setSearch(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        router.get(
            `/projects`,
            { search: search, category: selectedCategory },
            {
                preserveState: true,
            }
        );
    };

    const handleCategoryChange = (e, projects) => {
        if (e.target.value === "All") {
            setTemparr(projects);
        } else {
            const filteredProjects = projects.filter(
                (project) =>
                    project.status.toLowerCase() ===
                    e.target.value.toLowerCase()
            );
            setTemparr(filteredProjects);
        }
        setSelectedCategory(e.target.value);
        console.log(e.target.value);
    };
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState(searchPast ? searchPast : "");
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        try {
            const res = await axios.get(
                `http://127.0.0.1:8000/api/project/suggestions?q=${value}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );
            const data = res.data;
            setSuggestions(data);
            console.log("data here", res, isFocused);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        }
    };
    console.log("Projects:", projects);
    const handlleClick = async (projectId) => {
        const response = await axios.get(
            `http://127.0.0.1:8000/api/projects/${projectId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Project Details:", response.data);
        router.visit(`/manager/myprojects/${projectId}`);
    };
    return (
        <>
            <Head>
                <title>My Projects</title>
                <meta name="description" content="Page description" />
            </Head>
            <ManagerLayout></ManagerLayout>
            <div className="heading text-2xl ml-7 lg:ml-90 mr-7 mt-25 flex items-center p-7 mb-20">
                <div className="heading text-2xl flex flex-col justify-center items-center md:flex-row lg:flex-row xl:flex-row flex-wrap w-full">
                    <div className="card flex justify-center items-center w-full">
                        <span>
                            <div className="flex justify-between items-center mb-4 w-full">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex justify-center items-center w-full"
                                >
                                    <span className="flex justify-center items-center w-full">
                                        <span className="flex justify-items-end w-full max-w-2xl">
                                            <span className="relative w-full">
                                                <label className="input w-full">
                                                    <svg
                                                        className="h-[1em] opacity-50"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <g
                                                            strokeLinejoin="round"
                                                            strokeLinecap="round"
                                                            strokeWidth="2.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                        >
                                                            <circle
                                                                cx="11"
                                                                cy="11"
                                                                r="8"
                                                            ></circle>
                                                            <path d="m21 21-4.3-4.3"></path>
                                                        </g>
                                                    </svg>
                                                    <span className="flex flex-col w-full">
                                                        <span>
                                                            <input
                                                                type="search"
                                                                placeholder="Search"
                                                                value={search}
                                                                name="search"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    settingText(
                                                                        e
                                                                    );
                                                                    handleInputChange(
                                                                        e
                                                                    );
                                                                }}
                                                                onFocus={() =>
                                                                    setIsFocused(
                                                                        true
                                                                    )
                                                                }
                                                                onBlur={() =>
                                                                    setTimeout(
                                                                        () =>
                                                                            setIsFocused(
                                                                                false
                                                                            ),
                                                                        200
                                                                    )
                                                                } // Delay for click
                                                                className="relative z-10 p-2 w-full"
                                                            />
                                                            {isFocused &&
                                                                suggestions.length >
                                                                    0 && (
                                                                    <span className="card absolute top-full left-0 w-full bg-white shadow-md z-20">
                                                                        <ul className="absolute top-full left-0 w-full bg-white shadow-md z-20 max-h-60 overflow-auto">
                                                                            {suggestions.map(
                                                                                (
                                                                                    item,
                                                                                    index
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="p-2 cursor-pointer hover:bg-gray-200 absolute w-full"
                                                                                        onClick={() => {
                                                                                            setSearch(
                                                                                                item
                                                                                            ); // optional: update field
                                                                                            setIsFocused(
                                                                                                false
                                                                                            );
                                                                                            // router.get(
                                                                                            //     `/projects`,
                                                                                            //     {
                                                                                            //         search: item,
                                                                                            //         category:
                                                                                            //             selectedCategory,
                                                                                            //     },
                                                                                            //     {
                                                                                            //         preserveState: true,
                                                                                            //     }
                                                                                            // );
                                                                                        }}
                                                                                    >
                                                                                        {
                                                                                            item.name
                                                                                        }
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </span>
                                                                )}
                                                        </span>
                                                    </span>
                                                </label>
                                            </span>

                                            <span>
                                                <button
                                                    className="btn btn-neutral text-white ml-2 mr-3"
                                                    type="submit"
                                                >
                                                    Search
                                                </button>
                                            </span>
                                        </span>

                                        <span className="flex justify-center items-center">
                                            <select
                                                className="select w-full"
                                                value={selectedCategory}
                                                onChange={(e) =>
                                                    handleCategoryChange(
                                                        e,
                                                        projects
                                                    )
                                                }
                                                name="category"
                                            >
                                                <option value={"All"}>
                                                    All
                                                </option>
                                                <option value={"completed"}>
                                                    Completed
                                                </option>
                                                <option value={"on_hold"}>
                                                    On Hold
                                                </option>
                                                <option value={"cancelled"}>
                                                    Cancelled
                                                </option>
                                            </select>
                                        </span>
                                    </span>
                                </form>
                            </div>
                        </span>
                    </div>

                    {temparr.map((project) => {
                        let statusColor = "";
                        if (project.status.toLowerCase() === "completed") {
                            statusColor = "text-green-600";
                        } else if (project.status.toLowerCase() === "active") {
                            statusColor = "text-sky-500";
                        } else if (
                            project.status.toLowerCase() === "on_hold" ||
                            project.status.toLowerCase() === "cancelled"
                        ) {
                            statusColor = "text-red-500";
                        } else {
                            statusColor = "";
                        }
                        return (
                            <div
                                key={project.id}
                                className="card bg-base-100 shadow-md m-4 p-4 w-full hover:bg-stone-100 cursor-pointer"
                            >
                                <div className="card-body text-wrap">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        <div>
                                            <h2 className="card-title text-wrap text-sm md:text-2xl">
                                                {project.name}{" "}
                                                <span className={statusColor}>
                                                    (Status: {project.status})
                                                </span>
                                            </h2>
                                        </div>
                                        <div className="card-actions justify-end">
                                            <button
                                                className="btn btn-primary my-5 md:my-0"
                                                onClick={() =>
                                                    handlleClick(project.id)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-[20px]">
                                        <div className="flex items-center text-success space-x-2">
                                            <div
                                                aria-label="success"
                                                className="status status-success"
                                            ></div>
                                            <div>
                                                Completed Task:{" "}
                                                {project.completed_tasks}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-sky-500 space-x-2">
                                            <div
                                                aria-label="info"
                                                className="status status-info"
                                            ></div>
                                            <div>
                                                Task in progress:{" "}
                                                {project.in_progress_tasks}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-warning space-x-2">
                                            <div
                                                aria-label="warning"
                                                className="status status-warning"
                                            ></div>
                                            <div>
                                                Pending Task:{" "}
                                                {project.pending_tasks}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-secondary space-x-2">
                                            <div
                                                aria-label="status"
                                                className="status status-secondary"
                                            ></div>
                                            <div>
                                                OverDue Task:{" "}
                                                {project.overdue_tasks}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-neutral space-x-2">
                                            <div
                                                aria-label="status"
                                                className="status status-neutral"
                                            ></div>
                                            <div>
                                                No. of Crew:{" "}
                                                {project.all_employees.length}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end md:-mt-12">
                                        <PieChart width={300} height={200}>
                                            <Pie
                                                data={[
                                                    {
                                                        name: "Completed",
                                                        value: project.completed_tasks,
                                                    },
                                                    {
                                                        name: "In Progress",
                                                        value: project.in_progress_tasks,
                                                    },
                                                    {
                                                        name: "Pending",
                                                        value: project.pending_tasks,
                                                    },
                                                    {
                                                        name: "Overdue",
                                                        value: project.overdue_tasks,
                                                    },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {[
                                                    {
                                                        name: "Completed",
                                                        value: project.completed_tasks,
                                                    },
                                                    {
                                                        name: "In Progress",
                                                        value: project.in_progress_tasks,
                                                    },
                                                    {
                                                        name: "Pending",
                                                        value: project.pending_tasks,
                                                    },
                                                    {
                                                        name: "Overdue",
                                                        value: project.overdue_tasks,
                                                    },
                                                ].map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MyProjects;
