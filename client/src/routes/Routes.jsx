import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const Login = lazy(() => import("../Auth/Login"));
const Registration = lazy(() => import("../Auth/Registration"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Layout = lazy(() => import("../components/Layout"));

const ProjectRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default ProjectRoutes;
