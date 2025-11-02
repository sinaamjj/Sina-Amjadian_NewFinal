import styles from "./TourDetails.module.css";
import Link from "next/link";
import Image from "next/image";
import jalaali from "jalaali-js";
import User from "../../public/images/user-tick.png";
import Map from "../../public/images/map.png";
import Medal from "../../public/images/medal-star.png";
import Routing from "../../public/images/routing-2.png";
import Calender from "../../public/images/calendar.png";
import Bus from "../../public/images/bus.png";
import Security from "../../public/images/security.png";

function toJalali(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const { jy, jm, jd } = jalaali.toJalaali(date);
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  return `${jd} ${months[jm - 1]} ${jy}`;
}

function TourDetails({ tour }) {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        {/* IMAGE */}
        <div className={styles.image}>
          <Image
            src={tour.image}
            alt={tour.title}
            width={397}
            height={265}
            className={styles.image}
          />
        </div>

        {/* TEXT */}
        <div className={styles.topText}>
          <div className={styles.title}>
            <h1>{tour.title}</h1>
            <p>۵ روز و ۴ شب</p>
          </div>
          <div className={styles.info}>
            <div className={styles.infoText}>
              <Image src={User} alt="user" />
              <p>تورلیدر از مبدا</p>
            </div>
            <div className={styles.infoText}>
              <Image src={Map} alt="Map" />
              <p>برنامه سفر</p>
            </div>
            <div className={styles.infoText}>
              <Image src={Medal} alt="Medal" />
              <p>تضمین کیفیت</p>
            </div>
          </div>
          <div className={styles.price}>
            <p>
              <span>{tour.price.toLocaleString("fa-IR")}</span> تومان
            </p>
            <Link href={`/reserve/${tour.id}`}>
              <button className={styles.button}>رزرو و خرید</button>
            </Link>
          </div>
        </div>
      </div>
      {/* BOTTOM */}
      <div className={styles.bottomIcons}>
        <div className={`${styles.bottomContainer} ${styles.hidden}`}>
          <div className={styles.bottomItem}>
            <Image src={Routing} alt="Routing" />
            <p>مبدا</p>
          </div>
          <span>{tour.origin.name}</span>
        </div>

        <div className={`${styles.bottomContainer} ${styles.hidden}`}>
          <div className={styles.bottomItem}>
            <Image src={Calender} alt="Calender" />
            <p>تاریخ رفت</p>
          </div>
          <span>{toJalali(tour.startDate)}</span>
        </div>

        <div className={`${styles.bottomContainer} ${styles.hidden}`}>
          <div className={styles.bottomItem}>
            <Image src={Calender} alt="Calender" />
            <p>تاریخ برگشت</p>
          </div>
          <span>{toJalali(tour.endDate)}</span>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.bottomItem}>
            <Image src={Bus} alt="Bus" />
            <p>حمل و نقل</p>
          </div>
          <span>{tour.fleetVehicle}</span>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.bottomItem}>
            <Image src={Routing} alt="Route" />
            <p>ظرفیت</p>
          </div>
          <span>حداکثر {tour.capacity} نفر</span>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.bottomItem}>
            <Image src={Security} alt="Security" />
            <p>بیمه</p>
          </div>
          <span>۵۰ هزار دیناری</span>
        </div>
      </div>
    </div>
  );
}

export default TourDetails;
