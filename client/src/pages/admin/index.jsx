import AdminDashboard from "@components/dashboard-admin";
import AdminLayout from "@components/layouts/admin-layout";
import getLayout from "@components/layouts/layouts";


export default function Dashboard() {
    return <AdminDashboard />;
  
}

Dashboard.authenticate = {
    permissions: ["ADMIN"],
};


Dashboard.Layout = AdminLayout;
