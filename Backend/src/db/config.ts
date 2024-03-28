import { Sequelize } from "sequelize";

const dbUsername = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDatabase = process.env.DB_DATABASE as string;

const sequelize = new Sequelize(dbDatabase, dbUsername, dbPassword, {
  host: "localhost",
  dialect: "mysql",
});

// sequelize.sync().then(() => {
//   console.log("Database and tables created!");
// });

export default sequelize;
