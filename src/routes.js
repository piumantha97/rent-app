import { Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { Icons } from './pages/icons';
import { NotFound } from './pages/not-found';
import { Agreements } from './pages/orders';
import { Records } from './pages/records';
import { Reports } from './pages/reports';
// import {  AddAgreementForm } from './pages/addAgreements';
import  MonthlyRentPayment  from './pages/monthlyRentPayment';
import { Theme } from './pages/theme';
import AddPlace from './pages/addPlace';
import AddBusinessForm from './pages/addBusiness';
import AddAgreementForm from './pages/addAgreements';
import {PaymentSummary} from './pages/paymentSummary';
import { UnpaidRentReport } from './pages/unpaidRentReport'; 

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" />
  },
  {
    path: 'dashboard',
    element: <Layout />,
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
        element: < AddAgreementForm />
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
        path: '*',
        element: <Navigate to="/404" />
      },
      {
        path: 'unpaid-rent',
        element: <UnpaidRentReport/>
      }
    ]
  },
  {
    path: '404',
    element: <NotFound />
  }
];
