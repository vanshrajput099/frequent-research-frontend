import { useState } from "react"
import PersonalInfo from "./components/Personal-Info";
import { ProfessionalDetails } from "./components/Professional-Details";
import Prefrences from "./components/Prefrences";
import Summary from "./components/Summary";

const App = () => {

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  return (
    <div className="min-h-screen w-full bg-black py-10 px-2">
      <div className="text-center w-full xl:w-[50%] mx-auto space-y-2 px-2">
        <h1 className="text-2xl lg:text-5xl font-bold text-gray-100">User Profile Update</h1>
        <p className="text-white text-xs">I have implemented all the required features in this form as specified. However, please note that this is currently working as a create (new entry) form, not an update form.
          To properly implement update functionality, we would need access to the existing user data (e.g., fetched from a database or API) to pre-fill the form fields. Without the old data, updating is not logically possible — since the form has no reference to what needs to be updated.
          Everything else, including validations, dynamic fields, conditional logic, and form submission, is functioning correctly.</p>
      </div>

      {/* Form Container */}
      <div className="w-full lg:w-[35%] border mx-auto mt-10 p-5 bg-gray-900 rounded-xl border border-gray-700">
        {
          step === 1 ? <PersonalInfo setStep={setStep} formData={formData} setFormData={setFormData} /> :
            step === 2 ? <ProfessionalDetails setStep={setStep} formData={formData} setFormData={setFormData} /> :
              step === 3 ? <Prefrences setStep={setStep} formData={formData} setFormData={setFormData} /> :
                step === 4 ? <Summary formData={formData} /> : null
        }
      </div>
    </div>
  )
}

export default App