import dynamic from "next/dynamic";

import Layout from "@/components/layout/Layout";
import "react-toastify/dist/ReactToastify.css";

const DynamicToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

function MyApp({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <>
      {getLayout(<Component {...pageProps} />)}
      <DynamicToastContainer />
    </>
  );
}

export default MyApp;
