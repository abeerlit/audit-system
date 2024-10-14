import AuditingIcon from "@/components/icons/dashboard/auditing-icon";
import ChaptersIcon from "@/components/icons/dashboard/chapters-icon";
import DiscussionsIcon from "@/components/icons/dashboard/discussions-icon";
import HomeIcon from "@/components/icons/dashboard/home-icon";
import ProfileIcon from "@/components/icons/dashboard/profile-icon";
import UsersIcon from "@/components/icons/dashboard/users-icon";

export const sidebarLinks = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <HomeIcon className="" />
    },
    {
        name: 'Chapters',
        href: '/dashboard/chapters',
        icon: <ChaptersIcon className="" />
    },
    {
        name: 'User Management',
        href: '/dashboard/users',
        icon: <UsersIcon className="" />
    },
    {
        name: 'Auditing',
        href: '/dashboard/auditing',
        icon: <AuditingIcon className="" />
    },
    {
        name: 'Discussions',
        href: '/dashboard/discussions',
        icon: <DiscussionsIcon className="" />
    },
    {
        name: 'Profile',
        href: '/dashboard/profile',
        icon: <ProfileIcon className="" />
    }
]