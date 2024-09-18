"use client";
import { NextUIProvider } from "@nextui-org/react";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    <NextUIProvider>
      <ToastContainer position="bottom-right" hideProgressBar className="z-50" />
      {children}
    </NextUIProvider>
  );
};

export default Providers;
