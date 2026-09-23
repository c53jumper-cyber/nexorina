import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, RefreshCw, UserCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { authService } from '../../backend/auth/authService';
import { SystemRole } from '../../shared/types/rbac';

interface AdminAccessDeniedProps {
  onReturnToUser: () => void;
  onRoleChanged: () => void;
}

export const AdminAccessDenied: React.FC<AdminAccessDeniedProps> = ({
  onReturnToUser,
  onRoleChanged,
}) => {
  const currentRole = authService.getCurrentRole();

  const handleSwitchRole = (newRole: SystemRole) => {
    authService.setRole(newRole);
    onRoleChanged();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-lg w-full p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-b from-[#140810] via-[#0E0B16] to-[#080B12] shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <Lock className="h-8 w-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold mb-2">
              HTTP 403 FORBIDDEN · SERVER AUTHORIZATION DENIED
            </span>
            <h1 className="text-2xl font-bold text-white font-display">
              دسترسی به پنل مدیریت امکان‌پذیر نیست
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              حساب کاربری فعال شما در سطح دسترسی <strong className="text-rose-400">[{currentRole}]</strong> تعریف شده است.
              بر اساس خط‌مشی‌های امنیتی بک‌اند Nexorina، کاربران عادی مجاز به دسترسی به ماژول‌های مدیریتی نیستند.
            </p>
          </div>

          {/* Technical Error Box */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-right font-mono text-[11px] text-slate-400">
            <div><span className="text-slate-500">Error Code:</span> ERR_ADMIN_ACCESS_FORBIDDEN</div>
            <div><span className="text-slate-500">Server Policy:</span> RBAC_VALIDATION_STRICT</div>
            <div><span className="text-slate-500">Required Privilege:</span> Super Admin | Admin | Manager | Finance | Support</div>
          </div>

          {/* Live Developer Role Switcher */}
          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] text-xs">
            <div className="flex items-center justify-center gap-1.5 text-indigo-300 font-semibold mb-2">
              <UserCheck className="h-4 w-4" />
              <span>شبیه‌ساز نقش‌ها برای تست دسترسی (Dev Role Switcher):</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              برای ورود به پنل مدیریت، نقش سشن خود را به یکی از مدیران تغییر دهید:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(['Super Admin', 'Admin', 'Finance', 'Manager', 'Support'] as SystemRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleSwitchRole(r)}
                  className="px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/40 text-indigo-200 text-xs font-mono font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  ورود به عنوان {r}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={onReturnToUser}
              className="w-full justify-center"
            >
              بازگشت به پنل کاربری (User App)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
