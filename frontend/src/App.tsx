import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import Contact from './components/Contact';
import About from './components/About';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

function MainLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <section id="products" className="py-16 bg-base-100">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-primary mb-4">
                    Notre Catalogue de Bois
                  </h2>
                  <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                    Découvrez notre sélection de bois de chauffage premium, soigneusement sélectionné
                    pour vous offrir le meilleur rapport qualité-prix et performance énergétique.
                  </p>
                </div>
                <ProductGrid />
              </div>
            </section>
          </>
        } />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
