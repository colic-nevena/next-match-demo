'use client';

import useMessageStore from '@/hooks/useMessageStore';
import { NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react'

type Props = {
  href: string;
  label: string;
}

export default function NavLink({ href, label }: Props) {
  const pathname = usePathname();

  const { unreadCount } = useMessageStore(state => ({
    unreadCount: state.unreadCount
  }))

  const isActive = useMemo(() => pathname === href, [pathname, href]);

  return (
    <NavbarItem isActive={isActive} as={Link} href={href}>
      <span>{label}</span>
      {href === '/messages' && unreadCount > 0 && (
        <span className='ml-1'>({unreadCount})</span>
      )}
    </NavbarItem>
  )
}