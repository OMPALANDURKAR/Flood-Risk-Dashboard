import { useState } from "react";

export default function Sidebar({ setDistrict }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    // trigger search after typing
    if (value.length > 2) {
      setDistrict(value);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold">Filters</h2>

      <input
        value={search}
        onChange={handleSearch}
        placeholder="Search district..."
        className="w-full p-2 rounded bg-[#0f172a] border border-[#334155]"
      />

      <div className="card">
        <p>Total Districts</p>
        <h2>10000</h2>
      </div>
    </div>
  );
}