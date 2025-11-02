import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import Image from "next/image";
import api from "../utils/api";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { toast } from "react-toastify";
import profile from "../public/images/profile2.png";
import sun from "../public/images/sun-fog.png";
import convert from "../public/images/convert-card.png";
import edit from "../public/images/edit-2.png";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
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
  }, []);

  const handleEditClick = (section) => {
    setEditSection(section);
    setFormData(user);
  };

  const handleCancel = () => {
    setEditSection(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/user/profile", formData);
      setUser(res.data.user || formData);
      setEditSection(null);
      toast.success("تغییرات با موفقیت ذخیره شد ✅");
    } catch (err) {
      console.error("❌ خطا در بروزرسانی:", err);
      toast.error("بروزرسانی با خطا مواجه شد ❌");
    }
  };

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
                type="text"
                name="email"
                placeholder="آدرس ایمیل"
                value={formData.email || ""}
                onChange={handleChange}
              />
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
                <input
                  type="text"
                  name="fullName"
                  placeholder="نام و نام خانوادگی"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="nationalId"
                  placeholder="کد ملی"
                  value={formData.nationalId || ""}
                  onChange={handleChange}
                />
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
              </div>

              <div className={styles.row}>
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
                <input
                  className={styles.bankEdit}
                  type="text"
                  name="sheba"
                  placeholder="شماره شبا"
                  value={formData.sheba || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.bankEdit}
                  type="text"
                  name="cardNumber"
                  placeholder="شماره کارت"
                  value={formData.cardNumber || ""}
                  onChange={handleChange}
                />
                <input
                  className={styles.bankEdit}
                  type="text"
                  name="accountNumber"
                  placeholder="شماره حساب"
                  value={formData.accountNumber || ""}
                  onChange={handleChange}
                />
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
