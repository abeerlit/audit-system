import AuditingIcon from "@/components/icons/dashboard/sidebar/auditing-icon";
import ChaptersIcon from "@/components/icons/dashboard/sidebar/chapters-icon";
import DiscussionsIcon from "@/components/icons/dashboard/sidebar/discussions-icon";
import HomeIcon from "@/components/icons/dashboard/sidebar/home-icon";
import ProfileIcon from "@/components/icons/dashboard/sidebar/profile-icon";
import UsersIcon from "@/components/icons/dashboard/sidebar/users-icon";

export const getRoutes = (role: string) => {
  return [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <HomeIcon className="" />,
    },

   
    ...(role == "admin"
      ? [
          {
            name: "User Management",
            href: "/dashboard/users",
            icon: <UsersIcon className="" />,
          },
          {
            name: "Chapters",
            href: "/dashboard/chapters",
            icon: <ChaptersIcon className="" />,
          },
        ]
      : role === "broker"
      ? [
        {
          name: "Chapters",
          href: "/dashboard/chapters",
          icon: <ChaptersIcon className="" />,
        },
          {
            name: "Auditing",
            href: "/dashboard/auditing",
            icon: <AuditingIcon className="" />,
          },
          {
            name: "Discussions",
            href: "/dashboard/discussions",
            icon: <DiscussionsIcon className="" />,
          },
        ]
      : role ==="expert" ? [ {
        name: "Chapters Auditing",
        href: "/dashboard/auditing",
        icon: <AuditingIcon className="" />,
      },
      {
        name: "Discussions Review",
        href: "/dashboard/discussions",
        icon: <DiscussionsIcon className="" />,
      },] : []),
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <ProfileIcon className="" />,
    },
  ];
};
