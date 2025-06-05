import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { Cell, Pie, PieChart } from "recharts";
import ManagerLayout from "../../Layouts/ManagerLayout.jsx";
const MyProjects = ({ projects, user }) => {
    const data = [
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 },
    ];
    const COLORS = ["#63d4a3", "#61aced", "#FFBB28", "#fa64a0"];
    const temparr = projects;
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
                <div className="heading text-2xl flex flex-col justify-center items-center md:flex-row lg:flex-row xl:flex-row flex-wrap">
                    <div className="card flex justify-center items-center">
                        <span>
                            <button className="btn btn-accent">Hey</button>
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
