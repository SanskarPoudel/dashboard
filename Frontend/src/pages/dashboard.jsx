import React from "react";
import Layout from "../components/layout";
import withPermissions from "../../HOC/PermissionCheck";

const dashboard = () => {
  return <Layout></Layout>;
};

export default withPermissions(dashboard, []);
