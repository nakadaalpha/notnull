import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTitleSetter() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'NotNull | Page Not Found';

    if (path === '/') title = 'NotNull | Home';
    else if (path.startsWith('/warehouse')) title = 'NotNull | Warehouse';
    else if (path.startsWith('/car/')) title = 'NotNull | Car Details';
    else if (path === '/login') title = 'NotNull | Login';
    else if (path === '/register') title = 'NotNull | Register';
    else if (path === '/profile') title = 'NotNull | My Profile';
    else if (path === '/admin') title = 'NotNull | Dashboard';
    else if (path === '/admin/brands') title = 'NotNull | Manage Brands';
    else if (path === '/admin/cars') title = 'NotNull | Manage Cars';
    else if (path === '/admin/customers') title = 'NotNull | Manage Customers';
    else if (path === '/admin/transactions') title = 'NotNull | Transactions';
    else if (path === '/admin/messages') title = 'NotNull | Messages';

    document.title = title;
  }, [location]);

  return null;
}
