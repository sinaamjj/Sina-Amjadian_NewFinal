import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import AuthRequired from "@/components/auth/AuthRequired";
import Layout from "@/components/layout/Layout";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { formatJalaliDateTime, formatPrice } from "@/lib/date";
import api from "@/lib/api";
import convert from "@/public/images/convert-card.png";
import profile from "@/public/images/profile2.png";
import sun from "@/public/images/sun-fog.png";
import styles from "./MyTransactions.module.css";

function MyTransactions() {
  const { authorized, checking } = useAuthGuard();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authorized) {
      setLoading(false);
      return;
    }

    async function fetchTransactions() {
      try {
        const res = await api.get("/user/transactions");
        setTransactions(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (err) {
        console.error("❌ خطا در دریافت تراکنش‌ها:", err);
        setError("دریافت اطلاعات با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [authorized]);

  if (checking) return <p className={styles.loading}>در حال بررسی حساب...</p>;
  if (!authorized) return <AuthRequired />;

  if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!transactions.length)
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
            {transactions.map((transaction, index) => (
              <tr key={transaction.id || index}>
                <td>{formatJalaliDateTime(transaction.createdAt)}</td>
                <td>{formatPrice(transaction.amount)}</td>
                <td className={styles.hidden}>
                  {transaction.type === "Purchase"
                    ? "ثبت نام در تور گردشگری"
                    : transaction.type || "نامشخص"}
                </td>
                <td>
                  <span>{transaction.orderCode || "---"}</span>
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

MyTransactions.getLayout = function getLayout(page) {
  return <Layout contentVariant="profile">{page}</Layout>;
};
