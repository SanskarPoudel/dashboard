import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/layout";
import withPermissions from "../HOC/PermissionCheck";
import { ToastContainer, toast } from "react-toastify";

const apiUrl = process.env.API_URL;

const Features = () => {
  const [allFeatures, setAllFeatures] = useState([]);
  const [disabling, setDisabling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAllFeatures();
  }, []);

  const fetchAllFeatures = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/feature/all`, {
        withCredentials: true,
      });
      setAllFeatures(response.data.features);
    } catch (err) {
      console.error("Failed to fetch features", err);
    }
  };

  const addFeature = async (featureName) => {
    try {
      setCreating(true);
      const response = await axios.post(
        `${apiUrl}/api/feature/create`,
        { name: featureName, active: true },
        { withCredentials: true }
      );

      setAllFeatures([...allFeatures, response.data.feature]);

      setCreating(false);

      toast.success("Feature Added Successfully");
    } catch (err) {
      setCreating(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDisableFeature = async (feature) => {
    if (feature.feature_name === "admin") {
      return toast.error(
        "You cannot disable admin as you will also be kicked out from accessing commanding functionalities.. Haha"
      );
    }

    try {
      setDisabling(true);
      const response = await axios.post(
        `${apiUrl}/api/feature/update`,
        {
          id: feature.id,
          active: !feature.active,
        },
        {
          withCredentials: true,
        }
      );

      setAllFeatures((prev) => {
        const newFeature = prev.map((prev) => {
          if (prev.id === feature.id) {
            return { ...prev, active: !prev.active };
          } else return prev;
        });

        return newFeature;
      });

      setDisabling(false);
      toast.success(
        `Feature ${feature.active ? "Disabled" : "Enabled"} successfully `
      );
    } catch (err) {
      setDisabling(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const deleteFeature = async (feature) => {
    if (feature.feature_name === "admin") {
      return toast.error(
        "You cannot delete admin as you will also be kicked out from accessing commanding functionalities.. Haha"
      );
    }
    try {
      setDeleting(true);

      await axios.delete(`${apiUrl}/api/feature/delete?id=${feature.id}`, {
        withCredentials: true,
      });

      setAllFeatures((prev) => {
        const final = prev.filter((pr) => {
          return pr.id !== feature.id;
        });

        return final;
      });

      toast.success("Feature deleted successfully");

      setDeleting(false);
    } catch (err) {
      setDeleting(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Layout>
      <div className="m-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const featureName = e.target.elements.featureName.value;
            await addFeature(featureName);
            e.target.reset();
          }}
          className="flex justify-center gap-4 mb-4"
        >
          <input
            type="text"
            name="featureName"
            placeholder="Enter Feature Name"
            className="border-2 border-gray-300 p-2 rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {creating ? "Adding" : "Add Feature"}
          </button>
        </form>
        <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Feature List
        </h2>
        <div>
          <table className="table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature) => (
                <tr key={feature.id}>
                  <td className="border px-4 py-2  text-center">
                    {feature.id}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {feature.feature_name}
                  </td>
                  <td className="border px-4 py-2 text-center ">
                    {feature.active ? "True" : "False"}
                  </td>
                  <td className="border px-4 py-2 flex justify-center gap-5">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDisableFeature(feature)}
                    >
                      {disabling
                        ? feature.active
                          ? "Disabling.."
                          : "Enabling.."
                        : feature.active
                        ? "Disable"
                        : "Enable"}
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => deleteFeature(feature)}
                    >
                      {deleting ? "Deleting.." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default withPermissions(Features, ["admin"]);
