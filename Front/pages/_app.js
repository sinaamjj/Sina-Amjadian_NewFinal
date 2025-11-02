import dynamic from "next/dynamic";
import Layout from "../components/layout/Layout";
import "react-toastify/dist/ReactToastify.css";

const DynamicToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <DynamicToastContainer />
    </Layout>
  );
}

export default MyApp;
