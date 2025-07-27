import { Outlet } from "react-router-dom";
import { Header, Footer } from "../components";
export const Layout = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
