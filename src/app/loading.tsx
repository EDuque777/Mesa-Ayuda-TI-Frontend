import { AppPreloader } from "@/shared/ui/loaders/AppPreloader";

export default function Loading() {
  return <AppPreloader minDuration={3000} />;
}