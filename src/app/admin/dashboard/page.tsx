import ParticlesBackground from "../../../components/Background";


export default function page() {
  return (
    <>
      <ParticlesBackground/>
    <div className="space-y-6 z-4  mt-15 md:mt-0 px-4 bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold z-2 text-white">Dashboard</h1>
      <div className="grid z-2 grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 z-2 bg-gray-800 rounded-xl shadow border border-gray-700">
          Total Users: <span className="font-semibold text-white">2</span>
        </div>
        <div className="p-4 z-2 bg-gray-800 rounded-xl shadow border border-gray-700">
          Total Videos: <span className="font-semibold text-white">0</span>
        </div>
        <div className="p-4 z-2 bg-gray-800 rounded-xl shadow border border-gray-700">
          Total Packages: <span className="font-semibold text-white">0</span>
        </div>
      </div>
    </div>
    </>
  );
}
