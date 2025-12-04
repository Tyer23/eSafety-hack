import ParentWordsPanel from "../../../components/ParentWordsPanel";
import ResponsiveLayout from "../../../components/ResponsiveLayout";

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
      color: "text-safe",
    },
    {
      label: "Privacy Warnings",
      value: "1",
      change: "-2",
      trend: "down",
      color: "text-caution",
    },
    {
      label: "Digital Wellbeing",
      value: "85%",
      change: "+5%",
      trend: "up",
      color: "text-blurple",
    },
    {
      label: "Risk Moments",
      value: "3",
      change: "-1",
      trend: "down",
      color: "text-alert",
    }
  ];

  return (
    <ResponsiveLayout
      mobileHeader={{
        title: "Patterns & Data",
      }}
      showMobileNav={true}
    >
      <div className="space-y-5">
        {/* Header - hidden on mobile (shown in MobileHeader instead) */}
        <div className="hidden md:block">
          <h1 className="text-title-2 font-semibold tracking-tight text-gray-900">
            Patterns &amp; data
          </h1>
          <p className="mt-2 text-subhead text-gray-600 max-w-xl">
            When you want to peek under the hood, this view organises{" "}
            <span className="font-semibold">themes, example phrases,</span> and
            other signals into clear sections.
          </p>
        </div>

        {/* Mobile description - only shown on mobile */}
        <p className="md:hidden text-sm text-gray-600 leading-relaxed">
          Themes, example phrases, and other signals organized into clear sections.
        </p>

        {/* Stats Grid - mobile-first: 2 columns, desktop: 4 columns */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center justify-end">
                <span
                  className={`text-[11px] md:text-footnote font-medium ${
                    stat.trend === "up"
                      ? "text-safe"
                      : "text-caution"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className={`text-xl md:text-title-2 font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] md:text-footnote font-medium text-gray-700 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <ParentWordsPanel children={children} />
      </div>
    </ResponsiveLayout>
  );
}
