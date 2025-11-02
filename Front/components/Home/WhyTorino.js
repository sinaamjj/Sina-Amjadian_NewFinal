import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import styles from "./WhyTorino.module.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Img1 from "../../public/images/R1.jpg";
import Img2 from "../../public/images/R2.jpg";
import Img3 from "../../public/images/R3.jpg";
import Img4 from "../../public/images/R4.jpg";
import Why from "../../public/images/Why.png";

function WhyTorino() {
  const images = [Img1, Img2, Img3, Img4];

  return (
    <>
      <div className={styles.container}>
        {/* LEFT */}

        <div className={styles.right}>
          <div className={styles.rightTitle}>
            <Image src={Why} alt="Why" className={styles.rightImage} />
            <h1>
              چرا <span className={styles.spanTitle}>تورینو</span> ؟
            </h1>
          </div>
          <div className={styles.rightText}>
            <h2>تور طبیعت گردی و تاریخی</h2>
            <p>
              اگر دوست داشته باشید که یک جاذبه طبیعی را از نزدیک ببینید و در دل
              طبیعت چادر بزنید یا در یک اقامتگاه بوم گردی اتاق بگیرید، باید
              تورهای طبیعت‌گردی را خریداری کنید. اما اگر بخواهید از جاذبه‌های
              گردشگری و آثار تاریخی یک مقصد خاص بازدید کنید، می‌توانید تورهای
              فرهنگی و تاریخی را خریداری کنید.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.left}>
          <Swiper
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={3}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            navigation
            modules={[EffectCoverflow, Pagination, Navigation]}
            className={styles.mySwiper}
          >
            {images.map((src, index) => (
              <SwiperSlide key={index} className={styles.slide}>
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  width={300}
                  height={400}
                  className={styles.image}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default WhyTorino;
