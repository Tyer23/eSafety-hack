import ParentSummaryPanel from "../../../components/ParentSummaryPanel";
import ThemeTrendsGraph from "../../../components/ThemeTrendsGraph";
import ActivityCalendar from "../../../components/ActivityCalendar";

export default function InsightsPage() {
  const children = [
    { id: "kid_01", name: "Jamie" },
    { id: "kid_02", name: "Emma" }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-title-2 font-semibold tracking-tight text-gray-900">
          Weekly insights
        </h1>
        <p className="mt-2 text-subhead text-gray-600 max-w-xl">
          A calm overview of how things are going online, focused on{" "}
          <span className="font-semibold">trends and strengths</span>, not
          single scary moments.
        </p>
      </div>

      <ParentSummaryPanel children={children} />

      {/* Theme Trends Graph - Full width */}
      <div>
        <ThemeTrendsGraph />
      </div>

      {/* Calendar and Quick Stats Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        <ActivityCalendar />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-subhead font-semibold text-gray-900 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-3 text-subhead">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This week&apos;s focus</span>
              <span className="font-semibold text-blurple">
                Kindness
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Best day</span>
              <span className="font-semibold text-safe">
                Monday
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overall trend</span>
              <span className="font-semibold text-safe">
                Improving
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
