import { router } from "@inertiajs/react";
import axios from "axios";
import ManagerLayout from "../../Layouts/ManagerLayout.jsx";
const Home = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.visit("/login");
    }

    const checkAuth = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (
                response.status !== 200 ||
                (response.data && response.data.error)
            ) {
                throw new Error(response.data?.error || "Authentication error");
            }
            return response.data;
        } catch (error) {
            console.log(error);
            return error;
        }
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
            <ManagerLayout></ManagerLayout>
            <div className="heading bg-success text-2xl ml-7 lg:ml-90 mr-7 mt-25 flex items-center p-7 mb-20">
                <div className="heading bg-success text-2xl">
                    This is a Manager Home Page
                </div>
            </div>
        </>
    );
};

export default Home;
