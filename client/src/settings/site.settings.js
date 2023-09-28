import { ROUTES } from "@utils/routes";


export const siteSettings = {
    name: "PickBazar",
    description: "",
    logo: {
      url: "/logo.svg",
      alt: "PickBazar",
      href: "/",
      width: 128,
      height: 40,
    },
    defaultLanguage: "en",
    author: {
      name: "RedQ, Inc.",
      websiteUrl: "https://redq.io",
      address: "",
    },
    headerLinks: [],
    authorizedLinks: [
      {
        href: ROUTES.PROFILES,
        label: "authorized-nav-item-profile",
      },
      {
        href: ROUTES.ORDERS,
        label: "authorized-nav-item-orders",
      },
      {
        href: ROUTES.LOGOUT,
        label: "authorized-nav-item-logout",
      },
    ],
    currencyCode: "USD",
    sidebarLinks: {
      admin: [
        {
          href: ROUTES.DASHBOARD,
          label: "sidebar-nav-item-dashboard",
          icon: "DashboardIcon",
        },
        {
          href: ROUTES.SHOPS,
          label: "sidebar-nav-item-shops",
          icon: "ShopIcon",
        },
        {
          href: ROUTES.ADMIN_MY_SHOPS,
          label: "sidebar-nav-item-my-shops",
          icon: "MyShopIcon",
        },
        {
          href: ROUTES.PRODUCTS,
          label: "sidebar-nav-item-products",
          icon: "ProductsIcon",
        },
        {
          href: ROUTES.ATTRIBUTES,
          label: "sidebar-nav-item-attributes",
          icon: "AttributeIcon",
        },
        {
          href: ROUTES.GROUPS,
          label: "sidebar-nav-item-groups",
          icon: "TypesIcon",
        },
        {
          href: ROUTES.CATEGORIES,
          label: "sidebar-nav-item-categories",
          icon: "CategoriesIcon",
        },
        {
          href: ROUTES.TAGS,
          label: "sidebar-nav-item-tags",
          icon: "TagIcon",
        },
        {
          href: ROUTES.ORDERS,
          label: "sidebar-nav-item-orders",
          icon: "OrdersIcon",
        },
        {
          href: ROUTES.ORDER_STATUS,
          label: "sidebar-nav-item-order-status",
          icon: "OrdersStatusIcon",
        },
        {
          href: ROUTES.USERS,
          label: "sidebar-nav-item-users",
          icon: "UsersIcon",
        },
        {
          href: ROUTES.COUPONS,
          label: "sidebar-nav-item-coupons",
          icon: "CouponsIcon",
        },
        {
          href: ROUTES.TAXES,
          label: "sidebar-nav-item-taxes",
          icon: "TaxesIcon",
        },
        {
          href: ROUTES.SHIPPINGS,
          label: "sidebar-nav-item-shippings",
          icon: "ShippingsIcon",
        },
        {
          href: ROUTES.WITHDRAWS,
          label: "sidebar-nav-item-withdraws",
          icon: "WithdrawIcon",
        },
        {
          href: ROUTES.SETTINGS,
          label: "sidebar-nav-item-settings",
          icon: "SettingsIcon",
        },
      ],
      shop: [
        {
          href: (shop) => `${ROUTES.DASHBOARD}${shop}`,
          label: "sidebar-nav-item-dashboard",
          icon: "DashboardIcon",
          permissions: "adminOwnerAndStaffOnly",
        },
        {
          href: (shop) => `/${shop}${ROUTES.ATTRIBUTES}`,
          label: "sidebar-nav-item-attributes",
          icon: "AttributeIcon",
          permissions: "adminOwnerAndStaffOnly",
        },
        {
          href: (shop) => `/${shop}${ROUTES.PRODUCTS}`,
          label: "sidebar-nav-item-products",
          icon: "ProductsIcon",
          permissions: "adminOwnerAndStaffOnly",
        },
        {
          href: (shop) => `/${shop}${ROUTES.ORDERS}`,
          label: "sidebar-nav-item-orders",
          icon: "OrdersIcon",
          permissions: "adminOwnerAndStaffOnly",
        },
        {
          href: (shop) => `/${shop}${ROUTES.STAFFS}`,
          label: "sidebar-nav-item-staffs",
          icon: "UsersIcon",
          permissions: "adminAndOwnerOnly",
        },
        {
          href: (shop) => `/${shop}${ROUTES.WITHDRAWS}`,
          label: "sidebar-nav-item-withdraws",
          icon: "AttributeIcon",
          permissions: "adminAndOwnerOnly",
        },
      ],
    },
    product: {
      placeholder: "/product-placeholder.svg",
    },
    avatar: {
      placeholder: "/avatar-placeholder.svg",
    },
  };
  