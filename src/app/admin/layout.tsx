import Sidebar from "@/components/admin/Sidebar";
import { getCurrentUser } from "../server-actions/getCurrentUser";

export default async function Adminlayout({ children }: LayoutProps<"/">) {
    await getCurrentUser();
    return (
        <div>
            <Sidebar/>
            {children}
        </div>
    )
}