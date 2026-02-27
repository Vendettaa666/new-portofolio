import SpotifyNowPlaying from '@/components/ui/SpotifyNowPlaying';
import SpotifyHistory from '@/components/ui/SpotifyHistory';

export default function Page() {
  return (
    <div className="flex flex-col items-center p-10 gap-6">
      {/* Kamu bisa menggabungkan keduanya dalam satu div agar terlihat seperti kartu tunggal */}
      <div className="w-full max-w-sm flex flex-col">
        <SpotifyNowPlaying />
        <SpotifyHistory />
      </div>
    </div>
  );
}