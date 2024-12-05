'use client';
import React, { useState } from "react";
import Navbar from "@/components/navbar";
import DashboardCenter from "@/components/dashboard";

export default function Dashboard() {
    return (
        <div>
            <Navbar />
            <DashboardCenter />
        </div>
    )
}