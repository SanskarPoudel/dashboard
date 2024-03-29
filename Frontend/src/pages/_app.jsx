import "@/styles/globals.css";
import { UserInfoProvider } from "../../contexts/userInfo";

export default function App({ Component, pageProps }) {
  return (
    <>
      <UserInfoProvider>
        <Component {...pageProps} />;
      </UserInfoProvider>
    </>
  );
}
