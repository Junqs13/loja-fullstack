import React, { Suspense, useEffect } from 'react'; // Importação combinada e correta
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // 1. Importar o Container
import 'react-toastify/dist/ReactToastify.css'; // 1. Importar o CSS
import { Container } from 'react-bootstrap';
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';


// Componentes
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Loader from './components/Loader';

// Telas
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import DashboardScreen from './screens/DashboardScreen';

const App = () => {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    // Aplica o atributo data-bs-theme na tag <html>
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <main className="py-3">
        <Container>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/contact" element={<ContactScreen />} />
              <Route path="/privacy" element={<PrivacyPolicyScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search/:keyword" element={<HomeScreen />} />
              <Route path="/" element={<HomeScreen />} />

              {/* Rotas Privadas para Utilizadores Logados */}
              <Route path="" element={<PrivateRoute />}>
                <Route path="/shipping" element={<ShippingScreen />} />
                <Route path="/payment" element={<PaymentScreen />} />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/order/:id" element={<OrderScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Route>

              {/* Rotas Privadas de Administrador */}
              <Route path="" element={<AdminRoute />}>
                <Route path="/admin/dashboard" element={<DashboardScreen />} />
                <Route path="/admin/userlist" element={<UserListScreen />} />
                <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
                <Route path="/admin/productlist" element={<ProductListScreen />} />
                <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                <Route path="/admin/orderlist" element={<OrderListScreen />} />
              </Route>
            </Routes>
          </Suspense>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;