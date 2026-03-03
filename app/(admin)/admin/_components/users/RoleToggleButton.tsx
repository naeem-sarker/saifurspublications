"use client";

import { updateUserRole } from "@/actions/userActions";
import { useState } from "react";
import { toast } from "sonner";

export default function RoleToggleButton({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(currentRole);

  const handleToggle = async () => {
    const nextRole = role === "MODERATOR" ? "USER" : "MODERATOR";

    if (!confirm(`Are you sure you want to make this user a ${nextRole}?`)) return;

    setLoading(true);
    const result = await updateUserRole(userId, nextRole);

    if (result.success) {
      setRole(nextRole);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded text-white transition-colors ${role === "MODERATOR" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      {loading ? "Processing..." : role === "MODERATOR" ? "Demote to User" : "Make Moderator"}
    </button>
  );
}