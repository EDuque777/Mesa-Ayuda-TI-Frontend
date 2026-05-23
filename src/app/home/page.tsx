import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { HomeContent } from "@/features/home/components/HomeContent";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
