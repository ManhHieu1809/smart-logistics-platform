export interface HubTelemetry {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  activeVehicles: number;
  throughputPerDay: string;
  slaRate: string;
  status: 'OPTIMAL' | 'HIGH_TRAFFIC' | 'NORMAL';
}

export const ENTERPRISE_HUBS: HubTelemetry[] = [
  {
    id: 'hub-hcm',
    name: 'Trung Tâm Khai Thác TP.HCM',
    country: 'Vietnam',
    lat: 10.8231,
    lng: 106.6297,
    activeVehicles: 342,
    throughputPerDay: '128,000 kiện',
    slaRate: '99.92%',
    status: 'OPTIMAL',
  },
  {
    id: 'hub-han',
    name: 'Trung Tâm Khai Thác Hà Nội',
    country: 'Vietnam',
    lat: 21.0285,
    lng: 105.8542,
    activeVehicles: 285,
    throughputPerDay: '115,000 kiện',
    slaRate: '99.88%',
    status: 'OPTIMAL',
  },
  {
    id: 'hub-sin',
    name: 'Singapore Changi Gateway',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    activeVehicles: 420,
    throughputPerDay: '240,000 kiện',
    slaRate: '99.95%',
    status: 'OPTIMAL',
  },
  {
    id: 'hub-tyo',
    name: 'Tokyo Narita Hub',
    country: 'Japan',
    lat: 35.772,
    lng: 140.3929,
    activeVehicles: 290,
    throughputPerDay: '180,000 kiện',
    slaRate: '99.80%',
    status: 'NORMAL',
  },
  {
    id: 'hub-sha',
    name: 'Thượng Hải Pudong Port',
    country: 'China',
    lat: 31.1443,
    lng: 121.8083,
    activeVehicles: 580,
    throughputPerDay: '420,000 kiện',
    slaRate: '99.70%',
    status: 'HIGH_TRAFFIC',
  },
  {
    id: 'hub-fra',
    name: 'Frankfurt Central Logistics',
    country: 'Germany',
    lat: 50.0379,
    lng: 8.5622,
    activeVehicles: 310,
    throughputPerDay: '195,000 kiện',
    slaRate: '99.91%',
    status: 'OPTIMAL',
  },
  {
    id: 'hub-lax',
    name: 'Los Angeles Transpacific Port',
    country: 'United States',
    lat: 33.9416,
    lng: -118.4085,
    activeVehicles: 480,
    throughputPerDay: '310,000 kiện',
    slaRate: '99.75%',
    status: 'NORMAL',
  },
];
