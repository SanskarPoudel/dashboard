import { Feature, Role, RoleFeature, User } from "../models";
export const insertInitialData = async () => {
  try {
    const feature: any = await Feature.create({
      feature_name: "admin",
      active: true,
    });

    const role: any = await Role.create({
      role_name: "Administrator",
    });

    await RoleFeature.create({
      role_id: role.id,
      feature_id: feature.id,
      enabled: true,
      access: "write",
    });

    await User.create({
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: "$2b$10$Qt7t0VZC74FCWi0..sAMVO5DUAXNpzSD2bpWY8HsM1tXprqTde.sW", // "admin_password"
      role_id: role.id,
    });

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
