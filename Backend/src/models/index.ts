import Feature from "./feature";
import RoleFeature from "./roleFeature";
import User from "./user";
import Role from "./role";

Role.hasMany(User, {
  foreignKey: "role_id",
});
User.belongsTo(Role, {
  foreignKey: "role_id",
});

Role.belongsToMany(Feature, {
  through: RoleFeature,
  foreignKey: "role_id",
  otherKey: "feature_id",
});
Feature.belongsToMany(Role, {
  through: RoleFeature,
  foreignKey: "feature_id",
  otherKey: "role_id",
});

export { Feature, RoleFeature, User, Role };
