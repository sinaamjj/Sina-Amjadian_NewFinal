import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import "moment/locale/fa";

import styles from "./SearchBox.module.css";
import Calendar from "@/public/images/calendar.png";
import Global from "@/public/images/global-search.png";
import Location from "@/public/images/location.png";
import api from "@/lib/api";

moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

const FALLBACK_CITIES = [
  { id: "1", name: "تهران" },
  { id: "2", name: "سنندج" },
  { id: "3", name: "تبریز" },
  { id: "4", name: "شیراز" },
];

function SearchBox({ initialFilters = {} }) {
  const router = useRouter();

  const [showOriginList, setShowOriginList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);
  const [origins, setOrigins] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function fetchCities() {
      try {
        const response = await api.get("/tour");
        if (ignore) return;

        const tours = Array.isArray(response.data) ? response.data : [];

        const originMap = new Map();
        const destinationMap = new Map();

        tours.forEach((tour) => {
          if (tour?.origin?.id) {
            originMap.set(tour.origin.id, tour.origin);
          }
          if (tour?.destination?.id) {
            destinationMap.set(tour.destination.id, tour.destination);
          }
        });

        setOrigins(originMap.size ? Array.from(originMap.values()) : FALLBACK_CITIES);
        setDestinations(
          destinationMap.size ? Array.from(destinationMap.values()) : FALLBACK_CITIES
        );
      } catch (error) {
        console.error("❌ خطا در گرفتن شهرها:", error.message);
        if (!ignore) {
          setOrigins(FALLBACK_CITIES);
          setDestinations(FALLBACK_CITIES);
        }
      }
    }

    fetchCities();
    return () => {
      ignore = true;
    };
  }, []);

  const initialValues = useMemo(
    () => ({
      origin: "",
      destination: "",
      originId: initialFilters.originId || "",
      destinationId: initialFilters.destinationId || "",
      date: "",
      dateIso: initialFilters.startDate || "",
    }),
    [initialFilters]
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      origin: Yup.string().required("مبدا الزامی است"),
      destination: Yup.string().required("مقصد الزامی است"),
      date: Yup.string().required("تاریخ الزامی است"),
    }),
    onSubmit: (values, helpers) => {
      const originData =
        origins.find((item) => item.id === values.originId) ||
        origins.find((item) => item.name === values.origin.trim());
      if (!originData) {
        helpers.setFieldError("origin", "لطفاً یک مبدا معتبر انتخاب کنید");
        toast.error("لطفاً یک مبدا معتبر انتخاب کنید ❌");
        return;
      }

      const destinationData =
        destinations.find((item) => item.id === values.destinationId) ||
        destinations.find((item) => item.name === values.destination.trim());
      if (!destinationData) {
        helpers.setFieldError("destination", "لطفاً یک مقصد معتبر انتخاب کنید");
        toast.error("لطفاً یک مقصد معتبر انتخاب کنید ❌");
        return;
      }

      if (!values.dateIso) {
        helpers.setFieldError("date", "انتخاب تاریخ الزامی است");
        toast.error("انتخاب تاریخ الزامی است ❌");
        return;
      }

      const query = {
        originId: originData.id,
        destinationId: destinationData.id,
        startDate: values.dateIso,
      };

      router.push({ pathname: "/tours", query });
    },
  });

  useEffect(() => {
    if (!initialFilters.startDate) return;

    const momentDate = moment(initialFilters.startDate, moment.ISO_8601, true);
    const fallbackDate = moment(initialFilters.startDate, "YYYY-MM-DD", true);
    const validDate = momentDate.isValid() ? momentDate : fallbackDate;

    if (validDate.isValid()) {
      setSelectedDate(validDate);
      formik.setFieldValue("date", validDate.format("jYYYY/jMM/jDD"));
      formik.setFieldValue("dateIso", validDate.format("YYYY-MM-DD"));
    }
  }, [initialFilters.startDate]);

  useEffect(() => {
    if (!initialFilters.originId && !initialFilters.destinationId) return;

    const originData = origins.find((item) => item.id === initialFilters.originId);
    if (originData) {
      formik.setFieldValue("origin", originData.name);
      formik.setFieldValue("originId", originData.id);
    }

    const destinationData = destinations.find(
      (item) => item.id === initialFilters.destinationId
    );
    if (destinationData) {
      formik.setFieldValue("destination", destinationData.name);
      formik.setFieldValue("destinationId", destinationData.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origins, destinations, initialFilters.originId, initialFilters.destinationId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.searchField}`)) {
        setShowOriginList(false);
        setShowDestinationList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const renderError = (field) =>
    formik.touched[field] && formik.errors[field] ? (
      <span className={styles.errorText}>{formik.errors[field]}</span>
    ) : null;

  const handleDateChange = (value) => {
    if (!value) {
      setSelectedDate(null);
      formik.setFieldValue("date", "");
      formik.setFieldValue("dateIso", "");
      return;
    }

    setSelectedDate(value);
    const jalali = moment(value).format("jYYYY/jMM/jDD");
    const gregorian = moment(value).format("YYYY-MM-DD");
    formik.setFieldValue("date", jalali);
    formik.setFieldValue("dateIso", gregorian);
  };

  return (
    <form
      className={styles.searchBox}
      onSubmit={(event) => {
        event.preventDefault();
        formik.validateForm().then((errors) => {
          if (Object.keys(errors).length) {
            toast.error("لطفاً فیلدها را با دقت کامل کنید ❌");
            formik.setTouched({
              origin: true,
              destination: true,
              date: true,
            });
            return;
          }
          formik.handleSubmit();
        });
      }}
    >
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
          {renderError("date")}
        </div>

        <div
          className={`${styles.searchField} ${styles.middle}`}
          onClick={(event) => event.stopPropagation()}
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
            onChange={(event) => {
              formik.handleChange(event);
              formik.setFieldValue("destinationId", "");
            }}
            className={styles.searchInput}
            autoComplete="off"
            onBlur={formik.handleBlur}
          />
          <Image src={Global} alt="Global" />

          {showDestinationList && destinations.length > 0 && (
            <ul className={styles.dropdown}>
              {destinations.map((city) => (
                <li
                  key={city.id}
                  onClick={() => {
                    formik.setFieldValue("destination", city.name);
                    formik.setFieldValue("destinationId", city.id);
                    setShowDestinationList(false);
                  }}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
          {renderError("destination")}
        </div>

        <div
          className={styles.searchField}
          onClick={(event) => event.stopPropagation()}
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
            onChange={(event) => {
              formik.handleChange(event);
              formik.setFieldValue("originId", "");
            }}
            className={styles.searchInput}
            autoComplete="off"
            onBlur={formik.handleBlur}
          />
          <Image src={Location} alt="Location" />

          {showOriginList && origins.length > 0 && (
            <ul className={styles.dropdown}>
              {origins.map((city) => (
                <li
                  key={city.id}
                  onClick={() => {
                    formik.setFieldValue("origin", city.name);
                    formik.setFieldValue("originId", city.id);
                    setShowOriginList(false);
                  }}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
          {renderError("origin")}
        </div>
      </div>
    </form>
  );
}

export default SearchBox;
