import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ChevronLeft, MapPin, Shield } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CaretakerSignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  // Personal Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Experience and Skills
  const [training, setTraining] = useState({
    first_aid: false,
    emergency_medical: false,
    crowd_management: false,
    sanitation: false,
    food_safety: false,
  });
  const [otherTraining, setOtherTraining] = useState("");
  const [shelterExperience, setShelterExperience] = useState("none");
  const [experienceDescription, setExperienceDescription] = useState("");

  // Availability
  const [availability, setAvailability] = useState({
    overnight_stay: false,
    full_time: false,
    duration: "1-3 days",
    preferred_shifts: {
      morning: false,
      afternoon: false,
      night: false,
      flexible: false,
    },
    currently_available: false,
  });

  // Special Skills
  const [languages, setLanguages] = useState({
    english: true,
    malayalam: false,
    sign_language: false,
  });
  const [otherLanguages, setOtherLanguages] = useState("");
  const [counseling, setCounseling] = useState({
    has_training: false,
    details: "",
  });
  const [specialSkills, setSpecialSkills] = useState("");

  // Resource Knowledge
  const [resourceKnowledge, setResourceKnowledge] = useState({
    shelter_supplies: false,
    management_protocols: {
      trained: false,
      certification_details: "",
    },
    local_emergency_resources: false,
  });

  // Additional Information
  const [mobilityLimitations, setMobilityLimitations] = useState("");
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleTrainingChange = (e) => {
    setTraining({
      ...training,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAvailabilityChange = (e) => {
    const { name, checked, value } = e.target;

    if (name.startsWith("preferred_shifts.")) {
      const shiftName = name.split(".")[1];
      setAvailability({
        ...availability,
        preferred_shifts: {
          ...availability.preferred_shifts,
          [shiftName]: checked,
        },
      });
    } else if (name === "duration") {
      setAvailability({
        ...availability,
        [name]: value,
      });
    } else {
      setAvailability({
        ...availability,
        [name]: checked,
      });
    }
  };

  const handleLanguageChange = (e) => {
    setLanguages({
      ...languages,
      [e.target.name]: e.target.checked,
    });
  };

  const handleResourceKnowledgeChange = (e) => {
    const { name, checked, value } = e.target;

    if (name === "management_protocols.trained") {
      setResourceKnowledge({
        ...resourceKnowledge,
        management_protocols: {
          ...resourceKnowledge.management_protocols,
          trained: checked,
        },
      });
    } else if (name === "management_protocols.certification_details") {
      setResourceKnowledge({
        ...resourceKnowledge,
        management_protocols: {
          ...resourceKnowledge.management_protocols,
          certification_details: value,
        },
      });
    } else {
      setResourceKnowledge({
        ...resourceKnowledge,
        [name]: checked,
      });
    }
  };

  const handleEmergencyContactChange = (e) => {
    setEmergencyContact({
      ...emergencyContact,
      [e.target.name]: e.target.value,
    });
  };

  const handleCounselingChange = (e) => {
    if (e.target.name === "has_training") {
      setCounseling({
        ...counseling,
        has_training: e.target.checked,
      });
    } else {
      setCounseling({
        ...counseling,
        details: e.target.value,
      });
    }
  };

  const getLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        setError("Unable to retrieve your location");
      }
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!coordinates) {
      setError("Please get your location before signing up.");
      setIsLoading(false);
      return;
    }

    // Parse otherLanguages string into array
    const otherLanguagesArray = otherLanguages
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang !== "");

    // Parse specialSkills string into array
    const specialSkillsArray = specialSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    try {
      const response = await axios.post(`${BASE_URL}/caretaker/signup`, {
        full_name: fullName,
        email,
        password,
        contact_info: {
          phone,
          alternate_phone: alternatePhone,
        },
        address: {
          street,
          city,
          state,
          postal_code: postalCode,
        },
        training: {
          ...training,
          other_training: otherTraining,
        },
        shelter_experience: {
          level: shelterExperience,
          description: experienceDescription,
        },
        availability,
        languages: {
          ...languages,
          other_languages: otherLanguagesArray,
        },
        counseling,
        special_skills: specialSkillsArray,
        resource_knowledge: resourceKnowledge,
        mobility_limitations: mobilityLimitations,
        emergency_contact: emergencyContact,
        additional_notes: additionalNotes,
        current_location: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
      });

      localStorage.setItem("caretakerToken", response.data.token);
      localStorage.setItem("caretakerId", response.data.newCaretaker._id);
      localStorage.setItem("caretakerName", fullName);
      localStorage.setItem("caretakerEmail", email);
      navigate("/caretaker/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[#0f172a] overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to home
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-purple-500/20 rounded-full backdrop-blur-sm mb-4">
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Caretaker Registration
              </h1>
              <p className="text-gray-400 mt-2">
                Create your caretaker account for disaster response management
              </p>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSignUp} className="space-y-8">
              {/* Section: Personal Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Alternate Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter alternate phone (optional)"
                    />
                  </div>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">
                      Location Details
                    </label>
                    <button
                      onClick={getLocation}
                      className="flex items-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg
                               hover:bg-purple-500/30 transition-colors focus:outline-none focus:ring-2 
                               focus:ring-purple-500"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Current Location
                    </button>
                  </div>

                  {coordinates && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-purple-500/10 rounded-lg">
                      <div className="text-gray-300">
                        <span className="text-sm">Latitude:</span>
                        <p className="font-mono">{coordinates.latitude}</p>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-sm">Longitude:</span>
                        <p className="font-mono">{coordinates.longitude}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Street
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Enter state"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Experience and Skills */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                  Experience and Skills
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Training (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="first_aid"
                        name="first_aid"
                        checked={training.first_aid}
                        onChange={handleTrainingChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="first_aid"
                        className="text-sm text-gray-300"
                      >
                        First Aid/CPR
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="emergency_medical"
                        name="emergency_medical"
                        checked={training.emergency_medical}
                        onChange={handleTrainingChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="emergency_medical"
                        className="text-sm text-gray-300"
                      >
                        Emergency Medical Training
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="crowd_management"
                        name="crowd_management"
                        checked={training.crowd_management}
                        onChange={handleTrainingChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="crowd_management"
                        className="text-sm text-gray-300"
                      >
                        Crowd Management
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sanitation"
                        name="sanitation"
                        checked={training.sanitation}
                        onChange={handleTrainingChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="sanitation"
                        className="text-sm text-gray-300"
                      >
                        Sanitation/Hygiene Protocols
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="food_safety"
                        name="food_safety"
                        checked={training.food_safety}
                        onChange={handleTrainingChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="food_safety"
                        className="text-sm text-gray-300"
                      >
                        Food Safety/Handling
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Other Training (if any)
                    </label>
                    <input
                      type="text"
                      value={otherTraining}
                      onChange={(e) => setOtherTraining(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Specify other training if applicable"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Previous Shelter Experience
                    </label>
                    <select
                      value={shelterExperience}
                      onChange={(e) => setShelterExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                    >
                      <option value="none" className="bg-gray-800">
                        None
                      </option>
                      <option value="1-2 events" className="bg-gray-800">
                        1-2 events
                      </option>
                      <option value="3-5 events" className="bg-gray-800">
                        3-5 events
                      </option>
                      <option value="5+ events" className="bg-gray-800">
                        More than 5 events
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Describe Your Experience
                    </label>
                    <textarea
                      value={experienceDescription}
                      onChange={(e) => setExperienceDescription(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Briefly describe your previous shelter management experience"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section: Availability */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                  Availability
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="overnight_stay"
                        name="overnight_stay"
                        checked={availability.overnight_stay}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="overnight_stay"
                        className="text-sm text-gray-300"
                      >
                        Willing to stay overnight at the shelter
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="full_time"
                        name="full_time"
                        checked={availability.full_time}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="full_time"
                        className="text-sm text-gray-300"
                      >
                        Available for full-time shelter duty
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="currently_available"
                        name="currently_available"
                        checked={availability.currently_available}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="currently_available"
                        className="text-sm text-gray-300"
                      >
                        I am currently available for deployment
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration of Availability
                    </label>
                    <select
                      name="duration"
                      value={availability.duration}
                      onChange={handleAvailabilityChange}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                    >
                      <option value="1-3 days" className="bg-gray-800">
                        1-3 days
                      </option>
                      <option value="4-7 days" className="bg-gray-800">
                        4-7 days
                      </option>
                      <option value="1-2 weeks" className="bg-gray-800">
                        1-2 weeks
                      </option>
                      <option value="2+ weeks" className="bg-gray-800">
                        More than 2 weeks
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Shifts (if not full-time)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="morning"
                        name="preferred_shifts.morning"
                        checked={availability.preferred_shifts.morning}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="morning"
                        className="text-sm text-gray-300"
                      >
                        Morning (6am-2pm)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="afternoon"
                        name="preferred_shifts.afternoon"
                        checked={availability.preferred_shifts.afternoon}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg"
                      />
                      <label
                        htmlFor="afternoon"
                        className="text-sm text-gray-300"
                      >
                        Afternoon (2pm-10pm)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="night"
                        name="preferred_shifts.night"
                        checked={availability.preferred_shifts.night}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label htmlFor="night" className="text-sm text-gray-300">
                        Night (10pm-6am)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="flexible"
                        name="preferred_shifts.flexible"
                        checked={availability.preferred_shifts.flexible}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="flexible"
                        className="text-sm text-gray-300"
                      >
                        Flexible
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Special Skills */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                  Special Skills
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language Proficiency (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="english"
                        name="english"
                        checked={languages.english}
                        onChange={handleLanguageChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="english"
                        className="text-sm text-gray-300"
                      >
                        English
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="malayalam"
                        name="malayalam"
                        checked={languages.malayalam}
                        onChange={handleLanguageChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="malayalam"
                        className="text-sm text-gray-300"
                      >
                        Malayalam
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sign_language"
                        name="sign_language"
                        checked={languages.sign_language}
                        onChange={handleLanguageChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="sign_language"
                        className="text-sm text-gray-300"
                      >
                        Sign Language
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Other Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      value={otherLanguages}
                      onChange={(e) => setOtherLanguages(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="e.g. French, Mandarin, Hindi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="counseling_training"
                        name="has_training"
                        checked={counseling.has_training}
                        onChange={handleCounselingChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="counseling_training"
                        className="text-sm text-gray-300"
                      >
                        I have counseling or mental health training
                      </label>
                    </div>
                    {counseling.has_training && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Counseling Training Details
                        </label>
                        <input
                          type="text"
                          name="details"
                          value={counseling.details}
                          onChange={handleCounselingChange}
                          className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                   placeholder-gray-500 backdrop-blur-sm transition-all"
                          placeholder="Describe your counseling training"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Other Special Skills (comma separated)
                    </label>
                    <textarea
                      value={specialSkills}
                      onChange={(e) => setSpecialSkills(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="e.g. cooking, electrical work, plumbing, communication"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section: Resource Knowledge */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                  Resource Knowledge
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="shelter_supplies"
                        name="shelter_supplies"
                        checked={resourceKnowledge.shelter_supplies}
                        onChange={handleResourceKnowledgeChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="shelter_supplies"
                        className="text-sm text-gray-300"
                      >
                        Familiar with standard shelter supplies
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="local_emergency_resources"
                        name="local_emergency_resources"
                        checked={resourceKnowledge.local_emergency_resources}
                        onChange={handleResourceKnowledgeChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="local_emergency_resources"
                        className="text-sm text-gray-300"
                      >
                        Familiar with local emergency resources
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="management_protocols"
                        name="management_protocols.trained"
                        checked={resourceKnowledge.management_protocols.trained}
                        onChange={handleResourceKnowledgeChange}
                        className="h-5 w-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 bg-white/10"
                      />
                      <label
                        htmlFor="management_protocols"
                        className="text-sm text-gray-300"
                      >
                        Trained in shelter management protocols
                      </label>
                    </div>
                    {resourceKnowledge.management_protocols.trained && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Management Protocol Details/Certification
                        </label>
                        <input
                          type="text"
                          name="management_protocols.certification_details"
                          value={
                            resourceKnowledge.management_protocols
                              .certification_details
                          }
                          onChange={handleResourceKnowledgeChange}
                          className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                   placeholder-gray-500 backdrop-blur-sm transition-all"
                          placeholder="e.g. Red Cross Shelter Management, 2023"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Additional Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-purple-400 border-b border-purple-500/30 pb-2">
                  Additional Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mobility Limitations (if any)
                  </label>
                  <input
                    type="text"
                    value={mobilityLimitations}
                    onChange={(e) => setMobilityLimitations(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Describe any mobility limitations we should be aware of"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Information
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={emergencyContact.name}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Contact Name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="relationship"
                        value={emergencyContact.relationship}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Relationship"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={emergencyContact.phone}
                        onChange={handleEmergencyContactChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Contact Phone"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Any additional information you'd like to share"
                  ></textarea>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-3 px-4 
                         rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 
                         focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Caretaker Account"}
              </button>

              {/* Login link */}
              <p className="text-gray-400 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/caretaker/login"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>

          {/* Additional links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Need help?{" "}
              <a
                href="/contact"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaretakerSignUp;
