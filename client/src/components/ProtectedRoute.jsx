import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, loading, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // انتظر حتى ينتهي التحقق من حالة المستخدم
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. منع الدخول إذا لم يكن هناك Token (ليس مسجلاً)
  if (!token && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. منع الدخول إذا لم يكن Admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // إذا نجحت الشروط، اعرض المحتوى
  return <Outlet />;
};

export default ProtectedRoute;