import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PrivateSidebarLayout } from "@/shared/ui/sidebar/PrivateSidebarLayout";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      <PrivateSidebarLayout>{children}</PrivateSidebarLayout>
    </ProtectedRoute>
  );
}
