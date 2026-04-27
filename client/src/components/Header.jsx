export default function Header() {
  return (
    <div className="header-bar flex justify-between items-center">

      <div>
        <h1 className="text-lg font-bold">Flood Monitoring Dashboard</h1>
        <p className="text-xs text-gray-400">
          Real-time flood risk analysis across India
        </p>
      </div>

      <div className="text-xs text-gray-400">
        {new Date().toLocaleString()}
      </div>

    </div>
  );
}