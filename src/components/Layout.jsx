import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ search, setSearch }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar search={search} setSearch={setSearch} />

      <main className="flex-grow w-full mx-auto px-8 py-2">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
