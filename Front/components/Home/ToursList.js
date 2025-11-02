import TourCard from "./TourCard";
import styles from "./ToursList.module.css";

function ToursList({ tours }) {
  if (!tours.length) {
    return <p>هیچ توری موجود نیست</p>;
  }

  return (
    <section className={styles.section}>
      <h2>همه تور ها</h2>
      <div className={styles.grid}>
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  );
}

export default ToursList;
