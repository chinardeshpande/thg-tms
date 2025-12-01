import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Truck,
  Route,
  BarChart3,
  Settings,
  Menu,
  X,
  TruckIcon,
  Warehouse,
  ArrowDownToLine,
  RotateCcw,
  Send,
  Navigation,
  ArrowUpFromLine,
  Shield,
  Package2,
  Calendar,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard size={20} />
  },
  {
    name: 'Transportation',
    icon: <TruckIcon size={20} />,
    children: [
      { name: 'Shipments', path: '/shipments', icon: <Package size={18} /> },
      { name: 'Live Tracking', path: '/live-tracking', icon: <Navigation size={18} /> },
      { name: 'Fleet Management', path: '/fleet', icon: <TruckIcon size={18} /> },
      { name: 'Route Planning', path: '/routes', icon: <Route size={18} /> },
    ],
  },
  {
    name: 'Network & Partners',
    icon: <Truck size={20} />,
    children: [
      { name: 'Carriers', path: '/carriers', icon: <Truck size={18} /> },
      { name: 'Tendering', path: '/tendering', icon: <Send size={18} /> },
    ],
  },
  {
    name: 'Dock & Loading',
    icon: <Calendar size={20} />,
    children: [
      { name: 'Dock Scheduling', path: '/dock-scheduling', icon: <Calendar size={18} /> },
      { name: 'Gate Pass', path: '/gate-pass', icon: <Shield size={18} /> },
      { name: 'Loading', path: '/loading', icon: <Package2 size={18} /> },
    ],
  },
  {
    name: 'Warehouse Operations',
    icon: <Warehouse size={20} />,
    children: [
      { name: 'Inbound', path: '/inbound', icon: <ArrowDownToLine size={18} /> },
      { name: 'Outbound', path: '/outbound', icon: <ArrowUpFromLine size={18} /> },
      { name: 'Returns', path: '/returns', icon: <RotateCcw size={18} /> },
      { name: 'Yard Management', path: '/yard', icon: <Warehouse size={18} /> },
    ],
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: <BarChart3 size={20} />
  },
];

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['Warehouse Operations', 'Dock & Loading', 'Transportation']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionName)
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Truck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">THG TMS</h1>
              <p className="text-xs text-gray-400">Transport Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.name}>
                {/* Parent Item or Standalone Link */}
                {item.path ? (
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`transition-transform duration-200 ${
                            isActive ? 'scale-110' : 'group-hover:scale-110'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {isActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </>
                    )}
                  </NavLink>
                ) : (
                  <>
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(item.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
                    >
                      <span className="transition-transform duration-200 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span className="flex-1 text-left">{item.name}</span>
                      {expandedSections.includes(item.name) ? (
                        <ChevronDown size={16} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </button>

                    {/* Children */}
                    {expandedSections.includes(item.name) && item.children && (
                      <div className="mt-1 ml-3 space-y-1 border-l-2 border-gray-700 pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path!}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
                              ${
                                isActive
                                  ? 'bg-blue-600/30 text-blue-300 border-l-2 border-blue-400'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                                  {child.icon}
                                </span>
                                <span>{child.name}</span>
                                {isActive && (
                                  <span className="ml-auto w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                                )}
                              </>
                            )}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-700 p-3">
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 group"
            >
              <span className="transition-transform duration-200 group-hover:rotate-90">
                <Settings size={20} />
              </span>
              <span>Settings</span>
            </NavLink>

            {/* User section */}
            <div className="mt-3 px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">John Doe</p>
                  <p className="text-xs text-gray-400 truncate">john@company.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
