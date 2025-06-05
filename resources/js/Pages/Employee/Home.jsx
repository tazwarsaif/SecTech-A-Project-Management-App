import { router } from "@inertiajs/react";
import axios from "axios";
import EmployeeLayout from "../../Layouts/EmployeeLayout.jsx";
const Home = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.visit("/login");
    }

    const checkAuth = async () => {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("User data:", response.data);
        return response.data;
    };
    if (!checkAuth()) {
        router.visit("/login");
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                "http://127.0.0.1:8000/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem("token");
        router.visit("/login");
    };
    return (
        <>
            <EmployeeLayout></EmployeeLayout>
            <div className="heading bg-success text-2xl ml-7 lg:ml-90 mr-7 mt-10 flex items-center p-4">
                <div className="heading bg-success text-2xl">
                    This is Employee Home.
                </div>
            </div>
        </>
    );
};

export default Home;
