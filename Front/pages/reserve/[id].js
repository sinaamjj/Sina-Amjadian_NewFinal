import axios from "axios";
import Reserve from "../../components/reserve/Reserve";

function ReservePage({ tour }) {
  return (
    <>
      <Reserve tour={tour} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await axios.get(`http://localhost:6500/tour/${id}`);
    return {
      props: { tour: res.data },
    };
  } catch (error) {
    console.error("❌ خطا در دریافت تور:", error.message);
    return {
      props: { tour: null },
    };
  }
}

export default ReservePage;
