import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaEdit } from "react-icons/fa";
import withPermissions from "../../HOC/PermissionCheck";

const apiUrl = process.env.API_URL;

const RoleAssignmentModal = ({
  isOpen,
  onClose,
  allRoles,
  assignRoleToUser,
  userId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Assign Role
        </h3>
        <div className="mt-2">
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => assignRoleToUser(userId, e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select a role
            </option>
            {allRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(`${apiUrl}/api/role/all`, {
          withCredentials: true,
        });
        setAllRoles(rolesResponse.data.roles);

        const usersResponse = await axios.get(`${apiUrl}/api/user/all`, {
          withCredentials: true,
        });
        setAllUsers(usersResponse.data.users);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  const assignRole = async (userId, roleId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/user/assignRole`,
        {
          role_id: roleId,
          user_id: userId,
        },
        {
          withCredentials: true,
        }
      );

      setAllUsers((prev) => {
        const final = prev.map((pr) => {
          if (pr.id === userId) {
            return response.data.updatedUser;
          } else {
            return pr;
          }
        });
        return final;
      });

      toast.success("Role Assigned Successfully");
    } catch (err) {
      toast.err(err?.response?.data?.message || "Something went wrong");
    }
  };

  const removeRole = async (userId) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/user/removeRole`,
        {
          user_id: userId,
        },
        {
          withCredentials: true,
        }
      );

      setAllUsers((prev) => {
        const final = prev.map((pr) => {
          if (pr.id === userId) {
            return response.data.updatedUser;
          } else {
            return pr;
          }
        });
        return final;
      });

      toast.success("Role Removed Successfully");
    } catch (err) {}
  };
  const showRoleAssignmentModal = (user) => {
    setSelectedUserId(user.id);
    setModalOpen(true);
  };

  const getRoleNameById = (roleId) => {
    const role = allRoles.find((role) => role.id === roleId);
    return role ? role.role_name : "No Role";
  };

  return (
    <Layout>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg m-4">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          {/* Table Head */}
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                User Name
              </th>
              <th scope="col" className="py-3 px-6">
                Email
              </th>
              <th scope="col" className="py-3 px-6">
                Role
              </th>
              <th scope="col" className="py-3 px-6">
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {allUsers.map((user) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={user.id}
              >
                <td className="py-4 px-6">
                  {user.first_name + " " + user.last_name}
                </td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">{getRoleNameById(user.role_id)}</td>
                <td className="py-4 px-6 flex justify-start items-center gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => showRoleAssignmentModal(user)}
                  >
                    {user.role_id ? "Change" : "Assign"} Role
                  </button>
                  {user.role_id && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => removeRole(user.id)}
                    >
                      Remove Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <RoleAssignmentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          allRoles={allRoles}
          assignRoleToUser={assignRole}
          userId={selectedUserId}
        />
      )}
    </Layout>
  );
};

export default withPermissions(Users, ["admin"]);
