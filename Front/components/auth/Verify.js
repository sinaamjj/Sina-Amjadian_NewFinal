import { useEffect, useRef, useState } from "react";
import OtpInput from "react18-input-otp";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Verify.module.css";

function Verify({ phone, onClose, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [canResend, setCanResend] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    if (!phone) return;
    try {
      const res = await axios.post("http://localhost:6500/auth/send-otp", {
        mobile: phone,
      });
      console.log("📩 پاسخ ارسال مجدد:", res.data);
      toast.success("کد جدید ارسال شد ✅");
      setOtp("");
      setTimeLeft(90);
      setCanResend(false);
    } catch (err) {
      console.error("❌ خطا در ارسال مجدد:", err);
      toast.error("ارسال مجدد با خطا مواجه شد ❌");
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) return;

    try {
      const res = await axios.post("http://localhost:6500/auth/check-otp", {
        mobile: phone,
        code: otp,
      });

      console.log("✅ پاسخ سرور:", res.data);

      const accessToken = res.data?.accessToken;
      const refreshToken = res.data?.refreshToken;

      if (!accessToken) {
        toast.error("❌ توکن دریافتی معتبر نیست!");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken || "");
      localStorage.setItem("mobile", phone);

      toast.success("ورود با موفقیت انجام شد ✅");

      if (typeof onSuccess === "function") {
        onSuccess(phone);
      }

      onClose?.();
    } catch (err) {
      console.error("❌ خطا در تأیید کد:", err);
      toast.error("کد وارد شده اشتباه است ❌");
      setOtp("");
    }
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <div className={styles.backDrop}>
      <div className={styles.container} ref={modalRef}>
        <button className={styles.closeBtn} type="button" onClick={onClose}>
          ×
        </button>

        <h1>کد تایید را وارد کنید</h1>
        <p>کد تایید به شماره {phone} ارسال شد</p>

        <OtpInput
          value={otp}
          onChange={(val) => {
            const onlyNums = val.replace(/[^0-9]/g, "");
            setOtp(onlyNums);
          }}
          numInputs={6}
          inputStyle={styles.otpInput}
          containerStyle={styles.otpContainer}
          isInputNum
        />

        {canResend ? (
          <p onClick={handleResend} className={styles.resendActive}>
            ارسال مجدد کد
          </p>
        ) : (
          <p className={styles.timer}>
            تا ارسال مجدد کد: {formatTime(timeLeft)}
          </p>
        )}

        <button
          className={styles.btn}
          disabled={otp.length < 6}
          onClick={handleVerify}
        >
          ورود به تورینو
        </button>
      </div>
    </div>
  );
}

export default Verify;
