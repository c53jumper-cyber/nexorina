/**
 * Nexorina Enterprise Relational Schema Architecture (PostgreSQL DDL Specification)
 * Strictly decoupled domain models for User Application, Admin Application, and Ledger.
 */

export interface DbTableDefinition {
  tableName: string;
  domain: 'identity' | 'mining' | 'trading' | 'casino' | 'growth' | 'finance' | 'support' | 'governance';
  description: string;
  columns: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isNullable?: boolean;
    isUnique?: boolean;
    references?: string;
    description: string;
  }[];
}

export const NEXORINA_SCHEMA_TABLES: DbTableDefinition[] = [
  // 1. Identity & Access Management
  {
    tableName: 'users',
    domain: 'identity',
    description: 'Registered user entities with credentials and KYC tier',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Primary user key' },
      { name: 'username', type: 'VARCHAR(64)', isUnique: true, description: 'Unique handle' },
      { name: 'email', type: 'VARCHAR(255)', isUnique: true, description: 'Verified contact email' },
      { name: 'password_hash', type: 'VARCHAR(255)', description: 'Argon2id cryptographic hash' },
      { name: 'invitation_code_id', type: 'UUID', references: 'invitations(id)', description: 'Mandatory referral code' },
      { name: 'role_id', type: 'UUID', references: 'roles(id)', description: 'Access classification' },
      { name: 'status', type: 'VARCHAR(32)', description: 'active | suspended | pending_verification' },
      { name: 'two_factor_enabled', type: 'BOOLEAN', description: 'TOTP authentication flag' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Account instantiation timestamp' },
    ],
  },
  {
    tableName: 'admin_users',
    domain: 'identity',
    description: 'Internal administrative operators with privileged roles',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Admin operator identifier' },
      { name: 'username', type: 'VARCHAR(64)', isUnique: true, description: 'Admin handle' },
      { name: 'email', type: 'VARCHAR(255)', isUnique: true, description: 'Corporate email' },
      { name: 'role_id', type: 'UUID', references: 'roles(id)', description: 'Assigned RBAC role' },
      { name: 'department', type: 'VARCHAR(64)', description: 'Operations | Finance | Security | Compliance' },
      { name: 'status', type: 'VARCHAR(32)', description: 'active | disabled' },
      { name: 'last_login_ip', type: 'INET', description: 'IP address of last login' },
    ],
  },
  {
    tableName: 'roles',
    domain: 'identity',
    description: 'System roles: Super Admin, Admin, Manager, Support, Finance, Moderator, Analyst, User',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Role identifier' },
      { name: 'slug', type: 'VARCHAR(64)', isUnique: true, description: 'super_admin | admin | finance ...' },
      { name: 'title_fa', type: 'VARCHAR(128)', description: 'Persian title for administrative UI' },
      { name: 'title_en', type: 'VARCHAR(128)', description: 'English title' },
      { name: 'is_system_protected', type: 'BOOLEAN', description: 'Prevents deletion of core roles' },
    ],
  },
  {
    tableName: 'permissions',
    domain: 'identity',
    description: 'Granular resource action permissions',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Permission identifier' },
      { name: 'role_id', type: 'UUID', references: 'roles(id)', description: 'Target role' },
      { name: 'resource', type: 'VARCHAR(64)', description: 'Target domain resource' },
      { name: 'action', type: 'VARCHAR(32)', description: 'read | write | delete | audit | approve' },
    ],
  },
  {
    tableName: 'invitations',
    domain: 'identity',
    description: 'Cryptographic invite tokens required for account registration',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Invitation identifier' },
      { name: 'code', type: 'VARCHAR(32)', isUnique: true, description: 'Unique alphanumeric token' },
      { name: 'creator_admin_id', type: 'UUID', references: 'admin_users(id)', description: 'Issuing admin' },
      { name: 'usage_limit', type: 'INTEGER', description: 'Maximum allowed redemptions' },
      { name: 'used_count', type: 'INTEGER', description: 'Current redemptions count' },
      { name: 'status', type: 'VARCHAR(32)', description: 'Active | Expired | Disabled | Used Up' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', description: 'Expiration cutoff' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Generation timestamp' },
    ],
  },
  {
    tableName: 'sessions',
    domain: 'identity',
    description: 'Active client sessions, refresh tokens, and device fingerprints',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Session token identifier' },
      { name: 'user_id', type: 'UUID', references: 'users(id)', description: 'Session owner' },
      { name: 'device_name', type: 'VARCHAR(128)', description: 'Client hardware / OS fingerprint' },
      { name: 'ip_address', type: 'INET', description: 'Client IP' },
      { name: 'last_active_at', type: 'TIMESTAMPTZ', description: 'Keepalive timestamp' },
      { name: 'expires_at', type: 'TIMESTAMPTZ', description: 'TTL boundary' },
    ],
  },
  {
    tableName: 'security_events',
    domain: 'identity',
    description: 'Security & authentication telemetry events',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Event identifier' },
      { name: 'user_id', type: 'UUID', isNullable: true, references: 'users(id)', description: 'Target user' },
      { name: 'event_type', type: 'VARCHAR(64)', description: 'LOGIN_FAILED | SUSPICIOUS_IP | 2FA_LOCK' },
      { name: 'severity', type: 'VARCHAR(16)', description: 'low | medium | high | critical' },
      { name: 'ip_address', type: 'INET', description: 'Source IP address' },
      { name: 'details', type: 'TEXT', description: 'Diagnostic metadata' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Event timestamp' },
    ],
  },

  // 2. Mining Domain
  {
    tableName: 'miners',
    domain: 'mining',
    description: 'Virtual and cloud hashrate contract units',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Miner unit ID' },
      { name: 'name', type: 'VARCHAR(64)', description: 'Miner cluster name' },
      { name: 'hashrate_th', type: 'NUMERIC(18, 4)', description: 'Nominal hashrate in TH/s' },
      { name: 'reward_rate', type: 'VARCHAR(32)', description: 'Expected yield' },
      { name: 'status', type: 'VARCHAR(32)', description: 'active | paused | maintenance' },
    ],
  },
  {
    tableName: 'mining_rewards',
    domain: 'mining',
    description: 'Periodic stratum distribution batches and payouts',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Reward distribution ID' },
      { name: 'user_id', type: 'UUID', references: 'users(id)', description: 'Recipient user' },
      { name: 'miner_id', type: 'UUID', references: 'miners(id)', description: 'Originating rig' },
      { name: 'amount_crypto', type: 'NUMERIC(18, 8)', description: 'Mined cryptocurrency' },
      { name: 'usd_equivalent', type: 'NUMERIC(18, 2)', description: 'Mark-to-market value' },
      { name: 'settled_at', type: 'TIMESTAMPTZ', description: 'Ledger finalization time' },
    ],
  },

  // 3. Trading & AI Bot Domain
  {
    tableName: 'trading_assets',
    domain: 'trading',
    description: 'Supported spot and derivative trading pairs',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Asset pair ID' },
      { name: 'symbol', type: 'VARCHAR(16)', isUnique: true, description: 'BTC/USDT, ETH/USDT, ...' },
      { name: 'base_asset', type: 'VARCHAR(8)', description: 'BTC' },
      { name: 'quote_asset', type: 'VARCHAR(8)', description: 'USDT' },
      { name: 'is_active', type: 'BOOLEAN', description: 'Execution availability flag' },
    ],
  },
  {
    tableName: 'trading_signals',
    domain: 'trading',
    description: 'Algorithmic trigger signals emitted by quantitative models',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Signal ID' },
      { name: 'pair', type: 'VARCHAR(16)', description: 'Trading pair' },
      { name: 'direction', type: 'VARCHAR(8)', description: 'LONG | SHORT' },
      { name: 'confidence_percent', type: 'INTEGER', description: 'Model statistical confidence' },
      { name: 'entry_zone', type: 'VARCHAR(64)', description: 'Recommended entry range' },
      { name: 'stop_loss', type: 'VARCHAR(64)', description: 'Invalidation trigger price' },
      { name: 'status', type: 'VARCHAR(32)', description: 'Active | Target Hit | Expired' },
    ],
  },
  {
    tableName: 'trading_bots',
    domain: 'trading',
    description: 'Autonomous execution bot configurations and live runtime state',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Bot configuration ID' },
      { name: 'user_id', type: 'UUID', references: 'users(id)', description: 'Bot creator' },
      { name: 'strategy_type', type: 'VARCHAR(32)', description: 'DCA Grid | Momentum | Arbitrage' },
      { name: 'allocated_margin', type: 'NUMERIC(18, 2)', description: 'Allocated USD margin' },
      { name: 'max_drawdown_percent', type: 'INTEGER', description: 'Hard circuit breaker threshold' },
      { name: 'status', type: 'VARCHAR(32)', description: 'Active | Paused | Stopped' },
    ],
  },
  {
    tableName: 'trading_positions',
    domain: 'trading',
    description: 'Active open simulated market positions',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Position ID' },
      { name: 'user_id', type: 'UUID', references: 'users(id)', description: 'Position holder' },
      { name: 'pair', type: 'VARCHAR(16)', description: 'Trading pair' },
      { name: 'side', type: 'VARCHAR(8)', description: 'LONG | SHORT' },
      { name: 'margin_usd', type: 'NUMERIC(18, 2)', description: 'Collateral' },
      { name: 'entry_price', type: 'NUMERIC(18, 4)', description: 'Execution price' },
      { name: 'current_pnl_usd', type: 'NUMERIC(18, 2)', description: 'Unrealized profit/loss' },
    ],
  },

  // 4. Financial & Wallet Domain
  {
    tableName: 'wallets',
    domain: 'finance',
    description: 'Consolidated multi-vault ledger accounts',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Wallet container ID' },
      { name: 'user_id', type: 'UUID', isUnique: true, references: 'users(id)', description: 'Account owner' },
      { name: 'total_balance_usd', type: 'NUMERIC(18, 2)', description: 'Consolidated mark-to-market' },
      { name: 'available_balance_usd', type: 'NUMERIC(18, 2)', description: 'Liquid margin' },
      { name: 'locked_balance_usd', type: 'NUMERIC(18, 2)', description: 'Escrow and order collateral' },
    ],
  },
  {
    tableName: 'transactions',
    domain: 'finance',
    description: 'Immutable double-entry transaction ledger',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Transaction journal entry' },
      { name: 'wallet_id', type: 'UUID', references: 'wallets(id)', description: 'Affected wallet' },
      { name: 'tx_type', type: 'VARCHAR(32)', description: 'DEPOSIT | WITHDRAWAL | REWARD | FEE' },
      { name: 'amount', type: 'NUMERIC(18, 8)', description: 'Transaction quantity' },
      { name: 'currency', type: 'VARCHAR(8)', description: 'USDT | BTC | ETH | SOL' },
      { name: 'status', type: 'VARCHAR(32)', description: 'COMPLETED | PENDING | REJECTED' },
      { name: 'created_at', type: 'TIMESTAMPTZ', description: 'Ledger insertion time' },
    ],
  },

  // 5. Governance & Audit Domain
  {
    tableName: 'audit_logs',
    domain: 'governance',
    description: 'Immutable forensic audit trail for all administrative actions',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, description: 'Audit record key' },
      { name: 'admin_id', type: 'UUID', references: 'admin_users(id)', description: 'Operator ID' },
      { name: 'action', type: 'VARCHAR(64)', description: 'Action classification' },
      { name: 'target', type: 'VARCHAR(128)', description: 'Target user, setting, or module' },
      { name: 'previous_value', type: 'TEXT', description: 'Snapshot before change' },
      { name: 'new_value', type: 'TEXT', description: 'Applied configuration state' },
      { name: 'ip_address', type: 'INET', description: 'Request origin IP' },
      { name: 'timestamp', type: 'TIMESTAMPTZ', description: 'Forensic timestamp' },
      { name: 'result', type: 'VARCHAR(32)', description: 'SUCCESS | FAILED' },
    ],
  },
  {
    tableName: 'system_settings',
    domain: 'governance',
    description: 'Global protocol parameters, fee schedules, and maintenance switches',
    columns: [
      { name: 'key', type: 'VARCHAR(64)', isPrimary: true, description: 'Configuration key' },
      { name: 'value', type: 'TEXT', description: 'Serialized JSON configuration' },
      { name: 'category', type: 'VARCHAR(32)', description: 'security | trading | finance | general' },
      { name: 'last_updated_by', type: 'UUID', references: 'admin_users(id)', description: 'Author admin' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', description: 'Modification timestamp' },
    ],
  },
];
