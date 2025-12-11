import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RepairServicesPage from './pages/RepairServicesPage';
import RepairServiceDetailPage from './pages/RepairServiceDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import NotFoundPage from './pages/NotFoundPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';

// Components
import FloatingPCBuilderButton from './components/pcBuilder/FloatingPCBuilderButton';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <FloatingPCBuilderButton />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductListingPage />} />
              <Route path="products/:productId" element={<ProductDetailPage />} />
              <Route path="categories/:categoryId" element={<ProductListingPage />} />
              <Route path="services" element={<RepairServicesPage />} />
              <Route path="services/:serviceId" element={<RepairServiceDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="account/*" element={<AccountPage />} />
              <Route path="add-products" element={<AddProductPage />} />
              <Route path="edit-product/:productId" element={<EditProductPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;