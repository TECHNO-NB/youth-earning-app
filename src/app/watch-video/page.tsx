// app/watch-video/page.tsx
import { Suspense } from "react";
import WatchVideoClient from "./WatchVideoClient";

export default function WatchVideoPage() {
  return (
    <Suspense fallback={<p className="text-center text-white mt-10">Loading...</p>}>
      <WatchVideoClient />
    </Suspense>
  );
}
