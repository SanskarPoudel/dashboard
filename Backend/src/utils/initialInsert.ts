import { Feature, Role, RoleFeature, User } from "../models";
export const insertInitialData = async () => {
  try {
    const feature: any = await Feature.create({
      feature_name: "admin",
      active: true,
    });

    const feature2: any = await Feature.create({
      feature_name: "reviewleads",
      active: true,
    });

    const feature3: any = await Feature.create({
      feature_name: "addfaqs",
      active: true,
    });

    const role: any = await Role.create({
      role_name: "Administrator",
    });

    const role2: any = await Role.create({
      role_name: "Moderator level 1",
    });

    await RoleFeature.create({
      role_id: role2.id,
      feature_id: feature2.id,
      enabled: true,
      access: "write",
    });

    await RoleFeature.create({
      role_id: role2.id,
      feature_id: feature3.id,
      enabled: true,
      access: "write",
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

    await User.create({
      first_name: "testUser",
      last_name: "lastNametest",
      email: "test@gmail.com",
      password: "$2b$10$/NrpmYiqsTRTIajTzoF5UumbE/MdpZBlE61z2s1geSGs4okZk1jGa", // "test123"
      role_id: role2.id,
    });

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
