import { TicketDetailPage } from "@/features/tickets";

export default async function TicketDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TicketDetailPage ticketId={id} />;
}
