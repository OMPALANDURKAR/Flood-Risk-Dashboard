export default function Sidebar() {
  return (
    <div className="space-y-4">

      <h2 className="text-sm font-bold">Filters</h2>

      <input
        placeholder="Search district..."
        className="w-full p-2 bg-[#0f172a] border border-[#334155] rounded"
      />

      <select className="w-full p-2 bg-[#0f172a] border border-[#334155] rounded">
        <option>All States</option>
      </select>

      <select className="w-full p-2 bg-[#0f172a] border border-[#334155] rounded">
        <option>All Risk</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      {/* Stats */}
      <div className="card">
        <p>Total Districts</p>
        <h2 className="text-xl">10000</h2>
      </div>

      <div className="card">
        <p>High Risk</p>
        <h2 className="text-red-400 text-xl">1200</h2>
      </div>

    </div>
  );
}