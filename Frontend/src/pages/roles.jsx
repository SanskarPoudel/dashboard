import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa"; // Import icons
import AddFeatureModal from "../components/modals/AddFeatureModal";
import { ToastContainer, toast } from "react-toastify";
import CreateRoleModal from "../components/modals/CreateRoleModa";
import withPermissions from "../HOC/PermissionCheck";

const apiUrl = process.env.API_URL;

const Roles = () => {
  const [allRoles, setAllRoles] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [addingFeature, setAddingFeature] = useState(false);
  const [addingOnrole, setAddingOnrole] = useState(null);
  const [featureEdits, setFeatureEdits] = useState({
    access: "",
    enabled: false,
  });
  const [showingCreateRole, setShowingCreateRole] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(`${apiUrl}/api/role/all`, {
          withCredentials: true,
        });
        setAllRoles(rolesResponse.data.roles);

        const featuresResponse = await axios.get(`${apiUrl}/api/feature/all`, {
          withCredentials: true,
        });
        setAllFeatures(featuresResponse.data.features);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };

    fetchData();
  }, []);

  const startEditFeature = (feature) => {
    setEditingFeatureId(feature.id);
    setFeatureEdits({
      access: feature.RoleFeature.access,
      enabled: feature.RoleFeature.enabled,
    });
  };

  const handleFeatureChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFeatureEdits((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveFeatureEdits = async (featureId, roleId) => {
    console.log("Saving feature edits:", featureId, featureEdits);
    try {
      const response = await axios.post(
        `${apiUrl}/api/role/updateFeature`,
        {
          id: roleId,
          feature: {
            feature_id: featureId,
            access: featureEdits.access,
            enabled: featureEdits.enabled,
          },
        },
        { withCredentials: true }
      );

      const finalRole = response.data.role;

      setAllRoles((prev) => {
        const final = prev.map((pre) => {
          if (pre.id === roleId) {
            return finalRole;
          } else {
            return pre;
          }
        });
        return final;
      });

      setFeatureEdits(null);
      setEditingFeatureId(null);
      toast.success("Feature updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const cancelEdit = () => {
    setEditingFeatureId(null);
  };

  const deleteFeature = async (featureId, roleId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/role/removeFeature`,
        {
          id: roleId,
          feature: featureId,
        },
        {
          withCredentials: true,
        }
      );

      const finalRole = response.data.role;

      setAllRoles((prev) => {
        const final = prev.map((pre) => {
          if (pre.id === roleId) {
            return finalRole;
          } else {
            return pre;
          }
        });
        return final;
      });
      toast.success("Feature deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const deleteRole = async (role) => {
    try {
      const response = await axios.delete(
        `${apiUrl}/api/role/delete?id=${role.id}`,
        {
          withCredentials: true,
        }
      );

      setAllRoles((prev) => {
        const final = prev.filter((pr) => pr.id !== role.id);
        return final;
      });

      toast.success("Role deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <button
        onClick={() => setShowingCreateRole(true)}
        className="my-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <FaPlus /> Create New Role
      </button>
      {addingFeature && (
        <AddFeatureModal
          setAddingFeature={setAddingFeature}
          setAllRoles={setAllRoles}
          allFeatures={allFeatures}
          addingOnrole={addingOnrole}
        />
      )}
      {showingCreateRole && (
        <CreateRoleModal
          setShowingCreateRole={setShowingCreateRole}
          allFeatures={allFeatures}
          setAllRoles={setAllRoles}
        />
      )}
      <div className="flex flex-wrap -m-4">
        {allRoles.map((role) => (
          <div key={role.id} className="p-4 md:w-1/2 lg:w-1/3">
            <div className="relative h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-lg">
              <button
                onClick={() => deleteRole(role)}
                className="absolute top-0 right-0 m-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>

              <div className="p-6">
                <h2 className="text-base font-medium text-indigo-600">
                  Role ID: {role.id}
                </h2>
                <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                  {role.role_name}
                </h1>
                <div className="leading-relaxed mb-3">
                  <strong>Features:</strong>
                  {role.Features.map((feature) => (
                    <div
                      key={feature.id}
                      className="mt-2 p-3 rounded-lg bg-gray-100 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold">
                            ID: {feature.id}
                          </p>
                          <p className="text-sm">
                            Name: {feature.feature_name}
                          </p>
                          <p className="text-sm">
                            Access:{" "}
                            {editingFeatureId === feature.id
                              ? featureEdits.access
                              : feature.RoleFeature.access}
                          </p>
                          <p className="text-sm">
                            Enabled:{" "}
                            {editingFeatureId === feature.id
                              ? featureEdits.enabled
                                ? "Yes"
                                : "No"
                              : feature.RoleFeature.enabled
                              ? "Yes"
                              : "No"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {editingFeatureId === feature.id ? (
                            <>
                              <button
                                onClick={() =>
                                  saveFeatureEdits(feature.id, role.id)
                                }
                                className="text-green-500 hover:text-green-700 mr-2"
                              >
                                <FaSave />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <FaTimes />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditFeature(feature)}
                                className="text-blue-500 hover:text-blue-700 mr-2"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() =>
                                  deleteFeature(feature.id, role.id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {editingFeatureId === feature.id && (
                        <div className="mt-2">
                          <span className="mr-1">Access</span>
                          <select
                            name="access"
                            value={featureEdits.access}
                            onChange={handleFeatureChange}
                            className="mr-2 p-1 rounded border-gray-300 shadow-sm"
                          >
                            <option value="read">Read</option>
                            <option value="write">Write</option>
                          </select>
                          <label className="inline-flex ml-2 items-center">
                            Enabled:
                            <input
                              type="checkbox"
                              name="enabled"
                              checked={featureEdits.enabled}
                              onChange={handleFeatureChange}
                              className="ml-2"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!addingFeature && (
                  <button
                    onClick={() => {
                      const allFeature = role.Features.map(
                        (feat) => feat.feature_name
                      );

                      if (allFeature.includes("admin")) {
                        return toast.error(
                          "Admin feature is enough for accessing everything in dashboard"
                        );
                      } else {
                        setAddingFeature(true);
                        setAddingOnrole(role);
                      }
                    }}
                    className="mt-4 flex  items-center gap-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    <FaPlus /> Add Feature
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default withPermissions(Roles, ["admin"]);
