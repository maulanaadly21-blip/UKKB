import React from 'react';
import Badge from '../common/Badge';

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'pending' }) => {
  const map: Record<string, { label: string; variant: 'amber' | 'studio' | 'red' | 'slate' | 'rose' }> = {
    pending: { label: 'Pending Payment', variant: 'amber' },
    belum_dikonfirm: { label: 'Pending Payment', variant: 'amber' },
    disetujui: { label: 'Disetujui', variant: 'studio' },
    dikonfirmasi: { label: 'Dikonfirmasi', variant: 'studio' },
    aktif: { label: 'Aktif (Checked In)', variant: 'red' },
    selesai: { label: 'Selesai (Checked Out)', variant: 'slate' },
    dibatalkan: { label: 'Dibatalkan', variant: 'rose' }
  };

  const current = map[status] || { label: status, variant: 'slate' };

  return <Badge variant={current.variant}>{current.label}</Badge>;
};

export default StatusBadge;
