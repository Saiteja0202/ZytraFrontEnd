import { Routes, Route } from 'react-router-dom';
import LandingPage from './Components/Others/LandingPage';
import AdminRegistration from './Components/Admin/AdminRegistration';
import UserRegistration from './Components/User/UserRegistration';
import AdminLogin from './Components/Admin/AdminLogin';
import UserLogin from './Components/User/UserLogin';
import AdminDashboard from './Components/Admin/AdminDashboard';
import AdminProfile from './Components/Admin/AdminProfile';
import AdminCategory from './Components/Admin/AdminCategory';
import AdminSubCategory from './Components/Admin/AdminSubCategory';
import AdminBrand from './Components/Admin/AdminBrand';
import AdminDiscount from './Components/Admin/AdminDiscount';
import AdminSeller from './Components/Admin/AdminSeller';
import AdminInventory from './Components/Admin/AdminInventory';
import AdminReports from './Components/Admin/AdminReports';
import AdminProducts from './Components/Admin/AdminProducts';
import AdminAllUsers from './Components/Admin/AdminAllUsers';
import UserDashboard from './Components/User/UserDashboard';
import UserCart from './Components/User/UserCart';
import UserOrders from './Components/User/UserOrders';
import UserProfile from './Components/User/UserProfile';
import AuthGuard from './Components/API/AuthGuard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="admin-registration" element={<AdminRegistration />} />
      <Route path="user-registration" element={<UserRegistration />} />
      <Route path="admin-login" element={<AdminLogin />} />
      <Route path="user-login" element={<UserLogin />} /> 

      <Route path="/admin-dashboard"element={<AuthGuard><AdminDashboard /></AuthGuard>}>
        <Route index element={<AdminProfile />} />
        <Route path="admin-profile" element={<AdminProfile />} />
        <Route path="admin-category" element={<AdminCategory />} />
        <Route path="admin-subcategory" element={<AdminSubCategory />} />
        <Route path="admin-brand" element={<AdminBrand />} />
        <Route path="admin-discount" element={<AdminDiscount />} />
        <Route path="admin-seller" element={<AdminSeller />} />
        <Route path="admin-products" element={<AdminProducts />} />
        <Route path="admin-inventory" element={<AdminInventory />} /> 
        <Route path="admin-reports" element={<AdminReports />} />
        <Route path="admin-all-users" element={<AdminAllUsers />} />
      </Route>

      <Route path="/user-dashboard" element={<AuthGuard><UserDashboard /></AuthGuard>}>
      <Route index element={<UserDashboard />} />
      <Route path="user-cart" element={<UserCart />} />
      <Route path="user-orders" element={<UserOrders />} />
      <Route path="user-profile" element={<UserProfile />} />
      </Route>

    </Routes>
  );
};


export default AppRoutes;
