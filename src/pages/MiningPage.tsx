/**
 * Nexorina User Application — Select & Activate Miner Progression System
 * An interactive dashboard representing hardware-based mining progression.
 * Implements the functional flow: Select Plan -> Confirmation View -> Activate Miner -> My Mining Farm.
 * Strictly UI/prototype only — no real hardware, blockchain, or financial operations.
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import {
  Cpu,
  Zap,
  Play,
  Pause,
  Coins,
  Shield,
  Activity,
  Check,
  Server,
  Clock,
  Lock,
  Flame,
  Wifi,
  Thermometer,
  Layers,
  PlusCircle,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Info,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sliders,
  Gauge,
  HelpCircle,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import { Miner, CryptoAsset } from '../types';
import { MOCK_MINING_REWARDS, MiningRewardRecord } from '../data/mockData';

// Image assets mapping representing professional visual look of physical nodes
const IMAGE_MAP = {
  quantum_asic: '/src/assets/images/miner_quantum_x1_1790114232760.jpg', // Single ASIC Unit
  titan_node: '/src/assets/images/miner_neural_titan_1790114246375.jpg',   // Standard High-Perf CPU/ASIC Server Node
  blade_chassis: '/src/assets/images/miner_apex_blade_1790114262141.jpg', // Sleek blade module or open-air platform
  vortex_cluster: '/src/assets/images/miner_vortex_cluster_1790114295466.jpg', // Dense industrial cluster cabinet
  hypernova_cabinet: '/src/assets/images/miner_hypernova_rig_1790114309034.jpg', // Heavy liquid-cooled multi-GPU/multi-ASIC cabinet
  kaspa_heavy: '/src/assets/images/miner_kheavyhash_kaspa_1790114615990.jpg', // Heavy Multi-Fan ASIC tower
  scrypt_lite: '/src/assets/images/miner_scrypt_ltc_1790114629825.jpg',   // Compact box ASIC
  gpu_openair: '/src/assets/images/miner_gpu_multirig_1790114643126.jpg',  // Multi-GPU open-air custom rig
};

// 1. Definition of Mineable Coins
export interface MineableCoin {
  symbol: string;
  name: string;
  algorithm: string;
  hardwareType: 'ASIC' | 'CPU' | 'GPU Mining Rig';
  status: 'optimal' | 'stable' | 'congested' | 'halving_soon';
  networkDifficulty: string;
  blockReward: string;
  poolHashrate: string;
  logoColor: string;
  usdPrice: number;
  description: string;
}

export const MINEABLE_COINS: MineableCoin[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    algorithm: 'SHA-256',
    hardwareType: 'ASIC',
    status: 'optimal',
    networkDifficulty: '84.38 T',
    blockReward: '3.125 BTC',
    poolHashrate: '280.4 EH/s',
    logoColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    usdPrice: 65120.0,
    description: 'High-density computational SHA-256 consensus hashing on application-specific hardware units.',
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    algorithm: 'Scrypt',
    hardwareType: 'ASIC',
    status: 'stable',
    networkDifficulty: '32.14 M',
    blockReward: '6.25 LTC',
    poolHashrate: '945.2 TH/s',
    logoColor: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    usdPrice: 84.50,
    description: 'Scrypt-compatible ASIC clusters designed for high memory throughput and rapid stratum block verification.',
  },
  {
    symbol: 'XMR',
    name: 'Monero',
    algorithm: 'RandomX',
    hardwareType: 'CPU',
    status: 'optimal',
    networkDifficulty: '384.2 GH',
    blockReward: '0.60 XMR',
    poolHashrate: '3.12 GH/s',
    logoColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    usdPrice: 154.20,
    description: 'Privacy-oriented RandomX CPU mining optimized for processing memory-hard latency challenges on standard cores.',
  },
  {
    symbol: 'RVN',
    name: 'Ravencoin',
    algorithm: 'KawPow',
    hardwareType: 'GPU Mining Rig',
    status: 'stable',
    networkDifficulty: '84.82 K',
    blockReward: '2,500 RVN',
    poolHashrate: '4.82 TH/s',
    logoColor: 'text-red-400 bg-red-500/10 border-red-500/20',
    usdPrice: 0.024,
    description: 'ASIC-resistant KawPow mining optimized for high-vram graphic cards organized in customized open-air rack platforms.',
  },
];

// 2. Hardware Progression Plan Scheme
export interface MiningPlan {
  id: string;
  level: number;
  name: string;
  isFree: boolean;
  isElite: boolean;
  rentalPrice: number; // 0 for free
  rentalPeriod: string;
  hashrate: string;
  hashrateValue: number; // Numeric representation
  hashrateUnit: string; // TH/s, MH/s, KH/s, etc.
  powerUsage: string;
  powerUsageNumeric: number; // Watts
  estimatedMonthlyOutput: string;
  estimatedMonthlyOutputUsd: number;
  hardwareModel: string;
  hardwareCount: number;
  image: string; // Dynamic Hardware Image associated with configuration
  description: string;

  // ASIC specifications
  asicModel?: string;
  asicCount?: number;
  hashratePerAsic?: string;
  powerUsagePerAsic?: string;

  // CPU specifications
  cpuModel?: string;
  cpuCount?: number;
  cores?: number;
  threads?: number;

  // GPU specifications
  gpuModel?: string;
  gpuCount?: number;
  vram?: string;
  motherboard?: string;
  cpu?: string;
  ram?: string;
  psu?: string;
  pcieRiser?: string;
  cooling?: string;
  rigCapacity?: string;
}

export const MINING_PLANS_BY_COIN: Record<string, MiningPlan[]> = {
  BTC: [
    {
      id: 'BTC-PLAN-01',
      level: 1,
      name: 'Plan 1 — Free Initial Node',
      isFree: true,
      isElite: false,
      rentalPrice: 0,
      rentalPeriod: 'Lifetime',
      hashrate: '14.0 TH/s',
      hashrateValue: 14.0,
      hashrateUnit: 'TH/s',
      powerUsage: '1,300 W',
      powerUsageNumeric: 1300,
      estimatedMonthlyOutput: '0.000045 BTC',
      estimatedMonthlyOutputUsd: 2.93,
      hardwareModel: 'Antminer S9 Mini-Node',
      hardwareCount: 1,
      image: IMAGE_MAP.quantum_asic,
      description: 'Your starting miner setup. Simple, resilient single-hashboard classic ASIC to verify stratum connection.',
      asicModel: 'Antminer S9 Standard-Core',
      asicCount: 1,
      hashratePerAsic: '14.0 TH/s',
      powerUsagePerAsic: '1,300 W',
    },
    {
      id: 'BTC-PLAN-02',
      level: 2,
      name: 'Plan 2 — Pro-Level Box',
      isFree: false,
      isElite: false,
      rentalPrice: 15,
      rentalPeriod: '30 Days',
      hashrate: '110.0 TH/s',
      hashrateValue: 110.0,
      hashrateUnit: 'TH/s',
      powerUsage: '3,250 W',
      powerUsageNumeric: 3250,
      estimatedMonthlyOutput: '0.000353 BTC',
      estimatedMonthlyOutputUsd: 23.00,
      hardwareModel: 'Antminer S19 Pro Single',
      hardwareCount: 1,
      image: IMAGE_MAP.kaspa_heavy,
      description: 'First tier premium monthly rental. High-stability solid aluminum construction with heavy turbine air intakes.',
      asicModel: 'Antminer S19 Pro Heavy',
      asicCount: 1,
      hashratePerAsic: '110.0 TH/s',
      powerUsagePerAsic: '3,250 W',
    },
    {
      id: 'BTC-PLAN-03',
      level: 3,
      name: 'Plan 3 — Advanced Dual Rack',
      isFree: false,
      isElite: false,
      rentalPrice: 35,
      rentalPeriod: '30 Days',
      hashrate: '280.0 TH/s',
      hashrateValue: 280.0,
      hashrateUnit: 'TH/s',
      powerUsage: '6,020 W',
      powerUsageNumeric: 6020,
      estimatedMonthlyOutput: '0.000906 BTC',
      estimatedMonthlyOutputUsd: 59.00,
      hardwareModel: 'Whatsminer M50 Twin-Array',
      hardwareCount: 2,
      image: IMAGE_MAP.titan_node,
      description: 'Advanced dual-module rack configuration. Incorporates twin high-performance controller boards with auto-tuning.',
      asicModel: 'Whatsminer M50 Enterprise',
      asicCount: 2,
      hashratePerAsic: '140.0 TH/s',
      powerUsagePerAsic: '3,010 W',
    },
    {
      id: 'BTC-PLAN-04',
      level: 4,
      name: 'Plan 4 — Professional Triple-Unit',
      isFree: false,
      isElite: false,
      rentalPrice: 55,
      rentalPeriod: '30 Days',
      hashrate: '450.0 TH/s',
      hashrateValue: 450.0,
      hashrateUnit: 'TH/s',
      powerUsage: '9,600 W',
      powerUsageNumeric: 9600,
      estimatedMonthlyOutput: '0.001459 BTC',
      estimatedMonthlyOutputUsd: 95.00,
      hardwareModel: 'Antminer S19 XP Triple Rack',
      hardwareCount: 3,
      image: IMAGE_MAP.blade_chassis,
      description: 'Professional hardware deployment utilizing efficient 5nm microchips to maintain high yields at standard temperatures.',
      asicModel: 'Antminer S19 XP Micro',
      asicCount: 3,
      hashratePerAsic: '150.0 TH/s',
      powerUsagePerAsic: '3,200 W',
    },
    {
      id: 'BTC-PLAN-05',
      level: 5,
      name: 'Plan 5 — Advanced Professional Array',
      isFree: false,
      isElite: false,
      rentalPrice: 150,
      rentalPeriod: '30 Days',
      hashrate: '1,340.0 TH/s',
      hashrateValue: 1340.0,
      hashrateUnit: 'TH/s',
      powerUsage: '21,440 W',
      powerUsageNumeric: 21440,
      estimatedMonthlyOutput: '0.004346 BTC',
      estimatedMonthlyOutputUsd: 283.00,
      hardwareModel: 'Antminer S21 Hydro-Sealed Quad',
      hardwareCount: 4,
      image: IMAGE_MAP.vortex_cluster,
      description: 'Newer liquid-cooled high capacity ASICs. Advanced closed-circuit hydro plates for absolute noise cancellation.',
      asicModel: 'Antminer S21 Hydro Platinum',
      asicCount: 4,
      hashratePerAsic: '335.0 TH/s',
      powerUsagePerAsic: '5,360 W',
    },
    {
      id: 'BTC-PLAN-06',
      level: 6,
      name: 'Plan 6 — Elite Hashing Cluster',
      isFree: false,
      isElite: true,
      rentalPrice: 320,
      rentalPeriod: '30 Days',
      hashrate: '3,040.0 TH/s',
      hashrateValue: 3040.0,
      hashrateUnit: 'TH/s',
      powerUsage: '48,800 W',
      powerUsageNumeric: 48800,
      estimatedMonthlyOutput: '0.009860 BTC',
      estimatedMonthlyOutputUsd: 642.00,
      hardwareModel: 'HyperNova SHA Hydrocluster Submerged',
      hardwareCount: 8,
      image: IMAGE_MAP.hypernova_cabinet,
      description: 'The highest tier available. Immersive liquid coolant cabinet operating at maximum hardware density with zero fan vibration.',
      asicModel: 'HyperNova SHA Submersible Custom',
      asicCount: 8,
      hashratePerAsic: '380.0 TH/s',
      powerUsagePerAsic: '6,100 W',
    },
  ],
  LTC: [
    {
      id: 'LTC-PLAN-01',
      level: 1,
      name: 'Plan 1 — Free Scrypt Starter',
      isFree: true,
      isElite: false,
      rentalPrice: 0,
      rentalPeriod: 'Lifetime',
      hashrate: '100.0 MH/s',
      hashrateValue: 100.0,
      hashrateUnit: 'MH/s',
      powerUsage: '200 W',
      powerUsageNumeric: 200,
      estimatedMonthlyOutput: '0.035 LTC',
      estimatedMonthlyOutputUsd: 2.95,
      hardwareModel: 'FutureBit Apollo II Box',
      hardwareCount: 1,
      image: IMAGE_MAP.scrypt_lite,
      description: 'Compact personal quiet Scrypt ASIC. Plugs directly into standard rails with minimal thermal generation.',
      asicModel: 'FutureBit Apollo Scrypt Core',
      asicCount: 1,
      hashratePerAsic: '100.0 MH/s',
      powerUsagePerAsic: '200 W',
    },
    {
      id: 'LTC-PLAN-02',
      level: 2,
      name: 'Plan 2 — Lite Server Box',
      isFree: false,
      isElite: false,
      rentalPrice: 12,
      rentalPeriod: '30 Days',
      hashrate: '1,600.0 MH/s',
      hashrateValue: 1600.0,
      hashrateUnit: 'MH/s',
      powerUsage: '1,450 W',
      powerUsageNumeric: 1450,
      estimatedMonthlyOutput: '0.28 LTC',
      estimatedMonthlyOutputUsd: 23.66,
      hardwareModel: 'GoldShell LT Lite Cabinet Unit',
      hardwareCount: 1,
      image: IMAGE_MAP.quantum_asic,
      description: 'First paid monthly setup. Delivers solid Scrypt mining efficiency utilizing standard turbine fans.',
      asicModel: 'GoldShell LT Lite Classic',
      asicCount: 1,
      hashratePerAsic: '1,600.0 MH/s',
      powerUsagePerAsic: '1,450 W',
    },
    {
      id: 'LTC-PLAN-03',
      level: 3,
      name: 'Plan 3 — Advanced Power Stack',
      isFree: false,
      isElite: false,
      rentalPrice: 45,
      rentalPeriod: '30 Days',
      hashrate: '8,400.0 MH/s',
      hashrateValue: 8400.0,
      hashrateUnit: 'MH/s',
      powerUsage: '2,400 W',
      powerUsageNumeric: 2400,
      estimatedMonthlyOutput: '1.45 LTC',
      estimatedMonthlyOutputUsd: 122.50,
      hardwareModel: 'Antminer L7 Mini Stack',
      hardwareCount: 2,
      image: IMAGE_MAP.kaspa_heavy,
      description: 'Advanced dual setup featuring 4nm Scrypt microprocessors to optimize electrical routing and prevent throttling.',
      asicModel: 'Antminer L7 Mini Stacked',
      asicCount: 2,
      hashratePerAsic: '4,200.0 MH/s',
      powerUsagePerAsic: '1,200 W',
    },
    {
      id: 'LTC-PLAN-04',
      level: 4,
      name: 'Plan 4 — Professional Heavy Rig',
      isFree: false,
      isElite: false,
      rentalPrice: 110,
      rentalPeriod: '30 Days',
      hashrate: '27,150.0 MH/s',
      hashrateValue: 27150.0,
      hashrateUnit: 'MH/s',
      powerUsage: '9,780 W',
      powerUsageNumeric: 9780,
      estimatedMonthlyOutput: '4.68 LTC',
      estimatedMonthlyOutputUsd: 395.00,
      hardwareModel: 'Antminer L7 Triple Tower',
      hardwareCount: 3,
      image: IMAGE_MAP.titan_node,
      description: 'Professional high capacity hardware with direct pool reporting interfaces and automatic board thermal cutoffs.',
      asicModel: 'Antminer L7 Standard Matrix',
      asicCount: 3,
      hashratePerAsic: '9,050.0 MH/s',
      powerUsagePerAsic: '3,260 W',
    },
    {
      id: 'LTC-PLAN-05',
      level: 5,
      name: 'Plan 5 — Advanced Professional Array',
      isFree: false,
      isElite: false,
      rentalPrice: 240,
      rentalPeriod: '30 Days',
      hashrate: '64,800.0 MH/s',
      hashrateValue: 64800.0,
      hashrateUnit: 'MH/s',
      powerUsage: '13,040 W',
      powerUsageNumeric: 13040,
      estimatedMonthlyOutput: '11.18 LTC',
      estimatedMonthlyOutputUsd: 945.00,
      hardwareModel: 'Antminer L9 Pro Quad-Rack',
      hardwareCount: 4,
      image: IMAGE_MAP.vortex_cluster,
      description: 'State-of-the-art Scrypt miners utilizing intelligent custom airflow grids to increase density parameters.',
      asicModel: 'Antminer L9 Pro Matrix',
      asicCount: 4,
      hashratePerAsic: '16,200.0 MH/s',
      powerUsagePerAsic: '3,260 W',
    },
    {
      id: 'LTC-PLAN-06',
      level: 6,
      name: 'Plan 6 — Elite Scrypt Titan Cluster',
      isFree: false,
      isElite: true,
      rentalPrice: 580,
      rentalPeriod: '30 Days',
      hashrate: '192,000.0 MH/s',
      hashrateValue: 192000.0,
      hashrateUnit: 'MH/s',
      powerUsage: '34,800 W',
      powerUsageNumeric: 34800,
      estimatedMonthlyOutput: '33.13 LTC',
      estimatedMonthlyOutputUsd: 2800.00,
      hardwareModel: 'HyperNova Scrypt Titan Octo-System',
      hardwareCount: 6,
      image: IMAGE_MAP.hypernova_cabinet,
      description: 'Our top Scrypt hardware configuration. Ultra-cooled copper-jacket nodes operating in dynamic frequency booster states.',
      asicModel: 'HyperNova Scrypt Immersion Heavy',
      asicCount: 6,
      hashratePerAsic: '32,000.0 MH/s',
      powerUsagePerAsic: '5,800 W',
    },
  ],
  XMR: [
    {
      id: 'XMR-PLAN-01',
      level: 1,
      name: 'Plan 1 — Free CPU Slot',
      isFree: true,
      isElite: false,
      rentalPrice: 0,
      rentalPeriod: 'Lifetime',
      hashrate: '7.2 KH/s',
      hashrateValue: 7.2,
      hashrateUnit: 'KH/s',
      powerUsage: '65 W',
      powerUsageNumeric: 65,
      estimatedMonthlyOutput: '0.015 XMR',
      estimatedMonthlyOutputUsd: 2.31,
      hardwareModel: 'AMD Ryzen 5 Basic Station',
      hardwareCount: 1,
      image: IMAGE_MAP.blade_chassis,
      description: 'Your starting CPU miner. Perfect low-power entry configuration utilizing dynamic cache optimizations.',
      cpuModel: 'AMD Ryzen 5 3600',
      cpuCount: 1,
      cores: 6,
      threads: 12,
    },
    {
      id: 'XMR-PLAN-02',
      level: 2,
      name: 'Plan 2 — High-Performance Core',
      isFree: false,
      isElite: false,
      rentalPrice: 8,
      rentalPeriod: '30 Days',
      hashrate: '22.5 KH/s',
      hashrateValue: 22.5,
      hashrateUnit: 'KH/s',
      powerUsage: '105 W',
      powerUsageNumeric: 105,
      estimatedMonthlyOutput: '0.082 XMR',
      estimatedMonthlyOutputUsd: 12.64,
      hardwareModel: 'AMD Ryzen 9 Workstation Slot',
      hardwareCount: 1,
      image: IMAGE_MAP.quantum_asic,
      description: 'High performance desktop microchip deployed inside our server racks with standard copper air coolers.',
      cpuModel: 'AMD Ryzen 9 5950X',
      cpuCount: 1,
      cores: 16,
      threads: 32,
    },
    {
      id: 'XMR-PLAN-03',
      level: 3,
      name: 'Plan 3 — Double Thread Array',
      isFree: false,
      isElite: false,
      rentalPrice: 15,
      rentalPeriod: '30 Days',
      hashrate: '54.0 KH/s',
      hashrateValue: 54.0,
      hashrateUnit: 'KH/s',
      powerUsage: '340 W',
      powerUsageNumeric: 340,
      estimatedMonthlyOutput: '0.198 XMR',
      estimatedMonthlyOutputUsd: 30.53,
      hardwareModel: 'Twin Ryzen 9 Extreme Platform',
      hardwareCount: 2,
      image: IMAGE_MAP.titan_node,
      description: 'Dual multi-threaded core structure. Utilizes double PCIe modules to maximize L3 cache speed parameters.',
      cpuModel: 'AMD Ryzen 9 7950X',
      cpuCount: 2,
      cores: 32,
      threads: 64,
    },
    {
      id: 'XMR-PLAN-04',
      level: 4,
      name: 'Plan 4 — Epic Server Node',
      isFree: false,
      isElite: false,
      rentalPrice: 32,
      rentalPeriod: '30 Days',
      hashrate: '110.0 KH/s',
      hashrateValue: 110.0,
      hashrateUnit: 'KH/s',
      powerUsage: '280 W',
      powerUsageNumeric: 280,
      estimatedMonthlyOutput: '0.404 XMR',
      estimatedMonthlyOutputUsd: 62.30,
      hardwareModel: 'Single AMD EPYC Workstation Server',
      hardwareCount: 1,
      image: IMAGE_MAP.kaspa_heavy,
      description: 'Professional high-density server chip with 64 physical cores, designed for non-stop multi-threaded processing.',
      cpuModel: 'AMD EPYC 7763',
      cpuCount: 1,
      cores: 64,
      threads: 128,
    },
    {
      id: 'XMR-PLAN-05',
      level: 5,
      name: 'Plan 5 — Dual Enterprise Rack',
      isFree: false,
      isElite: false,
      rentalPrice: 95,
      rentalPeriod: '30 Days',
      hashrate: '380.0 KH/s',
      hashrateValue: 380.0,
      hashrateUnit: 'KH/s',
      powerUsage: '720 W',
      powerUsageNumeric: 720,
      estimatedMonthlyOutput: '1.39 XMR',
      estimatedMonthlyOutputUsd: 214.34,
      hardwareModel: 'Dual AMD EPYC Core-Grid Chassis',
      hardwareCount: 2,
      image: IMAGE_MAP.vortex_cluster,
      description: 'Newer enterprise configuration. High core count architecture with redundant dual power backup interfaces.',
      cpuModel: 'AMD EPYC 9654',
      cpuCount: 2,
      cores: 192,
      threads: 384,
    },
    {
      id: 'XMR-PLAN-06',
      level: 6,
      name: 'Plan 6 — Elite Hyperthreaded Blade',
      isFree: false,
      isElite: true,
      rentalPrice: 210,
      rentalPeriod: '30 Days',
      hashrate: '980.0 KH/s',
      hashrateValue: 980.0,
      hashrateUnit: 'KH/s',
      powerUsage: '1,600 W',
      powerUsageNumeric: 1600,
      estimatedMonthlyOutput: '3.60 XMR',
      estimatedMonthlyOutputUsd: 555.12,
      hardwareModel: 'Quad AMD EPYC 9754 Superblade',
      hardwareCount: 4,
      image: IMAGE_MAP.hypernova_cabinet,
      description: 'The pinnacle of CPU monero hashing. Fully immersive hardware utilizing liquid heat exchangers to guarantee no clock drops.',
      cpuModel: 'AMD EPYC 9754 Dual-Duo',
      cpuCount: 4,
      cores: 512,
      threads: 1024,
    },
  ],
  RVN: [
    {
      id: 'GPU-PLAN-01',
      level: 1,
      name: 'Plan 1 — Free Single GPU Rig',
      isFree: true,
      isElite: false,
      rentalPrice: 0,
      rentalPeriod: 'Lifetime',
      hashrate: '14.0 MH/s',
      hashrateValue: 14.0,
      hashrateUnit: 'MH/s',
      powerUsage: '125 W',
      powerUsageNumeric: 125,
      estimatedMonthlyOutput: '110.0 RVN',
      estimatedMonthlyOutputUsd: 2.64,
      hardwareModel: 'GTX 1660S Starter Platform',
      hardwareCount: 1,
      image: IMAGE_MAP.blade_chassis,
      description: 'Your starting GPU Rig. Single 6GB GPU seated on an open-air frame, designed for easy diagnostic tracking.',
      gpuModel: 'NVIDIA GeForce GTX 1660 Super',
      gpuCount: 1,
      vram: '6 GB GDDR6',
      motherboard: 'MSI B450-A Pro Max',
      cpu: 'AMD Athlon 3000G',
      ram: '8GB DDR4 Crucial',
      psu: 'Corsair RM750x 750W',
      pcieRiser: 'VER009S High-Perf Risers',
      cooling: 'Open Air Chassis + 2x Corsair Fans',
      rigCapacity: '6 GPUs Max',
    },
    {
      id: 'GPU-PLAN-02',
      level: 2,
      name: 'Plan 2 — 4-GPU Mining Rig',
      isFree: false,
      isElite: false,
      rentalPrice: 10,
      rentalPeriod: '30 Days',
      hashrate: '60.0 MH/s',
      hashrateValue: 60.0,
      hashrateUnit: 'MH/s',
      powerUsage: '400 W',
      powerUsageNumeric: 400,
      estimatedMonthlyOutput: '470.0 RVN',
      estimatedMonthlyOutputUsd: 11.28,
      hardwareModel: 'RTX 3060Ti 4-GPU Hashing Frame',
      hardwareCount: 4,
      image: IMAGE_MAP.gpu_openair,
      description: 'First paid monthly setup. Multi-graphics card setup mounted on standard riser plates with gold-plated connectors.',
      gpuModel: 'NVIDIA GeForce RTX 3060 Ti',
      gpuCount: 4,
      vram: '8 GB GDDR6',
      motherboard: 'ASUS Prime Z390-P',
      cpu: 'Intel Core i3-9100F',
      ram: '8GB DDR4 Kingston',
      psu: 'EVGA SuperNOVA 1000 G+',
      pcieRiser: '6x PCIe VER009S Risers',
      cooling: 'Custom Aluminum Rig + 4x Noiseblocker Fans',
      rigCapacity: '6 GPUs Max',
    },
    {
      id: 'GPU-PLAN-03',
      level: 3,
      name: 'Plan 3 — Double Density Custom Rig',
      isFree: false,
      isElite: false,
      rentalPrice: 28,
      rentalPeriod: '30 Days',
      hashrate: '180.0 MH/s',
      hashrateValue: 180.0,
      hashrateUnit: 'MH/s',
      powerUsage: '880 W',
      powerUsageNumeric: 880,
      estimatedMonthlyOutput: '1,410.0 RVN',
      estimatedMonthlyOutputUsd: 33.84,
      hardwareModel: 'RTX 3070 Quad Pro Frame',
      hardwareCount: 4,
      image: IMAGE_MAP.gpu_openair,
      description: 'Advanced four-GPU structural platform. Balanced wattage load with custom dual server power supplies.',
      gpuModel: 'NVIDIA GeForce RTX 3070',
      gpuCount: 4,
      vram: '8 GB GDDR6',
      motherboard: 'ASRock H110 Pro BTC+',
      cpu: 'Intel Celeron G3930',
      ram: '16GB DDR4 Crucial Sport',
      psu: 'Dual EVGA 850W GQ (1700W Total)',
      pcieRiser: '13x PCIe VER009S Gold Risers',
      cooling: 'MiningCave Open Air Frame + 6x High-Flow Fans',
      rigCapacity: '8 GPUs Max',
    },
    {
      id: 'GPU-PLAN-04',
      level: 4,
      name: 'Plan 4 — Professional GPU Rig',
      isFree: false,
      isElite: false,
      rentalPrice: 70,
      rentalPeriod: '30 Days',
      hashrate: '450.0 MH/s',
      hashrateValue: 450.0,
      hashrateUnit: 'MH/s',
      powerUsage: '1,920 W',
      powerUsageNumeric: 1920,
      estimatedMonthlyOutput: '3,530.0 RVN',
      estimatedMonthlyOutputUsd: 84.72,
      hardwareModel: 'RTX 3080 Hex-Engine Closed Server',
      hardwareCount: 6,
      image: IMAGE_MAP.titan_node,
      description: 'Professional grade sealed server frame carrying integrated exhaust blowers to achieve low thermodynamic drag.',
      gpuModel: 'NVIDIA GeForce RTX 3080',
      gpuCount: 6,
      vram: '10 GB GDDR6X',
      motherboard: 'Biostar TB250-BTC PRO',
      cpu: 'Intel Core i5-7400',
      ram: '16GB G.Skill Aegis DDR4',
      psu: 'Server PSU Delta 2400W Plat + Breakout Board',
      pcieRiser: 'Sealed Server Case with PCIe Ribbons',
      cooling: 'High Static Pressure Delta Fans (4x 120mm)',
      rigCapacity: '8 GPUs Max',
    },
    {
      id: 'GPU-PLAN-05',
      level: 5,
      name: 'Plan 5 — Advanced Professional Octa',
      isFree: false,
      isElite: false,
      rentalPrice: 145,
      rentalPeriod: '30 Days',
      hashrate: '920.0 MH/s',
      hashrateValue: 920.0,
      hashrateUnit: 'MH/s',
      powerUsage: '2,560 W',
      powerUsageNumeric: 2560,
      estimatedMonthlyOutput: '7,210.0 RVN',
      estimatedMonthlyOutputUsd: 173.04,
      hardwareModel: 'RTX 4080 Super Octominer Station',
      hardwareCount: 8,
      image: IMAGE_MAP.vortex_cluster,
      description: 'Enterprise Octominer chassis. Direct motherboard slotting (zero risers) eliminates voltage latency drops completely.',
      gpuModel: 'NVIDIA GeForce RTX 4080 Super',
      gpuCount: 8,
      vram: '16 GB GDDR6X',
      motherboard: 'Octominer X12 Ultra Server Chassis',
      cpu: 'Intel Xeon E5-2650 v2',
      ram: '32GB DDR3 ECC Server Memory',
      psu: 'Dual HP Server PSU 1200W (2400W Integrated)',
      pcieRiser: 'Direct PCIe Slot Motherboard (No Risers)',
      cooling: 'Octominer 140mm High-RPM Server Fans (4x)',
      rigCapacity: '12 GPUs Max',
    },
    {
      id: 'GPU-PLAN-06',
      level: 6,
      name: 'Plan 6 — Elite GPU Mining Cluster',
      isFree: false,
      isElite: true,
      rentalPrice: 280,
      rentalPeriod: '30 Days',
      hashrate: '1,650.0 MH/s',
      hashrateValue: 1650.0,
      hashrateUnit: 'MH/s',
      powerUsage: '5,400 W',
      powerUsageNumeric: 5400,
      estimatedMonthlyOutput: '12,930.0 RVN',
      estimatedMonthlyOutputUsd: 310.32,
      hardwareModel: 'RTX 4090 Extreme Immersion Chamber',
      hardwareCount: 12,
      image: IMAGE_MAP.hypernova_cabinet,
      description: 'The pinnacle of graphic consensus hashing. 12 customized RTX 4090s submerged inside a dielectric fluid unit with automated chilling.',
      gpuModel: 'NVIDIA GeForce RTX 4090 Liquid Metal',
      gpuCount: 12,
      vram: '24 GB GDDR6X',
      motherboard: 'Octominer X12 Extreme immersion frame',
      cpu: 'Dual Intel Xeon Silver 4214',
      ram: '64GB DDR4 ECC Registered',
      psu: 'Triple Delta 2400W Titanium server PSUs',
      pcieRiser: 'Solid Copper Busbar direct slotting',
      cooling: 'Sealed Dielectric Submersion Chamber + External Chiller',
      rigCapacity: '12 GPUs Fully Loaded',
    },
  ],
};

// ----------------------------------------------------------------------
// React 19 Proof Error Boundary to catch Recharts runtime crashes
// ----------------------------------------------------------------------
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class SafeChartErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Recharts React 19 Conflict Caught - Mounting High-Fidelity SVG Path Fallback:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ----------------------------------------------------------------------
// High-Fidelity Custom SVG Area Chart Fallback Component
// ----------------------------------------------------------------------
interface CustomSvgChartProps {
  data: { time: string; hashrate: number }[];
  coinSym: string;
  unit: string;
}
const CustomSvgChart: React.FC<CustomSvgChartProps> = ({ data, coinSym, unit }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.hashrate);
  const maxVal = Math.max(...values) * 1.01;
  const minVal = Math.min(...values) * 0.99;
  const valRange = maxVal - minVal || 1;

  const width = 340;
  const height = 80;
  const paddingLeft = 35;
  const paddingRight = 10;
  const paddingTop = 10;
  const paddingBottom = 10;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.hashrate - minVal) / valRange) * chartHeight;
    return { x, y, hashrate: d.hashrate, time: d.time };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const strokeColor = coinSym === 'BTC' ? '#F59E0B' : coinSym === 'LTC' ? '#38BDF8' : coinSym === 'XMR' ? '#F97316' : '#F87171';
  const fillColor = coinSym === 'BTC' ? 'rgba(245, 158, 11, 0.15)' : coinSym === 'LTC' ? 'rgba(56, 189, 248, 0.15)' : coinSym === 'XMR' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(248, 113, 113, 0.15)';

  return (
    <div className="relative w-full h-full select-none" style={{ direction: 'ltr' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {[0, 0.5, 1].map((ratio, idx) => {
          const y = paddingTop + chartHeight * ratio;
          return (
            <line
              key={idx}
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="rgba(255,255,255,0.03)"
              strokeDasharray="2 3"
            />
          );
        })}

        <path d={areaPath} fill={fillColor} />
        <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.5} />

        <text x={4} y={paddingTop + 4} fill="#475569" fontSize={7} fontFamily="monospace">
          {maxVal.toFixed(1)}
        </text>
        <text x={4} y={paddingTop + chartHeight + 2} fill="#475569" fontSize={7} fontFamily="monospace">
          {minVal.toFixed(1)}
        </text>

        {points.map((p, idx) => (
          <rect
            key={idx}
            x={p.x - chartWidth / (data.length * 2)}
            y={0}
            width={chartWidth / data.length}
            height={height}
            fill="transparent"
            className="cursor-crosshair"
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ))}

        {hoverIndex !== null && points[hoverIndex] && (
          <>
            <line
              x1={points[hoverIndex].x}
              y1={paddingTop}
              x2={points[hoverIndex].x}
              y2={paddingTop + chartHeight}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <circle
              cx={points[hoverIndex].x}
              cy={points[hoverIndex].y}
              r={3.5}
              fill="#06080F"
              stroke={strokeColor}
              strokeWidth={1.5}
            />
          </>
        )}
      </svg>

      {hoverIndex !== null && points[hoverIndex] && (
        <div
          className="absolute z-10 bg-[#090D1A] border border-white/[0.08] rounded-md px-2 py-1 text-[9px] font-mono shadow-md pointer-events-none"
          style={{
            left: `${Math.min(
              width - 110,
              Math.max(40, (points[hoverIndex].x / width) * 100 - 15)
            )}%`,
            top: '-24px',
          }}
        >
          <div className="text-slate-500 font-bold">{points[hoverIndex].time}</div>
          <div className="text-slate-100 font-semibold mt-0.5">
            Speed: <span className="text-emerald-400">{points[hoverIndex].hashrate} {unit}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Unified Safe Hashrate Chart Component
// ----------------------------------------------------------------------
interface SafeHashrateChartProps {
  data: { time: string; hashrate: number }[];
  coinSym: string;
  unit: string;
}
const SafeHashrateChart: React.FC<SafeHashrateChartProps> = ({ data, coinSym, unit }) => {
  const strokeColor = coinSym === 'BTC' ? '#F59E0B' : coinSym === 'LTC' ? '#38BDF8' : coinSym === 'XMR' ? '#F97316' : '#F87171';
  const svgFallback = <CustomSvgChart data={data} coinSym={coinSym} unit={unit} />;

  return (
    <SafeChartErrorBoundary fallback={svgFallback}>
      <div className="w-full h-full" style={{ direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, left: -32, bottom: -5 }}>
            <defs>
              <linearGradient id={`grad-${coinSym}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.01)" />
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 6, fill: '#475569' }} tickLine={false} axisLine={false} />
            <RechartsTooltip
              contentStyle={{ backgroundColor: '#090D1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '4px 6px' }}
              labelStyle={{ color: '#64748B', fontSize: '7px', fontFamily: 'monospace' }}
              itemStyle={{ color: '#F8FAFC', fontSize: '8px', fontFamily: 'monospace', padding: 0 }}
              formatter={(value: any) => [`${value} ${unit}`, 'Speed']}
            />
            <Area
              type="monotone"
              dataKey="hashrate"
              stroke={strokeColor}
              fill={`url(#grad-${coinSym})`}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SafeChartErrorBoundary>
  );
};


// ----------------------------------------------------------------------
// Main MiningPage Component
// ----------------------------------------------------------------------
interface MiningPageProps {
  miners: Miner[];
  supportedAssets: CryptoAsset[];
  miningBalance: number;
}

export const MiningPage: React.FC<MiningPageProps> = ({ miningBalance }) => {
  // Main progression states
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>('BTC');
  const [selectedPlanLevel, setSelectedPlanLevel] = useState<number>(1);

  // Active progression configuration owned by the user (starts with level 1 - Free for all)
  const [activePlanIds, setActivePlanIds] = useState<Record<string, number>>({
    BTC: 1,
    LTC: 1,
    XMR: 1,
    RVN: 1,
  });

  // Power statuses of the user's running plans per coin
  const [runningStatuses, setRunningStatuses] = useState<Record<string, 'active' | 'paused'>>({
    BTC: 'active',
    LTC: 'active',
    XMR: 'paused',
    RVN: 'active',
  });

  // Select & Activate Miner Flow States
  const [pendingActivationPlan, setPendingActivationPlan] = useState<MiningPlan | null>(null);
  const [isActivatingPulse, setIsActivatingPulse] = useState<boolean>(false);

  // Expand states for individual hashrate history charts in My Mining Farm
  const [expandedCharts, setExpandedCharts] = useState<Record<string, boolean>>({
    BTC: true,
    LTC: false,
    XMR: false,
    RVN: false,
  });

  // Hashrate History data structures
  const [hashrateHistories, setHashrateHistories] = useState<Record<string, { time: string; hashrate: number }[]>>({});

  // Helper to generate 24-hour stability hashrate simulation
  const generateHistoryData = (baseVal: number) => {
    const points = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600 * 1000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const fluctuation = 1 + (Math.random() - 0.5) * 0.03;
      points.push({
        time: timeStr,
        hashrate: parseFloat((baseVal * fluctuation).toFixed(2)),
      });
    }
    return points;
  };

  // Generate histories on mount and whenever plan upgrades occur
  useEffect(() => {
    const nextHistories: Record<string, { time: string; hashrate: number }[] | any> = {};
    Object.entries(activePlanIds).forEach(([sym, lvl]) => {
      const plan = MINING_PLANS_BY_COIN[sym][lvl - 1];
      nextHistories[sym] = generateHistoryData(plan.hashrateValue);
    });
    setHashrateHistories(nextHistories);
  }, [activePlanIds]);

  // Simulator tracking live increment output
  const [tickerOffset, setTickerOffset] = useState<number>(0);
  const [liveLog, setLiveLog] = useState<string[]>([]);
  const [recentRewards] = useState<MiningRewardRecord[]>(MOCK_MINING_REWARDS);

  // Notice alerts
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Simulating live telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => prev + 0.000001);
      
      setHashrateHistories((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((sym) => {
          if (runningStatuses[sym] === 'active' && updated[sym]?.length > 0) {
            const arr = [...updated[sym]];
            const lastIndex = arr.length - 1;
            const lvl = activePlanIds[sym];
            const plan = MINING_PLANS_BY_COIN[sym][lvl - 1];
            const liveFluctuation = 1 + (Math.random() - 0.5) * 0.01;
            arr[lastIndex] = {
              ...arr[lastIndex],
              hashrate: parseFloat((plan.hashrateValue * liveFluctuation).toFixed(2)),
            };
            updated[sym] = arr;
          }
        });
        return updated;
      });

      if (Math.random() > 0.7) {
        const activeSymbols = Object.keys(runningStatuses).filter(sym => runningStatuses[sym] === 'active');
        if (activeSymbols.length > 0) {
          const sym = activeSymbols[Math.floor(Math.random() * activeSymbols.length)];
          const planLevel = activePlanIds[sym];
          const plan = MINING_PLANS_BY_COIN[sym][planLevel - 1];
          const messages = [
            `[Pool Gateway] Accepted share from ${sym} Node at stratum +tcp://pool.nexorina.org`,
            `[Telemetry] Temp ok · Fan Speed 84% on ${plan.hardwareModel}`,
            `[Diagnostic] Hashing board check completed: 0 HW errors. Speed ${plan.hashrate}`,
            `[Verification] Dynamic clock locked at optimal voltage for ${sym} configuration`,
          ];
          const text = messages[Math.floor(Math.random() * messages.length)];
          setLiveLog(prev => [text, ...prev.slice(0, 15)]);
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [activePlanIds, runningStatuses]);

  // Initial console feedback
  useEffect(() => {
    setLiveLog([
      '[Bootstrap] Connecting to Nexorina Mining Farm local rails...',
      '[Network] Connected to pool server #NX-Alpha-London with low latency ping (14ms)',
      '[Telemetry] Operational diagnostics verified for core hardware controllers',
      '[Cabinet] System initialization: Lifetime free starting nodes allocated',
    ]);
  }, []);

  // Compute live cumulative specs for active rigs
  const userActiveRigs = Object.entries(activePlanIds).map(([coinSym, lvl]) => {
    const plansList = MINING_PLANS_BY_COIN[coinSym];
    const currentPlan = plansList[lvl - 1];
    const isPaused = runningStatuses[coinSym] === 'paused';
    return {
      coinSym,
      plan: currentPlan,
      isPaused,
    };
  });

  const activeMinersCount = userActiveRigs.filter((r) => !r.isPaused).length;
  const totalPowerDraw = userActiveRigs.reduce((acc, r) => acc + (r.isPaused ? 0 : r.plan.powerUsageNumeric), 0);
  const totalDailyRewardsUsd = userActiveRigs.reduce((acc, r) => acc + (r.isPaused ? 0 : r.plan.estimatedMonthlyOutputUsd / 30), 0);

  // Active Coin Info
  const activeCoin = MINEABLE_COINS.find((c) => c.symbol === selectedCoinSymbol) || MINEABLE_COINS[0];
  const activeCoinPlans = MINING_PLANS_BY_COIN[selectedCoinSymbol];
  const selectedPlan = activeCoinPlans[selectedPlanLevel - 1];
  const userCurrentLevelForActiveCoin = activePlanIds[selectedCoinSymbol];

  // Upgrade & Activate Handler - Triggers the activation overlay (Step Select -> Confirm)
  const handleSelectPlanAction = (plan: MiningPlan) => {
    setPendingActivationPlan(plan);
  };

  // Final confirmation to add to My Mining Farm and start running
  const handleConfirmActivation = () => {
    if (!pendingActivationPlan) return;
    
    setIsActivatingPulse(true);

    setTimeout(() => {
      // Deploys the plan level in active state
      setActivePlanIds((prev) => ({
        ...prev,
        [selectedCoinSymbol]: pendingActivationPlan.level,
      }));
      setRunningStatuses((prev) => ({
        ...prev,
        [selectedCoinSymbol]: 'active',
      }));

      const isFree = pendingActivationPlan.isFree;
      const msg = isFree
        ? `Successfully activated Lifetime Free setup for ${selectedCoinSymbol}.`
        : `Deployed & Activated Level ${pendingActivationPlan.level} "${pendingActivationPlan.hardwareModel}" on your farm.`;

      triggerNotice(msg);
      setLiveLog((prev) => [
        `[Activation] SUCCESS · Mounted and synchronized ${selectedCoinSymbol} setup: ${pendingActivationPlan.hardwareModel}`,
        `[Pool Gateway] Starting consensus thread hashing at ${pendingActivationPlan.hashrate}`,
        ...prev,
      ]);

      setIsActivatingPulse(false);
      setPendingActivationPlan(null); // Closes confirmation
    }, 1000);
  };

  // Toggle active power status
  const handleTogglePower = (sym: string) => {
    const currentStatus = runningStatuses[sym];
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    setRunningStatuses((prev) => ({
      ...prev,
      [sym]: nextStatus,
    }));

    const plan = MINING_PLANS_BY_COIN[sym][activePlanIds[sym] - 1];
    triggerNotice(
      nextStatus === 'active'
        ? `Booted hardware arrays on ${sym} Miner (${plan.hardwareModel}).`
        : `Sparsely parked hashboards on ${sym} Miner (${plan.hardwareModel}).`
    );
    setLiveLog(prev => [
      nextStatus === 'active' 
        ? `[Control] Booting hash boards on ${sym} Rig...` 
        : `[Control] Pausing processing threads on ${sym} Rig. Standing down power draw.`,
      ...prev
    ]);
  };

  const toggleChartExpansion = (sym: string) => {
    setExpandedCharts((prev) => ({
      ...prev,
      [sym]: !prev[sym],
    }));
  };

  return (
    <div className="space-y-5">
      {/* 1. Header & Live Telemetry Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 mb-1">
            <Server className="h-3.5 w-3.5" />
            <span>COIN-BASED PROGRESSION FARMING SYSTEM</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              INTEGRATED HARDWARE RACKS OK
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            My Mining Farm
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 font-sans">
            Rent and configure physical hardware components mapped uniquely per algorithm. Upgrade your rigs to maximize total hashrate.
          </p>
        </div>

        {/* Live counter & alerts */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto font-mono">
          {actionNotice && (
            <div className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3 py-1.5 text-xs text-indigo-300 animate-in fade-in duration-200">
              <Check className="h-3.5 w-3.5 text-indigo-400" />
              <span>{actionNotice}</span>
            </div>
          )}

          <div className="bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex items-center gap-3.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">Live Pool Yield:</span>
              <span className="text-emerald-400 font-bold font-mono">
                +{tickerOffset.toFixed(8)} BTC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Summary Diagnostics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C101A] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wide text-slate-400 uppercase font-semibold">Active Miners Count</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-white font-mono">{activeMinersCount} / 4</div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Operational Hardware Racks</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C101A] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wide text-slate-400 uppercase font-semibold">Total Power Usage</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-white font-mono">{totalPowerDraw.toLocaleString()} W</div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Cabinet Limit: 110,000 W</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C101A] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wide text-slate-400 uppercase font-semibold">Daily Est. Rewards</span>
            <Coins className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-emerald-400 font-mono">${totalDailyRewardsUsd.toFixed(2)}</div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Estimated Output (Daily Equivalent)</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C101A] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wide text-slate-400 uppercase font-semibold">Rewards Balance</span>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold text-white font-mono">${miningBalance.toFixed(2)}</div>
            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Accumulated Ledger Earnings</p>
          </div>
        </div>
      </div>

      {/* 3. My Mining Farm — Cabinet overview displaying actual hardware images & real-time Hashrate history (Section 8) */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
            <Server className="h-4 w-4 text-indigo-400" /> My Mining Farm
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
            Your currently deployed and active hardware plans. Click any miner node to inspect its configurations or toggle live hashrate stability analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {userActiveRigs.map((rig) => {
            const coin = MINEABLE_COINS.find((c) => c.symbol === rig.coinSym) || MINEABLE_COINS[0];
            const isPaused = runningStatuses[rig.coinSym] === 'paused';
            const isChartExpanded = expandedCharts[rig.coinSym];
            const chartData = hashrateHistories[rig.coinSym] || [];

            return (
              <div
                key={rig.coinSym}
                onClick={() => {
                  setSelectedCoinSymbol(rig.coinSym);
                  setSelectedPlanLevel(rig.plan.level);
                }}
                className={`cursor-pointer rounded-xl border p-3.5 flex flex-col justify-between bg-black/40 hover:bg-white/[0.01] hover:border-indigo-500/50 transition-all group relative overflow-hidden ${
                  selectedCoinSymbol === rig.coinSym ? 'border-indigo-500 shadow-md shadow-indigo-500/10' : 'border-white/[0.05]'
                }`}
              >
                {/* Physical Image preview of the active configuration */}
                <div className="h-28 w-full rounded-lg overflow-hidden border border-white/[0.08] mb-3 relative bg-slate-950">
                  <img
                    src={rig.plan.image}
                    alt={rig.plan.hardwareModel}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-1.5 left-1.5 text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-indigo-400 border border-white/10">
                    Level {rig.plan.level} Setup
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                      {coin.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Alg: {coin.algorithm}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-1 truncate">
                    {rig.plan.hardwareModel}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2.5 pt-2 border-t border-white/[0.04]">
                    <span>Hashrate: <strong className="text-indigo-300">{rig.plan.hashrate}</strong></span>
                    <span>Units: <strong className="text-slate-300">{rig.plan.hardwareCount}</strong></span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Power: <strong>{isPaused ? '0 W' : rig.plan.powerUsage}</strong></span>
                    <span className={isPaused ? 'text-amber-400' : 'text-emerald-400'}>
                      {isPaused ? 'PAUSED' : 'ONLINE'}
                    </span>
                  </div>
                </div>

                {/* Real-time Hashrate History stability Chart */}
                <div className="mt-3.5 border-t border-white/[0.04] pt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleChartExpansion(rig.coinSym)}
                    className="w-full text-left text-[9px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center justify-between transition-colors mb-1.5"
                  >
                    <span>{isChartExpanded ? '▼ Hide Live Stability' : '▲ View Live Stability'}</span>
                    <span className="text-[8px] text-slate-600">Simulated 24h</span>
                  </button>

                  {isChartExpanded && chartData.length > 0 && (
                    <div className="h-20 w-full bg-black/40 border border-white/[0.03] rounded-lg p-1.5 animate-in slide-in-from-top-1.5 duration-150">
                      <SafeHashrateChart
                        data={chartData}
                        coinSym={rig.coinSym}
                        unit={rig.plan.hashrateUnit}
                      />
                    </div>
                  )}
                </div>

                {/* Inline Toggle Button */}
                <div className="mt-3 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleTogglePower(rig.coinSym)}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                      isPaused
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/25'
                    }`}
                  >
                    {isPaused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
                    <span>{isPaused ? 'BOOT' : 'PAUSE'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Splitted progression flow section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left 7 Columns: Selection of Mineable Coins & 6 Plan Cards with actual large hardware images */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Mineable Coins Selector Menu */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-4 sm:p-5">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block mb-1">
              Algorithms Configuration Hub
            </span>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
              <Sliders className="h-4 w-4 text-indigo-400" /> Select Mineable Coin
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              {MINEABLE_COINS.map((coin) => {
                const isActive = coin.symbol === selectedCoinSymbol;
                const userLvl = activePlanIds[coin.symbol];
                return (
                  <button
                    key={coin.symbol}
                    onClick={() => {
                      setSelectedCoinSymbol(coin.symbol);
                      setSelectedPlanLevel(userLvl);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isActive
                        ? 'border-indigo-500 bg-[#0F1424] shadow-md shadow-indigo-500/10'
                        : 'border-white/[0.06] bg-[#0C101F] hover:border-white/[0.12] hover:bg-[#0D1222]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`h-6 w-6 rounded flex items-center justify-center font-mono font-bold text-[10px] ${coin.logoColor}`}>
                        {coin.symbol}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">Level {userLvl}</span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-white">{coin.name}</h4>
                      <span className="text-[9px] font-mono text-slate-500 block mt-0.5">{coin.algorithm} · {coin.hardwareType}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6 Mining Plan cards with Select Plan actions */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-4 sm:p-5">
            <div className="pb-3 border-b border-white/[0.06] mb-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                  Upgrade & Progression Path
                </span>
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  6-Level Mining Plans for {activeCoin.name} ({activeCoin.algorithm})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Current Equipped: Level {userCurrentLevelForActiveCoin}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeCoinPlans.map((plan) => {
                const isUserActive = activePlanIds[selectedCoinSymbol] === plan.level;
                const isSelectedToInspect = selectedPlanLevel === plan.level;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanLevel(plan.level)}
                    className={`cursor-pointer rounded-xl border transition-all p-3.5 bg-black/30 flex flex-col justify-between group relative overflow-hidden ${
                      isSelectedToInspect
                        ? 'border-indigo-500 bg-[#0F1424] shadow-sm'
                        : isUserActive
                        ? 'border-emerald-500/50 bg-emerald-500/[0.01]'
                        : 'border-white/[0.05] hover:border-white/10 hover:bg-[#0C101F]'
                    }`}
                  >
                    {/* Hardware image corresponding to plan */}
                    <div className="h-32 w-full rounded-lg overflow-hidden border border-white/[0.08] relative bg-slate-950 mb-3 flex-shrink-0">
                      <img
                        src={plan.image}
                        alt={plan.hardwareModel}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/85 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono border border-white/15 text-indigo-400">
                        Plan Level {plan.level} {plan.isFree ? '· Free' : ''} {plan.isElite ? '· Elite' : ''}
                      </div>

                      {isSelectedToInspect && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-indigo-600 border border-indigo-400 flex items-center justify-center text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}

                      {isUserActive && (
                        <span className="absolute bottom-2 right-2 text-[8px] bg-emerald-500/90 text-black px-1.5 py-0.5 rounded font-mono font-bold">
                          ACTIVE SETUP
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 font-semibold truncate max-w-[130px]">
                          {plan.name}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400">
                          Est. ${plan.estimatedMonthlyOutputUsd}/mo
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors">
                        {plan.hardwareModel}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 mt-1">
                        <span>Hashrate: {plan.hashrate}</span>
                        <span>·</span>
                        <span>Power: {plan.powerUsage}</span>
                      </div>
                    </div>

                    {/* Step Select Plan Button action */}
                    <div className="mt-3.5 pt-2 border-t border-white/[0.04] flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        {plan.isFree ? 'Free' : `$${plan.rentalPrice}.00`}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanLevel(plan.level);
                          handleSelectPlanAction(plan);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold transition-all ${
                          isUserActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 pointer-events-none'
                            : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white'
                        }`}
                      >
                        {isUserActive ? 'Running' : 'Select Plan'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Inspect Specifications & Details Inspect Panel */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-full blur-2xl pointer-events-none" />

            <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 border border-white/[0.08] bg-slate-950">
              <img
                src={selectedPlan.image}
                alt={selectedPlan.hardwareModel}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D17] via-[#0A0D17]/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-200 font-semibold bg-black/75 backdrop-blur px-2 py-0.5 rounded border border-white/10">
                  Level {selectedPlan.level} Specification Detail
                </span>
                <span className="text-indigo-300 font-bold bg-black/75 backdrop-blur px-2 py-0.5 rounded border border-white/10">
                  {selectedPlan.hashrate}
                </span>
              </div>
            </div>

            {/* Spec metadata headers */}
            <div className="pb-3.5 border-b border-white/[0.06] mb-4">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block font-bold">
                  {activeCoin.symbol} Mining Plan Spec
                </span>
                
                {activePlanIds[selectedCoinSymbol] === selectedPlan.level ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider">
                    Equipped & Running
                  </span>
                ) : selectedPlan.isElite ? (
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold uppercase">
                    Elite System
                  </span>
                ) : null}
              </div>

              <h3 className="text-base font-bold text-white mt-1">
                {selectedPlan.hardwareModel}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {selectedPlan.description}
              </p>
            </div>

            {/* Detailed specifications matrix */}
            <div className="space-y-3 font-mono text-[11px]">
              
              <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block pb-1 border-b border-white/[0.05]">
                  Hardware Specification Matrix
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-1">
                    <span className="text-slate-500">Mineable Coin:</span>
                    <span className="text-white font-bold">{selectedCoinSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-1">
                    <span className="text-slate-500">Algorithm:</span>
                    <span className="text-white font-semibold">{activeCoin.algorithm}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-1">
                    <span className="text-slate-500">Hardware Type:</span>
                    <span className="text-white font-semibold">{activeCoin.hardwareType}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-1">
                    <span className="text-slate-500">Hardware Count:</span>
                    <span className="text-white font-bold">{selectedPlan.hardwareCount} Unit(s)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-1">
                    <span className="text-slate-500">Total Hashrate:</span>
                    <span className="text-indigo-400 font-bold">{selectedPlan.hashrate}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/[0.03] pb-1">
                    <span className="text-slate-500">Power Usage:</span>
                    <span className="text-amber-400 font-semibold">{selectedPlan.powerUsage}</span>
                  </div>
                </div>
              </div>

              {/* ASIC SPECIFIC SHEETS */}
              {activeCoin.hardwareType === 'ASIC' && (
                <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl space-y-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block pb-1 border-b border-white/[0.05]">
                    ASIC Chip Specifications
                  </span>
                  <div className="space-y-1 text-xs pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">ASIC Model:</span>
                      <span className="text-slate-200 font-bold">{selectedPlan.asicModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ASIC Count:</span>
                      <span className="text-slate-200">{selectedPlan.asicCount} modules</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hashrate per ASIC:</span>
                      <span className="text-slate-200 font-semibold">{selectedPlan.hashratePerAsic}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Power Draw per ASIC:</span>
                      <span className="text-slate-200">{selectedPlan.powerUsagePerAsic}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeCoin.hardwareType === 'CPU' && (
                <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl space-y-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block pb-1 border-b border-white/[0.05]">
                    CPU Processor Specifications
                  </span>
                  <div className="space-y-1 text-xs pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">CPU Model:</span>
                      <span className="text-slate-200 font-bold">{selectedPlan.cpuModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CPU Count:</span>
                      <span className="text-slate-200">{selectedPlan.cpuCount} socket node</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cores Configuration:</span>
                      <span className="text-indigo-300 font-bold">{selectedPlan.cores} Cores</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Threads:</span>
                      <span className="text-slate-200">{selectedPlan.threads} Threads</span>
                    </div>
                  </div>
                </div>
              )}

              {activeCoin.hardwareType === 'GPU Mining Rig' && (
                <div className="bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl space-y-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block pb-1 border-b border-white/[0.05]">
                    GPU Mining Rig Specifications
                  </span>
                  <div className="space-y-1 text-xs pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPU Model:</span>
                      <span className="text-slate-200 font-bold">{selectedPlan.gpuModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">GPU Count Matrix:</span>
                      <span className="text-indigo-400 font-bold">{selectedPlan.gpuCount} × GPUs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dedicated VRAM:</span>
                      <span className="text-slate-200">{selectedPlan.vram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Server Motherboard:</span>
                      <span className="text-slate-400 text-[10px] max-w-[170px] truncate">{selectedPlan.motherboard}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Control CPU / RAM:</span>
                      <span className="text-slate-200 text-[10px]">{selectedPlan.cpu} / {selectedPlan.ram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Power Supplying PSU:</span>
                      <span className="text-slate-400 text-[10px] max-w-[170px] truncate">{selectedPlan.psu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PCIe / Riser Deck:</span>
                      <span className="text-slate-200 text-[10px]">{selectedPlan.pcieRiser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cooling Protocol:</span>
                      <span className="text-slate-400 text-[10px] max-w-[170px] truncate">{selectedPlan.cooling}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Outputs parameters */}
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Estimated output equivalent:</span>
                  <span className="text-emerald-400 font-bold">{selectedPlan.estimatedMonthlyOutput} / month</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/[0.05] pt-1.5">
                  <span className="text-slate-400">Projected Yield Value:</span>
                  <span className="text-white font-bold">${selectedPlan.estimatedMonthlyOutputUsd.toFixed(2)} / month</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/[0.05] pt-1.5">
                  <span className="text-slate-400">Rental Price:</span>
                  <span className="text-indigo-300 font-bold">
                    {selectedPlan.isFree ? 'Free starting setup' : `$${selectedPlan.rentalPrice}.00 USD / {selectedPlan.rentalPeriod}`}
                  </span>
                </div>
              </div>

            </div>

            {/* Select Plan Trigger */}
            <div className="mt-5">
              {activePlanIds[selectedCoinSymbol] === selectedPlan.level ? (
                <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Selected Configuration Deployed
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleSelectPlanAction(selectedPlan)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.01] flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Select & Activate Setup</span>
                </button>
              )}
            </div>

            {/* Static caution banner */}
            <div className="mt-3.5 flex gap-2 p-2.5 rounded-lg bg-amber-500/[0.03] border border-amber-500/15 text-[10px] text-amber-500/80 font-mono">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-500" />
              <p className="leading-relaxed font-sans">
                Profitability is not guaranteed. Future outputs are simulated estimations based on network difficulty and pool performance.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 5. Verified Ledger of Recent Mining Rewards */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div>
            <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5 uppercase font-mono">
              <Coins className="h-4 w-4 text-amber-400" /> Recent Rewards Ledger
            </h3>
            <span className="text-[10px] text-slate-400 font-mono block">
              Direct verification of decentralized pools to your Nexorina rewards balance.
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            STRATUM POOL OK
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {recentRewards.map((reward) => {
            return (
              <div
                key={reward.id}
                className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors text-xs font-mono flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-[10px]">
                    {reward.asset}
                  </div>
                  <div>
                    <span className="text-white font-bold block">{reward.amountCrypto}</span>
                    <span className="text-[9px] text-slate-500 block mt-0.5">Block {reward.blockHash} · {reward.timestamp}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">+${reward.amountUsd.toFixed(2)}</span>
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">{reward.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Step Select Plan -> Confirmation & Activation Modal Overlay */}
      {pendingActivationPlan && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#070A13] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl animate-in scale-in duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-black/40">
              <div className="flex items-center gap-2 font-mono">
                <Server className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-300 uppercase">Confirm Miner Activation</span>
              </div>
              <button 
                onClick={() => setPendingActivationPlan(null)} 
                className="p-1 rounded-lg hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 font-mono text-xs">
              
              {/* Core hardware image matching the plan precisely */}
              <div className="h-44 w-full rounded-xl overflow-hidden border border-white/[0.08] relative bg-slate-950 flex-shrink-0">
                <img
                  src={pendingActivationPlan.image}
                  alt={pendingActivationPlan.hardwareModel}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-2 left-2 flex items-center bg-black/75 px-2.5 py-0.5 rounded text-[9px] font-bold border border-white/10 text-indigo-400">
                  LEVEL {pendingActivationPlan.level} SETUP
                </div>
              </div>

              {/* Confirmation Details Card */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 space-y-2.5">
                <div className="flex justify-between items-center border-b border-white/[0.03] pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px]">Mineable Coin:</span>
                  <span className="text-white font-bold">{selectedCoinSymbol} ({activeCoin.name})</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.03] pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px]">Mining Plan name:</span>
                  <span className="text-white font-bold text-right">{pendingActivationPlan.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.03] pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px]">Miner Configuration:</span>
                  <span className="text-indigo-400 font-bold text-right truncate max-w-[220px]">
                    {pendingActivationPlan.hardwareModel} ({pendingActivationPlan.hardwareCount} Unit)
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.03] pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px]">Total Hashrate:</span>
                  <span className="text-emerald-400 font-bold">{pendingActivationPlan.hashrate}</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/[0.03] pb-1.5">
                  <span className="text-slate-500 uppercase text-[10px]">Power Usage:</span>
                  <span className="text-amber-400 font-bold">{pendingActivationPlan.powerUsage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase text-[10px]">Monthly Plan Price:</span>
                  <span className="text-white font-bold">
                    {pendingActivationPlan.isFree ? 'Free starting setup' : `$${pendingActivationPlan.rentalPrice}.00 USD`}
                  </span>
                </div>
              </div>

              {/* Warnings caution line */}
              <div className="flex gap-2 p-3 rounded-lg bg-indigo-500/[0.03] border border-indigo-500/10 text-[10px] text-indigo-400/80 leading-relaxed font-sans">
                <Info className="h-4 w-4 shrink-0 text-indigo-400" />
                <p>
                  By clicking activate, this hardware array will replace the current setup for {selectedCoinSymbol} in your cabinet. It will begin stratum hashing instantly.
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-5 py-4 border-t border-white/[0.06] bg-black/40 flex items-center justify-end gap-2.5 font-mono">
              <button
                onClick={() => setPendingActivationPlan(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-[11px] transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmActivation}
                disabled={isActivatingPulse}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isActivatingPulse ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Activate Miner</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
