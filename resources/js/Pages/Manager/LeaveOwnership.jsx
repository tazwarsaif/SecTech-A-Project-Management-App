import { Head } from "@inertiajs/react";
import ManagerLayout from "../../Layouts/ManagerLayout";
const LeaveOwnership = (data) => {
    console.log(data);
    return (
        <>
            <Head>
                <title>Project Ownership Transfer</title>
                <meta name="description" content="Page description" />
            </Head>
            <ManagerLayout></ManagerLayout>
            <div className="heading text-2xl ml-7 lg:ml-90 mr-7 mt-25 flex justify-center items-center p-7 mb-20">
                <div className="heading text-2xl flex flex-col md:flex-row lg:flex-row xl:flex-row flex-wrap">
                    <div className="card bg-base-100 shadow-md m-4 p-7 w-full flex justify-center items-center">
                        <div>Create Project</div>
                        <div className="w-3xl">
                            <div className="mb-4 mt-7">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="title"
                                >
                                    Title
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-3xl py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                                    id="name"
                                    type="text"
                                    placeholder="Enter Title"
                                    required
                                />
                            </div>
                            <div className="mb-4 mt-7">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="description"
                                >
                                    Descrition
                                </label>
                                <textarea
                                    type="text"
                                    className="input w-full h-35 text-wrap mb-4 p-2"
                                    placeholder="Type description here"
                                    name="description"
                                ></textarea>
                            </div>
                            <div className="mb-4 mt-7">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="client"
                                >
                                    Select Client
                                </label>
                                <select // Make sure `employee` state holds the selected `employee.id`
                                    className="border rounded px-3 py-2 bg-white w-sm" // Better width control
                                    name="priority"
                                ></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeaveOwnership;
