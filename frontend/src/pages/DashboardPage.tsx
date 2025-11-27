import type { RootState } from "@/store";
import type { User } from "@/types/auth";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const user = useSelector<RootState>(
    (state) => state.auth.user
  ) as User | null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <h1>Dashboard page</h1>
        <p>Welcome, {user?.name}</p>
      </div>
    </div>
  );
}
