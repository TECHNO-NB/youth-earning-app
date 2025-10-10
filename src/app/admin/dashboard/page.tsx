import Background from "@/components/AnimatedBg";


export default function page() {
  return (
    <>
       <Background/>
    <div className="space-y-6 z-2  mt-15 px-4 bg-gray-950 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold  text-white">Dashboard</h1>
      <div className="grid z-2 grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded-xl shadow border border-gray-700">
          Total Users: <span className="font-semibold text-white">120</span>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl shadow border border-gray-700">
          Total Videos: <span className="font-semibold text-white">25</span>
        </div>
        <div className="p-4 bg-gray-800 rounded-xl shadow border border-gray-700">
          Total Packages: <span className="font-semibold text-white">10</span>
        </div>
      </div>
    </div>
    </>
  );
}
