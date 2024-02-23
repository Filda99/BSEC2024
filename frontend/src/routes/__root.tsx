import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { SWRConfig } from 'swr';
import { Fetcher } from '@/api/api';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const ROUTES = [
  {
    path: '/',
    name: 'Dashboard',
  },
  {
    path: '/income',
    name: 'Income',
  },
  {
    path: '/expenses',
    name: 'Expenses',
  },
  {
    path: '/investments',
    name: 'Investments',
  },
];

const App = () => {
  return (
    <SWRConfig value={{ fetcher: Fetcher }}>
      <div className="px-20 py-6 h-full">
        <nav className="border-b border-black flex items-center justify-between text-lg">
          <ul className="flex space-x-2 mb-2">
            {ROUTES.map(({ name, path }) => (
              <li key={name}>
                <Link className="px-2 py-1.5 rounded-md" activeProps={{ className: 'bg-black text-white' }} to={path}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/profile">
            <UserCircleIcon className="w-8 h-8" />
          </Link>
        </nav>
        <Outlet />
      </div>
    </SWRConfig>
  );
};

export const Route = createRootRoute({
  component: App,
});
