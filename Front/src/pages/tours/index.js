import Head from "next/head";
import axios from "axios";

import SearchBox from "@/components/home/SearchBox";
import ToursList from "@/components/home/ToursList";

function ToursPage({ tours, filters }) {
  return (
    <>
      <Head>
        <title>تورهای موجود | تورینو</title>
        <meta
          name="description"
          content="جستجوی تورهای تورینو براساس مبدا، مقصد و تاریخ"
        />
      </Head>
      <SearchBox initialFilters={filters} />
      <main>
        <ToursList tours={tours} title="نتایج جستجو" />
      </main>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const params = {};
  const filters = {
    originId: query.originId || "",
    destinationId: query.destinationId || "",
    startDate: query.startDate || "",
  };

  if (filters.originId) params.originId = filters.originId;
  if (filters.destinationId) params.destinationId = filters.destinationId;
  if (filters.startDate) params.startDate = filters.startDate;

  try {
    const response = await axios.get("http://localhost:6500/tour", { params });
    return {
      props: {
        tours: Array.isArray(response.data) ? response.data : [],
        filters,
      },
    };
  } catch (error) {
    console.error("❌ خطا در دریافت لیست تورها:", error.message);
    return {
      props: {
        tours: [],
        filters,
      },
    };
  }
}

export default ToursPage;
