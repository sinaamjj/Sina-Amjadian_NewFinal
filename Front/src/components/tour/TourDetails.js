import Link from "next/link";
import Image from "next/image";

import {
  calculateDuration,
  formatJalali,
  formatJalaliNumeric,
  formatPrice,
} from "@/lib/date";
import Bus from "@/public/images/bus.png";
import Calender from "@/public/images/calendar.png";
import Medal from "@/public/images/medal-star.png";
import Routing from "@/public/images/routing-2.png";
import Security from "@/public/images/security.png";
import User from "@/public/images/user-tick.png";
import Map from "@/public/images/map.png";

import styles from "./TourDetails.module.css";

const FALLBACK_IMAGE = "/images/R2.jpg";

function TourDetails({ tour }) {
  const duration = calculateDuration(tour?.startDate, tour?.endDate);
  const startDate = formatJalali(tour?.startDate);
  const endDate = formatJalali(tour?.endDate);
  const startNumeric = formatJalaliNumeric(tour?.startDate);
  const endNumeric = formatJalaliNumeric(tour?.endDate);
  const origin = tour?.origin?.name || "مبدا نامشخص";
  const destination = tour?.destination?.name || "مقصد نامشخص";
  const price = formatPrice(tour?.price);
  const availableSeats = typeof tour?.availableSeats === "number" ? tour.availableSeats : null;
  const insuranceText = tour?.insurance ? "دارای بیمه" : "بدون بیمه";
  const options = Array.isArray(tour?.options) ? tour.options : [];
  const imageSrc = tour?.image || FALLBACK_IMAGE;

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {/* IMAGE */}
        <div className={styles.image}>
          <Image
            src={imageSrc}
            alt={tour?.title || "تور"}
            width={397}
            height={265}
            className={styles.image}
          />
        </div>

        {/* TEXT */}
        <div className={styles.topText}>
          <div className={styles.title}>
            <h1>{tour?.title || "بدون عنوان"}</h1>
            <p>
              {duration.days !== "-" && duration.nights !== "-"
                ? `${duration.days} روز و ${duration.nights} شب`
                : "مدت زمان نامشخص"}
            </p>
          </div>
          <div className={styles.info}>
            <div className={styles.infoText}>
              <Image src={User} alt="user" />
              <p>تورلیدر از مبدا {origin}</p>
            </div>
            <div className={styles.infoText}>
              <Image src={Map} alt="Map" />
              <p>
                {origin} تا {destination}
              </p>
            </div>
            <div className={styles.infoText}>
              <Image src={Medal} alt="Medal" />
              <p>{options[0] || "تجربه‌ای متفاوت"}</p>
            </div>
          </div>
          <div className={styles.price}>
            <p>
              <span>{price}</span>
              {price !== "---" && <span className={styles.currency}> تومان</span>}
            </p>
            <Link href={`/reserve/${tour?.id}`}>
              <button className={styles.button}>رزرو و خرید</button>
            </Link>
          </div>
          {options.length > 1 && (
            <ul className={styles.options}>
              {options.slice(1).map((option) => (
                <li key={option}>{option}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* BOTTOM */}
      <div className={styles.bottomIcons}>
        <div className={`${styles.bottomContainer} ${styles.hidden}`}>
          <div className={styles.bottomItem}>
            <Image src={Routing} alt="Routing" />
            <p>مبدا</p>
          </div>
          <span>{origin}</span>
        </div>

        <div className={`${styles.bottomContainer} ${styles.hidden}`}>
          <div className={styles.bottomItem}>
            <Image src={Calender} alt="Calender" />
            <p>تاریخ رفت</p>
          </div>
          <span>{startDate}</span>
          <small>{startNumeric}</small>
        </div>

        <div className={`${styles.bottomContainer} ${styles.hidden}`}>
          <div className={styles.bottomItem}>
            <Image src={Calender} alt="Calender" />
            <p>تاریخ برگشت</p>
          </div>
          <span>{endDate}</span>
          <small>{endNumeric}</small>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.bottomItem}>
            <Image src={Bus} alt="Bus" />
            <p>حمل و نقل</p>
          </div>
          <span>{tour?.fleetVehicle || "اعلام خواهد شد"}</span>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.bottomItem}>
            <Image src={Routing} alt="Route" />
            <p>ظرفیت</p>
          </div>
          <span>
            ظرفیت {tour?.capacity || "-"} نفر - {availableSeats ?? "---"} صندلی باقی‌مانده
          </span>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.bottomItem}>
            <Image src={Security} alt="Security" />
            <p>بیمه</p>
          </div>
          <span>{insuranceText}</span>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;
