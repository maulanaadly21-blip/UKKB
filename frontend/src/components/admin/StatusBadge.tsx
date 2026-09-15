import React from 'react';
import Badge from '../common/Badge';

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'pending' }) => {
  const map: Record<string, { label: string; variant: 'amber' | 'teal' | 'emerald' | 'indigo' | 'rose' | 'slate' }> = {
    pending: { label: 'Pending Payment', variant: 'amber' },
    belum_dikonfirm: { label: 'Pending Payment', variant: 'amber' },
    dikonfirmasi: { label: 'Dikonfirmasi', variant: 'teal' },
    aktif: { label: 'Aktif (Checked In)', variant: 'emerald' },
    selesai: { label: 'Selesai (Checked Out)', variant: 'indigo' },
    dibatalkan: { label: 'Dibatalkan', variant: 'rose' }
  };

  const current = map[status] || { label: status, variant: 'slate' };

  return <Badge variant={current.variant}>{current.label}</Badge>;
};

export default StatusBadge;
