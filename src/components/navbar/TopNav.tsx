import { Button, Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { GiMatchTip } from "react-icons/gi";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import { getUserInfoForNav } from "@/app/actions/userActions";
import FiltersWrapper from "./FiltersWrapper";

export default async function TopNav() {
  const session = await auth()
  const userInfo = session?.user && await getUserInfoForNav()

  return (
    <>
      <Navbar
        maxWidth="xl"
        className="bg-gradient-to-r from-purple-400 to-purple-700"
        classNames={{ item: ["text-l", "text-white", "uppercase", "data-[active=true]:text-yellow-200"] }}
      >
        <NavbarBrand as={Link} href="/">
          <GiMatchTip size={30} className="text-gray-200" />
          <div className="font-bold text-2xl flex">
            <span className="text-gray-900">Next</span>
            <span className="text-gray-200">Match</span>
          </div>
        </NavbarBrand>

        <NavbarContent justify="center">
          <NavLink href="/members" label="Matches" />

          <NavLink href="/lists" label="Lists" />

          <NavLink href="/messages" label="Messages" />
        </NavbarContent>
        <NavbarContent justify="end">
          {userInfo ? (
            <UserMenu userInfo={userInfo} />
          ) : (
            <>
              <Button as={Link} href="/login" variant="bordered" className="text-white" size="sm">
                Login
              </Button>
              <Button as={Link} href="/register" variant="bordered" className="text-white" size="sm">
                Register
              </Button>
            </>
          )}
        </NavbarContent>
      </Navbar>

      <FiltersWrapper />
    </>
  );
};
