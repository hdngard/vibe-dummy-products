import { LoginPage } from "@/pages/LoginPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { useAuth } from "@/shared/auth/AuthContext";
import { GuestRoute } from "@/shared/routes/GuestRoute";
import { ProtectedRoute } from "@/shared/routes/ProtectedRoute";
import { Navigate, Route, Routes } from "react-router-dom";

const RootRedirect = () => {
  const { token } = useAuth();
  return <Navigate to={token ? "/products" : "/login"} replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
