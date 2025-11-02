import { useEffect, useState } from "react";
import api from "../utils/api";
import styles from "./MyTours.module.css";
import Image from "next/image";
import Link from "next/link";
import jalaali from "jalaali-js";
import profile from "../public/images/profile2.png";
import sun from "../public/images/sun-fog.png";
import convert from "../public/images/convert-card.png";
import Sun from "../public/images/sun.png";
import AirPlane from "../public/images/airplane.png";

function MyTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toJalali = (dateStr) => {
    if (!dateStr) return "---";
    try {
      const date = new Date(dateStr);
      const j = jalaali.toJalaali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      return `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd
        .toString()
        .padStart(2, "0")}`;
    } catch {
      return "---";
    }
  };

  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await api.get("/user/tours");
        const orders = res.data;

        const detailedTours = await Promise.all(
          orders.map(async (order, index) => {
            const tourId = order.tourId || order.tour?.id;

            if (!tourId && !order.tour) {
              console.warn("⚠️ سفارش بدون اطلاعات تور:", order);
              return { ...order, tour: null };
            }

            if (order.tour && !order.tourId) {
              return { ...order, tour: order.tour };
            }

            try {
              const tourRes = await api.get(`/tour/${tourId}`);
              return { ...order, tour: tourRes.data };
            } catch (err) {
              console.error("❌ خطا در دریافت تور:", err.message);
              return { ...order, tour: null };
            }
          })
        );

        console.log("✅ داده نهایی تورها:", detailedTours);
        setTours(detailedTours);
      } catch (err) {
        console.error("❌ خطا در دریافت تورها:", err);
        setError("دریافت اطلاعات با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    fetchTours();
  }, []);

  if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (tours.length === 0)
    return <p className={styles.empty}>هیچ توری یافت نشد.</p>;

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={styles.rightContainer}>
        <div className={styles.right}>
          <Link className={styles.right} href="/Profile">
            <Image src={profile} alt="Profile" width={20} height={20} />
            <p>پروفایل</p>
          </Link>
        </div>
        <div className={`${styles.right} ${styles.active}`}>
          <div className={`${styles.right} ${styles.active}`}>
            <Image src={sun} alt="sun" width={20} height={20} />
            <p>تورهای من</p>
          </div>
        </div>
        <div className={styles.right}>
          <Link className={styles.right} href="/MyTransactions">
            <Image src={convert} alt="convert" width={20} height={20} />
            <p>تراکنش‌ها</p>
          </Link>
        </div>
      </div>

      <div className={styles.leftContainer}>
        <div className={styles.tourList}>
          {tours.map((tour, index) => {
            const tourData = tour.tour || tour;

            return (
              <div
                key={`${tour.id || tour.tourId || "noId"}-${index}`}
                className={styles.tourCard}
              >
                <div className={styles.header}>
                  <div className={styles.transport}>
                    <Image src={Sun} alt="sun" width={20} height={20} />
                    <p className={styles.tourTitle}>
                      {tourData.title || tourData.name || "نامشخص"}
                    </p>
                  </div>

                  <div className={styles.transport}>
                    <Image
                      src={AirPlane}
                      alt="airplane"
                      width={20}
                      height={20}
                    />
                    {tourData.type === "plane" ? (
                      <span>سفر با هواپیما</span>
                    ) : tourData.type === "ship" ? (
                      <span>سفر با کشتی</span>
                    ) : (
                      <span>سفر با اتوبوس</span>
                    )}
                  </div>

                  <div>
                    <p
                      className={`${styles.status} ${
                        tour.status === "done" ? styles.done : styles.progress
                      }`}
                    >
                      {tour.status === "done"
                        ? "به اتمام رسیده"
                        : "در حال برگزاری"}
                    </p>
                  </div>
                </div>

                <div className={styles.route}>
                  <strong>
                    {tourData.origin?.name || "مبدا نامشخص"} به{" "}
                    {tourData.destination?.name || "مقصد نامشخص"}
                  </strong>
                  <div className={styles.date}>
                    <p className={styles.go}>
                      {" "}
                      تاریخ رفت {toJalali(tourData.startDate)}{" "}
                    </p>
                    <p> تاریخ برگشت {toJalali(tourData.endDate)}</p>
                  </div>
                </div>

                <div className={styles.footer}>
                  <p className={styles.footerItem}>
                    <span className={styles.tour}>شماره تور </span>
                    <span className={styles.tourNumber}>
                      {tourData.code || "102095404"}
                    </span>
                  </p>
                  <p className={styles.footerItem}>
                    <span className={styles.tour}>مبلغ پرداخت شده </span>
                    <span className={styles.tourNumber}>
                      {tourData.price
                        ? tourData.price.toLocaleString("fa-IR")
                        : "---"}{" "}
                    </span>
                    تومان
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MyTours;
