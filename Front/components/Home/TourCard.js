import Image from "next/image";
import Link from "next/link";
import styles from "./TourCard.module.css";

function TourCard({ tour }) {
  return (
    <div className={styles.card}>
      <Image
        src={tour.image}
        alt={tour.title}
        width={300}
        height={200}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3>{tour.title}</h3>
        <p>مهر ماه . 3 روزه - پرواز - هتل 3 س....</p>
        <div className={styles.bottomCard}>
          <Link href={`/tours/${tour.id}`}>
            <button className={styles.button}>رزرو</button>
          </Link>
          <p>
            <span>{tour.price.toLocaleString("fa-IR")}</span> تومان
          </p>
        </div>
      </div>
    </div>
  );
}

export default TourCard;
