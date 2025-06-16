import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
const Login = lazy(() => import("../Auth/Login"));
const Registration = lazy(() => import("../Auth/Registration"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Layout = lazy(() => import("../Layout/Layout"));
const AuthGaurd = lazy(() => import("../components/AuthGaurd"));
const VerifyOTP = lazy(() => import("../Auth/VerifyOTP"));
const BookingList = lazy(() => import("../pages/BookingList"));
const BookingForm = lazy(() => import("../pages/BookingForm"));
const EmployeeBookingList = lazy(() => import("../pages/EmployeeBookingList"));
const RoomsList = lazy(() => import("../pages/Rooms"));
const UploadRooms = lazy(() => import("../pages/UploadRooms"));
import Cookies from "js-cookie";

const ProjectRoutes = () => {
  const token = Cookies.get("token");
  const user = Cookies.get("user");
  const userObject = JSON.parse(user || "{}");
  const userType = userObject?.type;

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* <Route path="/login" element={<Login />} /> */}
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/dashboard" /> : <Registration />}
          />
          <Route
            path="/verify-otp"
            element={token ? <Navigate to="/dashboard" /> : <VerifyOTP />}
          />

          <Route element={<AuthGaurd />}>
            <Route
              path="/dashboard"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/bookings_list"
              element={
                <Layout>
                  {userType === "employee" ? (
                    <EmployeeBookingList />
                  ) : (
                    <BookingList />
                  )}
                </Layout>
              }
            />
            <Route
              path="/book_your_room"
              element={
                <Layout>
                  <BookingForm />
                </Layout>
              }
            />
            <Route
              path="/rooms"
              element={
                <Layout>
                  <RoomsList />
                </Layout>
              }
            />
            <Route
              path="/upload_rooms"
              element={
                <Layout>
                  <UploadRooms />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default ProjectRoutes;
