/**
 * StatusBadge Component
 * Display badges for order and partner status
 * Location: partner/src/components/common/StatusBadge.jsx
 */

import { ORDER_STATUS_DISPLAY, PARTNER_STATUS_DISPLAY } from '../../utils/constants';

/**
 * Order Status Badge
 */
export function OrderStatusBadge({ status, size = 'md' }) {
  const config = ORDER_STATUS_DISPLAY[status] || ORDER_STATUS_DISPLAY.pending;

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        ${config.bgColor} ${config.textColor}
        ${sizes[size]}
      `}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

/**
 * Partner Status Badge
 */
export function PartnerStatusBadge({ status, size = 'md' }) {
  const config = PARTNER_STATUS_DISPLAY[status] || PARTNER_STATUS_DISPLAY.offline;

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        ${config.bgColor} ${config.textColor}
        ${sizes[size]}
      `}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

/**
 * Generic Status Badge
 */
export default function StatusBadge({ 
  label, 
  icon, 
  color = 'gray', 
  size = 'md' 
}) {
  const colors = {
    orange: 'bg-orange-100 text-orange-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-semibold
        ${colors[color]}
        ${sizes[size]}
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  );
}

/**
 * Example Usage:
 * 
 * <OrderStatusBadge status="in_transit" />
 * <OrderStatusBadge status="delivered" size="lg" />
 * 
 * <PartnerStatusBadge status="available" />
 * <PartnerStatusBadge status="on_delivery" size="sm" />
 * 
 * <StatusBadge label="Active" icon="🟢" color="green" />
 */