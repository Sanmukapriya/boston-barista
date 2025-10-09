import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./containers/Homepage/Homepage";
import Menu from "./containers/Menu/Menu";
import AboutPage from "./containers/About page/AboutPage";
import Gallery from "./containers/Gallery/Gallery";
import ContactPage from "./containers/Contact Page/ContactPage";
import Checkout from "./containers/Checkout/Checkout";
import ScrollToTop from "./components/Scroll To Top/ScrollToTop";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
