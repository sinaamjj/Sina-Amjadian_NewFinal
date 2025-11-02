import axios from "axios";

import AuthRequired from "@/components/auth/AuthRequired";
import Reserve from "@/components/reserve/Reserve";
import { useAuthGuard } from "@/hooks/useAuthGuard";

function ReservePage({ tour }) {
  const { authorized, checking } = useAuthGuard();

  if (checking)
    return (
      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        در حال بررسی حساب...
      </p>
    );

  if (!authorized) return <AuthRequired />;

  return <Reserve tour={tour} />;
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
