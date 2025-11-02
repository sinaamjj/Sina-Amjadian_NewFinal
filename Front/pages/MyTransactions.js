import { useEffect, useState } from "react";
import api from "../utils/api";
import styles from "./MyTransactions.module.css";
import Image from "next/image";
import Link from "next/link";
import profile from "../public/images/profile2.png";
import sun from "../public/images/sun-fog.png";
import convert from "../public/images/convert-card.png";
import jalaali from "jalaali-js";

function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toJalaliDateTime = (dateStr) => {
    if (!dateStr) return "---";
    try {
      const date = new Date(dateStr);
      const j = jalaali.toJalaali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      const time = date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${j.jy}/${j.jm.toString().padStart(2, "0")}/${j.jd
        .toString()
        .padStart(2, "0")} - ${time}`;
    } catch {
      return "---";
    }
  };

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await api.get("/user/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("❌ خطا در دریافت تراکنش‌ها:", err);
        setError("دریافت اطلاعات با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (transactions.length === 0)
    return <p className={styles.empty}>هیچ تراکنشی یافت نشد.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.rightContainer}>
        <div className={styles.right}>
          <Link className={styles.right} href="/Profile">
            <Image src={profile} alt="Profile" width={20} height={20} />
            <p className={styles.mright}>پروفایل</p>
          </Link>
        </div>
        <div className={styles.right}>
          <Link className={styles.right} href="/MyTours">
            <Image src={sun} alt="sun" width={20} height={20} />
            <p className={styles.mright}>تورهای من</p>
          </Link>
        </div>
        <div className={`${styles.right} ${styles.active}`}>
          <Image src={convert} alt="convert" width={20} height={20} />
          <p className={styles.mright}>تراکنش‌ها</p>
        </div>
      </div>

      <div className={styles.main}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>تاریخ و ساعت</th>
              <th>مبلغ (تومان)</th>
              <th className={styles.hidden}>نوع تراکنش</th>
              <th>شماره سفارش</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {transactions.map((t, index) => (
              <tr key={t.id || index}>
                <td>{toJalaliDateTime(t.createdAt)}</td>
                <td>{t.amount ? t.amount.toLocaleString("fa-IR") : "---"}</td>
                <td className={styles.hidden}>
                  {t.type === "Purchase"
                    ? "ثبت نام در تور گردشگری"
                    : t.type || "نامشخص"}
                </td>
                <td>
                  <span>{t.orderCode}</span>
                  <span>{index + 1205400}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyTransactions;
