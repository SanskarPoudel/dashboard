import React from "react";
import Layout from "../components/layout";
import withPermissions from "../HOC/PermissionCheck";

const Dashboard = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center p-4 md:p-8 mb-20">
          <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 font-extrabold text-7xl md:text-9xl">
            Welcome to <br /> Dashboard
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-600 font-light animate-pulse">
            Your modern workspace
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default withPermissions(Dashboard, []);
