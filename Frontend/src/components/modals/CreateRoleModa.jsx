import axios from "axios";
import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateRoleModal = ({
  setShowingCreateRole,
  allFeatures,
  setAllRoles,
}) => {
  const [roleName, setRoleName] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const handleFeatureAdd = () => {
    setSelectedFeatures([
      ...selectedFeatures,
      { feature_id: "", access: "read", enabled: true },
    ]);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = selectedFeatures.map((feature, idx) => {
      if (idx === index) {
        return { ...feature, [field]: value };
      }
      return feature;
    });
    setSelectedFeatures(updatedFeatures);
  };

  const handleCreateRole = async () => {
    try {
      if (selectedFeatures.length <= 0) {
        return toast.error("Please select at least one feature for role");
      }

      if (!roleName) {
        return toast.error("Please enter a role name");
      }

      const response = await axios.post(
        `${process.env.API_URL}/api/role/create`,
        {
          name: roleName,
          features: selectedFeatures,
        },
        {
          withCredentials: true,
        }
      );

      setAllRoles((prev) => {
        return [...prev, response.data.role];
      });

      toast.success("Role created successfully");

      setShowingCreateRole(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold mb-4">Create New Role</h3>
        <div className="mb-4">
          <label className="block mb-2">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        {selectedFeatures.map((feature, index) => (
          <div key={index} className="mb-4 flex items-center">
            <select
              className="p-2 border rounded"
              value={feature.feature_id}
              onChange={(e) =>
                handleFeatureChange(index, "feature_id", e.target.value)
              }
            >
              <option value="">Select Feature</option>
              {allFeatures.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.feature_name}
                </option>
              ))}
            </select>
            <select
              className="p-2 border rounded ml-4"
              value={feature.access}
              onChange={(e) =>
                handleFeatureChange(index, "access", e.target.value)
              }
            >
              <option value="read">Read</option>
              <option value="write">Write</option>
            </select>
          </div>
        ))}
        <div className="mb-4">
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleFeatureAdd}
          >
            Add Feature
          </button>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            onClick={handleCreateRole}
          >
            <FaSave className="inline mr-2" />
            Create
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            onClick={() => setShowingCreateRole(false)}
          >
            <FaTimes className="inline mr-2" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
