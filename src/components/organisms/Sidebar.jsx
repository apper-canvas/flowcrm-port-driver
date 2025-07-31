import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" },
    { name: "Activities", href: "/activities", icon: "Activity" },
  ];

  const NavItem = ({ item, mobile = false }) => (
    <NavLink
      to={item.href}
      onClick={() => mobile && onClose && onClose()}
      className={({ isActive }) =>
        `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
            : "text-gray-600 hover:bg-gradient-to-r hover:from-surface hover:to-gray-50 hover:text-gray-900"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={item.icon} 
            size={20} 
            className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} 
          />
          <span>{item.name}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <div className="h-full bg-gradient-to-b from-surface to-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-6 py-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <ApperIcon name="Waves" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    FlowCRM
                  </h1>
                  <p className="text-xs text-gray-500">Customer Relations</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                <p>FlowCRM v1.0</p>
                <p>© 2024 All rights reserved</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={onClose} />
          
          <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-surface to-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Waves" size={20} className="text-white" />
                  </div>
                  <h1 className="text-lg font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    FlowCRM
                  </h1>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                  <ApperIcon name="X" size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <NavItem key={item.name} item={item} mobile />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;