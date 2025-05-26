import { useState } from "react";

export const ProfessionalDetails = ({ setStep, formData, setFormData }) => {

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const setDataInForm = (e) => {
        setFormErrors({});
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleForm = async (e) => {
        e.preventDefault();
        setFormErrors({});
        const errors = {};

        if (!formData.profession) {
            errors.profession = "Select Your Profession";
        } else {
            if (formData.profession === "entrepreneur" && !formData.companyName) {
                errors.companyName = "Company Name is required";
            }
        }

        if (!formData.address) {
            errors.address = "Address is required";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setStep(prev => prev + 1);

    }

    return (
        <div className='text-white'>
            <form className='space-y-4'>
                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-xl'>Profession</label>
                    <select defaultValue={"null"} onChange={setDataInForm} className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' name="profession" id="">
                        <option disabled value="null">Select A Profession</option>
                        <option value="student">Student</option>
                        <option value="developer">Developer</option>
                        <option value="entrepreneur">Entrepreneur</option>
                    </select>
                    {formErrors.profession && <p className="text-red-500 text-sm">{formErrors.profession}</p>}
                </div>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-xl'>Company Name</label>
                    <input name="companyName" onChange={setDataInForm} type="text" placeholder='Enter Your Company Name' className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' />
                    {formErrors.companyName && <p className="text-red-500 text-sm">{formErrors.companyName}</p>}
                </div>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-xl'>Address Line 1</label>
                    <input name="address" onChange={setDataInForm} type="text" placeholder='Enter Your Address' className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' />
                    {formErrors.address && <p className="text-red-500 text-sm">{formErrors.address}</p>}
                </div>

                <button disabled={loading} onClick={handleForm} className='w-full border border-gray-500 py-2 rounded-sm bg-blue-500'>{loading ? "Loading" : "Next"}</button>
            </form>
        </div>
    )
}
