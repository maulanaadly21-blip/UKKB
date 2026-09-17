import React from 'react';
import Badge from '../common/Badge';

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'pending' }) => {
  const map: Record<string, { label: string; variant: 'amber' | 'teal' | 'emerald' | 'indigo' | 'rose' | 'slate' }> = {
    pending: { label: 'Belum Dikonfirmasi', variant: 'amber' },
    belum_dikonfirm: { label: 'Belum Dikonfirmasi', variant: 'amber' },
    disetujui: { label: 'Disetujui', variant: 'teal' },
    dikonfirmasi: { label: 'Disetujui', variant: 'teal' },
    aktif: { label: 'Aktif (Checked In)', variant: 'emerald' },
    selesai: { label: 'Selesai (Checked Out)', variant: 'indigo' },
    dibatalkan: { label: 'Dibatalkan', variant: 'rose' }
  };

  const current = map[status] || { label: status, variant: 'slate' };

  return <Badge variant={current.variant}>{current.label}</Badge>;
};

export default StatusBadge;
