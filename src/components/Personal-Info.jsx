import { useEffect, useState } from "react";
import axios from "axios";

const PersonalInfo = ({ setStep, formData, setFormData }) => {

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [gender, setGender] = useState(undefined);
    const [genderInput, setGenderInput] = useState();
    const [passwordStrength, setPasswordStrength] = useState(null);

    const passwordStrengthFunction = (password = "") => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        if (score === 3) setPasswordStrength("Strong");
        else if (score === 2) setPasswordStrength("Medium");
        else setPasswordStrength("Weak");
    }

    useEffect(() => {
        passwordStrengthFunction(formData.password);
    }, [formData.password])

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        return minLength && hasNumber && hasSpecialChar;
    }

    const setDataInForm = (e) => {
        setFormErrors({});
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormErrors({});

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    profilePicture: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleForm = async (e) => {
        e.preventDefault();
        setFormErrors({});
        const errors = {};

        if (gender === "other") {
            setFormData(prev => ({ ...prev, gender: genderInput }))
        } else {
            setFormData(prev => ({ ...prev, gender }))
        }

        if (!gender && !genderInput) {
            errors.gender = " Gender is required";
        }

        if (!formData.profilePicture) {
            errors.profilePicture = "Profile Picture is required";
        }

        if (!formData.username) {
            errors.username = "Username is required";
        } else {
            if (formData.username.length < 4 || formData.username.length > 20) {
                errors.username = "Username should be between 4 and 20 characters";
            }
            if (formData.username.includes(" ")) {
                errors.username = "Username should not contain spaces.";
            }
        }

        if (formData.oldPassword && !formData.password) {
            errors.password = "New Password is required";
        }

        if (!formData.oldPassword && formData.password) {
            errors.oldPassword = "Current Password is required";
        }

        if (formData.oldPassword && formData.password) {
            const res = validatePassword(formData.password);
            if (!res) {
                errors.password = "Password should be more than 8 characters and have atleast 1 number and 1 special character";
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setLoading(true);

        try {
            const checkUserNameRes = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/check-username`,
                { username: formData.username }
            );

            if (checkUserNameRes.data.statusCode >= 400) {
                setFormErrors({ username: "Username has already been taken." });
                setLoading(false);
                return;
            }

            if (formData.oldPassword) {
                const checkPasswordRes = await axios.post(
                    `${import.meta.env.VITE_BACKEND_BASE_URL}/check-password`,
                    {
                        username: formData.username,
                        oldPassword: formData.oldPassword
                    }
                );

                if (checkPasswordRes.data.statusCode >= 400) {
                    setFormErrors({ oldPassword: "Wrong password input" });
                    setLoading(false);
                    return;
                }
            }

            setStep(prev => prev + 1);
        } catch (err) {
            console.error("Form error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='text-white'>
            <form className='space-y-1 lg:space-y-4'>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-sm lg:text-xl'>Profile Picture</label>
                    <div className="space-y-2">
                        {
                            imagePreview && <div>
                                <img className="object-contain mx-auto h-[300px]" src={imagePreview} alt="" />
                            </div>
                        }
                        <input name="profilePicture" accept="image/*" onChange={handleImageChange} className='w-fit h-fit p-2 text-sm w-full border border-gray-400 rounded-lg hover:cursor-pointer bg-gray-100 text-black' type="file" />
                        {formErrors.profilePicture && <p className="text-red-500 text-sm">{formErrors.profilePicture}</p>}
                    </div>
                </div>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-sm lg:text-xl'>Username</label>
                    <input name="username" onChange={setDataInForm} type="text" placeholder='Enter Your Username' className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' />
                    {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}
                </div>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-sm lg:text-xl'>Gender</label>
                    <select defaultValue={"null"} onChange={(e) => setGender(e.target.value)} className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' name="gender" id="">
                        <option disabled value="null">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {gender === "other" && <input onChange={(e) => setGenderInput(e.target.value)} name="gender" type="text" placeholder='Enter Your Gender' className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' />}
                    {formErrors.gender && <p className="text-red-500 text-sm">{formErrors.gender}</p>}
                </div>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-sm lg:text-xl'>Current Password</label>
                    <input name="oldPassword" onChange={setDataInForm} type="password" placeholder='Enter Your Current Password' className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' />
                    {formErrors.oldPassword && <p className="text-red-500 text-sm">{formErrors.oldPassword}</p>}
                </div>

                <div className='flex flex-col p-2 space-y-2'>
                    <label htmlFor="" className='text-sm lg:text-xl'>New Password</label>
                    <input name="password" onChange={setDataInForm} type="password" placeholder='Enter Your New Password' className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' />
                    {formData.password && <p>Password Strength : {passwordStrength}</p>}
                    {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                </div>

                <button disabled={loading} onClick={handleForm} className='w-full border border-gray-500  py-1 lg:py-2 rounded-sm bg-blue-500'>{loading ? "Loading" : "Next"}</button>
            </form>
        </div>
    )
}

export default PersonalInfo