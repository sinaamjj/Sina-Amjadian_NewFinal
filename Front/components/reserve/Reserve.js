import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import api from "../../utils/api";
import styles from "./Reserve.module.css";
import Calendar from "../../public/images/calendar.png";
import Profile from "../../public/images/profile3.png";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import "moment/locale/fa";
import Login from "../auth/Login";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

function ReserveSection({ tour }) {
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");

  const handleDateChange = (value) => {
    setBirthDate(value);
  };

  const handlePurchase = async () => {
    if (
      !fullName ||
      fullName.length < 4 ||
      !/^[آ-یa-zA-Z\s]+$/.test(fullName)
    ) {
      toast.error(
        "نام و نام خانوادگی باید حداقل ۴ حرف و فقط شامل حروف باشد ❌"
      );
      return;
    }

    if (!/^\d{10}$/.test(nationalId)) {
      toast.error("کد ملی باید دقیقاً ۱۰ رقم باشد ❌");
      return;
    }

    if (!tour?.id) {
      toast.error("شناسه تور یافت نشد ❌");
      return;
    }

    const toEnglishDigits = (str) =>
      str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

    const formattedDate = birthDate
      ? toEnglishDigits(birthDate.format("jYYYY/jMM/jDD"))
      : "";

    const orderData = {
      fullName,
      nationalCode: nationalId,
      gender,
      birthDate: formattedDate,
    };

    setLoading(true);

    try {
      await api.put(`/basket/${tour.id}`);
      console.log("✅ تور به سبد خرید اضافه شد");

      const res = await api.post("/order", orderData);
      console.log("✅ سفارش با موفقیت ثبت شد:", res.data);

      toast.success("تور با موفقیت ثبت شد ✅");
      setTimeout(() => router.push("/MyTours"), 1500);
    } catch (err) {
      console.error("❌ خطا در ثبت تور:", err.response?.data || err);
      toast.error(err.response?.data?.message || "ثبت تور با خطا مواجه شد ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* RIGHT */}
      <div className={styles.rightContainer}>
        <h2 className={styles.title}>
          <Image src={Profile} className={styles.icon} width={30} height={30} />
          مشخصات مسافر
        </h2>

        <div className={styles.formGrid}>
          <input
            type="text"
            className={styles.dateInput}
            placeholder="نام و نام خانوادگی"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            className={styles.dateInput}
            placeholder="کد ملی"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
          <div className={styles.dateInput}>
            <DatePicker
              value={birthDate}
              onChange={handleDateChange}
              isGregorian={false}
              timePicker={false}
              placeholder="تاریخ تولد"
              inputFormat="jYYYY/jMM/jDD"
            />
            <Image src={Calendar} alt="Calendar" width={20} height={20} />
          </div>

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={styles.width}
          >
            <option value="">جنسیت</option>
            <option value="male">مرد</option>
            <option value="female">زن</option>
          </select>
        </div>
      </div>

      {/* LEFT */}
      <div className={styles.leftContainer}>
        {tour ? (
          <>
            <div className={styles.leftText}>
              <h1>{tour.title}</h1>
              <p>۵ روز و ۴ شب</p>
            </div>
            <div className={styles.priceBox}>
              <p>قیمت نهایی</p>
              <span>{tour.price?.toLocaleString("fa-IR")} تومان</span>
            </div>

            <button
              className={styles.reserveBtn}
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? "در حال ثبت..." : "ثبت و خرید نهایی"}
            </button>
          </>
        ) : (
          <p className={styles.loading}>در حال بارگذاری اطلاعات...</p>
        )}
      </div>
    </div>
  );
}

export default ReserveSection;
