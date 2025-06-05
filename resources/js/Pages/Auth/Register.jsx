import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";
const Register = ({ countries }) => {
    const countryCodes = countries;
    const props = usePage().props;
    const [prefix, setPrefix] = useState("44");
    const [number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const validateForm = () => {
        const errors = {};

        if (!name.trim()) {
            errors.name = "Name is required.";
        }

        if (!mail.trim()) {
            errors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
            errors.email = "Email is invalid.";
        }

        if ((!prefix.trim() || !/^\d+$/.test(prefix)) && selectedRole === "1") {
            errors.prefix = "Prefix must be numeric.";
        }

        if (!number.trim() && selectedRole === "1") {
            errors.number = "Phone number is required.";
        } else if (!/^\d{7,15}$/.test(number) && selectedRole === "1") {
            errors.number = "Enter a valid phone number.";
        }

        if (!password.trim()) {
            errors.password = "Password is required.";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
        } else if (password !== passwordConfirmation) {
            errors.password_confirmation = "Passwords do not match.";
        }
        if (!passwordConfirmation.trim()) {
            errors.password_confirmation = "Password confirmation is required.";
        }
        if (selectedRole === null) {
            errors.role = "Please select a role.";
        }
        if (selectedRole === "1") {
            if (!address.trim()) {
                errors.address = "Address is required for Client role.";
            }
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            return;
        }
        const role_id = Number(selectedRole);
        const formData = {
            name,
            password,
            email: mail,
            role_id,
            password_confirmation: passwordConfirmation,
            _token: props.csrf_token,
        };
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/register",
                formData
            );
            console.log("Success:", response);
            router.visit("/login");
        } catch (error) {
            if (error.response) {
                console.log(
                    "Validation or server error:",
                    error.response.data.error
                );
                setFormErrors(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg px-8 py-6 w-150">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Register
                </h2>
                {Object.keys(formErrors).length > 0 && (
                    <div role="alert" className="alert alert-error">
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
                        <ul>
                            {Object.entries(formErrors).map(([key, value]) => (
                                <li key={key}>{value}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="name"
                        >
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="mail"
                            placeholder="Enter your mail address"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="role"
                        >
                            Select Role
                        </label>
                        <div className="mb-4 flex space-x-2">
                            <label className="flex space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="3"
                                    className="radio radio-neutral"
                                    onChange={(e) =>
                                        setSelectedRole(e.target.value)
                                    }
                                />
                                <p className="text-l">Client</p>
                            </label>
                            <br />

                            <label className="flex space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="2"
                                    className="radio radio-neutral"
                                    onChange={(e) =>
                                        setSelectedRole(e.target.value)
                                    }
                                />
                                <p className="text-l">Manager</p>
                            </label>
                            <br />

                            <label className="flex space-x-2">
                                <input
                                    type="radio"
                                    name="role"
                                    value="4"
                                    className="radio radio-neutral"
                                    onChange={(e) =>
                                        setSelectedRole(e.target.value)
                                    }
                                />
                                <p className="text-l">Employee</p>
                            </label>

                            {/* <p>Selected Role ID: {selectedRole}</p> */}
                        </div>
                    </div>
                    {selectedRole === "1" && (
                        <div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="address"
                                >
                                    Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="address"
                                    type="text"
                                    placeholder="Enter your address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="address"
                                >
                                    Phone Number
                                </label>
                                <div className="flex">
                                    <select
                                        value={prefix}
                                        onChange={(e) =>
                                            setPrefix(e.target.value)
                                        }
                                        className="border rounded-l-md px-2 bg-white w-min"
                                    >
                                        {Object.entries(countryCodes).map(
                                            ([key, label]) => (
                                                <option key={key} value={key}>
                                                    {label}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    <input
                                        type="tel"
                                        placeholder="Enter number"
                                        value={number}
                                        onChange={(e) =>
                                            setNumber(e.target.value)
                                        }
                                        required
                                        className="input w-full rounded-l-none"
                                    />
                                </div>

                                <div className="text-sm text-gray-600">
                                    <strong>Full Number:</strong> +{prefix}{" "}
                                    {number}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password_confirmation"
                        >
                            Confirm Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password_confirmation"
                            type="password"
                            placeholder="Enter your password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
                            type="submit"
                        >
                            Register
                        </button>
                        <a
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            href="/login"
                        >
                            Already have an accoun? Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
