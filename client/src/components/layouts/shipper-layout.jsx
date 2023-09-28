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

const ShipperLayout = ({ children }) => {
    const router = useRouter()


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col transition-colors duration-150">
        <Navbar />


        <div className="flex flex-1 pt-20">
            <aside className="shadow w-72 xl:w-76 hidden lg:block overflow-y-auto bg-white px-4 fixed start-0 bottom-0 h-full pt-22">
            <div className="flex flex-col space-y-6 py-3">
                <Link
                    href={ROUTES.SHIPPER_DASHBOARD}
                    className={`flex w-full items-center text-lg text-start hover:text-accent focus:text-accent  ${router.pathname == ROUTES.SHIPPER_DASHBOARD ? 'text-accent' : ''}`}
                >
                    <OrderIcons/>
                    <span>Đơn đặt hàng</span>
                </Link>
            </div>
            </aside>
            <main className="w-full lg:ps-72 xl:ps-76">
            <div className="p-5 md:p-8 overflow-y-auto h-full">{children}</div>
            </main>
        </div>
        </div>
    );
};
export default ShipperLayout;
