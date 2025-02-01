import { useState } from "react";
import { X } from "lucide-react";

const UserDataForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    totalMembers: "",
    children: "",
    elderly: "",
    medicalConditions: "",
    requiresMedicalEquipment: false,
    needsTransportation: false,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-white font-semibold">
              Report Disaster
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Details Section */}
            <div className="mb-6">
              <h3 className="text-xl text-white mb-4">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Family Composition Section */}
            <div className="mb-6">
              <h3 className="text-xl text-white mb-4">Family Composition</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">
                    Total Members
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.totalMembers}
                    onChange={(e) =>
                      setFormData({ ...formData, totalMembers: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Children (0 - 14 age)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.children}
                    onChange={(e) =>
                      setFormData({ ...formData, children: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Elderly (65+)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                    value={formData.elderly}
                    onChange={(e) =>
                      setFormData({ ...formData, elderly: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Health and Medical Needs Section */}
            <div className="mb-6">
              <h3 className="text-xl text-white mb-4">
                Health and Medical Needs
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-200 mb-2">
                    Medical Conditions
                  </label>
                  <textarea
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white h-32"
                    value={formData.medicalConditions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medicalConditions: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-slate-800"
                      checked={formData.requiresMedicalEquipment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiresMedicalEquipment: e.target.checked,
                        })
                      }
                    />
                    <span className="text-gray-200">
                      Requires Medical Equipements
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 bg-slate-800"
                      checked={formData.needsTransportation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          needsTransportation: e.target.checked,
                        })
                      }
                    />
                    <span className="text-gray-200">
                      Need Transpotation Assistance
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
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

export default UserDataForm;
