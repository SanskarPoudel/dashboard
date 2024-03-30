import axios from "axios";
import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFeatureModal = ({
  allFeatures,
  setAddingFeature,
  setAllRoles,
  addingOnrole,
}) => {
  const [newFeature, setNewFeature] = useState({
    featureId: "",
    access: "read",
    enabled: true,
  });

  const handleNewFeatureChange = (e) => {
    const { name, value, checked, type } = e.target;
    setNewFeature((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveNewFeature = async () => {
    try {
      if (!newFeature.access || !newFeature.featureId) {
        return toast.error("Please select required fields");
      }

      const response = await axios.post(
        `${process.env.API_URL}/api/role/addFeature`,
        {
          id: addingOnrole.id,
          feature: {
            access: newFeature.access,
            feature_id: newFeature.featureId,
            enabled: newFeature.enabled,
          },
        },
        {
          withCredentials: true,
        }
      );

      const roleUpdated = response.data.role;

      setAllRoles((prev) => {
        const final = prev.map((r) => {
          if (r.id === addingOnrole.id) {
            return roleUpdated;
          } else {
            return r;
          }
        });
        return final;
      });

      toast.success("Feature added successfully");

      setAddingFeature(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setAddingFeature(false);
        }
      }}
    >
      <ToastContainer />
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700 space-y-4">
        <h3 className="text-2xl font-semibold text-center mb-4">
          Add New Feature
        </h3>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Feature</label>
          <select
            className="w-full p-3 border rounded-lg text-lg"
            name="featureId"
            value={newFeature.featureId}
            onChange={handleNewFeatureChange}
          >
            <option value="">Select Feature</option>
            {allFeatures.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.feature_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <span className="text-lg font-medium">Access</span>
          <select
            name="access"
            value={newFeature.access}
            onChange={handleNewFeatureChange}
            className="ml-2 p-3 rounded-lg border text-lg w-full max-w-xs"
          >
            <option value="read">Read</option>
            <option value="write">Write</option>
          </select>
        </div>
        <div className="flex items-center mb-4">
          <label className="text-lg font-medium mr-2">Enabled:</label>
          <input
            type="checkbox"
            name="enabled"
            checked={newFeature.enabled}
            onChange={handleNewFeatureChange}
            className="scale-125"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors"
            onClick={saveNewFeature}
          >
            <FaSave className="inline mr-2" /> Save
          </button>
          <button
            className="px-5 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"
            onClick={() => setAddingFeature(false)}
          >
            <FaTimes className="inline mr-2" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFeatureModal;
