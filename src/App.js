import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import FeaturedProperties from "./Components/FeaturedProperties";

import Properties from "./Pages/Public/Properties";
import PropertyDetails from "./Pages/Public/PropertyDetails";

import PendingProperties from "./Pages/admin/PendingProperties";
import Login from "./Pages/auth/Login";
import Enquiries from "./Pages/provider/Enquiries";
import Wishlist from "./Pages/customer/Wishlist";
import AgentProfile from "./Pages/agent/AgentProfile";
import AgentManagement from "./Pages/admin/AgentManagement";
import Agents from "./Pages/Public/Agents";
import BuildersManagement from "./Pages/admin/BuildersManagement";

import AgentDetails from "./Pages/Public/AgentDetails";
import Builders from "./Pages/Public/Builders";
import OwnerDashboard from "./Pages/owner/OwnerDashboard";
import EditProperty from "./Pages/owner/EditProperty";
import CustomerProfile from "./Pages/customer/CustomerProfile";
import CustomerEnquiries from "./Pages/customer/CustomerEnquiries";
import CustomerDashboard from "./Pages/customer/CustomerDashboard";
import OwnerEnquiries from "./Pages/owner/OwnerEnquiries";
import OwnerProfile from "./Pages/owner/OwnerProfile";

import AddProperty from "./Pages/owner/AddProperty";
import MyProperties from "./Pages/owner/MyProperties";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AgentDashboard from "./Pages/agent/AgentDashboard";
import BuilderDashboard from "./Pages/builder/BuilderDashboard";
import BuilderProfile from "./Pages/builder/BuilderProfile";
import BuilderAddProperty from "./Pages/builder/BuilderAddProperty";
import BuilderEditProperty from "./Pages/builder/BuilderEditProperty";
import BuilderEnquiries from "./Pages/builder/BuilderEnquiries";
import BuilderProperties from "./Pages/builder/BuilderProperties";
import BuilderProjects from "./Pages/builder/BuilderProjects";
import Projects from "./Pages/Public/Projects";
import BuilderAddProject from "./Pages/builder/BuilderAddProject";
import BuilderEditProject from "./Pages/builder/BuilderEditProject";
import ProjectDetails from "./Pages/Public/ProjectDetails";
import Register from "./Pages/auth/Register";
import AdminReviews from "./Pages/admin/AdminReviews";
import AdminPackages from "./Pages/admin/AdminPackages";
import SubscriptionPlans from "./Components/SubscriptionPlans";





function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <FeaturedProperties />
            </>
          }
        />

        {/* Properties Page */}
        <Route
          path="/properties"
          element={<Properties />}
        />

        {/* Property Details Page */}
        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Admin Pending Properties */}
        <Route
          path="/admin/pending"
          element={<PendingProperties />}
        />

        <Route
          path="/provider/enquiries"
          element={<Enquiries />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/agent/profile"
          element={<AgentProfile />}
        />

        <Route
          path="/admin/agents"
          element={<AgentManagement />}
        />

        <Route
          path="/agents"
          element={<Agents />}
        />

        <Route
          path="/agents/:id"
          element={<AgentDetails />}
        />

        <Route path="/admin/Builders" element={<BuildersManagement />} />

        <Route path="/Builders" element={<Builders />} />

        <Route
           path="/owner/dashboard"
           element={<OwnerDashboard />}
        />

        <Route path="/owner/properties/edit/:id" element={<EditProperty />}/>
        <Route path="/owner/profile" element={<OwnerProfile />}/>
        <Route path="/owner/enquiries" element={<OwnerEnquiries />}/>      
        <Route path="/customer/dashboard" element={<CustomerDashboard />}/>
        <Route path="/customer/enquiries" element={<CustomerEnquiries />}/>
        <Route path="/customer/profile" element={<CustomerProfile />}/>
        <Route path="/owner/properties/add" element={<AddProperty />}/>
        <Route path="/owner/properties" element={<MyProperties />}/>
        <Route path="/admin/dashboard" element={<AdminDashboard />}/>
        <Route path="/agent/dashboard" element={<AgentDashboard />}/>
        <Route path="/builder/dashboard" element={<BuilderDashboard />}/>
        <Route path="/builder/profile" element={<BuilderProfile />}/>
        <Route path="/builder/properties/add" element={<BuilderAddProperty />}/>
        <Route path="/builder/properties/edit/:id" element={<BuilderEditProperty />}/>
        <Route path="/builder/BuilderEnquiries" element={<BuilderEnquiries />}/>
        <Route path="/builder/properties" element={<BuilderProperties />}/>
        <Route path="/builder/projects" element={<BuilderProjects />}/>
        <Route path="/projects" element={<Projects />}/>
        <Route path="/builder/projects/add" element={<BuilderAddProject />}/>
        <Route path="/builder/projects/edit/:id" element={<BuilderEditProject />}/>
        <Route path="/projects/:id" element={<ProjectDetails />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/admin/reviews" element={<AdminReviews />}/>
        <Route path="/admin/packages" element={<AdminPackages />}/>
        <Route path="/builder/subscription" element={<SubscriptionPlans />}/>
        <Route path="/agent/subscription" element={<SubscriptionPlans />}/>
        <Route path="/owner/subscription" element={<SubscriptionPlans />}/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;