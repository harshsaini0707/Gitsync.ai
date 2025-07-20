// app/sign-up/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900">
      <div className="z-10 pt-8 pb-20">
        <SignUp
          appearance={{
            elements: {
              card: "shadow-2xl",
            },
          }}
        />
      </div>
    </div>
  );
}
