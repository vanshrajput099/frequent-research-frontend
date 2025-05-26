import axios from "axios";
import { useEffect, useState } from "react";

const Prefrences = ({ setStep, formData, setFormData }) => {

    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [countryData, setCountryData] = useState([]);
    const [stateData, setStateData] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [showStates, setShowStates] = useState(false);
    const [showCities, setShowCities] = useState(false);

    const getCountries = async () => {
        const data = await axios.get('https://countriesnow.space/api/v0.1/countries');
        setCountryData(data.data.data);
    }

    const getStates = async () => {
        const data = await axios.post('https://countriesnow.space/api/v0.1/countries/states', { country: formData.country });
        setStateData(data.data.data.states);
    }

    const getCities = async () => {
        const data = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', { country: formData.country, state: formData.state });
        setCitiesData(data.data.data);
    }

    useEffect(() => {
        getCountries();
    }, [])

    useEffect(() => {
        if (formData.country) {
            getStates();
            setShowStates(true);
        }
    }, [formData.country])

    useEffect(() => {
        if (formData.state) {
            getCities();
            setShowCities(true);
        }
    }, [formData.state])

    const setDataInForm = (e) => {
        setFormErrors({});
        if (e.target.name === "country") {
            setFormData(prev => {
                const { state, ...rest } = prev;
                return { ...rest, [e.target.name]: e.target.value };
            });
            setShowStates(false);
            setShowCities(false);
        } else if (e.target.name === "state") {
            setFormData(prev => {
                const { city, ...rest } = prev;
                return { ...rest, [e.target.name]: e.target.value };
            });
            setShowCities(false);
        }
        else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    }

    const handleForm = async (e) => {
        e.preventDefault();
        setFormErrors({});
        const errors = {};

        if (!formData.country) {
            errors.country = "Select Your country";
        }

        if (!formData.state) {
            errors.state = "Select Your state";
        }

        if (!formData.city) {
            errors.city = "Select Your city";
        }

        if (!formData.subscription) {
            errors.subscription = "Subscription is required";
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
                    <label htmlFor="" className='text-xl'>Select Your Country</label>
                    <select defaultValue={formData.country || "null"} onChange={setDataInForm} className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' name="country" id="">
                        <option disabled value="null">Select A Country</option>
                        {
                            countryData.map((ele, idx) => <option key={idx} value={ele.country}>{ele.country}</option>)
                        }
                    </select>
                    {formErrors.country && <p className="text-red-500 text-sm">{formErrors.country}</p>}
                </div>

                {
                    showStates && formData.country &&
                    <div className='flex flex-col p-2 space-y-2'>
                        <label htmlFor="" className='text-xl'>Select Your State</label>
                        <select defaultValue={formData.state || "null"} onChange={setDataInForm} className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' name="state" id="">
                            <option disabled value="null">Select A State</option>
                            {
                                stateData.map((ele, idx) => <option key={idx} value={ele.name}>{ele.name}</option>)
                            }
                        </select>
                        {formErrors.state && <p className="text-red-500 text-sm">{formErrors.state}</p>}
                    </div>
                }

                {
                    showCities && formData.state &&
                    <div className='flex flex-col p-2 space-y-2'>
                        <label htmlFor="" className='text-xl'>Select Your City</label>
                        <select defaultValue={formData.city || "null"} onChange={setDataInForm} className='placeholder:text-xs p-2 text-sm border border-gray-400 rounded-lg w-full bg-gray-100 text-black' name="city" id="">
                            <option disabled value="null">Select A State</option>
                            {
                                citiesData.map((ele, idx) => <option key={idx} value={ele}>{ele}</option>)
                            }
                        </select>
                        {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
                    </div>
                }

                <div className='flex flex-col p-2 space-y-2'>
                    <label className='text-xl'>Subscription Plan</label>
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <label>Basic</label>
                            <input
                                type="radio"
                                name="subscription"
                                value="basic"
                                checked={formData.subscription === "basic"}
                                onChange={setDataInForm}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label>Pro</label>
                            <input
                                type="radio"
                                name="subscription"
                                value="pro"
                                checked={formData.subscription === "pro"}
                                onChange={setDataInForm}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label>Enterprise</label>
                            <input
                                type="radio"
                                name="subscription"
                                value="enterprise"
                                checked={formData.subscription === "enterprise"}
                                onChange={setDataInForm}
                            />
                        </div>
                    </div>

                    {formErrors.subscription && (
                        <p className="text-red-500 text-sm">{formErrors.subscription}</p>
                    )}
                </div>


                <div className="flex items-center p-2 gap-2">
                    <label htmlFor="">Newsletter</label>
                    <input onChange={setDataInForm} type="checkbox" checked={true} />
                </div>

                <button disabled={loading} onClick={handleForm} className='w-full border border-gray-500 py-2 rounded-sm bg-blue-500'>{loading ? "Loading" : "Next"}</button>
            </form>
        </div>
    )
}

export default Prefrences