import { SpeakButton } from '@/components/SpeakButton';

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-gray-100 ">
      <div className="flex items-center justify-center h-screen w-full">
          <SpeakButton />
      </div>
    </main>
  );
}
