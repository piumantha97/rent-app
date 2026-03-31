import { Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/login';
import { Icons } from './pages/icons';
import { NotFound } from './pages/not-found';
import { Agreements } from './pages/orders';
import { Records } from './pages/records';
import { Reports } from './pages/reports';
import MonthlyRentPayment from './pages/monthlyRentPayment';
import { Theme } from './pages/theme';
import AddPlace from './pages/addPlace';
import AddBusinessForm from './pages/addBusiness';
import AddAgreementForm from './pages/addAgreements';
import { PaymentSummary } from './pages/paymentSummary';
import { UnpaidRentReport } from './pages/unpaidRentReport';
import { MonthlyIncomeReport } from './pages/monthlyIncomeReport';
import { BusinessIncomeReport } from './pages/businessIncomeReport';

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: 'dashboard',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Reports />
      },
      {
        path: 'payment-summary',
        element: <PaymentSummary />
      },
      {
        path: 'orders',
        element: <Agreements />
      },
      {
        path: 'records',
        element: <Records />
      },
      {
        path: 'add-agreement',
        element: <AddAgreementForm />
      },
      {
        path: 'monthly-rent-payments',
        element: <MonthlyRentPayment />
      },
      {
        path: 'add-place',
        element: <AddPlace />
      },
      {
        path: 'add-business',
        element: <AddBusinessForm />
      },
      {
        path: 'theme',
        element: <Theme />
      },
      {
        path: 'icons',
        element: <Icons />
      },
      {
        path: 'monthly-income',
        element: <MonthlyIncomeReport />
      },
      {
        path: 'unpaid-rent',
        element: <UnpaidRentReport />
      },
      {
        path: 'business-income',
        element: <BusinessIncomeReport />
      }
    ]
  },
  {
    path: '404',
    element: <NotFound />
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];