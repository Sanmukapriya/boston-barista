import { useEffect } from "react";
import styles from "./Homepage.module.css";
import "../../index.css";
import Header from "../../components/Header/Header";
import Herobanner from "../../components/Herobanner/Herobanner";
import Drinks from "../../components/Drinks/Drinks";
import Croissants from "../../components/Croissants/Croissants";
import BuyForHome from "../../components/Buy For Home/BuyForHome";
import About from "../../components/About/About";
import BaristaParty from "../../components/Barista Paty/BaristaParty";
import Footer from "../../components/Footer/Footer";

const Homepage = () => {
  useEffect(() => {
    const hiddenSections = document.querySelectorAll(`.${styles.hidden}`);
    
    if (!hiddenSections) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    hiddenSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={styles.background}>
        <div className={`${styles.hidden} container`}>
          <Header />
          <Herobanner />
        </div>
      </div>

      <div className={styles.drinksBg}>
        <div className={`${styles.hidden} container`}>
          <Drinks />
        </div>
      </div>

      <div className={styles.croissantBg}>
        <div className={`${styles.hidden} container`}>
          <Croissants />
        </div>
      </div>

      <div className={styles.buyForHome}>
        <div className={`${styles.hidden} container`}>
          <BuyForHome />
        </div>
      </div>

      <div className={styles.aboutBg}>
        <div className={`${styles.hidden} container`}>
          <About />
        </div>
      </div>

      <div className={styles.partyBg}>
        <div className={`${styles.hidden} container`}>
          <BaristaParty />
        </div>
      </div>

      <div className={`${styles.hidden} container`}>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;