"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserRole } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ROLE_LABELS,
  USER_ROLES,
  type UserRoleValue,
} from "@/lib/admin-constants";

type Props = { userId: string; current: UserRoleValue; isSelf: boolean };

export function UserRoleForm({ userId, current, isSelf }: Props) {
  const router = useRouter();
  const [role, setRole] = useState<UserRoleValue>(current);
  const [pending, startTransition] = useTransition();

  const onSave = () =>
    startTransition(async () => {
      const result = await updateUserRole(userId, role);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-5">
      <Label htmlFor="role">نقش کاربر</Label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRoleValue)}
        disabled={isSelf || pending}
        className="h-10 w-full rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        {USER_ROLES.map((r) => (
          <option key={r} value={r}>
            {ROLE_LABELS[r]}
          </option>
        ))}
      </select>
      {isSelf && (
        <p className="text-xs text-muted-foreground">
          نقش حساب خودتان قابل تغییر نیست.
        </p>
      )}
      <Button
        type="button"
        className="w-full"
        onClick={onSave}
        disabled={isSelf || pending || role === current}
      >
        {pending ? "در حال ذخیره..." : "ذخیره نقش"}
      </Button>
    </div>
  );
}
