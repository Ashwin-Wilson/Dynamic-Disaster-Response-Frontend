import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ChevronLeft, MapPin, Heart } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const VolunteerSignUp = () => {
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

  // Availability
  const [availability, setAvailability] = useState({
    preferred_time_slots: {
      morning: false,
      afternoon: false,
      evening: false,
      overnight: false,
      weekends: false,
    },
    emergency_availability: false,
    notice_required: "Same day",
    max_hours_per_week: "",
  });

  // Skills and Training
  const [skillsAndTraining, setSkillsAndTraining] = useState({
    first_aid: {
      certified: false,
      certification_expiry: "",
    },
    disaster_management: false,
    swimming: false,
    heavy_equipment: false,
    search_and_rescue: false,
    cooking: false,
    medical_training: {
      has_training: false,
      details: "",
    },
    languages: {
      english: true,
      spanish: false,
      sign_language: false,
    },
  });
  const [otherLanguages, setOtherLanguages] = useState("");
  const [otherSkills, setOtherSkills] = useState("");

  // Resource Availability
  const [resourceAvailability, setResourceAvailability] = useState({
    tools: {
      boats: {
        available: false,
        details: "",
      },
      ropes: false,
      first_aid_kits: false,
      power_tools: false,
    },
    vehicle: {
      available: false,
      type: "None",
      details: "",
    },
  });
  const [otherTools, setOtherTools] = useState("");

  // Physical Fitness
  const [physicalFitness, setPhysicalFitness] = useState({
    is_physically_fit: false,
    fitness_level: "Moderate",
    limitations: "",
    can_lift_weight: "10-25 lbs",
  });

  // Additional Information
  const [emergencyContact, setEmergencyContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  });
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");

  const handleAvailabilityChange = (e) => {
    const { name, checked, value, type } = e.target;

    if (name.startsWith("preferred_time_slots.")) {
      const slotName = name.split(".")[1];
      setAvailability({
        ...availability,
        preferred_time_slots: {
          ...availability.preferred_time_slots,
          [slotName]: checked,
        },
      });
    } else if (type === "checkbox") {
      setAvailability({
        ...availability,
        [name]: checked,
      });
    } else if (name === "notice_required") {
      setAvailability({
        ...availability,
        [name]: value,
      });
    } else if (name === "max_hours_per_week") {
      setAvailability({
        ...availability,
        [name]: value === "" ? "" : parseInt(value, 10),
      });
    }
  };

  const handleSkillsChange = (e) => {
    const { name, checked, value, type } = e.target;

    if (name === "first_aid.certified") {
      setSkillsAndTraining({
        ...skillsAndTraining,
        first_aid: {
          ...skillsAndTraining.first_aid,
          certified: checked,
        },
      });
    } else if (name === "first_aid.certification_expiry") {
      setSkillsAndTraining({
        ...skillsAndTraining,
        first_aid: {
          ...skillsAndTraining.first_aid,
          certification_expiry: value,
        },
      });
    } else if (name === "medical_training.has_training") {
      setSkillsAndTraining({
        ...skillsAndTraining,
        medical_training: {
          ...skillsAndTraining.medical_training,
          has_training: checked,
        },
      });
    } else if (name === "medical_training.details") {
      setSkillsAndTraining({
        ...skillsAndTraining,
        medical_training: {
          ...skillsAndTraining.medical_training,
          details: value,
        },
      });
    } else if (name.startsWith("languages.")) {
      const langName = name.split(".")[1];
      setSkillsAndTraining({
        ...skillsAndTraining,
        languages: {
          ...skillsAndTraining.languages,
          [langName]: checked,
        },
      });
    } else {
      setSkillsAndTraining({
        ...skillsAndTraining,
        [name]: checked,
      });
    }
  };

  const handleResourceChange = (e) => {
    const { name, checked, value, type } = e.target;

    if (name === "tools.boats.available") {
      setResourceAvailability({
        ...resourceAvailability,
        tools: {
          ...resourceAvailability.tools,
          boats: {
            ...resourceAvailability.tools.boats,
            available: checked,
          },
        },
      });
    } else if (name === "tools.boats.details") {
      setResourceAvailability({
        ...resourceAvailability,
        tools: {
          ...resourceAvailability.tools,
          boats: {
            ...resourceAvailability.tools.boats,
            details: value,
          },
        },
      });
    } else if (
      name.startsWith("tools.") &&
      name !== "tools.boats.available" &&
      name !== "tools.boats.details"
    ) {
      const toolName = name.split(".")[1];
      setResourceAvailability({
        ...resourceAvailability,
        tools: {
          ...resourceAvailability.tools,
          [toolName]: checked,
        },
      });
    } else if (name === "vehicle.available") {
      setResourceAvailability({
        ...resourceAvailability,
        vehicle: {
          ...resourceAvailability.vehicle,
          available: checked,
        },
      });
    } else if (name === "vehicle.type") {
      setResourceAvailability({
        ...resourceAvailability,
        vehicle: {
          ...resourceAvailability.vehicle,
          type: value,
        },
      });
    } else if (name === "vehicle.details") {
      setResourceAvailability({
        ...resourceAvailability,
        vehicle: {
          ...resourceAvailability.vehicle,
          details: value,
        },
      });
    }
  };

  const handleFitnessChange = (e) => {
    const { name, checked, value, type } = e.target;

    if (type === "checkbox") {
      setPhysicalFitness({
        ...physicalFitness,
        [name]: checked,
      });
    } else {
      setPhysicalFitness({
        ...physicalFitness,
        [name]: value,
      });
    }
  };

  const handleEmergencyContactChange = (e) => {
    setEmergencyContact({
      ...emergencyContact,
      [e.target.name]: e.target.value,
    });
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

    // Parse otherSkills string into array
    const otherSkillsArray = otherSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    // Parse otherTools string into array
    const otherToolsArray = otherTools
      .split(",")
      .map((tool) => tool.trim())
      .filter((tool) => tool !== "");

    try {
      const response = await axios.post(`${BASE_URL}/volunteer/signup`, {
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
        availability,
        skills_and_training: {
          ...skillsAndTraining,
          other_languages: otherLanguagesArray,
          other_skills: otherSkillsArray,
        },
        resource_availability: {
          tools: {
            ...resourceAvailability.tools,
            other_tools: otherToolsArray,
          },
          vehicle: resourceAvailability.vehicle,
        },
        physical_fitness: physicalFitness,
        emergency_contact: emergencyContact,
        additional_notes: additionalNotes,
        previous_volunteer_experience: previousExperience,
        current_location: {
          type: "Point",
          coordinates: [coordinates.longitude, coordinates.latitude],
        },
      });

      localStorage.setItem("volunteerToken", response.data.token);
      localStorage.setItem("volunteerName", fullName);
      localStorage.setItem("volunteerEmail", email);
      navigate("/volunteer/dashboard");
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
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-green-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-green-500/10 rounded-full blur-[100px]"></div>
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
              <div className="p-3 bg-green-500/20 rounded-full backdrop-blur-sm mb-4">
                <Heart className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Volunteer Registration
              </h1>
              <p className="text-gray-400 mt-2">
                Create your volunteer account for disaster response
              </p>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSignUp} className="space-y-8">
              {/* Section: Personal Details */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                      className="flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-lg
                               hover:bg-green-500/30 transition-colors focus:outline-none focus:ring-2 
                               focus:ring-green-500"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Get Current Location
                    </button>
                  </div>

                  {coordinates && (
                    <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/10 rounded-lg">
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Availability */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
                  Availability
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time Slots (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="morning"
                        name="preferred_time_slots.morning"
                        checked={availability.preferred_time_slots.morning}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="morning"
                        className="text-sm text-gray-300"
                      >
                        Morning (6am-12pm)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="afternoon"
                        name="preferred_time_slots.afternoon"
                        checked={availability.preferred_time_slots.afternoon}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="afternoon"
                        className="text-sm text-gray-300"
                      >
                        Afternoon (12pm-6pm)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="evening"
                        name="preferred_time_slots.evening"
                        checked={availability.preferred_time_slots.evening}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="evening"
                        className="text-sm text-gray-300"
                      >
                        Evening (6pm-10pm)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="overnight"
                        name="preferred_time_slots.overnight"
                        checked={availability.preferred_time_slots.overnight}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="overnight"
                        className="text-sm text-gray-300"
                      >
                        Overnight (10pm-6am)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="weekends"
                        name="preferred_time_slots.weekends"
                        checked={availability.preferred_time_slots.weekends}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="weekends"
                        className="text-sm text-gray-300"
                      >
                        Weekends
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="emergency_availability"
                        name="emergency_availability"
                        checked={availability.emergency_availability}
                        onChange={handleAvailabilityChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="emergency_availability"
                        className="text-sm text-gray-300"
                      >
                        Available for emergency calls
                      </label>
                    </div>

                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notice Required
                    </label>
                    <select
                      name="notice_required"
                      value={availability.notice_required}
                      onChange={handleAvailabilityChange}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                    >
                      <option value="None" className="bg-gray-800">
                        None
                      </option>
                      <option value="Few hours" className="bg-gray-800">
                        Few hours
                      </option>
                      <option value="Same day" className="bg-gray-800">
                        Same day
                      </option>
                      <option value="1-2 days" className="bg-gray-800">
                        1-2 days
                      </option>
                      <option value="3+ days" className="bg-gray-800">
                        3+ days
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Maximum Hours Per Week
                    </label>
                    <input
                      type="number"
                      name="max_hours_per_week"
                      value={availability.max_hours_per_week}
                      onChange={handleAvailabilityChange}
                      min="1"
                      max="168"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter maximum weekly hours"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Skills and Training */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
                  Skills and Training
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Aid Certification */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="first_aid_certified"
                        name="first_aid.certified"
                        checked={skillsAndTraining.first_aid.certified}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="first_aid_certified"
                        className="text-sm text-gray-300"
                      >
                        First Aid/CPR Certified
                      </label>
                    </div>

                    {skillsAndTraining.first_aid.certified && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Certification Expiry Date
                        </label>
                        <input
                          type="date"
                          name="first_aid.certification_expiry"
                          value={
                            skillsAndTraining.first_aid.certification_expiry
                          }
                          onChange={handleSkillsChange}
                          className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Other training checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="disaster_management"
                        name="disaster_management"
                        checked={skillsAndTraining.disaster_management}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="disaster_management"
                        className="text-sm text-gray-300"
                      >
                        Disaster Management Training
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="swimming"
                        name="swimming"
                        checked={skillsAndTraining.swimming}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="swimming"
                        className="text-sm text-gray-300"
                      >
                        Swimming
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="heavy_equipment"
                        name="heavy_equipment"
                        checked={skillsAndTraining.heavy_equipment}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="heavy_equipment"
                        className="text-sm text-gray-300"
                      >
                        Heavy Equipment Operation
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="search_and_rescue"
                        name="search_and_rescue"
                        checked={skillsAndTraining.search_and_rescue}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="search_and_rescue"
                        className="text-sm text-gray-300"
                      >
                        Search and Rescue
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="cooking"
                        name="cooking"
                        checked={skillsAndTraining.cooking}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="cooking"
                        className="text-sm text-gray-300"
                      >
                        Cooking for Large Groups
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="medical_training"
                        name="medical_training.has_training"
                        checked={
                          skillsAndTraining.medical_training.has_training
                        }
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="medical_training"
                        className="text-sm text-gray-300"
                      >
                        Medical Training
                      </label>
                    </div>
                    {skillsAndTraining.medical_training.has_training && (
                      <div>
                        <input
                          type="text"
                          name="medical_training.details"
                          value={skillsAndTraining.medical_training.details}
                          onChange={handleSkillsChange}
                          className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                   placeholder-gray-500 backdrop-blur-sm transition-all"
                          placeholder="Describe your medical training"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Other Skills (comma separated)
                    </label>
                    <textarea
                      value={otherSkills}
                      onChange={(e) => setOtherSkills(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="e.g. communication, counseling, electrical work, plumbing"
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language Proficiency (Check all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="english"
                        name="languages.english"
                        checked={skillsAndTraining.languages.english}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
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
                        id="spanish"
                        name="languages.spanish"
                        checked={skillsAndTraining.languages.spanish}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="spanish"
                        className="text-sm text-gray-300"
                      >
                        Spanish
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="sign_language"
                        name="languages.sign_language"
                        checked={skillsAndTraining.languages.sign_language}
                        onChange={handleSkillsChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
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
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="e.g. French, Mandarin, Hindi"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Resource Availability */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
                  Resource Availability
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Available Tools (Check all that apply)
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="boats_available"
                        name="tools.boats.available"
                        checked={resourceAvailability.tools.boats.available}
                        onChange={handleResourceChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="boats_available"
                        className="text-sm text-gray-300"
                      >
                        Boats
                      </label>
                    </div>
                    {resourceAvailability.tools.boats.available && (
                      <div>
                        <input
                          type="text"
                          name="tools.boats.details"
                          value={resourceAvailability.tools.boats.details}
                          onChange={handleResourceChange}
                          className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                   placeholder-gray-500 backdrop-blur-sm transition-all"
                          placeholder="Describe your boat(s)"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="ropes"
                        name="tools.ropes"
                        checked={resourceAvailability.tools.ropes}
                        onChange={handleResourceChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label htmlFor="ropes" className="text-sm text-gray-300">
                        Ropes
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="first_aid_kits"
                        name="tools.first_aid_kits"
                        checked={resourceAvailability.tools.first_aid_kits}
                        onChange={handleResourceChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="first_aid_kits"
                        className="text-sm text-gray-300"
                      >
                        First Aid Kits
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="power_tools"
                        name="tools.power_tools"
                        checked={resourceAvailability.tools.power_tools}
                        onChange={handleResourceChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="power_tools"
                        className="text-sm text-gray-300"
                      >
                        Power Tools
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Other Tools (comma separated)
                      </label>
                      <input
                        type="text"
                        value={otherTools}
                        onChange={(e) => setOtherTools(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                        placeholder="e.g. generator, flashlights, tents"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="vehicle_available"
                        name="vehicle.available"
                        checked={resourceAvailability.vehicle.available}
                        onChange={handleResourceChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                      />
                      <label
                        htmlFor="vehicle_available"
                        className="text-sm text-gray-300"
                      >
                        I have a vehicle that can be used
                      </label>
                    </div>
                    {resourceAvailability.vehicle.available && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Vehicle Type
                          </label>
                          <select
                            name="vehicle.type"
                            value={resourceAvailability.vehicle.type}
                            onChange={handleResourceChange}
                            className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                     placeholder-gray-500 backdrop-blur-sm transition-all"
                          >
                            <option value="Sedan" className="bg-gray-800">
                              Sedan
                            </option>
                            <option value="SUV" className="bg-gray-800">
                              SUV
                            </option>
                            <option value="Truck" className="bg-gray-800">
                              Truck
                            </option>
                            <option value="Van" className="bg-gray-800">
                              Van
                            </option>
                            <option value="Other" className="bg-gray-800">
                              Other
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Vehicle Details
                          </label>
                          <input
                            type="text"
                            name="vehicle.details"
                            value={resourceAvailability.vehicle.details}
                            onChange={handleResourceChange}
                            className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                     placeholder-gray-500 backdrop-blur-sm transition-all"
                            placeholder="Make, model, capacity, 4WD, etc."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Physical Fitness */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
                  Physical Fitness
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_physically_fit"
                        name="is_physically_fit"
                        checked={physicalFitness.is_physically_fit}
                        onChange={handleFitnessChange}
                        className="h-5 w-5 rounded border-gray-600 text-green-600 focus:ring-green-500 bg-white/10"
                        required
                      />
                      <label
                        htmlFor="is_physically_fit"
                        className="text-sm text-gray-300"
                      >
                        I confirm that I am physically fit for disaster response
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fitness Level
                      </label>
                      <select
                        name="fitness_level"
                        value={physicalFitness.fitness_level}
                        onChange={handleFitnessChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                      >
                        <option value="Limited" className="bg-gray-800">
                          Limited
                        </option>
                        <option value="Moderate" className="bg-gray-800">
                          Moderate
                        </option>
                        <option value="Good" className="bg-gray-800">
                          Good
                        </option>
                        <option value="Excellent" className="bg-gray-800">
                          Excellent
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Weight Lifting Capacity
                      </label>
                      <select
                        name="can_lift_weight"
                        value={physicalFitness.can_lift_weight}
                        onChange={handleFitnessChange}
                        className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                                 placeholder-gray-500 backdrop-blur-sm transition-all"
                      >
                        <option value="Under 10 lbs" className="bg-gray-800">
                          Under 10 lbs
                        </option>
                        <option value="10-25 lbs" className="bg-gray-800">
                          10-25 lbs
                        </option>
                        <option value="25-50 lbs" className="bg-gray-800">
                          25-50 lbs
                        </option>
                        <option value="50+ lbs" className="bg-gray-800">
                          50+ lbs
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Physical Limitations (if any)
                    </label>
                    <textarea
                      name="limitations"
                      value={physicalFitness.limitations}
                      onChange={handleFitnessChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Describe any physical limitations that may affect your volunteer work"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Section: Additional Information */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-green-400 border-b border-green-500/30 pb-2">
                  Additional Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Previous Volunteer Experience
                  </label>
                  <textarea
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Describe any previous volunteer experience, particularly in disaster response"
                  ></textarea>
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-medium py-3 px-4 
                         rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 
                         focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Volunteer Account"}
              </button>

              {/* Login link */}
              <p className="text-gray-400 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/volunteer/login"
                  className="text-green-400 hover:text-green-300 transition-colors font-medium"
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
                className="text-green-400 hover:text-green-300 transition-colors"
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

export default VolunteerSignUp;
