import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Login from "../auth/Login";
import Verify from "../auth/Verify";
import Frame from "../../public/images/Frame.png";
import StateAir from "../../public/images/state-airline-f45c55b2 1.png";
import Samandehi from "../../public/images/samandehi-6e2b448a.png";
import Aira from "../../public/images/aira-682b7c43.png";
import Ecunion from "../../public/images/ecunion-35c3c933.png";
import Passenger from "../../public/images/Passenger.png";
import ArrowDown from "../../public/images/arrow-down.png";
import Profile from "../../public/images/profile.png";
import Profile2 from "../../public/images/profile2.png";
import Logout from "../../public/images/logout.png";
import styles from "./Layout.module.css";
import Group from "../../public/images/Group 46.png";
import Sign from "../../public/images/sign in buttom.png";
import Home from "../../public/images/home-2.png";
import Air from "../../public/images/airplane-square.png";
import Volume from "../../public/images/volume-low.png";
import Call from "../../public/images/call2.png";

function Layout({ children }) {
  const [mobile, setMobile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [verifyPhone, setVerifyPhone] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedMobile = localStorage.getItem("mobile");
    if (token && savedMobile) {
      setMobile(savedMobile);
    } else {
      setMobile(null);
    }
  }, [router.asPath]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mobile");
    setMobile(null);
    router.push("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLoginSuccess = (mobileNumber) => {
    setMobile(mobileNumber);
    setVerifyPhone(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const desktop = desktopDropdownRef.current;
      const mobile = mobileDropdownRef.current;

      if (
        (!desktop || !desktop.contains(event.target)) &&
        (!mobile || !mobile.contains(event.target))
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* HEADER */}
      <div className={styles.mobileHeader}>
        <Image
          src={Group}
          alt="Menu"
          className={styles.menuIcon}
          onClick={() => setIsMobileMenuOpen(true)}
        />

        {mobile && (
          <div className={styles.mobileUserBox} onClick={toggleMenu}>
            <Image src={ArrowDown} alt="Arrow" width={16} height={16} />
            <span className={styles.mobileNumber}>{mobile}</span>
            <Image src={Frame} alt="User" width={16} height={16} />
          </div>
        )}

        {!mobile && (
          <Image
            src={Sign}
            alt="Sign In"
            className={styles.signIcon}
            onClick={() => setShowLogin(true)}
          />
        )}

        {mobile && isMenuOpen && (
          <div className={styles.dropdownMenu} ref={desktopDropdownRef}>
            <div className={styles.dropdownHeader}>
              <Image src={Profile2} alt="Profile2" width={20} height={20} />
              <span>{mobile}</span>
            </div>
            <div
              className={styles.dropdownItem}
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/Profile");
              }}
            >
              <div className={styles.dropdownItemContainer}>
                <Image src={Profile} alt="Profile" width={20} height={20} />
                <span>اطلاعات حساب کاربری</span>
              </div>
            </div>
            <hr />
            <div
              className={styles.dropdownItem}
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
            >
              <div className={styles.dropdownItemContainer}>
                <Image src={Logout} alt="Logout" width={20} height={20} />
                <span className={styles.Logout}>خروج از حساب کاربری</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <header className={styles.header}>
        <div className={styles.container}>
          {/* LEFT */}
          <div className={styles.btnContainer}>
            {mobile ? (
              <div className={styles.userBox} ref={mobileDropdownRef}>
                <div onClick={toggleMenu} className={styles.mobileArea}>
                  <Image
                    src={ArrowDown}
                    alt="Arrow Down"
                    width={20}
                    height={20}
                  />
                  <span className={styles.userMobile}>{mobile}</span>
                  <Image src={Frame} alt="Frame" width={20} height={20} />
                </div>

                {isMenuOpen && (
                  <div className={styles.dropdownMenu} ref={mobileDropdownRef}>
                    <div className={styles.dropdownHeader}>
                      <Image
                        src={Profile2}
                        alt="Profile2"
                        width={20}
                        height={20}
                      />
                      <span>{mobile}</span>
                    </div>

                    <div
                      className={styles.dropdownItem}
                      onClick={() => router.push("/Profile")}
                    >
                      <div className={styles.dropdownItemContainer}>
                        <Image
                          src={Profile}
                          alt="Profile"
                          width={20}
                          height={20}
                        />
                        <span>اطلاعات حساب کاربری</span>
                      </div>
                    </div>

                    <hr />

                    <div className={styles.dropdownItem} onClick={handleLogout}>
                      <div className={styles.dropdownItemContainer}>
                        <Image
                          src={Logout}
                          alt="Logout"
                          width={20}
                          height={20}
                        />
                        <span className={styles.Logout}>
                          خروج از حساب کاربری
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className={styles.signup}>ثبت نام</button>
                <div className={styles.linkStyle}>
                  <button
                    className={styles.login}
                    onClick={() => setShowLogin(true)}
                  >
                    ورود
                  </button>
                  <Image
                    className={styles.loginImg}
                    src={Frame}
                    alt="Frame"
                    width={20}
                    height={20}
                  />
                </div>
              </>
            )}
          </div>

          {/* MIDDLE */}
          <div className={styles.navbar}>
            <ul className={styles.ulStyle}>
              <li>تماس با ما</li>
              <li>درباره ما</li>
              <li>خدمات گردشگری</li>
              <Link className={styles.liStyle} href="/">
                <li>صفحه اصلی</li>
              </Link>
            </ul>
          </div>

          {/* RIGHT */}
          <div>
            <Link href="/">
              <img src="/images/Torino (4) 1.png" alt="Torino" />
            </Link>
          </div>
        </div>
      </header>

      {/* CHILDREN */}
      <div
        className={`${styles.children} ${
          router.pathname.startsWith("/tours/") ||
          router.pathname.startsWith("/reserve/")
            ? styles.tourPage
            : router.pathname === "/Profile"
            ? styles.profilePage
            : ""
        }`}
      >
        {children}
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.topFooter}>
          <div className={styles.leftFooter}>
            <div>
              <Link href="/">
                <img src="/images/Torino (4) 1.png" alt="Torino" />
              </Link>
            </div>
            <p>تلفن پشتیبانی : 4758-021</p>
            <div>
              <Image src={Aira} alt="Aria" className={styles.footerIcon} />
              <Image
                src={Samandehi}
                alt="Samandehi"
                className={styles.footerIcon}
              />
              <Image
                src={Ecunion}
                alt="Ecunion"
                className={styles.footerIcon}
              />
              <Image
                src={Passenger}
                alt="Passenger"
                className={styles.footerIcon}
              />
              <Image
                src={StateAir}
                alt="StateAir"
                className={styles.footerIcon}
              />
            </div>
          </div>

          {/* MIDDLE */}
          <div className={styles.middleContainer}>
            <div className={styles.middleFooter}>
              <h2>خدمات مشتریان</h2>
              <ul className={styles.ulFooterStyle}>
                <li>پشتیبانی آنلاین</li>
                <li>راهنمای خرید</li>
                <li>راهنمای استرداد</li>
                <li>پرسش و پاسخ</li>
              </ul>
            </div>
            {/* RIGHT */}
            <div className={styles.rightFooter}>
              <h2>تورینو</h2>
              <ul className={styles.ulFooterStyle}>
                <li>درباره ما</li>
                <li>تماس با ما</li>
                <li>چرا تورینو</li>
                <li>بیمه مسافرتی</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className={styles.bottomFooter}>
          <p>.کلیه حقوق این وب سایت متعلق به تورینو میباشد</p>
        </div>
      </footer>

      {isMobileMenuOpen && (
        <div
          className={styles.mobileMenuOverlay}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              <li>
                <Image src={Home} className={styles.img} />
                <Link href="/">صفحه اصلی</Link>
              </li>
              <li>
                <Image src={Air} className={styles.img} />
                <Link>خدمات گردشگری</Link>
              </li>
              <li>
                <Image src={Volume} className={styles.img} />
                <Link>درباره ما</Link>
              </li>
              <li>
                <Image src={Call} className={styles.img} />
                <Link>تماس با ما</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
      {/* MODALS */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSuccess={(phone) => {
            setShowLogin(false);
            setVerifyPhone(phone);
          }}
        />
      )}

      {verifyPhone && (
        <Verify
          phone={verifyPhone}
          onClose={() => setVerifyPhone(null)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}

export default Layout;
