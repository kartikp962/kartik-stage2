import type { KycStatus } from '../../api/types';

export interface KYCStatusBannerProps {
  status: KycStatus;
}

interface BannerConfig {
  /** Bootstrap contextual alert variant, so colours come from the theme. */
  variant: 'warning' | 'danger';
  /**
   * 'status' is announced politely by screen readers; 'alert' interrupts.
   * A rejection needs the user's attention, a pending check does not.
   */
  role: 'status' | 'alert';
  message: string;
}

// Typed as Record<KycStatus, ...>: adding a new status to KYC_STATUSES
// is a compile error here until we decide how it should be displayed.
const BANNERS: Record<KycStatus, BannerConfig | null> = {
  pending: {
    variant: 'warning',
    role: 'status',
    message: 'Your identity verification is in progress. You can browse but cannot invest yet.',
  },
  rejected: {
    variant: 'danger',
    role: 'alert',
    message: 'Your identity verification was unsuccessful. Please contact support.',
  },
  approved: null,
};

export function KYCStatusBanner({ status }: KYCStatusBannerProps) {
  const banner = BANNERS[status];
  if (!banner) return null;

  return (
    <div className={`alert alert-${banner.variant} mb-4`} role={banner.role}>
      {banner.message}
    </div>
  );
}
