// app/api/sync-user/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { db } from "~/server/db";


export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await clerkClient.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress ?? "";

  await db.user.upsert({
    where: { emailAddress: email },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    create: {
      id: userId,
      emailAddress: email,
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return NextResponse.json({ success: true });
}
