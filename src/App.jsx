// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/Scroll To Top/ScrollToTop";
import "./App.css";
import Loader from "./components/Loader/Loader.jsx";
import { Suspense, lazy } from "react";

// Lazy load pages
const Homepage = lazy(() => import("./containers/Homepage/Homepage"));
const Menu = lazy(() => import("./containers/Menu/Menu"));
const AboutPage = lazy(() => import("./containers/About page/AboutPage"));
const Gallery = lazy(() => import("./containers/Gallery/Gallery"));
const ContactPage = lazy(() => import("./containers/Contact Page/ContactPage"));
const Checkout = lazy(() => import("./containers/Checkout/Checkout"));

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
