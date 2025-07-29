import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function Layout({ search, setSearch }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar search={search} setSearch={setSearch} />

      <main className="flex-grow w-full max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
