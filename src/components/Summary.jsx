import { useState } from "react";
import axios from "axios"

const Summary = ({ formData }) => {

    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [res, setRes] = useState(null);

    const handleFormSubmission = async () => {
        setLoading(true);
        const formDataToSend = new FormData();

        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/update`,
                formDataToSend
            );
            setRes(res)
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='text-white'>
            <h1 className="text-center text-2xl">Summary</h1>
            <div className="space-y-4 mt-5">
                {
                    Object.keys(formData).map((ele) => {
                        if (ele === "password") {
                            return null;
                        }
                        if (ele === "profilePicture") {
                            if (formData[ele]) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setImageUrl(reader.result);
                                };
                                reader.readAsDataURL(formData[ele]);
                            }
                            return (
                                <img className="object-contain mx-auto h-[300px]" src={imageUrl ? imageUrl : ""} alt="" />
                            )
                        }
                        return (
                            <>
                                <div className="flex justify-between">
                                    <div className="text-xl font-medium">{ele.charAt(0).toUpperCase() + ele.slice(1)}</div>
                                    <div className="text-lg">{formData[ele].charAt(0).toUpperCase() + formData[ele].slice(1)}</div>
                                </div>
                            </>
                        )
                    })
                }
            </div>
            <button disabled={loading} onClick={handleFormSubmission} className="mt-5 w-full bg-blue-500 py-1 rounded-lg border border-gray-500">{loading ? "Loading.." : "Submit"}</button>
            {error && <p className="text-red-500">{error.message}</p>}
            {res?.data.statusCode < 400 && <p className="text-center">User Created || Updated</p>}
        </div>
    )
}

export default Summary