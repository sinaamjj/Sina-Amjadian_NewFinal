import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./SearchBox.module.css";
import Location from "../../public/images/location.png";
import Global from "../../public/images/global-search.png";
import Calendar from "../../public/images/calendar.png";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import "moment/locale/fa";
moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

function SearchBox() {
  const [showOriginList, setShowOriginList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await fetch("/api/cities");
        if (!res.ok) throw new Error("خطا در دریافت داده‌ها");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
        setCities(["تهران", "سنندج", "تبریز", "شیراز"]);
      }
    }
    fetchCities();
  }, []);

  const formik = useFormik({
    initialValues: {
      origin: "",
      destination: "",
      date: "",
    },
    validationSchema: Yup.object({
      origin: Yup.string().required("مبدا الزامی است"),
      destination: Yup.string().required("مقصد الزامی است"),
      date: Yup.string().required("تاریخ الزامی است"),
    }),
    onSubmit: (values) => {
      console.log("✅ داده‌های فرم:", values);
      alert(
        `جستجو: ${values.origin} → ${values.destination} در تاریخ ${values.date}`
      );
    },
  });

  const handleDateChange = (value) => {
    setSelectedDate(value);
    const formatted = moment(value).format("jYYYY/jMM/jDD");
    formik.setFieldValue("date", formatted);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.searchField}`)) {
        setShowOriginList(false);
        setShowDestinationList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <form className={styles.searchBox} onSubmit={formik.handleSubmit}>
      <div className={styles.container}>
        <button type="submit" className={styles.searchBtn}>
          جستجو
        </button>

        <div className={styles.searchField}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            isGregorian={false}
            timePicker={false}
            placeholder="تاریخ"
            inputFormat="jYYYY/jMM/jDD"
            className={styles.searchInput}
          />
          <Image src={Calendar} alt="Calender" />
        </div>

        <div
          className={`${styles.searchField} ${styles.middle}`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            name="destination"
            placeholder="مقصد"
            value={formik.values.destination}
            onFocus={() => {
              setShowDestinationList(true);
              setShowOriginList(false);
            }}
            onChange={formik.handleChange}
            className={styles.searchInput}
            autoComplete="off"
          />
          <Image src={Global} alt="Global" />

          {showDestinationList && cities.length > 0 && (
            <ul className={styles.dropdown}>
              {cities.map((city) => (
                <li
                  key={city}
                  onClick={() => {
                    formik.setFieldValue("destination", city);
                    setShowDestinationList(false);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className={styles.searchField}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            name="origin"
            placeholder="مبدا"
            value={formik.values.origin}
            onFocus={() => {
              setShowOriginList(true);
              setShowDestinationList(false);
            }}
            onChange={formik.handleChange}
            className={styles.searchInput}
            autoComplete="off"
          />
          <Image src={Location} alt="Location" />

          {showOriginList && cities.length > 0 && (
            <ul className={styles.dropdown}>
              {cities.map((city) => (
                <li
                  key={city}
                  onClick={() => {
                    formik.setFieldValue("origin", city);
                    setShowOriginList(false);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </form>
  );
}

export default SearchBox;
