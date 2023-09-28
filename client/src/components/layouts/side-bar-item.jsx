import DashboardIcons from "@components/icons/dashboard-icons";
import Link from "next/link";
import { useRouter } from "next/router";

const SidebarItem = ({ href, icon, label }) => {
  const router = useRouter()

  return (
    <Link
      href={href}
      className={`flex w-full items-center text-lg text-start hover:text-accent focus:text-accent  ${router.pathname.startsWith(href) ? 'text-accent' : ''}`}
    >
        {icon}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarItem;
