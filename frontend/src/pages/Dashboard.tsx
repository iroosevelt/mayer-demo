import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import DashboardHome from './Dashboard/DashboardHome';
import MyPlans from './Dashboard/MyPlans';
import UploadPlan from './Dashboard/UploadPlan';
import Appointments from './Dashboard/Appointments';
import Profile from './Dashboard/Profile';

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="my-plans" element={<MyPlans />} />
        <Route path="upload-plan" element={<UploadPlan />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
