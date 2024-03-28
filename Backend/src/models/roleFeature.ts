import { DataTypes } from "sequelize";
import sequelize from "../db/config";

const RoleFeature = sequelize.define(
  "RoleFeature",
  {
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
      primaryKey: true,
    },
    feature_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "features",
        key: "id",
      },
      primaryKey: true,
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    access: {
      type: DataTypes.ENUM("none", "read", "write"),
      allowNull: false,
    },
  },
  {
    timestamps: true,

    tableName: "role_features",
  }
);

export default RoleFeature;
