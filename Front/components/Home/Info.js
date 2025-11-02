import styles from "./Info.module.css";
import Image from "next/image";
import Img16 from "../../public/images/Group 16.png";
import Img17 from "../../public/images/Group 17.png";
import Img18 from "../../public/images/Group 18.png";

function Info() {
  return (
    <>
      <div className={styles.border}>
        <div className={styles.container}>
          {/* LEFT */}
          <div className={styles.left}>
            <Image src={Img16} alt="16" />
            <div>
              <h1>بصرفه ترین قیمت</h1>
              <p>بصرفه ترین و ارزان ترین قیمت تور را از ما بخواهید.</p>
            </div>
          </div>
          {/* MIDDLE */}
          <div className={styles.middle}>
            <Image src={Img17} alt="17" />
            <div>
              <h1>پشتیبانی</h1>
              <p>پشتیبانی و همراهی 24 ساعته در تمامی مراحل سفر شما.</p>
            </div>
          </div>
          {/* RIGHT */}
          <div className={styles.right}>
            <Image src={Img18} alt="18" />
            <div>
              <h1>رضایت کاربران</h1>
              <p>رضایت بیش از 10هزار کاربر از تور های ما.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;
