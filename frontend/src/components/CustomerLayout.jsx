import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
      <Footer />
    </div>
  );
};

export default CustomerLayout;