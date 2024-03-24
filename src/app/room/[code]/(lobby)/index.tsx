import { useRoom } from "@/store/room";

export default function LobbyPage() {
  const room = useRoom()!;

  return (
    <main className='min-h-dvh bg-slate-200 flex'>
      <section className='bg-stone-300 flex-1'>
        {room.code}, Room Admin: {room.admin.name}
      </section>
      <section className='bg-orange-100 flex-1'>
        {room.participants.map((r) => r.name).join(", ")}
      </section>
      <section className='bg-neutral-200 flex-1'></section>
    </main>
  );
}
