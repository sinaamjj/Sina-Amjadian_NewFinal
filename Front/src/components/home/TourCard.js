import Image from "next/image";
import Link from "next/link";

import { calculateDuration, formatJalaliRange, formatPrice } from "@/lib/date";

import styles from "./TourCard.module.css";

const FALLBACK_IMAGE = "/images/R1.jpg";

function TourCard({ tour }) {
  const duration = calculateDuration(tour?.startDate, tour?.endDate);
  const route = `${tour?.origin?.name || "مبدا نامشخص"} به ${
    tour?.destination?.name || "مقصد نامشخص"
  }`;
  const range = formatJalaliRange(tour?.startDate, tour?.endDate);
  const transport = tour?.fleetVehicle ? `- ${tour.fleetVehicle}` : "";
  const description = `${route} | ${range} ${transport}`;
  const price = formatPrice(tour?.price);
  const imageSrc = tour?.image || FALLBACK_IMAGE;

  return (
    <div className={styles.card}>
      <Image
        src={imageSrc}
        alt={tour?.title || "تور"}
        width={300}
        height={200}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{tour?.title || "بدون عنوان"}</h3>
        <p>
          {duration.days !== "-" && duration.nights !== "-"
            ? `${duration.days} روز و ${duration.nights} شب`
            : "مدت زمان نامشخص"}
        </p>
        <p className={styles.meta}>{description}</p>
        <div className={styles.bottomCard}>
          <Link href={`/tours/${tour?.id}`}> 
            <button className={styles.button}>رزرو</button>
          </Link>
          <p>
            <span>{price}</span>
            {price !== "---" && <span className={styles.currency}> تومان</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TourCard;
