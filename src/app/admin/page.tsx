import DashboardStats from "@/components/admin/DashboardStats";
import RecentPosts from "@/components/admin/RecentPosts";

export default function DashboardPage() {
  return(
    <main className="md:ml-64 p-4 sm:p-6 min-h-screen">
      {/* header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-text">
          Dashboard
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Welcome back. Heres whats happening with your blog.
        </p>
      </div>

      {/* stats */}
      <DashboardStats/>

      {/* Recent Post */}
      <RecentPosts/>
    </main>
  )
}
