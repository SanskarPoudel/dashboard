import React from "react";
import Layout from "../components/layout";
import withPermissions from "../HOC/PermissionCheck";

const AddFaqs = () => {
  return <Layout></Layout>;
};

export default withPermissions(AddFaqs, ["addfaqs"]);
