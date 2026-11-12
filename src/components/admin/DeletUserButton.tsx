"use client";

import { deleteUser } from "@/actions/user";
import { ConfirmDelete } from "./ConfirmDelet";

export function DeleteUserButton({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  return (
    <ConfirmDelete
      label="حذف کاربر"
      title="حذف کاربر"
      description={`آیا از حذف «${userName}» مطمئن هستید؟ سبد خرید و علاقه‌مندی‌های او هم حذف می‌شود. این کار قابل بازگشت نیست.`}
      action={() => deleteUser(userId)}
      redirectTo="/admin/users"
    />
  );
}
