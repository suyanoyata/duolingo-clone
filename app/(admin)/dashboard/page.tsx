import { redirect } from "next/navigation";

export default function Page() {
  return redirect("/dashboard/courses");

  // TODO: either implement /dashboard or just do redirect
  return (
    <div>
      <h1 className="text-2xl p-2 font-bold text-zinc-600">Dashboard</h1>
    </div>
  );
}
