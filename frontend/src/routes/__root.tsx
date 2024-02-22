import { Link, Outlet, createRootRoute } from '@tanstack/react-router';

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
  {
    path: '/profile',
    name: 'Profile',
  },
];

const App = () => {
  return (
    <div className="px-20 py-6">
      <nav className="border-b-2 border-black">
        <ul className="flex space-x-2 mb-2">
          {ROUTES.map(({ name, path }) => (
            <li key={name}>
              <Link className="px-2 py-1.5 rounded-md" activeProps={{ className: 'bg-black text-white' }} to={path}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: App,
});
