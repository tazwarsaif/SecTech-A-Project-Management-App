import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import { router } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ManagerLayout from "../../Layouts/ManagerLayout.jsx";
import ProjectProgressBarChart from "./ProjectProgressBarChart.jsx";

const Home = ({ user, eventsBack, projects, data, tasks }) => {
    const [events, setEvents] = useState(eventsBack);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/user",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status !== 200 || response.data?.error) {
                    throw new Error(response.data?.error || "Auth failed");
                }
            } catch (error) {
                console.error("Auth error:", error);
                router.visit("/login");
            }
        };

        if (!token) {
            router.visit("/login");
        } else {
            checkAuth();
        }
    }, [token]);

    const renderEventContent = (eventInfo) => {
        const startDate = new Date(eventInfo.event.start).toLocaleDateString();
        return (
            <div
                title={`Title: ${eventInfo.event.title} Date: ${startDate}`}
                className="fc-event-custom text-xs sm:text-sm"
            >
                <b>🛠</b>
            </div>
        );
    };

    return (
        <>
            <ManagerLayout />
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-80 mt-10 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-9">
                    {/* Project Progress Chart */}
                    <section className="w-full md:-mt-5">
                        <div className="bg-white rounded-xl p-4 sm:p-6 h-full">
                            <ProjectProgressBarChart />
                        </div>
                    </section>

                    {/* Calendar */}
                    <section className="w-full">
                        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                            <h1 className="text-xl sm:text-2xl font-bold mb-4">
                                📅 Project Calendar
                            </h1>
                            <div className="flex items-center gap-4 mb-3">
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                                    <span className="text-xs text-gray-600">
                                        Start Date
                                    </span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 rounded-full bg-orange-400"></span>
                                    <span className="text-xs text-gray-600">
                                        End Date
                                    </span>
                                </span>
                            </div>
                            <div className="text-sm overflow-x-auto">
                                <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    events={eventsBack}
                                    eventContent={renderEventContent}
                                    height="360px"
                                />
                            </div>
                        </div>
                    </section>
                    <section className="w-full">
                        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                            <h1 className="text-xl sm:text-2xl font-bold mb-4">
                                📝 Tasks Overview
                            </h1>
                            <section className="card space-y-3">
                                {tasks && tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <section
                                            key={task.id}
                                            className="flex items-center justify-between border-b last:border-b-0 py-2"
                                        >
                                            <section>
                                                <section className="font-medium">
                                                    {task.title}
                                                </section>
                                                <section className="text-xs text-gray-500">
                                                    {task.description}
                                                </section>
                                            </section>
                                            <section className="flex items-center space-x-3">
                                                {/* Status Badge */}
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        task.status ===
                                                        "completed"
                                                            ? "bg-green-100 text-green-700"
                                                            : task.status ===
                                                              "in_progress"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-gray-100 text-gray-700"
                                                    }`}
                                                >
                                                    {task.status === "completed"
                                                        ? "Completed"
                                                        : task.status ===
                                                          "in_progress"
                                                        ? "In Progress"
                                                        : "Pending"}
                                                </span>
                                                {/* Percentage */}
                                                <span className="text-xs text-blue-600 font-bold">
                                                    {task.percentage ?? 0}%
                                                </span>
                                            </section>
                                        </section>
                                    ))
                                ) : (
                                    <section className="text-gray-400 text-sm">
                                        No tasks found.
                                    </section>
                                )}
                            </section>
                        </div>
                    </section>

                    {/* Calendar */}
                    <section className="w-full">
                        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                            <h1 className="text-xl sm:text-2xl font-bold mb-4">
                                📅 Project & Task Calendar
                            </h1>
                            <div className="text-sm overflow-x-auto">
                                <FullCalendar
                                    plugins={[dayGridPlugin]}
                                    initialView="dayGridMonth"
                                    events={eventsBack}
                                    eventContent={renderEventContent}
                                    height="390px"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Home;
