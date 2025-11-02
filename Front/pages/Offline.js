import Image from "next/image";
import styles from "./Offline.module.css";
import error from "../public/images/Error Lamp Robot.png";

function notFound() {
  return (
    <>
      <div className={styles.container}>
        {/* LEFT */}
        <div>
          <Image className={styles.img} src={error} alt="error" />
        </div>
        {/* RIGHT */}
        <div>
          <h1>!اتصال با سرور برقرار نیست</h1>
          <h2>.لطفا بعدا دوباره امتحان کنید</h2>
        </div>
      </div>
    </>
  );
}

export default notFound;
