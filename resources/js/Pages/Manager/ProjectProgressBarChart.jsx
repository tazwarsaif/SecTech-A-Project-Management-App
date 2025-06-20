import axios from "axios";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const ProjectProgressBarChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios
            .get("/projects/progress")
            .then((res) => {
                setChartData(res.data);
            })
            .catch((err) =>
                console.error("Error fetching project progress:", err)
            );
    }, []);

    return (
        <section className=" bg-white rounded-xl shadow-md p-4 h-full">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 flex flex-col md:flex-row flex-wrap">
                📊 Project Progress Overview
            </h1>
            <ResponsiveContainer width="100%" height={400} className="text-xs">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="completed"
                        stackId="a"
                        fill="#10b981"
                        name="Completed Tasks"
                    />
                    <Bar
                        dataKey="pending"
                        stackId="a"
                        fill="#f97316"
                        name="Pending Tasks"
                    />
                </BarChart>
            </ResponsiveContainer>
        </section>
    );
};

export default ProjectProgressBarChart;
