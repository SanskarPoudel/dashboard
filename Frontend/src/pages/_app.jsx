import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserInfoProvider } from "../contexts/userInfo";

export default function App({ Component, pageProps }) {
  return (
    <>
      <UserInfoProvider>
        <ToastContainer />
        <Component {...pageProps} />;
      </UserInfoProvider>
    </>
  );
}
