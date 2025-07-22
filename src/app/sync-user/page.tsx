
"use client";

import { LoaderFour } from "../../components/ui/loader";
import { useEffect } from "react";

export default function SyncUserPage() {
  useEffect(() => {
    const sync = async () => {
      await fetch("/api/sync-user");
      window.location.href = "/dashboard";
    };
    sync();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <LoaderFour/>
      </div>
    </div>
  );
}
