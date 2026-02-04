import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import LottieAnimation from './components/LottieAnimation.jsx';
const RootLayout = lazy(() => import('./layouts/RootLayout.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Register = lazy(() => import('./pages/Register.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const MovieDetails = lazy(() => import('./pages/MovieDetails.jsx'));
const EditMovie = lazy(() => import('./pages/EditMovie.jsx'));
const ErrorPage = lazy(() => import('./pages/ErrorPage.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LottieAnimation />}>
        <RootLayout />
      </Suspense>
    ),

    errorElement: (
      <Suspense fallback={<LottieAnimation />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LottieAnimation status="page" />}>
            <Home />
          </Suspense>
        ),
      },

      {
        path: '/login',
        element: (
          <Suspense fallback={<LottieAnimation status="page" />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '/register',
        element: (
          <Suspense fallback={<LottieAnimation status="page" />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: '/movie/:id',
        element: (
          <Suspense fallback={<LottieAnimation status="page" />}>
            <MovieDetails />
          </Suspense>
        ),
      },
      {
        element: <ProtectedRoute />, // لا نضع path هنا ليطبق على كل الأبناء
        children: [
          {
            path: '/dashboard',
            element: (
              <Suspense fallback={<LottieAnimation status="page" />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: '/movie/edit/:id',
            element: (
              <Suspense fallback={<LottieAnimation status="page" />}>
                <EditMovie />
              </Suspense>
            ),
          },
        ],
      },

      {
        path: '*',
        element: (
          <Suspense fallback={<LottieAnimation status="page" />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
