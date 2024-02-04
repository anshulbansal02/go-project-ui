import GameForm from "./components/GameForm";

export default function HomePage() {
  return (
    <section className='p-4'>
      <header className='my-[16vh] text-center'>
        <h1 className='text-3xl mb-1'>Scribbly</h1>
        <h3 className='text-xl font-medium'>A multiplayer pictionary game</h3>
      </header>

      <GameForm />
    </section>
  );
}
