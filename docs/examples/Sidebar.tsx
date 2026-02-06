"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  Shield,
  Network,
  Settings,
  FileText,
  Lock,
  Activity,
  LucideIcon,
  Users,
  Key,
  Server,
  Package,
  Puzzle,
  Cog,
  Wifi,
  Router,
  Heart,
  BarChart3,
  List,
  FileText as FileLog,
  Camera,
  Timer,
  ShieldCheck,
  Award,
} from "lucide-react";
import { useState } from "react";

interface ChildMenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  children?: ChildMenuItem[];
}

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  order: number;
  children?: ChildMenuItem[];
}

const menuItems = [
  {
    title: "Home",
    href: "/home",
    icon: LayoutDashboard,
    order: 0,
    children: [
      { title: "Dashboard", href: "/home/dashboard", icon: BarChart3 },
      { title: "License", href: "/home/license", icon: Award },
      { title: "Password", href: "/home/password", icon: Key },
    ],
  },
  {
    title: "System",
    href: "/system",
    icon: Settings,
    order: 1,
    children: [
      {
        title: "Access",
        href: "/system/access",
        icon: Users,
        children: [
          { title: "Groups", href: "/system/access/groups" },
          { title: "Privileges", href: "/system/access/privileges" },
          { title: "Servers", href: "/system/access/servers" },
          { title: "Testers", href: "/system/access/testers" },
          { title: "Users", href: "/system/access/users" },
        ],
      },
      {
        title: "Configuration",
        href: "/system/config",
        icon: Cog,
        children: [
          { title: "Backup", href: "/system/config/backup" },
          { title: "Default", href: "/system/config/default" },
          { title: "History", href: "/system/config/history" },
          { title: "Wizard", href: "/system/config/wizard" },
        ],
      },
      {
        title: "Diagnostics",
        href: "/system/diagnostics",
        icon: Activity,
        children: [
          { title: "Activity", href: "/system/diagnostics/activity" },
          { title: "Services", href: "/system/diagnostics/services" },
          { title: "Statistics", href: "/system/diagnostics/statistics" },
        ],
      },
      {
        title: "Firmware",
        href: "/system/firmware",
        icon: Package,
        children: [
          { title: "Changelog", href: "/system/firmware/changelog" },
          { title: "Packages", href: "/system/firmware/packages" },
          { title: "Plugins", href: "/system/firmware/plugins" },
          { title: "Settings", href: "/system/firmware/settings" },
          { title: "Status", href: "/system/firmware/status" },
          { title: "Updates", href: "/system/firmware/updates" },
        ],
      },
      {
        title: "Gateways",
        href: "/system/gateways",
        icon: Router,
        children: [
          { title: "Configs", href: "/system/gateways/configs" },
          { title: "Groups", href: "/system/gateways/groups" },
          { title: "Log", href: "/system/gateways/log" },
        ],
      },
      {
        title: "High Availability",
        href: "/system/high-availability",
        icon: Heart,
        children: [
          { title: "Settings", href: "/system/high-availability/settings" },
          { title: "Status", href: "/system/high-availability/status" },
        ],
      },
      { title: "Logs", href: "/system/logs", icon: FileLog },
      {
        title: "Routes",
        href: "/system/routes",
        icon: List,
        children: [
          { title: "Configs", href: "/system/routes/configs" },
          { title: "Log", href: "/system/routes/log" },
          { title: "Status", href: "/system/routes/status" },
        ],
      },
      {
        title: "Settings",
        href: "/system/settings",
        icon: Settings,
        children: [
          { title: "Admin", href: "/system/settings/admin" },
          { title: "Cron", href: "/system/settings/cron" },
          { title: "General", href: "/system/settings/general" },
          { title: "Logging", href: "/system/settings/logging" },
          { title: "Miscellaneous", href: "/system/settings/miscellaneous" },
          { title: "Tunables", href: "/system/settings/tunables" },
        ],
      },
      { title: "Snapshots", href: "/system/snapshots", icon: Camera },
      {
        title: "Trust",
        href: "/system/trust",
        icon: ShieldCheck,
        children: [
          { title: "Authorities", href: "/system/trust/authorities" },
          { title: "Certificates", href: "/system/trust/certs" },
          { title: "Revocation", href: "/system/trust/revocation" },
          { title: "Settings", href: "/system/trust/settings" },
        ],
      },
    ],
  },
  {
    title: "Interfaces",
    href: "/interfaces",
    icon: Network,
    order: 2,
    children: [
      {
        title: "Assignments",
        href: "/interfaces/assignments",
        icon: List,
      },
      {
        title: "Devices",
        href: "/interfaces/devices",
        icon: Server,
        children: [
          { title: "Bridges", href: "/interfaces/devices/bridges" },
          { title: "GIF", href: "/interfaces/devices/gif" },
          { title: "GRE", href: "/interfaces/devices/gre" },
          { title: "LAGG", href: "/interfaces/devices/lagg" },
          { title: "Loopback", href: "/interfaces/devices/loopback" },
          {
            title: "Point-to-Point",
            href: "/interfaces/devices/point-to-point",
          },
          { title: "VLAN", href: "/interfaces/devices/vlan" },
          { title: "VXLAN", href: "/interfaces/devices/vxlan" },
        ],
      },
      {
        title: "Diagnostics",
        href: "/interfaces/diagnostics",
        icon: Activity,
        children: [
          { title: "ARP Tables", href: "/interfaces/diagnostics/arp-tables" },
          { title: "DNS Lookup", href: "/interfaces/diagnostics/dns-lookup" },
          { title: "Netstat", href: "/interfaces/diagnostics/netstat" },
          {
            title: "Packet Capture",
            href: "/interfaces/diagnostics/packet_capture",
          },
          { title: "Ping", href: "/interfaces/diagnostics/ping" },
          { title: "Port Probe", href: "/interfaces/diagnostics/portprobe" },
          { title: "Traceroute", href: "/interfaces/diagnostics/traceroute" },
        ],
      },
      { title: "Neighbors", href: "/interfaces/neighbors", icon: Users },
      { title: "Overview", href: "/interfaces/overview", icon: BarChart3 },
      {
        title: "Settings",
        href: "/interfaces/settings",
        icon: Cog,
      },
      {
        title: "Virtual IPs",
        href: "/interfaces/virtual-ips",
        icon: Wifi,
        children: [
          { title: "Settings", href: "/interfaces/virtual-ips/settings" },
          { title: "Status", href: "/interfaces/virtual-ips/status" },
        ],
      },
      { title: "WAN", href: "/interfaces/wan", icon: Router },
      {
        title: "Wireless",
        href: "/interfaces/wireless",
        icon: Wifi,
        children: [{ title: "Devices", href: "/interfaces/wireless/devices" }],
      },
    ],
  },
  {
    title: "Firewall",
    href: "/firewall",
    icon: Shield,
    order: 3,
    children: [
      { title: "Aliases", href: "/firewall/aliases", icon: List },
      { title: "Categories", href: "/firewall/categories", icon: Puzzle },
      { title: "Groups", href: "/firewall/groups", icon: Users },
      {
        title: "Automation",
        href: "/firewall/automation",
        icon: Timer,
        children: [
          { title: "Filter", href: "/firewall/automation/filter" },
          { title: "Source NAT", href: "/firewall/automation/source_nat" },
        ],
      },
      {
        title: "Diagnostics",
        href: "/firewall/diagnostics",
        icon: Activity,
        children: [
          { title: "Aliases", href: "/firewall/diagnostics/aliases" },
          { title: "Sessions", href: "/firewall/diagnostics/sessions" },
          { title: "States", href: "/firewall/diagnostics/states" },
          { title: "Statistics", href: "/firewall/diagnostics/statistics" },
        ],
      },
      {
        title: "Log",
        href: "/firewall/log",
        icon: FileLog,
        children: [
          { title: "General", href: "/firewall/log/general" },
          { title: "Live", href: "/firewall/log/live" },
          { title: "Overview", href: "/firewall/log/overview" },
          { title: "Plain View", href: "/firewall/log/plain_view" },
        ],
      },
      {
        title: "NAT",
        href: "/firewall/nat",
        icon: Router,
        children: [
          { title: "NPTv6", href: "/firewall/nat/nptv6" },
          { title: "One-to-One", href: "/firewall/nat/one_to_one" },
          { title: "Outbound", href: "/firewall/nat/outbound" },
          { title: "Port Forward", href: "/firewall/nat/port_froward" },
        ],
      },
      {
        title: "Rules",
        href: "/firewall/rules",
        icon: ShieldCheck,
        children: [
          { title: "Floating", href: "/firewall/rules/floating" },
          { title: "WAN", href: "/firewall/rules/wan" },
        ],
      },
      {
        title: "Settings",
        href: "/firewall/settings",
        icon: Cog,
        children: [
          { title: "Advanced", href: "/firewall/settings/advanced" },
          { title: "Normalization", href: "/firewall/settings/normalization" },
          { title: "Schedules", href: "/firewall/settings/schedules" },
        ],
      },
      {
        title: "Shaper",
        href: "/firewall/shaper",
        icon: BarChart3,
        children: [
          { title: "Pipes", href: "/firewall/shaper/pipes" },
          { title: "Queues", href: "/firewall/shaper/queues" },
          { title: "Rules", href: "/firewall/shaper/rules" },
          { title: "Status", href: "/firewall/shaper/status" },
        ],
      },
    ],
  },
  {
    title: "VPN",
    href: "/vpn",
    icon: Lock,
    order: 4,
    children: [
      {
        title: "IPsec",
        href: "/vpn/ipsec",
        icon: Shield,
        children: [
          { title: "Connections", href: "/vpn/ipsec/connections" },
          { title: "Key Pairs", href: "/vpn/ipsec/key_pairs" },
          { title: "Leases", href: "/vpn/ipsec/leases" },
          { title: "Log", href: "/vpn/ipsec/log" },
          { title: "Pre-shared Keys", href: "/vpn/ipsec/pre_shared_keys" },
          { title: "SAD", href: "/vpn/ipsec/sad" },
          { title: "Sessions", href: "/vpn/ipsec/sessions" },
          { title: "Settings", href: "/vpn/ipsec/settings" },
          { title: "SPD", href: "/vpn/ipsec/spd" },
          { title: "VTI", href: "/vpn/ipsec/vti" },
        ],
      },
      {
        title: "OpenVPN",
        href: "/vpn/openvpn",
        icon: Lock,
        children: [
          {
            title: "Client Overwrites",
            href: "/vpn/openvpn/client_overwrites",
          },
          { title: "Export", href: "/vpn/openvpn/export" },
          { title: "Instances", href: "/vpn/openvpn/instances" },
          { title: "Log", href: "/vpn/openvpn/log" },
          { title: "Status", href: "/vpn/openvpn/status" },
        ],
      },
      {
        title: "WireGuard",
        href: "/vpn/wireguard",
        icon: Wifi,
        children: [
          { title: "Instances", href: "/vpn/wireguard/instances" },
          { title: "Log", href: "/vpn/wireguard/log" },
          { title: "Peer Generator", href: "/vpn/wireguard/peer_generator" },
          { title: "Peers", href: "/vpn/wireguard/peers" },
          { title: "Status", href: "/vpn/wireguard/status" },
        ],
      },
    ],
  },
  {
    title: "Services",
    href: "/services",
    icon: Activity,
    order: 5,
    children: [
      {
        title: "Captive Portal",
        href: "/services/captiveportal",
        icon: Users,
        children: [
          { title: "Admin", href: "/services/captiveportal/admin" },
          { title: "Log", href: "/services/captiveportal/log" },
          { title: "Sessions", href: "/services/captiveportal/sessions" },
          { title: "Vouchers", href: "/services/captiveportal/vouchers" },
        ],
      },
      {
        title: "DHCP",
        href: "/services/dhcp",
        icon: Router,
        children: [
          { title: "Control Agent", href: "/services/dhcp/ctrl_agent" },
          { title: "IPv4 Leases", href: "/services/dhcp/leases4" },
          { title: "IPv6 Leases", href: "/services/dhcp/leases6" },
          { title: "Log", href: "/services/dhcp/log" },
          { title: "IPv4", href: "/services/dhcp/v4" },
          { title: "IPv6", href: "/services/dhcp/v6" },
        ],
      },
      {
        title: "DHCP Relay",
        href: "/services/dhcprelay",
        icon: Router,
        children: [
          { title: "Configs", href: "/services/dhcprelay/configs" },
          { title: "Log", href: "/services/dhcprelay/log" },
        ],
      },
      {
        title: "DHCPv4",
        href: "/services/dhcpv4",
        icon: Router,
        children: [
          { title: "Leases", href: "/services/dhcpv4/leases" },
          { title: "Log", href: "/services/dhcpv4/log" },
        ],
      },
      {
        title: "DHCPv6",
        href: "/services/dhcpv6",
        icon: Router,
        children: [
          { title: "Leases", href: "/services/dhcpv6/leases" },
          { title: "Log", href: "/services/dhcpv6/log" },
        ],
      },
      {
        title: "DNS Forwarder",
        href: "/services/dnsmasq",
        icon: Wifi,
        children: [
          { title: "DHCP Options", href: "/services/dnsmasq/dhcpoptions" },
          { title: "DHCP Ranges", href: "/services/dnsmasq/dhcpranges" },
          { title: "DHCP Tags", href: "/services/dnsmasq/dhcptags" },
          { title: "Domains", href: "/services/dnsmasq/domains" },
          { title: "General", href: "/services/dnsmasq/general" },
          { title: "Hosts", href: "/services/dnsmasq/hosts" },
          { title: "Leases", href: "/services/dnsmasq/leases" },
          { title: "Log", href: "/services/dnsmasq/log" },
        ],
      },
      {
        title: "IDS",
        href: "/services/ids",
        icon: Shield,
        children: [
          { title: "Admin", href: "/services/ids/admin" },
          { title: "Log", href: "/services/ids/log" },
          { title: "Policy", href: "/services/ids/policy" },
        ],
      },
      {
        title: "Monit",
        href: "/services/monit",
        icon: Activity,
        children: [
          { title: "Log", href: "/services/monit/log" },
          { title: "Settings", href: "/services/monit/settings" },
          { title: "Status", href: "/services/monit/status" },
        ],
      },
      {
        title: "Network",
        href: "/services/network",
        icon: Network,
        children: [
          { title: "General", href: "/services/network/general" },
          { title: "GPS", href: "/services/network/gps" },
          { title: "Log", href: "/services/network/log" },
          { title: "PPS", href: "/services/network/pps" },
          { title: "Status", href: "/services/network/status" },
        ],
      },
      { title: "OpenDNS", href: "/services/opendns", icon: Wifi },
      {
        title: "Unbound DNS",
        href: "/services/unbound_dns",
        icon: Wifi,
        children: [
          { title: "Access List", href: "/services/unbound_dns/access_list" },
          { title: "Advanced", href: "/services/unbound_dns/advanced" },
          { title: "Blocklist", href: "/services/unbound_dns/blocklist" },
          { title: "DNS over TLS", href: "/services/unbound_dns/dot" },
          { title: "Forward", href: "/services/unbound_dns/forwad" },
          { title: "General", href: "/services/unbound_dns/general" },
          { title: "Log", href: "/services/unbound_dns/log" },
          { title: "Overrides", href: "/services/unbound_dns/overrides" },
          { title: "Statistics", href: "/services/unbound_dns/statistics" },
        ],
      },
    ],
  },
  {
    title: "Reports",
    href: "/report",
    icon: FileText,
    order: 6,
    children: [
      {
        title: "Health",
        href: "/report/health",
        icon: Heart,
        children: [
          { title: "Overview", href: "/report/health/overview" },
          { title: "System", href: "/report/health/system" },
          { title: "Services", href: "/report/health/services" },
        ],
      },
      {
        title: "Insight",
        href: "/report/insight",
        icon: BarChart3,
        children: [
          { title: "Analytics", href: "/report/insight/analytics" },
          { title: "Metrics", href: "/report/insight/metrics" },
          { title: "Performance", href: "/report/insight/performance" },
        ],
      },
      {
        title: "Netflow",
        href: "/report/netflow",
        icon: Network,
        children: [
          { title: "Analysis", href: "/report/netflow/analysis" },
          { title: "Export", href: "/report/netflow/export" },
          { title: "Statistics", href: "/report/netflow/statistics" },
        ],
      },
      {
        title: "Settings",
        href: "/report/settings",
        icon: Cog,
        children: [
          { title: "Configuration", href: "/report/settings/configuration" },
          { title: "General", href: "/report/settings/general" },
          { title: "Reports", href: "/report/settings/reports" },
        ],
      },
      {
        title: "Traffic",
        href: "/report/traffic",
        icon: Activity,
        children: [
          { title: "Analysis", href: "/report/traffic/analysis" },
          { title: "History", href: "/report/traffic/history" },
          { title: "Real-time", href: "/report/traffic/realtime" },
        ],
      },
      {
        title: "Unbound DNS",
        href: "/report/unbound-dns",
        icon: Wifi,
        children: [
          { title: "Queries", href: "/report/unbound-dns/queries" },
          { title: "Statistics", href: "/report/unbound-dns/statistics" },
          { title: "Cache", href: "/report/unbound-dns/cache" },
        ],
      },
    ],
  },
];

interface MenuItemProps {
  item: MenuItem;
  level?: number;
  pathname: string;
  expandedItems: Set<string>;
  toggleExpanded: (item: string) => void;
}

function renderMenuItem(
  item: ChildMenuItem,
  level: number,
  pathname: string,
  expandedItems: Set<string>,
  toggleExpanded: (item: string) => void,
): React.ReactElement {
  // Check if current path is in children (recursive) to auto-expand
  const hasActiveChild = (children: ChildMenuItem[]): boolean => {
    return (
      children?.some((child) => {
        const isChildActive =
          pathname === child.href || pathname.startsWith(child.href + "/");
        const hasActiveGrandChildren = child.children
          ? hasActiveChild(child.children)
          : false;
        return isChildActive || hasActiveGrandChildren;
      }) ?? false
    );
  };

  const isExpanded =
    expandedItems.has(item.href) ||
    (hasActiveChild(item.children || []) && !expandedItems.has(item.href));
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const marginLeft = level * 12; // 12px per level

  if (hasChildren) {
    return (
      <Collapsible
        key={item.href}
        open={isExpanded}
        onOpenChange={() => toggleExpanded(item.href)}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-between h-6 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide hover:bg-gray-800",
              isActive && "text-blue-400 hover:bg-gray-800",
            )}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <span className="text-left truncate max-w-[140px]">
              {item.title}
            </span>
            {item.icon && <item.icon className="h-3 w-3 shrink-0" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="space-y-1">
              {item.children?.map((child) =>
                renderMenuItem(
                  child,
                  level + 1,
                  pathname,
                  expandedItems,
                  toggleExpanded,
                ),
              )}
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      key={item.href}
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-between h-8 px-2 text-sm font-normal text-gray-300 hover:bg-gray-800",
        isActive && "bg-gray-800 text-blue-400 hover:bg-gray-700",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link
        href={item.href}
        className="flex justify-between items-center w-full"
      >
        <span className="flex items-center gap-2">
          {!item.icon && (
            <span className="w-2 h-2 bg-gray-600 rounded-full shrink-0" />
          )}
          <span className="truncate max-w-[140px]">{item.title}</span>
        </span>
        {item.icon && <item.icon className="h-3 w-3 shrink-0" />}
      </Link>
    </Button>
  );
}

function MenuItem({
  item,
  level = 0,
  pathname,
  expandedItems,
  toggleExpanded,
}: MenuItemProps) {
  // Check if current path is in children (recursive) to auto-expand
  const hasActiveChild = (children: ChildMenuItem[]): boolean => {
    return (
      children?.some((child) => {
        const isChildActive =
          pathname === child.href || pathname.startsWith(child.href + "/");
        const hasActiveGrandChildren = child.children
          ? hasActiveChild(child.children)
          : false;
        return isChildActive || hasActiveGrandChildren;
      }) ?? false
    );
  };

  const isExpanded =
    expandedItems.has(item.href) ||
    (hasActiveChild(item.children || []) && !expandedItems.has(item.href));
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  const marginLeft = level * 12; // 12px per level

  if (hasChildren) {
    return (
      <Collapsible
        open={isExpanded}
        onOpenChange={() => toggleExpanded(item.href)}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-300 hover:bg-gray-800",
              isActive && "bg-gray-800 text-blue-400 hover:bg-gray-700",
            )}
            style={{ marginLeft: `${marginLeft}px` }}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left truncate max-w-[120px]">
              {item.title}
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="mt-1 space-y-1">
              {item.children?.map((child) =>
                renderMenuItem(
                  child,
                  level + 1,
                  pathname,
                  expandedItems,
                  toggleExpanded,
                ),
              )}
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 h-8 px-2 text-sm font-normal text-gray-300 hover:bg-gray-800",
        isActive && "bg-gray-800 text-blue-400 hover:bg-gray-700",
      )}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <Link href={item.href}>
        {level > 0 ? (
          <span className="w-2 h-2 bg-gray-600 rounded-full shrink-0" />
        ) : (
          <item.icon className="h-4 w-4 shrink-0" />
        )}
        <span className="truncate max-w-[100px]">{item.title}</span>
      </Link>
    </Button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }
      return newSet;
    });
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-14 items-center border-b border-gray-800 px-4"
      >
        <h1 className="text-lg font-semibold text-gray-200">Aether Shield</h1>
      </motion.div>
      <nav className="flex-1 overflow-hidden p-2 space-y-1 hover:overflow-auto">
        <AnimatePresence>
          {menuItems
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <MenuItem
                  item={item}
                  pathname={pathname}
                  expandedItems={expandedItems}
                  toggleExpanded={toggleExpanded}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </nav>
    </div>
  );
}
