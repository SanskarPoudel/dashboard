import React from "react";
import Layout from "../components/layout";
import withPermissions from "../HOC/PermissionCheck";

const Reviewleads = () => {
  return <Layout></Layout>;
};

export default withPermissions(Reviewleads, ["reviewleads"]);
