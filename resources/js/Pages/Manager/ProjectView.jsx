import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import ManagerLayout from "../../Layouts/ManagerLayout.jsx";
const ProjectView = ({ project, category = null }) => {
    const [title, setTitle] = useState("");
    const [employee, setEmp] = useState(0);
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [status, setStatus] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formSuccess, setFormSuccess] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [empname, setEmpname] = useState("Select an employee");
    const [progress, setProgress] = useState(0);
    const [priority, setPriority] = useState("high");
    const [taskid, setTaskid] = useState(0);
    let [allTasks, setAllTasks] = useState(project.tasks || []);
    const [reportSubject, setReportSubject] = useState("");
    const [report, setReport] = useState("");
    const [currentReport, setCurrentReport] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(
        category ? category : "All"
    );
    const [allemp, setAllemp] = useState([]);
    const [allCrew, setAllCrew] = useState(project.all_employees);
    const [crewDelete, setDeleteCrew] = useState(false);
    const projectId = project.id;
    const [formdata, setFormData] = useState({
        title: "",
        description: "",
        deadline: "",
        status: "",
    });
    const [search, setSearch] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const token = localStorage.getItem("token");
    const session = localStorage.getItem("session");
    const COLORS = ["#63d4a3", "#61aced", "#FFBB28", "#fa64a0"];
    if (!session || !token) {
        router.visit("/unauthorized");
        return;
    }
    const AllempSet = async () => {
        const excludeCrew = [];
        for (let j = 0; j < project.totalEmp.length; j++) {
            let temp = true;
            for (let i = 0; i < allCrew.length; i++) {
                if (allCrew[i].id === project.totalEmp[j].id) {
                    // Fixed property access
                    temp = false;
                    break;
                }
            }
            if (temp === true) {
                excludeCrew.push(project.totalEmp[j]);
            }
        }
        setAllemp(excludeCrew);
    };
    // const verifyAuth = async () => {
    //     try {
    //         const response = await axios.get("http://127.0.0.1:8000/api/user", {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (!response.data) {
    //             return router.visit("/unauthorized");
    //         }
    //     } catch (error) {
    //         return router.visit("/unauthorized");
    //     }
    // };

    // verifyAuth();

    console.log(project);
    const rmemp = () => {
        setEmp(0);
        setEmpname("Select an employee");
    };
    const validateForm = () => {
        const errors = {};

        if (!title.trim()) {
            errors.name = "Title is required.";
        }

        if (status === null) {
            errors.role = "Please select a satus.";
        }
        if (!deadline || isNaN(Date.parse(deadline))) {
            errors.deadline = "Please enter a valid deadline date.";
        }
        return errors;
    };
    const validateForm2 = () => {
        const errors = {};

        if (!reportSubject.trim()) {
            errors.subject = "Subject is required.";
        }
        if (!report.trim()) {
            errors.report = "Write some report.";
        }

        return errors;
    };
    const hanldeClick = async (onetask) => {
        setTitle(onetask.title);
        setDescription(onetask.description);
        setDeadline(onetask.deadline.split(" ")[0]);
        setStatus(onetask.status);
        let assignedUser = 0;
        if (onetask.task_no !== null) {
            for (let i = 0; i < project.all_employees.length; i++) {
                if (project.all_employees[i].id === onetask.task_no.user_id) {
                    assignedUser = project.all_employees[i].id;
                    setEmpname(project.all_employees[i].name);
                    break;
                }
            }
            console.log(assignedUser);
        }
        setEmp(assignedUser);
        setPriority(onetask.priority);
        setProgress(onetask.progress);
    };
    const selectChange = (e) => {
        setEmp(Number(e.target.value));
        for (let i = 0; i < project.all_employees.length; i++) {
            if (project.all_employees[i].id === Number(e.target.value)) {
                setEmpname(project.all_employees[i].name);
                break;
            }
        }
    };
    console.log(deadline);
    const handleCategoryChange = (e, tasks) => {
        setSelectedCategory(e.target.value);
        let temp = [];
        if (e.target.value === "overdue") {
            for (let i = 0; i < tasks.length; i++) {
                if (
                    tasks[i].status === "pending" &&
                    new Date(tasks[i].deadline.split(" ")[0]) < new Date()
                ) {
                    temp.push(tasks[i]);
                }
            }
        } else if (e.target.value === "all") {
            temp = tasks;
        } else {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].status === e.target.value) {
                    temp.push(tasks[i]);
                }
            }
        }
        setAllTasks(temp);

        console.log(e.target.value, temp);
    };
    const closeView = () => {
        setTitle("");
        setDescription("");
        setDeadline("");
        setEmp(0);
        setStatus(null);
        setFormErrors({});
        setPriority("high");
        setProgress(0);
        setReportSubject("");
        setReport("");
        setFormErrors({});
        setFormSuccess({});
    };
    const reportCloseView = async () => {
        setCurrentReport([]);
    };
    const settingText = (e) => {
        setSearch(e.target.value);
    };
    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const taskchange = (selectedCategory, tasks, taskspriority) => {
        let temp = [];
        let temp2 = [];
        let tamp3 = null;
        if (selectedCategory === "All") {
            temp2 = tasks;
        } else if (selectedCategory === "overdue") {
            for (let i = 0; i < tasks.length; i++) {
                if (
                    tasks[i].status === "pending" &&
                    new Date(tasks[i].deadline.split(" ")[0]) < new Date()
                ) {
                    temp2.push(tasks[i]);
                }
            }
        } else {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].status === selectedCategory) {
                    temp2.push(tasks[i]);
                }
            }
            console.log("ami ekhane", temp2);
        }

        if (taskspriority === "high") {
            for (let i = 0; i < temp2.length; i++) {
                if (temp2[i].priority === "high") {
                    temp.push(temp2[i]);
                }
            }
        } else if (taskspriority === "reset") {
            setSelectedCategory("All");
            temp = tasks;
        } else if (taskspriority === "medium") {
            for (let i = 0; i < temp2.length; i++) {
                if (temp2[i].priority === "medium") {
                    temp.push(temp2[i]);
                }
            }
        } else if (taskspriority === "low") {
            for (let i = 0; i < temp2.length; i++) {
                if (temp2[i].priority === "low") {
                    temp.push(temp2[i]);
                }
            }
        }
        setAllTasks(temp);
    };
    const addcrew = async (event, id, project_id) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/addcrew",
                { project_id: project.id, user_id: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            if (response.data.error) {
                console.log("API Error:", response.data.error);
                return;
            }
            console.log("Success:", response);
            let temp = null;
            for (let i = 0; i < project.totalEmp.length; i++) {
                if (project.totalEmp[i].id === id) {
                    temp = project.totalEmp[i];
                    break;
                }
            }
            setAllCrew((prevItems) => [...prevItems, temp]);
            setAllemp((prevItems) =>
                prevItems.filter((item) => item.id !== id)
            );
        } catch (error) {
            if (error.response) {
                console.log("Validation or server error:", error);
                setFormErrors(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    const deleteCrew = async (event, id, project_id) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/deletecrew",
                { userId: id, projectId: project.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            if (response.data.error) {
                console.log("API Error:", response.data.error);
                return;
            }
            console.log("Success:", response);
            setAllCrew((prevItems) =>
                prevItems.filter((item) => item.id !== id)
            );
        } catch (error) {
            if (error.response) {
                console.log("Validation or server error:", error);
                setFormErrors(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    const deleteTask = async (event, id) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/deletetask",
                { task_id: id, project_id: project.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            if (response.data.error) {
                console.log("API Error:", response.data.error);
                setFormErrors(response.data.error);
                return;
            }
            console.log("Success:", response);
            window.location.reload();
        } catch (error) {
            if (error.response) {
                console.log("Validation or server error:", error);
                setFormErrors(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    const handleInputChange = async (e) => {
        const value = e.target.value;
        // fetch suggestions
        const res = await fetch(`/search/suggestions?q=${value}`);
        const data = await res.json();
        setSuggestions(data);
    };
    const reportSubmission = async (event, id) => {
        event.preventDefault();
        const errors = validateForm2();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            return;
        }
        const formData = {
            user_id: id,
            submitted_by: project.manager_id,
            report_date: new Date().toISOString().split("T")[0],
            subject: reportSubject,
            description: report,
            status: "submitted",
        };
        // console.log(formData);
        // return;
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/addreport",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            if (response.data.error) {
                console.log("API Error:", response.data.error);
                setFormErrors(response.data.error);
                return;
            }
            console.log("Success:", response);
            setReportSubject("");
            setReport("");
            setFormSuccess({ success: "The report is successfully added." });
            setCurrentReport((prevItems) => [...prevItems, formData]);
        } catch (error) {
            if (error.response) {
                console.log("Validation or server error:", error);
                setFormErrors(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    const submitTask = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            return;
        }

        const formData = {
            title: title,
            description: description,
            deadline: new Date(deadline).toISOString().split("T")[0],
            created_by: project.manager_id,
            project_id: project.id,
            status: status,
            priority: priority,
            progress: progress,
        };
        if (employee !== 0) {
            formData.employee_id = employee;
        }

        try {
            if (editMode === true) {
                formData.task_id = taskid;
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/updatetask",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );
                if (response.data.error) {
                    console.log("API Error:", response.data.error);
                    setFormErrors(response.data.error);
                    return;
                }
                console.log("Success:", response);
            } else if (editMode === false) {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/addtask",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );
                if (response.data.error) {
                    console.log("API Error:", response.data.error);
                    setFormErrors(response.data.error);
                    return;
                }
                console.log("Success:", response);
            }

            window.location.reload();
        } catch (error) {
            if (error.response) {
                console.log("Validation or server error:", error);
                setFormErrors(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };
    return (
        <>
            <Head>
                <title>{project.name}</title>
                <meta name="description" content="Page description" />
            </Head>
            <ManagerLayout></ManagerLayout>
            <div className="heading text-2xl ml-7 lg:ml-90 mr-7 mt-25 flex items-center p-5 mb-20">
                <div className="heading text-sm md:text-xl lg:text-2xl flex flex-col space-y-4 text-wrap w-screen">
                    <div className="card bg-base-100 shadow-md m-4 p-4 flex flex-col lg:flex-row mb-3.5">
                        <div className="card-body text-wrap w-fit flex flex-row justify-between">
                            <h1 className="font-bold text-3xl text-wrap flex flex-wrap">
                                {project.name}
                            </h1>
                            <div className="text-wrap w-fit">
                                <button className="btn btn-primary w-max">
                                    Edit Project
                                </button>
                            </div>
                        </div>{" "}
                    </div>

                    <div>
                        <p>{project.description}</p>
                    </div>
                    <div className="flex flex-col space-y-8 md:flex-row md:mt-0 flex-wrap md:justify-between">
                        <div className="card">
                            <div className="flex items-center text-success space-x-2">
                                <div
                                    aria-label="success"
                                    className="status status-success"
                                ></div>
                                <div>
                                    Completed Task: {project.completed_tasks}
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
                                <div>Pending Task: {project.pending_tasks}</div>
                            </div>
                            <div className="flex items-center text-secondary space-x-2">
                                <div
                                    aria-label="status"
                                    className="status status-secondary"
                                ></div>
                                <div>OverDue Task: {project.overdue_tasks}</div>
                            </div>
                            <div className="flex items-center text-neutral space-x-2">
                                <div
                                    aria-label="status"
                                    className="status status-neutral"
                                ></div>
                                <div>
                                    No. of Crew: {project.all_employees.length}
                                </div>
                            </div>
                            <div>
                                <button
                                    className="btn mt-5"
                                    onClick={() =>
                                        document
                                            .getElementById("crewModal")
                                            .showModal()
                                    }
                                >
                                    View Crew Members
                                </button>
                                <dialog
                                    id="crewModal"
                                    className="modal modal-bottom sm:modal-middle"
                                >
                                    <div className="modal-box w-11/12 max-w-5xl">
                                        <div className="flex flex-row justify-between">
                                            <h3 className="font-bold text-sm">
                                                All Crews
                                            </h3>
                                            <div className="flex">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        document
                                                            .getElementById(
                                                                "my_3"
                                                            )
                                                            .showModal();
                                                        AllempSet();
                                                    }}
                                                >
                                                    Add Crew
                                                </button>
                                                <dialog
                                                    id="my_3"
                                                    className="modal"
                                                >
                                                    <div className="modal-box flex flex-col space-y-7">
                                                        <form method="dialog">
                                                            {/* if there is a button in form, it will close the modal */}
                                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                                                ✕
                                                            </button>
                                                        </form>
                                                        <span>
                                                            {allemp.map(
                                                                (elem, idx) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="flex flex-row justify-between text-[20px] mb-3 hover:bg-stone-100 p-4 rounded-2xl cursor-pointer"
                                                                    >
                                                                        <div>
                                                                            {
                                                                                elem.name
                                                                            }
                                                                        </div>
                                                                        <div className="flex space-x-2">
                                                                            <form method="dialog">
                                                                                {/* if there is a button in form, it will close the modal */}
                                                                                <button
                                                                                    className="btn btn-dash btn-success"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        addcrew(
                                                                                            e,
                                                                                            elem.id,
                                                                                            project.id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Add
                                                                                </button>
                                                                            </form>

                                                                            <div>
                                                                                <button
                                                                                    className="btn btn-info text-stone-50 w-full"
                                                                                    onClick={() => {
                                                                                        document
                                                                                            .getElementById(
                                                                                                `crewView_${elem.id}`
                                                                                            )
                                                                                            .showModal();
                                                                                        setCurrentReport(
                                                                                            elem.submitted_reportsof_employee
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    Details
                                                                                </button>
                                                                                <dialog
                                                                                    id={`crewView_${elem.id}`}
                                                                                    className="modal"
                                                                                >
                                                                                    <span className="modal-box overflow-y-scroll">
                                                                                        <h3>
                                                                                            Employee
                                                                                            Name:{" "}
                                                                                            {
                                                                                                elem.name
                                                                                            }
                                                                                        </h3>
                                                                                        <h4 className="my-3">
                                                                                            Reviews:
                                                                                        </h4>
                                                                                        <div className="card flex flex-col ">
                                                                                            {currentReport.map(
                                                                                                (
                                                                                                    report,
                                                                                                    idx
                                                                                                ) => (
                                                                                                    <div
                                                                                                        key={
                                                                                                            idx
                                                                                                        }
                                                                                                        className="rounded-lg p-2 hover:bg-stone-100 transition-colors"
                                                                                                    >
                                                                                                        <h4>
                                                                                                            {
                                                                                                                report.subject
                                                                                                            }
                                                                                                        </h4>
                                                                                                        <h6 className="text-[20px] text-amber-800">
                                                                                                            {
                                                                                                                report.status
                                                                                                            }
                                                                                                        </h6>

                                                                                                        <div>
                                                                                                            <p className="py-1 text-sm ">
                                                                                                                {
                                                                                                                    report.description
                                                                                                                }
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            )}
                                                                                        </div>

                                                                                        <div className="modal-action">
                                                                                            <form method="dialog">
                                                                                                {/* if there is a button in form, it will close the modal */}
                                                                                                <button
                                                                                                    className="btn"
                                                                                                    onClick={
                                                                                                        reportCloseView
                                                                                                    }
                                                                                                >
                                                                                                    Close
                                                                                                </button>
                                                                                            </form>
                                                                                        </div>
                                                                                    </span>
                                                                                </dialog>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </span>
                                                    </div>
                                                </dialog>
                                            </div>
                                        </div>

                                        <div className="flex flex-col">
                                            {allCrew.map((emp, index) => (
                                                <span
                                                    key={emp.id}
                                                    value={emp.id}
                                                    className="cursor-pointer hover:bg-base-200 flex flex-row justify-between my-1 p-2"
                                                >
                                                    <div className="text-xl text-wrap">
                                                        {index + 1}. {emp.name}
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {/* For Employee Report Details */}
                                                        <div>
                                                            <button
                                                                className="btn w-full"
                                                                onClick={() => {
                                                                    document
                                                                        .getElementById(
                                                                            `crewView_${emp.id}`
                                                                        )
                                                                        .showModal();
                                                                    setCurrentReport(
                                                                        emp.submitted_reportsof_employee
                                                                    );
                                                                }}
                                                            >
                                                                Details
                                                            </button>
                                                            <dialog
                                                                id={`crewView_${emp.id}`}
                                                                className="modal"
                                                            >
                                                                <span className="modal-box overflow-y-scroll">
                                                                    <div className="flex flex-row justify-between mb-6">
                                                                        <h3 className="font-bold text-lg mb-4">
                                                                            {
                                                                                emp.name
                                                                            }
                                                                        </h3>
                                                                        <div>
                                                                            <button
                                                                                className="btn btn-success"
                                                                                onClick={() =>
                                                                                    document
                                                                                        .getElementById(
                                                                                            "writeReview"
                                                                                        )
                                                                                        .showModal()
                                                                                }
                                                                            >
                                                                                📝
                                                                            </button>
                                                                            <dialog
                                                                                id="writeReview"
                                                                                className="modal"
                                                                            >
                                                                                <div className="modal-box w-11/12 max-w-5xl">
                                                                                    {Object.keys(
                                                                                        formErrors
                                                                                    )
                                                                                        .length >
                                                                                        0 && (
                                                                                        <div
                                                                                            role="alert"
                                                                                            className="alert alert-error mb-4"
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
                                                                                                {Object.entries(
                                                                                                    formErrors
                                                                                                )
                                                                                                    .filter(
                                                                                                        ([
                                                                                                            _,
                                                                                                            value,
                                                                                                        ]) =>
                                                                                                            value
                                                                                                    ) // Filter out empty error messages
                                                                                                    .map(
                                                                                                        ([
                                                                                                            key,
                                                                                                            value,
                                                                                                        ]) => (
                                                                                                            <span
                                                                                                                key={
                                                                                                                    key
                                                                                                                }
                                                                                                                className="text-sm"
                                                                                                            >
                                                                                                                {
                                                                                                                    value
                                                                                                                }
                                                                                                            </span>
                                                                                                        )
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    {Object.keys(
                                                                                        formSuccess
                                                                                    )
                                                                                        .length >
                                                                                        0 && (
                                                                                        <div
                                                                                            role="alert"
                                                                                            className="alert alert-success mb-4"
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
                                                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                                                />
                                                                                            </svg>
                                                                                            <div className="flex flex-col">
                                                                                                {Object.entries(
                                                                                                    formSuccess
                                                                                                )
                                                                                                    .filter(
                                                                                                        ([
                                                                                                            _,
                                                                                                            value,
                                                                                                        ]) =>
                                                                                                            value
                                                                                                    ) // Filter out empty error messages
                                                                                                    .map(
                                                                                                        ([
                                                                                                            key,
                                                                                                            value,
                                                                                                        ]) => (
                                                                                                            <span
                                                                                                                key={
                                                                                                                    key
                                                                                                                }
                                                                                                                className="text-sm"
                                                                                                            >
                                                                                                                {
                                                                                                                    value
                                                                                                                }
                                                                                                            </span>
                                                                                                        )
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    <h3 className="font-bold text-lg">
                                                                                        {
                                                                                            emp.name
                                                                                        }
                                                                                    </h3>
                                                                                    <input
                                                                                        type="text"
                                                                                        placeholder="Write Your Subject"
                                                                                        className="input w-full mb-4 mt-3"
                                                                                        value={
                                                                                            reportSubject
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            setReportSubject(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    <textarea
                                                                                        className="textarea w-full"
                                                                                        placeholder="Write your report"
                                                                                        value={
                                                                                            report
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            setReport(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    ></textarea>
                                                                                    <div className="modal-action">
                                                                                        <form method="dialog">
                                                                                            {/* if there is a button, it will close the modal */}
                                                                                            <button
                                                                                                className="btn"
                                                                                                onClick={() => {
                                                                                                    setFormErrors(
                                                                                                        {}
                                                                                                    );
                                                                                                    closeView();
                                                                                                }}
                                                                                            >
                                                                                                Close
                                                                                            </button>
                                                                                        </form>
                                                                                        <button
                                                                                            className="btn btn-primary"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) =>
                                                                                                reportSubmission(
                                                                                                    e,
                                                                                                    emp.id
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Add
                                                                                            Report
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </dialog>
                                                                        </div>
                                                                    </div>

                                                                    <div className="card flex flex-col ">
                                                                        {currentReport.map(
                                                                            (
                                                                                report,
                                                                                idx
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        idx
                                                                                    }
                                                                                    className="rounded-lg p-2 hover:bg-stone-100 transition-colors"
                                                                                >
                                                                                    <h4>
                                                                                        {
                                                                                            report.subject
                                                                                        }
                                                                                    </h4>
                                                                                    <h6 className="text-[20px] text-amber-800">
                                                                                        {
                                                                                            report.status
                                                                                        }
                                                                                    </h6>

                                                                                    <div>
                                                                                        <p className="py-1 text-sm ">
                                                                                            {
                                                                                                report.description
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>

                                                                    <div className="modal-action">
                                                                        <form method="dialog">
                                                                            {/* if there is a button in form, it will close the modal */}
                                                                            <button
                                                                                className="btn"
                                                                                onClick={
                                                                                    reportCloseView
                                                                                }
                                                                            >
                                                                                Close
                                                                            </button>
                                                                        </form>
                                                                    </div>
                                                                </span>
                                                            </dialog>
                                                        </div>

                                                        <div>
                                                            <button
                                                                className="btn btn-error"
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            `deleteCrew_${emp.id}`
                                                                        )
                                                                        .showModal()
                                                                }
                                                            >
                                                                ❌
                                                            </button>
                                                            <dialog
                                                                id={`deleteCrew_${emp.id}`}
                                                                className="modal modal-bottom sm:modal-middle"
                                                            >
                                                                <div className="modal-box">
                                                                    <h3 className="font-bold text-lg">
                                                                        You sure
                                                                        you want
                                                                        to
                                                                        delete
                                                                        your
                                                                        crew?
                                                                    </h3>

                                                                    <div className="modal-action">
                                                                        <form method="dialog">
                                                                            {/* if there is a button in form, it will close the modal */}
                                                                            <button className="btn">
                                                                                No
                                                                            </button>
                                                                        </form>
                                                                        <button
                                                                            className="btn btn-error text-white"
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                deleteCrew(
                                                                                    e,
                                                                                    emp.id,
                                                                                    project.id
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </dialog>
                                                        </div>
                                                    </div>
                                                </span>
                                            ))}
                                        </div>

                                        <div className="modal-action">
                                            <form method="dialog">
                                                {/* if there is a button in form, it will close the modal */}
                                                <button
                                                    className="btn"
                                                    onClick={() =>
                                                        window.location.reload()
                                                    }
                                                >
                                                    Close
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </div>
                        </div>
                        <div>
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
                                    outerRadius={97}
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
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                    </div>

                    <div>
                        <div className="mt-5">
                            <div className="card text-sm">
                                <div className="flex flex-col md:flex-row justify-between">
                                    <div className="flex flex-row">
                                        <h1 className="font-bold mt-7 text-xl">
                                            Tasks
                                        </h1>
                                        <div className="flex justify-center items-center mt-5 h-max ml-3">
                                            <select
                                                className="select"
                                                value={selectedCategory}
                                                onChange={(e) =>
                                                    handleCategoryChange(
                                                        e,
                                                        project.tasks
                                                    )
                                                }
                                                name="category"
                                            >
                                                <option value="all">All</option>
                                                <option value="completed">
                                                    Completed
                                                </option>
                                                <option value="in_progress">
                                                    In Progress
                                                </option>
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="overdue">
                                                    Overdue
                                                </option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col space-y-2 mt-5 h-max ml-3">
                                            <h6>Filter Tasks by :</h6>
                                            <div className="flex space-x-2">
                                                <div className="badge badge-error badge-xs"></div>
                                                <div>
                                                    <a
                                                        className="cursor-pointer hover:underline hover:text-error"
                                                        onClick={() =>
                                                            taskchange(
                                                                selectedCategory,
                                                                project.tasks,
                                                                "high"
                                                            )
                                                        }
                                                    >
                                                        High
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="badge badge-warning badge-xs"></div>
                                                <a
                                                    className="cursor-pointer hover:underline hover:text-warning"
                                                    onClick={() =>
                                                        taskchange(
                                                            selectedCategory,
                                                            project.tasks,
                                                            "medium"
                                                        )
                                                    }
                                                >
                                                    Medium
                                                </a>
                                                <div></div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <div className="badge badge-info badge-xs"></div>
                                                <a
                                                    className="cursor-pointer hover:underline hover:text-info"
                                                    onClick={() =>
                                                        taskchange(
                                                            selectedCategory,
                                                            project.tasks,
                                                            "low"
                                                        )
                                                    }
                                                >
                                                    Low
                                                </a>
                                            </div>
                                            <div className="flex space-x-2">
                                                <div className="badge badge-neutral badge-xs"></div>
                                                <a
                                                    className="cursor-pointer hover:underline hover:text-info"
                                                    onClick={() =>
                                                        taskchange(
                                                            selectedCategory,
                                                            project.tasks,
                                                            "reset"
                                                        )
                                                    }
                                                >
                                                    click to reset
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                                        <button
                                            className="btn mt-7"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "insertTask"
                                                    )
                                                    .showModal()
                                            }
                                        >
                                            + Add Task
                                        </button>
                                        <dialog
                                            id="insertTask"
                                            className="modal modal-bottom sm:modal-middle"
                                        >
                                            <span className="modal-box text-start mb-2">
                                                {Object.keys(formErrors)
                                                    .length > 0 && (
                                                    <div
                                                        role="alert"
                                                        className="alert alert-error mb-4"
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
                                                            {Object.entries(
                                                                formErrors
                                                            )
                                                                .filter(
                                                                    ([
                                                                        _,
                                                                        value,
                                                                    ]) => value
                                                                ) // Filter out empty error messages
                                                                .map(
                                                                    ([
                                                                        key,
                                                                        value,
                                                                    ]) => (
                                                                        <span
                                                                            key={
                                                                                key
                                                                            }
                                                                            className="text-sm"
                                                                        >
                                                                            {
                                                                                value
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                )}
                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1 text-sm">
                                                        Task Title
                                                    </h5>
                                                </label>
                                                {/* onChange={(e) =>
                                                        setProgress(
                                                            e.target.value
                                                        )
                                                    } */}

                                                <input
                                                    type="text"
                                                    name="title"
                                                    className="input w-full mb-4"
                                                    placeholder="Type here"
                                                    value={title}
                                                    onChange={(e) =>
                                                        setTitle(e.target.value)
                                                    }
                                                />
                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1  text-sm">
                                                        Description
                                                    </h5>
                                                </label>
                                                <textarea
                                                    type="text"
                                                    className="input w-full h-35 text-wrap mb-4 p-2"
                                                    placeholder="Type here"
                                                    name="description"
                                                    value={description}
                                                    onChange={(e) =>
                                                        setDescription(
                                                            e.target.value
                                                        )
                                                    }
                                                ></textarea>
                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1 text-sm">
                                                        Deadline
                                                    </h5>
                                                </label>
                                                <input
                                                    type="date"
                                                    className="input w-full mb-4"
                                                    placeholder="Type here"
                                                    name="deadline"
                                                    value={deadline}
                                                    onChange={(e) =>
                                                        setDeadline(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1 text-sm">
                                                        Set Priority
                                                    </h5>
                                                </label>
                                                <div className="flex space-x-3 mb-3">
                                                    <select
                                                        value={priority} // Make sure `employee` state holds the selected `employee.id`
                                                        onChange={(e) => {
                                                            setPriority(
                                                                e.target.value
                                                            );
                                                        }} // Convert string to number
                                                        className="border rounded px-3 py-2 bg-white w-sm" // Better width control
                                                        name="priority"
                                                    >
                                                        {editMode === true && (
                                                            <option
                                                                value={priority}
                                                            >
                                                                {priority}
                                                            </option>
                                                        )}
                                                        {editMode === false &&
                                                            priority ===
                                                                "high" && (
                                                                <option value="high">
                                                                    High
                                                                </option>
                                                            )}
                                                        {editMode === false &&
                                                            priority ===
                                                                "low" && (
                                                                <option value="low">
                                                                    Low
                                                                </option>
                                                            )}
                                                        {editMode === false &&
                                                            priority ===
                                                                "medium" && (
                                                                <option value="medium">
                                                                    Medium
                                                                </option>
                                                            )}
                                                        {priority !== "low" && (
                                                            <option value="low">
                                                                Low
                                                            </option>
                                                        )}
                                                        {priority !==
                                                            "medium" && (
                                                            <option value="medium">
                                                                Medium
                                                            </option>
                                                        )}
                                                        {priority !==
                                                            "high" && (
                                                            <option value="high">
                                                                High
                                                            </option>
                                                        )}
                                                    </select>
                                                    <div>
                                                        {priority ===
                                                            "high" && (
                                                            <div className="badge badge-error badge-xl"></div>
                                                        )}
                                                        {priority === "low" && (
                                                            <div className="badge badge-info badge-xl mt-1"></div>
                                                        )}
                                                        {priority ===
                                                            "medium" && (
                                                            <div className="badge badge-warning badge-xl"></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1 text-sm">
                                                        Set Progress
                                                    </h5>
                                                </label>
                                                <input
                                                    type="range"
                                                    onChange={(e) => {
                                                        console.log(
                                                            e.target.value
                                                        );
                                                        setProgress(
                                                            e.target.value
                                                        );
                                                    }}
                                                    className="range range-sm range-neutral w-full"
                                                    value={progress}
                                                    step="25"
                                                />
                                                <div className="flex justify-between px-2.5 mt-2 text-xs">
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                    <span>|</span>
                                                </div>
                                                <div className="flex justify-between px-2.5 mt-2 text-xs mb-4">
                                                    <span>1</span>
                                                    <span>2</span>
                                                    <span>3</span>
                                                    <span>4</span>
                                                    <span>5</span>
                                                </div>
                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1 text-sm">
                                                        Status
                                                    </h5>
                                                </label>
                                                <div className="flex space-x-2 mt-3">
                                                    <input
                                                        type="radio"
                                                        value="completed"
                                                        name="myRadio"
                                                        className="radio radio-sm"
                                                        checked={
                                                            status ===
                                                            "completed"
                                                        }
                                                        onChange={(e) =>
                                                            setStatus(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <div>Completed</div>
                                                </div>
                                                <div className="flex space-x-2 mt-3">
                                                    <input
                                                        type="radio"
                                                        value="in_progress"
                                                        name="myRadio"
                                                        className="radio radio-sm"
                                                        checked={
                                                            status ===
                                                            "in_progress"
                                                        }
                                                        onChange={(e) =>
                                                            setStatus(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <div>In progress</div>
                                                </div>
                                                <div className="flex space-x-2 mt-3 mb-4">
                                                    <input
                                                        type="radio"
                                                        value="pending"
                                                        name="myRadio"
                                                        className="radio radio-sm"
                                                        checked={
                                                            status === "pending"
                                                        }
                                                        onChange={(e) =>
                                                            setStatus(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <div>Pending</div>
                                                </div>
                                                <label htmlFor="tasktitle">
                                                    <h5 className="font-bold mb-2 ml-1 text-sm">
                                                        Assign to
                                                    </h5>
                                                </label>
                                                <div className="flex space-x-1">
                                                    <select
                                                        value={employee} // Make sure `employee` state holds the selected `employee.id`
                                                        onChange={(e) => {
                                                            selectChange(e);
                                                        }} // Convert string to number
                                                        className="border rounded px-3 py-2 bg-white w-sm" // Better width control
                                                    >
                                                        {editMode === true && (
                                                            <option
                                                                value={employee}
                                                            >
                                                                {empname}
                                                            </option>
                                                        )}
                                                        {editMode === false && (
                                                            <option value={0}>
                                                                Select an
                                                                employee
                                                            </option>
                                                        )}

                                                        {project.all_employees.map(
                                                            (emp) => (
                                                                <option
                                                                    key={emp.id}
                                                                    value={
                                                                        emp.id
                                                                    }
                                                                >
                                                                    {emp.name}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    <div>
                                                        <button
                                                            className="btn btn-outline btn-error w-fit"
                                                            onClick={rmemp}
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="modal-action">
                                                    <form
                                                        method="dialog"
                                                        className="flex space-x-3"
                                                    >
                                                        {/* if there is a button in form, it will close the modal */}
                                                        <button
                                                            className="btn"
                                                            onClick={() => {
                                                                setEmpname("");
                                                                setEditMode(
                                                                    false
                                                                );
                                                                closeView();
                                                            }}
                                                        >
                                                            Close
                                                        </button>
                                                    </form>
                                                    {editMode === true && (
                                                        <form
                                                            onClick={submitTask}
                                                        >
                                                            <button
                                                                className="btn btn-primary"
                                                                type="submit"
                                                            >
                                                                Update Task
                                                            </button>
                                                        </form>
                                                    )}
                                                    {editMode === true && (
                                                        <div>
                                                            <button
                                                                className="btn btn-error text-white"
                                                                onClick={() =>
                                                                    document
                                                                        .getElementById(
                                                                            `deleteTask_${taskid}`
                                                                        )
                                                                        .showModal()
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                            <dialog
                                                                id={`deleteTask_${taskid}`}
                                                                className="modal modal-bottom sm:modal-middle"
                                                            >
                                                                <div className="modal-box">
                                                                    <h3 className="font-bold text-lg">
                                                                        You sure
                                                                        you want
                                                                        to
                                                                        delete
                                                                        this
                                                                        task?
                                                                    </h3>

                                                                    <div className="modal-action">
                                                                        <form method="dialog">
                                                                            {/* if there is a button in form, it will close the modal */}
                                                                            <button className="btn">
                                                                                No
                                                                            </button>
                                                                        </form>
                                                                        <button
                                                                            className="btn btn-error text-white"
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                deleteTask(
                                                                                    e,
                                                                                    taskid
                                                                                );
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </dialog>
                                                        </div>
                                                    )}
                                                    {editMode === false && (
                                                        <form
                                                            onSubmit={
                                                                submitTask
                                                            }
                                                        >
                                                            <button
                                                                className="btn btn-primary"
                                                                type="submit"
                                                            >
                                                                Insert Task
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            </span>
                                        </dialog>
                                    </div>
                                </div>
                            </div>
                            <table className="table">
                                {/* head */}

                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Task Title</th>
                                        <th className="text-center flex items-center justify-center">
                                            Status
                                        </th>
                                        <th className="text-center">
                                            Deadline
                                        </th>
                                        <th className="text-center">
                                            Priority
                                        </th>
                                        <th className="text-center">
                                            Assigned to
                                        </th>
                                        <th className="text-center">
                                            Progress
                                        </th>
                                        <th className="text-center"></th>
                                        <th className=""></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* row 1 */}
                                    {allTasks.map((task, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="w-sm text-wrap">
                                                {task.title}
                                            </td>
                                            <td className="text-center flex items-center justify-center">
                                                {task.status ===
                                                    "completed" && (
                                                    <div>
                                                        <div className="badge badge-soft badge-success">
                                                            completed
                                                        </div>
                                                    </div>
                                                )}
                                                {task.status ===
                                                    "in_progress" && (
                                                    <div>
                                                        <div className="badge badge-soft badge-info">
                                                            in_progress
                                                        </div>
                                                    </div>
                                                )}
                                                {task.status === "pending" &&
                                                    new Date(
                                                        task.deadline.split(
                                                            " "
                                                        )[0]
                                                    ) < new Date() && (
                                                        <div>
                                                            <div className="badge badge-soft badge-error">
                                                                overdue
                                                            </div>
                                                        </div>
                                                    )}
                                                {task.status === "pending" &&
                                                    new Date(
                                                        task.deadline.split(
                                                            " "
                                                        )[0]
                                                    ) > new Date() && (
                                                        <div>
                                                            <div className="badge badge-soft badge-warning">
                                                                pending
                                                            </div>
                                                        </div>
                                                    )}
                                            </td>
                                            <td className="text-center">
                                                {task.deadline}
                                            </td>
                                            <td className="text-center">
                                                {task.priority === "high" && (
                                                    <div className="badge badge-error badge-xs"></div>
                                                )}
                                                {task.priority === "low" && (
                                                    <div className="badge badge-info badge-xs"></div>
                                                )}
                                                {task.priority === "medium" && (
                                                    <div className="badge badge-warning badge-xs"></div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {task.task_no && (
                                                    <div className="text-center">
                                                        User ID:{" "}
                                                        {task.task_no.user_id}
                                                    </div>
                                                )}
                                                {!task.task_no && (
                                                    <div className="text-center">
                                                        Yet to Assign
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {task.progress === 0 && (
                                                    <h6 className="text-error font-bold">
                                                        {task.progress}%
                                                    </h6>
                                                )}
                                                {task.progress === 25 && (
                                                    <h6 className="text-error font-bold">
                                                        {task.progress}%
                                                    </h6>
                                                )}
                                                {task.progress === 50 && (
                                                    <h6 className="text-info font-bold">
                                                        {task.progress}%
                                                    </h6>
                                                )}
                                                {task.progress === 75 && (
                                                    <h6 className="text-info font-bold">
                                                        {task.progress}%
                                                    </h6>
                                                )}
                                                {task.progress === 100 && (
                                                    <h6 className="text-success font-bold">
                                                        {task.progress}%
                                                    </h6>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn"
                                                    onClick={() => {
                                                        setTaskid(task.id);
                                                        setEditMode(true);
                                                        hanldeClick(task);
                                                        document
                                                            .getElementById(
                                                                "insertTask"
                                                            )
                                                            .showModal();
                                                    }}
                                                >
                                                    View/Edit
                                                </button>
                                            </td>
                                            <td className="">
                                                <button
                                                    className="btn btn-error text-white"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(
                                                                `deleteTask_${task.id}`
                                                            )
                                                            .showModal()
                                                    }
                                                >
                                                    Delete
                                                </button>
                                                <dialog
                                                    id={`deleteTask_${task.id}`}
                                                    className="modal modal-bottom sm:modal-middle"
                                                >
                                                    <div className="modal-box">
                                                        <h3 className="font-bold text-lg">
                                                            You sure you want to
                                                            delete this task?
                                                        </h3>

                                                        <div className="modal-action">
                                                            <form method="dialog">
                                                                {/* if there is a button in form, it will close the modal */}
                                                                <button className="btn">
                                                                    No
                                                                </button>
                                                            </form>
                                                            <button
                                                                className="btn btn-error text-white"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    deleteTask(
                                                                        e,
                                                                        task.id
                                                                    );
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </dialog>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectView;
