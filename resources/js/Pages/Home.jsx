import { router } from "@inertiajs/react";
import axios from "axios";
const Home = () => {
    const token = localStorage.getItem("token");
    const session = localStorage.getItem("session");

    const checkAuth = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User data:", response.data);

            if (response.data.role_id === 2) {
                router.get("/manager");
            } else if (response.data.role_id === 3) {
                router.get("/client");
            } else {
                router.get("/employee");
            }
            return response.data;
        } catch (error) {
            console.error("Authentication check failed:", error);
            router.get("/login");
            return null;
        }
    };
    if (!checkAuth()) {
        router.visit("/login");
    }
    return <></>;
};

export default Home;
