"use client";
import { getUnreadMessagesCount } from "@/app/actions/messageActions";
import useMessageStore from "@/hooks/useMessageStore";
import { useNotificationChannel } from "@/hooks/useNotificationChannel";
import { usePresenceChannel } from "@/hooks/usePresenceChannel";
import { NextUIProvider } from "@nextui-org/react";
import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: ReactNode;
  userId: string | null;
}

const Providers = ({ children, userId }: Props) => {
  const isUnreadMessagesCountSet = useRef(false) // to only set it once

  const { updateUnreadCount } = useMessageStore(state => ({
    updateUnreadCount: state.updateUnreadCount
  }))

  const setUnreadCount = useCallback((amount: number) => {
    updateUnreadCount(amount)
  }, [updateUnreadCount])

  useEffect(() => {
    if (!isUnreadMessagesCountSet.current && userId) {
      getUnreadMessagesCount().then(count => {
        setUnreadCount(count)
      })

      isUnreadMessagesCountSet.current = true
    }
  }, [setUnreadCount, userId])

  usePresenceChannel()
  useNotificationChannel(userId)

  return (
    <NextUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar className="z-50" />
      {children}
    </NextUIProvider>
  );
};

export default Providers;
