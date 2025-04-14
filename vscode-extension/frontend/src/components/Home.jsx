"use client"
import React from "react";
import { useState } from "react"
import { SidebarView } from "../views/SidebarView"
import { FullView } from "../views/FullView"

export default function Home() {
  const [view, setView] = useState("sidebar")

  return (
    <div className="h-screen w-full bg-[#24292e] overflow-hidden flex">
      <div className={`flex-1 ${view === "fullview" ? "block" : "hidden"}`}>
        <FullView/>
      </div>

      <div className={`${view === "sidebar" ? "w-full" : "hidden"}`}>
        <SidebarView/>
      </div>

      <div className="absolute bottom-4 right-4 space-x-2">
        {view === "sidebar" && (
          <button
            className="bg-[#2dba4e] text-[0.9rem] text-white p-2 rounded shadow-md hover:bg-[#25a042] transition-colors transform active:translate-y-0"
            onClick={() => setView("fullview")}
          >
            Switch to Full View
          </button>
        )}

        {view === "fullview" && (
          <button
            className="bg-[#2dba4e] text-[0.9rem] text-white p-2 rounded shadow-md hover:bg-[#25a042] transition-colors transform active:translate-y-0 mr-5"
            onClick={() => setView("sidebar")}
          >
            Switch to Sidebar
          </button>
        )}
      </div>
    </div>
  )
}
