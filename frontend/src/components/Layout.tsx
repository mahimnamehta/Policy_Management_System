import { Link, NavLink, Outlet } from 'react-router-dom';

export const Layout = (): JSX.Element => {
  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="brand">
          Policy Management
        </Link>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/policies">Policies</NavLink>
          <NavLink to="/policies/new">Create Policy</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
