import { useEffect, useState } from "react";
import { getAnalytics } from "../api/data";

export default function AnalyticsPanel() {
  const [data, setData] = useState({}); // ✅ safe default

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      setData(res.data || {});
    } catch (err) {
      console.error("Analytics fetch error", err);
    }
  };

  // ✅ SAFE CALCULATIONS
  const districts = Object.keys(data);

  let total = 0;
  let floods = 0;

  districts.forEach((d) => {
    total += data[d]?.total || 0;
    floods += data[d]?.floods || 0;
  });

  return (
    <div className="p-4 h-full bg-[#1e293b] text-white">
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>

      <div className="space-y-3">
        <div className="p-3 bg-[#334155] rounded">
          <p>Total Records</p>
          <h3 className="text-xl">{total}</h3>
        </div>

        <div className="p-3 bg-[#334155] rounded">
          <p>Total Floods</p>
          <h3 className="text-xl text-red-400">{floods}</h3>
        </div>

        <div className="p-3 bg-[#334155] rounded">
          <p>District Count</p>
          <h3 className="text-xl">{districts.length}</h3>
        </div>
      </div>
    </div>
  );
}