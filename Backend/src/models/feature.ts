import { DataTypes } from "sequelize";
import sequelize from "../db/config";

const Feature = sequelize.define(
  "Feature",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    feature_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "features",
  }
);

export default Feature;
