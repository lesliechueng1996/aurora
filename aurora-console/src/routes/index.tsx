import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import Menus from './Menus';
import Dashboard from './Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'menus',
        element: <Menus />,
      },
    ],
  },
]);

export default router;
