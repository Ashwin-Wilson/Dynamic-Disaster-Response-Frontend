import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MAP_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const FamilyRegistrationForm = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });
  const [formData, setFormData] = useState({
    family_members: [
      {
        name: "",
        age: "",
        gender: "male",
        relation: "",
        is_vulnerable: false,
        vulnerability_type: {
          pregnant: false,
          disabled: false,
          elderly: false,
          child: false,
        },
        chronic_illness: [
          {
            condition: "",
            medication_required: false,
            details: "",
          },
        ],
      },
    ],
    total_members: 1,
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      proximity_to_risks: [
        {
          risk_type: "river",
          distance: 0,
          details: "",
        },
      ],
    },
    housing: {
      type: "permanent",
      details: "",
    },
    medical_requirements: {
      dependent_on_equipment: false,
      equipment_details: [
        {
          equipment_type: "",
          quantity: 0,
          power_required: false,
        },
      ],
      regular_medications: false,
      medication_details: "",
      immediate_medical_assistance_needed: false,
    },
    evacuation_details: {
      personal_transport_available: false,
      vehicle_type: "",
      assistance_required: false,
      assistance_type: "",
      preferred_evacuation_center: "",
    },
    disaster_preparedness: {
      disaster_kit_available: false,
      kit_last_checked: "",
      evacuation_protocol_awareness: false,
      emergency_contacts: [
        {
          name: "",
          relationship: "",
          phone: "",
        },
      ],
      meeting_point: "",
    },
    primary_contact: {
      phone: "",
      alternate_phone: "",
      emergency_contact: "",
    },
    disaster_history: [
      {
        disaster_type: "flood",
        date: "",
        impact_level: "minor",
        damages: "",
        evacuation_required: false,
      },
    ],
  });
  useEffect(() => {
    axios
      .get(`${BASE_URL}/family/get-family-by-id`, {
        headers: { familyId: localStorage.getItem("familyId") },
      })
      .then((response) => {
        console.log(response.data.family);
        setFormData({ ...formData, ...response.data.family });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  if (!isOpen) return null;

  const handleAddFamilyMember = () => {
    setFormData({
      ...formData,
      family_members: [
        ...formData.family_members,
        {
          name: "",
          age: "",
          gender: "male",
          relation: "",
          is_vulnerable: false,
          vulnerability_type: {
            pregnant: false,
            disabled: false,
            elderly: false,
            child: false,
          },
          chronic_illness: [
            {
              condition: "",
              medication_required: false,
              details: "",
            },
          ],
        },
      ],
      total_members: formData.total_members + 1,
    });
  };

  const handleRemoveFamilyMember = (indexToRemove) => {
    if (formData.family_members.length <= 1) return;
    setFormData({
      ...formData,
      family_members: formData.family_members.filter(
        (_, index) => index !== indexToRemove
      ),
      total_members: formData.total_members - 1,
    });
  };

  const handleSubmit = (e) => {
    formData.address.location.coordinates = [location.lng, location.lat];
    axios.post(`${BASE_URL}/family/update`, {
      token: localStorage.getItem("token"),
      updates: formData,
    });
    // console.log(e);
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-slate-900 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-semibold">
              Family Registration
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl text-white mb-4">Family Members</h3>
              {formData.family_members.map((member, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-slate-700 rounded-lg relative"
                >
                  {formData.family_members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFamilyMember(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-200 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...formData.family_members];
                          newMembers[index].name = e.target.value;
                          setFormData({
                            ...formData,
                            family_members: newMembers,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">Age</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={member.age}
                        onChange={(e) => {
                          const newMembers = [...formData.family_members];
                          newMembers[index].age = e.target.value;
                          setFormData({
                            ...formData,
                            family_members: newMembers,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">Gender</label>
                      <select
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={member.gender}
                        onChange={(e) => {
                          const newMembers = [...formData.family_members];
                          newMembers[index].gender = e.target.value;
                          setFormData({
                            ...formData,
                            family_members: newMembers,
                          });
                        }}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">
                        Relation
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={member.relation}
                        onChange={(e) => {
                          const newMembers = [...formData.family_members];
                          newMembers[index].relation = e.target.value;
                          setFormData({
                            ...formData,
                            family_members: newMembers,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-200 mb-2">
                      Vulnerabilities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(member.vulnerability_type).map((type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            className="w-4 h-4 bg-slate-800"
                            checked={member.vulnerability_type[type]}
                            onChange={(e) => {
                              const newMembers = [...formData.family_members];
                              newMembers[index].vulnerability_type[type] =
                                e.target.checked;
                              newMembers[index].is_vulnerable =
                                e.target.checked;
                              setFormData({
                                ...formData,
                                family_members: newMembers,
                              });
                            }}
                          />
                          <span className="text-gray-200 capitalize">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-200 mb-2">
                      Chronic Illness
                    </label>
                    {member.chronic_illness.map((illness, illnessIndex) => (
                      <div
                        key={illnessIndex}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                      >
                        <div>
                          <input
                            type="text"
                            placeholder="Condition"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                            value={illness.condition}
                            onChange={(e) => {
                              const newMembers = [...formData.family_members];
                              newMembers[index].chronic_illness[
                                illnessIndex
                              ].condition = e.target.value;
                              setFormData({
                                ...formData,
                                family_members: newMembers,
                              });
                            }}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Details"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                            value={illness.details}
                            onChange={(e) => {
                              const newMembers = [...formData.family_members];
                              newMembers[index].chronic_illness[
                                illnessIndex
                              ].details = e.target.value;
                              setFormData({
                                ...formData,
                                family_members: newMembers,
                              });
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="w-4 h-4 bg-slate-800"
                              checked={illness.medication_required}
                              onChange={(e) => {
                                const newMembers = [...formData.family_members];
                                newMembers[index].chronic_illness[
                                  illnessIndex
                                ].medication_required = e.target.checked;
                                setFormData({
                                  ...formData,
                                  family_members: newMembers,
                                });
                              }}
                            />
                            <span className="text-gray-200">
                              Medication Required
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddFamilyMember}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Family Member
              </button>
            </div>

            <div>
              <h3 className="text-xl text-white mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">Street</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">City</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">State</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Pincode</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.address.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          pincode: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg text-white mb-2">
                  Location Coordinates
                </h4>
                <MapView setLoction={setLocation} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-200 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                      // value={formData.address.location.coordinates[0]}
                      value={location.lng}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="0.000001"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                      // value={formData.address.location.coordinates[1]}
                      value={location.lat}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg text-white mb-2">Proximity to Risks</h4>
                {formData.address.proximity_to_risks.map((risk, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                  >
                    <div>
                      <label className="block text-gray-200 mb-2">
                        Risk Type
                      </label>
                      <select
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={risk.risk_type}
                        onChange={(e) => {
                          const newRisks = [
                            ...formData.address.proximity_to_risks,
                          ];
                          newRisks[index].risk_type = e.target.value;
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              proximity_to_risks: newRisks,
                            },
                          });
                        }}
                      >
                        <option value="river">River</option>
                        <option value="slope">Slope</option>
                        <option value="coast">Coast</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">
                        Distance (meters)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={risk.distance}
                        onChange={(e) => {
                          const newRisks = [
                            ...formData.address.proximity_to_risks,
                          ];
                          newRisks[index].distance = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              proximity_to_risks: newRisks,
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">
                        Details
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                        value={risk.details}
                        onChange={(e) => {
                          const newRisks = [
                            ...formData.address.proximity_to_risks,
                          ];
                          newRisks[index].details = e.target.value;
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              proximity_to_risks: newRisks,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl text-white mb-4">Housing Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">
                    Housing Type
                  </label>
                  <select
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.housing.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        housing: { ...formData.housing, type: e.target.value },
                      })
                    }
                  >
                    <option value="permanent">Permanent</option>
                    <option value="temporary">Temporary</option>
                    <option value="makeshift">Makeshift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Details</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.housing.details}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        housing: {
                          ...formData.housing,
                          details: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-white mb-4">Medical Requirements</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-slate-800"
                    checked={
                      formData.medical_requirements.dependent_on_equipment
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical_requirements: {
                          ...formData.medical_requirements,
                          dependent_on_equipment: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="text-gray-200">
                    Dependent on Medical Equipment
                  </span>
                </label>

                {formData.medical_requirements.dependent_on_equipment && (
                  <div className="ml-6">
                    {formData.medical_requirements.equipment_details.map(
                      (equipment, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2"
                        >
                          <div>
                            <label className="block text-gray-200 mb-2">
                              Equipment Type
                            </label>
                            <input
                              type="text"
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                              value={equipment.equipment_type}
                              onChange={(e) => {
                                const newDetails = [
                                  ...formData.medical_requirements
                                    .equipment_details,
                                ];
                                newDetails[index].equipment_type =
                                  e.target.value;
                                setFormData({
                                  ...formData,
                                  medical_requirements: {
                                    ...formData.medical_requirements,
                                    equipment_details: newDetails,
                                  },
                                });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-gray-200 mb-2">
                              Quantity
                            </label>
                            <input
                              type="number"
                              className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                              value={equipment.quantity}
                              onChange={(e) => {
                                const newDetails = [
                                  ...formData.medical_requirements
                                    .equipment_details,
                                ];
                                newDetails[index].quantity = parseInt(
                                  e.target.value
                                );
                                setFormData({
                                  ...formData,
                                  medical_requirements: {
                                    ...formData.medical_requirements,
                                    equipment_details: newDetails,
                                  },
                                });
                              }}
                            />
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                className="w-4 h-4 bg-slate-800"
                                checked={equipment.power_required}
                                onChange={(e) => {
                                  const newDetails = [
                                    ...formData.medical_requirements
                                      .equipment_details,
                                  ];
                                  newDetails[index].power_required =
                                    e.target.checked;
                                  setFormData({
                                    ...formData,
                                    medical_requirements: {
                                      ...formData.medical_requirements,
                                      equipment_details: newDetails,
                                    },
                                  });
                                }}
                              />
                              <span className="text-gray-200">
                                Power Required
                              </span>
                            </label>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-gray-200 mb-2">
                    Medication Details
                  </label>
                  <textarea
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white h-32"
                    value={formData.medical_requirements.medication_details}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical_requirements: {
                          ...formData.medical_requirements,
                          medication_details: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-white mb-4">Primary Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={
                      formData.primary_contact.phone
                        ? formData.primary_contact.phone
                        : 0
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primary_contact: {
                          ...formData.primary_contact,
                          phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.primary_contact.alternate_phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primary_contact: {
                          ...formData.primary_contact,
                          alternate_phone: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.primary_contact.emergency_contact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primary_contact: {
                          ...formData.primary_contact,
                          emergency_contact: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl text-white mb-4">Disaster History</h3>
              {formData.disaster_history.map((disaster, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
                >
                  <div>
                    <label className="block text-gray-200 mb-2">
                      Disaster Type
                    </label>
                    <select
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                      value={disaster.disaster_type}
                      onChange={(e) => {
                        const newHistory = [...formData.disaster_history];
                        newHistory[index].disaster_type = e.target.value;
                        setFormData({
                          ...formData,
                          disaster_history: newHistory,
                        });
                      }}
                    >
                      <option value="flood">Flood</option>
                      <option value="landslide">Landslide</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">
                      Impact Level
                    </label>
                    <select
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                      value={disaster.impact_level}
                      onChange={(e) => {
                        const newHistory = [...formData.disaster_history];
                        newHistory[index].impact_level = e.target.value;
                        setFormData({
                          ...formData,
                          disaster_history: newHistory,
                        });
                      }}
                    >
                      <option value="minor">Minor</option>
                      <option value="moderate">Moderate</option>
                      <option value="severe">Severe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                      value={disaster.date}
                      onChange={(e) => {
                        const newHistory = [...formData.disaster_history];
                        newHistory[index].date = e.target.value;
                        setFormData({
                          ...formData,
                          disaster_history: newHistory,
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2">Damages</label>
                    <textarea
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                      value={disaster.damages}
                      onChange={(e) => {
                        const newHistory = [...formData.disaster_history];
                        newHistory[index].damages = e.target.value;
                        setFormData({
                          ...formData,
                          disaster_history: newHistory,
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 bg-slate-800"
                        checked={disaster.evacuation_required}
                        onChange={(e) => {
                          const newHistory = [...formData.disaster_history];
                          newHistory[index].evacuation_required =
                            e.target.checked;
                          setFormData({
                            ...formData,
                            disaster_history: newHistory,
                          });
                        }}
                      />
                      <span className="text-gray-200">Evacuation Required</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const createCustomMarker = (color1, color2) => {
  // Create the main container
  var customMarker = document.createElement("div");
  customMarker.className = "relative w-10 h-10 rounded-full animate-pulse";

  // Create outer circle
  var outerCircle = document.createElement("div");
  outerCircle.className = `absolute inset-0 rounded-full ${color2} `;

  // Create inner circle
  var innerCircle = document.createElement("div");
  innerCircle.className = `absolute inset-2 rounded-full  ${color1} `;

  // Append circles to marker
  customMarker.appendChild(outerCircle);
  customMarker.appendChild(innerCircle);

  return customMarker;
};

const MapView = ({ setLoction }) => {
  const [mapMarker, setMapMarker] = useState(null);
  const [olaMap, setOlaMap] = useState(null);
  const [rMarkerLoc, setrMarkerLoc] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });

  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: MAP_API_KEY,
    });

    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: "map",
      center: [rMarkerLoc.lng, rMarkerLoc.lat],
      zoom: 15,
      branding: false,
    });
    setOlaMap(myMap);
    const redMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

    const rMarker = olaMaps
      .addMarker({
        element: redMarker,
        offset: [0, 6],
        anchor: "bottom",
        draggable: true,
      })
      .setLngLat([rMarkerLoc.lng, rMarkerLoc.lat])
      .addTo(myMap);

    setMapMarker(rMarker);

    function onDrag() {
      const lngLat = rMarker.getLngLat();
      setrMarkerLoc(lngLat);
    }
    rMarker.on("drag", onDrag);

    const geolocate = olaMaps.addGeolocateControls({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    myMap.addControl(geolocate);

    geolocate.on("geolocate", async (event) => {
      await rMarker.setLngLat([event.coords.longitude, event.coords.latitude]);
      setrMarkerLoc({
        lng: event.coords.longitude,
        lat: event.coords.latitude,
      });
    });
  }, []);
  useEffect(() => {
    setLoction(rMarkerLoc);
  }, [rMarkerLoc]);
  return (
    <div className="flex-1">
      <SearchBar
        mapMarker={mapMarker}
        olaMap={olaMap}
        setrMarkerLoc={setrMarkerLoc}
      />
      <p> Drag the marker to select other locations</p>
      <div id="map" style={{ height: "40rem", width: "100%" }}></div>
    </div>
  );
};

const SearchBar = ({ mapMarker, olaMap, setrMarkerLoc }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
          input
        )}&api_key=${MAP_API_KEY}`
      );
      setSuggestions(response.data.predictions || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion.description);
    setIsOpen(false);

    // You can handle the selected location here
    const lng = suggestion.geometry.location.lng;
    const lat = suggestion.geometry.location.lat;

    // Update marker position
    if (mapMarker) {
      await mapMarker.setLngLat([lng, lat]);
      await olaMap.setCenter([lng, lat]);
      await setrMarkerLoc({ lng, lat });
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for a location..."
        className="w-full px-4 py-2 text-white bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-12 w-full bg-slate-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 focus:outline-none focus:bg-slate-700"
            >
              <p className="font-medium">
                {suggestion.structured_formatting?.main_text}
              </p>
              <p className="text-sm text-gray-400">
                {suggestion.structured_formatting?.secondary_text}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyRegistrationForm;
