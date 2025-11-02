import styles from "./Header.module.css";
import Image from "next/image";
import Title from "../../public/images/Title_design__1_.png";

function Header() {
  return (
    <>
      <Image src={Title} alt="Title" className={styles.img} />
      <h1 className={styles.title}>
        <span className={styles.span}>تورینو</span> برگزار کننده بهترین تور های
        داخلی و خارجی
      </h1>
    </>
  );
}

export default Header;
