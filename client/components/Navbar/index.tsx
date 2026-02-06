import React from "react";
import { Menu, Moon, Sun, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import Image from "next/image";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed,
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const { data: currentUser } = useGetAuthUserQuery({});
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!currentUser) return null;
    const currentUserDetails = currentUser?.userDetails;

    return (
        <div className="flex items-center justify-between bg-white px-4 py-1.5 dark:bg-black">
            {/* Menu toggle */}
            <div className="flex items-center gap-8">
                {!isSidebarCollapsed ? null : (
                    <button
                        onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
                    >
                        <Menu className="h-6 w-6 dark:text-white" />
                    </button>
                )}
            </div>

            {/* Icons */}
            <div className="flex items-center">
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className={
                        isDarkMode
                            ? `rounded p-2 dark:hover:bg-gray-700`
                            : `rounded p-2 hover:bg-gray-100`
                    }
                >
                    {isDarkMode ? (
                        <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
                    ) : (
                        <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
                    )}
                </button>
                <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block"></div>
                <div className="hidden items-center justify-between md:flex">
                    <div className="align-center flex h-7 w-7 justify-center">
                        {!!currentUserDetails?.profilePictureUrl ? (
                            <Image
                                src={`https://ninghuax-tm-demo-bucket-us-west-2.s3.us-east-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                                alt={currentUserDetails?.username || "User Profile Picture"}
                                width={100}
                                height={50}
                                className="h-full rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5 cursor-pointer self-center rounded-full dark:text-white" />
                        )}
                    </div>
                    <span className="mx-2 text-sm text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
                    <button
                        className="hidden rounded bg-gray-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-700 md:block"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
