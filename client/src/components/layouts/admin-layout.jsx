import BrandIcons from "@components/icons/brand-icons";
import CategoryIcons from "@components/icons/category-icons";
import DashboardIcons from "@components/icons/dashboard-icons";
import ImportProductIcons from "@components/icons/import-product-icons";
import OrderIcons from "@components/icons/order-icons";
import PosterIcons from "@components/icons/poster-icons";
import ProductIcons from "@components/icons/product-icons";
import UserIcons from "@components/icons/user-icons";
import { ROUTES } from "@utils/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Navbar from "./navbar";
import SidebarItem from "./side-bar-item";
import { CouponIcons } from "@components/icons/coupon-icons";
import { ShippingsIcon } from "@components/icons/shipping-icons";
import { TaxesIcon } from "@components/icons/taxs-icons";
import { AttributeIcon } from "@components/icons/attribute-icons";
import { OrdersStatusIcon } from "@components/icons/order-status-icons";

const AdminLayout = ({ children }) => {
    const router = useRouter()
    const sidebarLinks = [
        {
            href: ROUTES.ADMIN_PRODUCT,
            label: "Sản phẩm",
            icon:  <ProductIcons/>
        },
        {
            href: ROUTES.ADMIN_CUSTOMER,
            label: "Khách hàng",
            icon:  <UserIcons/>
        },
        {
            href: ROUTES.ADMIN_STAFF,
            label: "Nhân viên",
            icon:  <UserIcons/>
        },
        {
            href: ROUTES.ADMIN_CATEGORY,
            label: "Danh mục",
            icon:  <CategoryIcons/>
        },
        {
            href: ROUTES.ADMIN_BRAND,
            label: "Thương hiệu",
            icon:  <BrandIcons/>
        },
        {
            href: ROUTES.ADMIN_ORDER,
            label: "Đơn đặt hàng",
            icon:  <OrderIcons/>
        },
        {
            href: ROUTES.ADMIN_POSTER,
            label: "Poster",
            icon:  <PosterIcons/>
        },
        {
            href: ROUTES.ADMIN_IMPORT,
            label: "Phiếu nhập",
            icon:  <ImportProductIcons/>
        },
        {
            href: ROUTES.ADMIN_PURCHASE,
            label: "Phiếu đặt",
            icon:  <ImportProductIcons/>
        },
        
        {
            href: ROUTES.ADMIN_PROMOTION,
            label: "Đợt khuyến mãi",
            icon:  <CouponIcons/>
        },
        {
            href: ROUTES.ADMIN_SUPPLIER,
            label: "Nhà cung cấp",
            icon:  <TaxesIcon/>
        }
    ]

    const SidebarItemMap = () => (
        <Fragment>
        {sidebarLinks.map(({ href, label, icon }) => (
            <SidebarItem href={href} label={label} icon={icon} key={href} />
        ))}
        </Fragment>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col transition-colors duration-150">
        <Navbar />


        <div className="flex flex-1 pt-20">
            <aside className="shadow w-72 xl:w-76 hidden lg:block overflow-y-auto bg-white px-4 fixed start-0 bottom-0 h-full pt-22">
            <div className="flex flex-col space-y-6 py-3">
                <Link
                    href={ROUTES.ADMIN_DASHBOARD}
                    className={`flex w-full items-center text-lg text-start hover:text-accent focus:text-accent  ${router.pathname == ROUTES.ADMIN_DASHBOARD ? 'text-accent' : ''}`}
                >
                    <DashboardIcons/>
                    <span>Dashboard</span>
                </Link>
                <SidebarItemMap/>
            </div>
            </aside>
            <main className="w-full lg:ps-72 xl:ps-76">
                <div className="p-5 md:p-8 overflow-y-auto h-full">{children}</div>
            </main>
        </div>
        </div>
    );
};
export default AdminLayout;
