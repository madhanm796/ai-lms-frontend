const StatCard = ({ value, label, color }) => {
  // Map color names to Tailwind classes
  const colors = {
    purple: "bg-purple-500 shadow-purple-500/30",
    red: "bg-red-500 shadow-red-500/30",
  };

  return (
    <div className={`${colors[color]} text-white p-6 rounded-2xl flex flex-col items-center justify-center min-w-30`}>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm opacity-90">{label}</span>
    </div>
  );
};

export default StatCard;