export type NetworkData = {
  ip_address: string | null;
  router: string | null;
  noise: number;
  physical_mode: string;
  rssi: number;
  security: string;
  snr: number;
  time: string;
  tx_rate: number;
  channel: string;
};

export type PingData = {
  ip_address: string;
  time_ms: number | null;
  size: number;
  time: string;
};
