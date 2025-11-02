import Header from "../components/home/Header";
import SearchBox from "../components/home/SearchBox";
import ToursList from "../components/home/ToursList";
import Buy from "../components/Home/Buy";
import WhyTorino from "../components/home/WhyTorino";
import Info from "../components/home/Info";
import axios from "axios";

function HomePage({ tours }) {
  return (
    <div>
      <Header />
      <SearchBox />
      <ToursList tours={tours} />
      <Buy />
      <WhyTorino />
      <Info />
    </div>
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
