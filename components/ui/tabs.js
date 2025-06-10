"use client";
import React, { useState } from "react";

export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className = "", activeTab, setActiveTab }) {
  return (
    <div className={`flex border-b ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}


export function TabsTrigger({ value, children, activeTab, setActiveTab }) {
  
  // const Toogle = () =>{
  //   setActiveTab(value);
  // }
  return (
    <button
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-[#1f5aad] text-[#1f5aad]' : 'text-[#64748b]'}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, activeTab }) {
  return activeTab === value ? <div>{children}</div> : null;
}