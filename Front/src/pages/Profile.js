import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";
import Layout from "@/components/layout/Layout";
import api from "@/lib/api";
import AuthRequired from "@/components/auth/AuthRequired";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import profile from "@/public/images/profile2.png";
import sun from "@/public/images/sun-fog.png";
import convert from "@/public/images/convert-card.png";
import edit from "@/public/images/edit-2.png";
import styles from "./Profile.module.css";

function Profile() {
  const { authorized, checking } = useAuthGuard();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (!authorized) {
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await api.get("/user/profile");
        setUser(res.data);
        console.log("✅ اطلاعات کاربر:", res.data);
      } catch (err) {
        console.error("❌ خطا در دریافت پروفایل:", err);
        setError("دریافت اطلاعات با خطا مواجه شد.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [authorized]);

  const handleEditClick = (section) => {
    setEditSection(section);
    setFormErrors({});
    setFormData({ ...user });
  };

  const handleCancel = () => {
    setEditSection(null);
    setFormErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validators = useMemo(
    () => ({
      account: () => {
        const errors = {};
        if (!formData.email) {
          errors.email = "وارد کردن ایمیل الزامی است";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
        ) {
          errors.email = "فرمت ایمیل صحیح نیست";
        }
        return errors;
      },
      personal: () => {
        const errors = {};
        if (!formData.fullName || formData.fullName.trim().length < 3) {
          errors.fullName = "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد";
        }
        if (formData.fullName && !/^[آ-یa-zA-Z\s]+$/.test(formData.fullName.trim())) {
          errors.fullName = "از حروف فارسی یا لاتین استفاده کنید";
        }
        if (!/^\d{10}$/.test(formData.nationalId || "")) {
          errors.nationalId = "کد ملی باید ۱۰ رقم باشد";
        }
        if (!formData.gender) {
          errors.gender = "انتخاب جنسیت الزامی است";
        }
        if (formData.birthDate && !/^\d{4}\/\d{2}\/\d{2}$/.test(formData.birthDate)) {
          errors.birthDate = "تاریخ تولد معتبر نیست";
        }
        return errors;
      },
      bank: () => {
        const errors = {};
        const sheba = (formData.sheba || "").replace(/\s+/g, "").toUpperCase();
        const cardNumber = (formData.cardNumber || "").replace(/\s+/g, "");
        const accountNumber = (formData.accountNumber || "").replace(/\s+/g, "");

        if (!sheba || !( /^IR\d{24}$/.test(sheba) || /^\d{24}$/.test(sheba) )) {
          errors.sheba = "شماره شبا باید ۲۴ رقم و در صورت تمایل با پیشوند IR باشد";
        }
        if (!/^\d{16}$/.test(cardNumber)) {
          errors.cardNumber = "شماره کارت باید ۱۶ رقم باشد";
        }
        if (!/^\d{10,20}$/.test(accountNumber)) {
          errors.accountNumber = "شماره حساب باید حداقل ۱۰ و حداکثر ۲۰ رقم باشد";
        }
        return errors;
      },
    }),
    [formData]
  );

  const handleSave = async () => {
    if (!editSection) return;

    const validation = validators[editSection]?.() || {};
    if (Object.keys(validation).length) {
      setFormErrors(validation);
      toast.error("لطفاً خطاهای مشخص‌شده را برطرف کنید ❌");
      return;
    }

    const payload = { ...formData };
    if (editSection === "account" && payload.email) {
      payload.email = payload.email.trim();
    }
    if (editSection === "personal") {
      if (payload.fullName) payload.fullName = payload.fullName.trim();
      if (payload.birthDate) payload.birthDate = payload.birthDate.trim();
    }
    if (editSection === "bank") {
      payload.sheba = (payload.sheba || "").replace(/\s+/g, "").toUpperCase();
      payload.cardNumber = (payload.cardNumber || "").replace(/\s+/g, "");
      payload.accountNumber = (payload.accountNumber || "").replace(/\s+/g, "");
    }

    try {
      const res = await api.put("/user/profile", payload);
      setUser(res.data.user || payload);
      setFormData(res.data.user || payload);
      setEditSection(null);
      setFormErrors({});
      toast.success("تغییرات با موفقیت ذخیره شد ✅");
    } catch (err) {
      console.error("❌ خطا در بروزرسانی:", err);
      toast.error(err.response?.data?.message || "بروزرسانی با خطا مواجه شد ❌");
    }
  };

  if (checking) return <p className={styles.loading}>در حال بررسی حساب...</p>;
  if (!authorized) return <AuthRequired />;

  if (loading) return <p className={styles.loading}>در حال بارگذاری...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p>اطلاعاتی یافت نشد!</p>;

  return (
    <div className={styles.container}>
      <div className={styles.rightContainer}>
        <div className={`${styles.right} ${styles.active}`}>
          <Image src={profile} alt="Profile" width={20} height={20} />
          <p>پروفایل</p>
        </div>
        <div className={styles.right}>
          <Link className={styles.right} href="/MyTours">
            <Image src={sun} alt="sun" width={20} height={20} />
            <p>تورهای من</p>
          </Link>
        </div>
        <div className={styles.right}>
          <Link className={styles.right} href="/MyTransactions">
            <Image src={convert} alt="convert" width={20} height={20} />
            <p>تراکنش‌ها</p>
          </Link>
        </div>
      </div>

      <div className={styles.leftContainer}>
        <div className={styles.topContainer}>
          <div className={styles.topTitle}>اطلاعات حساب کاربری</div>

          {editSection === "account" ? (
            <div className={styles.editForm}>
              <input
                className={styles.emailEdit}
                type="email"
                name="email"
                placeholder="آدرس ایمیل"
                value={formData.email || ""}
                onChange={handleChange}
              />
              {formErrors.email && (
                <span className={styles.errorText}>{formErrors.email}</span>
              )}
              <div className={styles.btnRow}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  انصراف
                </button>
                <button className={styles.saveBtn} onClick={handleSave}>
                  تایید
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.topText}>
              <div className={styles.number}>
                <p>شماره موبایل</p>
                <p className={styles.color}>{user.mobile || "---"}</p>
              </div>
              <div className={styles.email}>
                <p>ایمیل</p>
                <p className={styles.color}>{user.email || "---"}</p>
              </div>
              <div
                className={styles.add}
                onClick={() => handleEditClick("account")}
              >
                <Image src={edit} alt="edit" width={20} height={20} />
                <p>{user.email ? "ویرایش" : "افزودن"}</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.middleContainer}>
          <div className={styles.middleTitle}>
            <p className={styles.topTitle}>اطلاعات شخصی</p>
            {editSection !== "personal" && (
              <div
                className={styles.add}
                onClick={() => handleEditClick("personal")}
              >
                <Image src={edit} alt="edit" width={20} height={20} />
                <p>ویرایش اطلاعات</p>
              </div>
            )}
          </div>

          {editSection === "personal" ? (
            <div className={styles.editForm}>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="نام و نام خانوادگی"
                    value={formData.fullName || ""}
                    onChange={handleChange}
                  />
                  {formErrors.fullName && (
                    <span className={styles.errorText}>{formErrors.fullName}</span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="nationalId"
                    placeholder="کد ملی"
                    value={formData.nationalId || ""}
                    onChange={handleChange}
                  />
                  {formErrors.nationalId && (
                    <span className={styles.errorText}>{formErrors.nationalId}</span>
                  )}
                </div>
                <DatePicker
                  className={styles.dateEdit}
                  placeholder="تاریخ تولد"
                  calendar={persian}
                  locale={persian_fa}
                  value={formData.birthDate || ""}
                  onChange={(date) => {
                    const formattedDate = date?.format("YYYY/MM/DD") || "";
                    setFormData({ ...formData, birthDate: formattedDate });
                  }}
                  inputClass={styles.dateInput}
                />
                {formErrors.birthDate && (
                  <span className={styles.errorText}>{formErrors.birthDate}</span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <select
                    className={styles.select}
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                  >
                    <option value="">جنسیت</option>
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                  </select>
                  {formErrors.gender && (
                    <span className={styles.errorText}>{formErrors.gender}</span>
                  )}
                </div>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  انصراف
                </button>
                <button className={styles.saveBtn} onClick={handleSave}>
                  تایید
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.middleTop}>
              <div className={styles.first}>
                <div className={styles.name}>
                  <p>نام و نام خانوادگی</p>
                  <p className={styles.color}>{user.fullName || "---"}</p>
                </div>
                <div className={styles.code}>
                  <p>کد ملی</p>
                  <p className={styles.color}>{user.nationalId || "---"}</p>
                </div>
              </div>
              <div className={styles.second}>
                <div className={styles.sex}>
                  <p>جنسیت</p>
                  <p className={styles.color}>
                    {user.gender === "male"
                      ? "مرد"
                      : user.gender === "female"
                      ? "زن"
                      : "---"}
                  </p>
                </div>
                <div className={styles.birth}>
                  <p>تاریخ تولد</p>
                  <p className={styles.color}>{user.birthDate || "---"}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.middleContainer}>
          <div className={styles.middleTitle}>
            <p className={styles.topTitle}>اطلاعات حساب بانکی</p>
            {editSection !== "bank" && (
              <div
                className={styles.add}
                onClick={() => handleEditClick("bank")}
              >
                <Image src={edit} alt="edit" width={20} height={20} />
                <p>ویرایش اطلاعات</p>
              </div>
            )}
          </div>

          {editSection === "bank" ? (
            <div>
              <div className={styles.bandEdit}>
                <div className={styles.inputGroup}>
                  <input
                    className={styles.bankEdit}
                    type="text"
                    name="sheba"
                    placeholder="شماره شبا"
                    value={formData.sheba || ""}
                    onChange={handleChange}
                  />
                  {formErrors.sheba && (
                    <span className={styles.errorText}>{formErrors.sheba}</span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <input
                    className={styles.bankEdit}
                    type="text"
                    name="cardNumber"
                    placeholder="شماره کارت"
                    value={formData.cardNumber || ""}
                    onChange={handleChange}
                  />
                  {formErrors.cardNumber && (
                    <span className={styles.errorText}>{formErrors.cardNumber}</span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <input
                    className={styles.bankEdit}
                    type="text"
                    name="accountNumber"
                    placeholder="شماره حساب"
                    value={formData.accountNumber || ""}
                    onChange={handleChange}
                  />
                  {formErrors.accountNumber && (
                    <span className={styles.errorText}>{formErrors.accountNumber}</span>
                  )}
                </div>
              </div>
              <div className={styles.btnRowBank}>
                <button className={styles.cancelBtn} onClick={handleCancel}>
                  انصراف
                </button>
                <button className={styles.saveBtn} onClick={handleSave}>
                  تایید
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.middleTop}>
              <div className={styles.first}>
                <div className={styles.name}>
                  <p>شماره شبا</p>
                  <p className={styles.color}>{user.sheba || "---"}</p>
                </div>
                <div className={styles.cardCode}>
                  <p>شماره کارت</p>
                  <p className={styles.color}>{user.cardNumber || "---"}</p>
                </div>
              </div>
              <div className={styles.second}>
                <div className={styles.sex}>
                  <p>شماره حساب</p>
                  <p className={styles.color}>{user.accountNumber || "---"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

Profile.getLayout = function getLayout(page) {
  return <Layout contentVariant="profile">{page}</Layout>;
};
