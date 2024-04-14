import AdminDashboard from "@components/dashboard-admin";
import AdminLayout from "@components/layouts/admin-layout";
import getLayout from "@components/layouts/layouts";
import SellerLayout from "@components/layouts/seller-layout";


export default function DashboardSeller() {
    return <AdminDashboard />;
  
}

DashboardSeller.authenticate = {
    permissions: ["SELLER"],
};


DashboardSeller.Layout = SellerLayout;
