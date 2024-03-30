import "@/styles/globals.css";
import { UserInfoProvider } from "../../contexts/userInfo";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
