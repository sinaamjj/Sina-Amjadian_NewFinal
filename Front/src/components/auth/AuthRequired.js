import Link from "next/link";

import styles from "./AuthRequired.module.css";

function AuthRequired({ message = "لطفاً ابتدا وارد شوید" }) {
  return (
    <div className={styles.container}>
      <h2>{message}</h2>
      <p>برای مشاهده این صفحه ابتدا وارد حساب کاربری خود شوید.</p>
      <Link href="/" className={styles.link}>
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}

export default AuthRequired;
