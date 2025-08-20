// src/App.tsx
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Taxes from "./pages/Taxes";
import Colors from "./pages/Colors";
import Brands from "./pages/Brands";
import Categories from "./pages/Category";
import Attributes from "./pages/Attributs";
import Clients from "./pages/Clients";
import Fournisseurs from "./pages/Suppliers";
import Produits from "./pages/Produit";

const ProtectedRoute = ({ children }: { children: any }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>; // Ou un spinner de chargement
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/taxes"
        element={
          <ProtectedRoute>
            <Taxes />
          </ProtectedRoute>
        }
      />
       <Route
        path="/settings/colors"
        element={
          <ProtectedRoute>
            <Colors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/brands"
        element={
          <ProtectedRoute>
            <Brands />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/attributes"
        element={
          <ProtectedRoute>
            <Attributes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <Fournisseurs />
          </ProtectedRoute>
        }
      />
       <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Produits />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const root = createRoot(document.body);
root.render(
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </HashRouter>
);