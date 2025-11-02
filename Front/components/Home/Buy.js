import styles from "./Buy.module.css";
import Image from "next/image";
import Call from "../../public/images/call.png";
import Cartoon from "../../public/images/professional-cartoon.png";

function Buy() {
  return (
    <>
      <div className={styles.container}>
        {/* RIGHT */}
        <div className={styles.rightContainer}>
          <div className={styles.rightImage}>
            <Image src={Cartoon} alt="Cartoon" />
          </div>
          <div className={styles.rightText}>
            <h1>
              خرید تلفنی از <span>تورینو</span>
            </h1>
            <p>به هرکجا که میخواهید!</p>
          </div>
        </div>
        {/* LEFT */}
        <div className={styles.leftContainer}>
          <div className={styles.leftMain}>
            <div className={styles.left}>
              <Image src={Call} alt="Call" />
              <p>021-1840</p>
            </div>
            <button type="submit" className={styles.searchBtn}>
              اطلاعات بیشتر
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Buy;
