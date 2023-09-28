import Image from "next/image";
import cn from "classnames";
import { siteSettings } from "@settings/site.settings";
import Link from "next/link";



export default function logo({classname, ...props}) {

  return (
    <Link
      href={siteSettings.logo.href}
      className={cn('inline-flex', classname)}
      {...props}
    >
        <span
            className="overflow-hidden relative  w-32 md:w-40 h-10"
        >
            <Image
              src={siteSettings.logo.url}
              alt={siteSettings.logo.alt}
              loading="eager"
              fill="true"
              className="object-contain"
            />
        </span>
    </Link>
  )
}
