import axios from "axios";
import TourDetails from "../../components/tour/TourDetails";

function TourPage({ tour }) {
  return <TourDetails tour={tour} />;
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await axios.get(`http://localhost:6500/tour/${id}`);
    return {
      props: { tour: res.data },
    };
  } catch (error) {
    console.error("❌ خطا در دریافت اطلاعات تور:", error.message);
    return { notFound: true };
  }
}

export default TourPage;
