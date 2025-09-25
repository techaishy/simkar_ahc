import Breadcrumbs from "@/components/ui/breadcrumb";
import DashboardClient from "@/module/dashboard/DashboardPage";

export default function DashboardPage() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden px-2 pb-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="p-4 font-semibold">
          <Breadcrumbs />
        </div>
        <DashboardClient />
      </div>
    </div>
  );
}
