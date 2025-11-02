import TourCard from "./TourCard";
import styles from "./ToursList.module.css";

function ToursList({ tours = [], title = "همه تورها", showCount = true }) {
  if (!tours.length) {
    return <p className={styles.empty}>هیچ توری مطابق جستجوی شما یافت نشد.</p>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{title}</h2>
        {showCount && <span className={styles.count}>{tours.length} تور</span>}
      </div>
      <div className={styles.grid}>
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}

export default ToursList;
