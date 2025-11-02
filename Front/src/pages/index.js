import Head from "next/head";
import axios from "axios";

import Buy from "@/components/home/Buy";
import Header from "@/components/home/Header";
import Info from "@/components/home/Info";
import SearchBox from "@/components/home/SearchBox";
import ToursList from "@/components/home/ToursList";
import WhyTorino from "@/components/home/WhyTorino";

function HomePage({ tours }) {
  return (
    <>
      <Head>
        <title>تورینو | رزرو آنلاین تور</title>
        <meta
          name="description"
          content="لیست تازه‌ترین تورهای گردشگری به همراه امکان جستجو براساس مبدا، مقصد و تاریخ"
        />
      </Head>
      <div>
        <Header />
        <SearchBox />
        <ToursList tours={tours} title="تورهای پیشنهادی" />
        <Buy />
        <WhyTorino />
        <Info />
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const res = await axios.get("http://localhost:6500/tour");
    const tours = res.data;

    return {
      props: { tours },
      revalidate: 60,
    };
  } catch (error) {
    console.error("❌ خطا در گرفتن لیست تورها:", error.message);
    return {
      props: { tours: [] },
      revalidate: 60,
    };
  }
}

export default HomePage;
