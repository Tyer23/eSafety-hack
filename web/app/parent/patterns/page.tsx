import ParentWordsPanel from "../../../components/ParentWordsPanel";

export default function PatternsPage() {
  const children = [
    { id: "kid_01", name: "Jamie" },
    { id: "kid_02", name: "Emma" }
  ];

  // Stats cards moved from main dashboard
  const stats = [
    {
      label: "Kind Interactions",
      value: "18",
      change: "+4",
      trend: "up",
      color: "bg-gradient-to-br from-pastel-pink-200 to-pastel-pink-300",
    },
    {
      label: "Privacy Warnings",
      value: "1",
      change: "-2",
      trend: "down",
      color: "bg-gradient-to-br from-pastel-blue-200 to-pastel-blue-300",
    },
    {
      label: "Digital Wellbeing",
      value: "85%",
      change: "+5%",
      trend: "up",
      color: "bg-gradient-to-br from-pastel-purple-200 to-pastel-purple-300",
    },
    {
      label: "Risk Moments",
      value: "3",
      change: "-1",
      trend: "down",
      color: "bg-gradient-to-br from-pastel-pink-100 to-pastel-blue-100",
    }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Patterns &amp; data
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-xl">
          When you want to peek under the hood, this view organises{" "}
          <span className="font-semibold">themes, example phrases,</span> and
          other signals into clear sections.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-end">
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up"
                    ? "text-pastel-purple-700"
                    : "text-pastel-blue-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className={`text-2xl font-bold ${stat.color.includes('pink') ? 'text-pastel-pink-600' : stat.color.includes('blue') ? 'text-pastel-blue-600' : 'text-pastel-purple-600'}`}>
              {stat.value}
            </div>
            <div className="mt-1 text-xs font-medium text-slate-700">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <ParentWordsPanel children={children} />
    </div>
  );
}
