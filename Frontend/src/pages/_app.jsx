import "@/styles/globals.css";
import { UserInfoProvider } from "../../contexts/userInfo";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <UserInfoProvider>
        <Component {...pageProps} />;
      </UserInfoProvider>
    </>
  );
}
