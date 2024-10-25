import NavGuest from "../../components/Navbar/Navbar";
import NavUser from "../../components/Navbar/User-Navbar";
import Footer from "../../components/Footer/Footer";

const AppLayout = ({ children, isUserLoggedIn }) => {
  const Nav = isUserLoggedIn ? NavUser : NavGuest;
  return (
    <>
      <Nav />
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppLayout;
