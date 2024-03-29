/** @type {import('next').NextConfig} */
const environment = process.env.NODE_ENV || "development";
let env = {};
if (environment === "production") {
  env = {
    ...env,
    API_URL: "http://localhost:8000",
  };
} else {
  env = {
    ...env,
    API_URL: "http://localhost:8000",
  };
}
const nextConfig = {
  env,
  reactStrictMode: true,
};

export default nextConfig;
