import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useUserInfo } from "../contexts/userInfo";
const apiUrl = process.env.API_URL;

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);

  const router = useRouter();

  const { userDetails } = useUserInfo();

  useEffect(() => {
    if (userDetails) {
      router.push("/dashboard");
    }
  }, [userDetails]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter all fields.");
    }

    try {
      setLoggingIn(true);
      const response = await axios.post(
        `${apiUrl}/api/user/login`,
        {
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Logged in successfully");
      Cookies.set("loggedIn", true, { expires: 1 });
      router.push("/dashboard");
      setEmail("");
      setPassword("");
      setLoggingIn(false);
    } catch (err) {
      setLoggingIn(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      return toast.error("Please enter all fields to continue");
    }

    try {
      setSigningUp(true);
      const response = await axios.post(
        `${apiUrl}/api/user/signup`,
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Signed up successfully");
      Cookies.set("loggedIn", true, { expires: 1 });
      router.push("/dashboard");
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setSigningUp(false);
    } catch (err) {
      setSigningUp(false);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-center mb-4">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <form
            onSubmit={(e) => {
              isLogin ? handleLogin(e) : handleSignUp(e);
            }}
          >
            {!isLogin && (
              <div className="flex gap-3">
                <div className="mb-4">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    value={firstName}
                    type="text"
                    id="firstName"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Your First name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    value={lastName}
                    type="text"
                    id="lastName"
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Your Last name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                value={email}
                type="email"
                id="email"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                value={password}
                type="password"
                id="password"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLogin ? (
                <> {loggingIn ? "Loggin In..." : "Login"} </>
              ) : (
                <> {signingUp ? "Signing Up..." : "SignUp"} </>
              )}
            </button>
          </form>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </>
  );
}
