import HomeClient from "@/components/home/home-client";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 min-h-screen">
      <main className="">
        <HomeClient user={user} />
      </main>
    </div>
  );
}
