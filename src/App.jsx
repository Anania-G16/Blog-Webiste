import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import CreateBlog from "./components/createBlog.jsx";
import ViewBlog from "./components/viewBlogs.jsx";
import NavBar from "./components/navbar.jsx";
import Login from "./components/login.jsx";
import Register from "./components/register.jsx";
import GiveAccess from "./components/giveAccess.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Loading from "./components/loading.jsx";
import axios from "axios";
axios.defaults.withCredentials = true;
function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get("http://localhost:5000/check-auth", {
          withCredentials: true,
        });
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false); // finished checking if the user was logged in
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/register") {
      if (isLoggedIn) {
        const result = window.confirm("Do you want to leave the site?");
        if (result) {
          // setIsLoggedIn(false);
        } else {
          navigate("/view");
        }
      }
    }
  }, [location.pathname]);
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  let showNavbar = isLoggedIn;
  if (location.pathname === "/" || location.pathname === "/register") {
    showNavbar = false;
  }
  return (
    <>
      {showNavbar && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login giveAccess={setIsLoggedIn} />} />
        <Route
          path="/register"
          element={<Register giveAccess={setIsLoggedIn} />}
        />
        <Route
          path="/giveAccess"
          element={<GiveAccess giveAccess={setIsLoggedIn} />}
        />
        {/* Protected Routes */}
        <Route
          path="/view"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ViewBlog />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreateBlog />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/view"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ViewBlog />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/view"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ViewBlog />{" "}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
export default App;
