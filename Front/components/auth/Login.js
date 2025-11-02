import styles from "./Login.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

function Login({ onClose, onSuccess }) {
  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("شماره موبایل الزامی است")
      .test(
        "is-valid-phone",
        "شماره موبایل معتبر نیست",
        (value) => !value || /^09\d{9}$/.test(value)
      ),
  });

  const formik = useFormik({
    initialValues: { phone: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post("http://localhost:6500/auth/send-otp", {
          mobile: values.phone,
        });

        console.log("✅ پاسخ سرور:", res.data);
        toast.success("کد تایید با موفقیت ارسال شد ✅");

        if (typeof onSuccess === "function") {
          onSuccess(values.phone);
        }
      } catch (error) {
        console.error("Error in send-otp:", error);
        toast.error("❌ ارسال کد با خطا مواجه شد!");
      }
    },
  });

  return (
    <div className={styles.backDrop}>
      <form className={styles.container} onSubmit={formik.handleSubmit}>
        <button className={styles.closeBtn} type="button" onClick={onClose}>
          ×
        </button>

        <h1>ورود به تورینو</h1>
        <div className={styles.inputGroup}>
          <p>شماره موبایل خود را وارد کنید</p>
          <input
            type="text"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            placeholder="2032***0912"
          />
        </div>

        {formik.touched.phone && formik.errors.phone && (
          <div className={styles.errorText}>{formik.errors.phone}</div>
        )}

        <button className={styles.btn} type="submit">
          ارسال کد تایید
        </button>
      </form>
    </div>
  );
}

export default Login;
