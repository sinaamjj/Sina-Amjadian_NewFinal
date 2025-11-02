import Image from "next/image";
import Link from "next/link";
import styles from "./404.module.css";
import errorTv from "../public/images/Error TV.png";

function notFound() {
  return (
    <>
      <div className={styles.container}>
        {/* LEFT */}
        <div>
          <Image className={styles.img} src={errorTv} alt="errorTv" />
        </div>
        {/* RIGHT */}
        <div className={styles.text}>
          <h1>!صفحه مورد نظر یافت نشد</h1>
          <Link href="/">
            <button>بازگشت به صفحه اصلی</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default notFound;
