"use client"
import React, { Fragment } from 'react'
import { Toaster } from "react-hot-toast";

const RootLayoutProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <Fragment>
        {children}
        <Toaster />
    </Fragment>
  )
}

export default RootLayoutProvider;