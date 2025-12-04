import ParentSummaryPanel from "../../../components/ParentSummaryPanel";
import ThemeTrendsGraph from "../../../components/ThemeTrendsGraph";
import ActivityCalendar from "../../../components/ActivityCalendar";
import ResponsiveLayout from "../../../components/ResponsiveLayout";
import { getParentBehaviourData } from "@/lib/behaviourData";

export default function InsightsPage() {
  const data = getParentBehaviourData();
  const primaryChild = data.children[0];

  return (
    <ResponsiveLayout
      mobileHeader={{
        title: "Weekly Insights",
      }}
      showMobileNav={true}
    >
      <div className="space-y-5">
        {/* Header - hidden on mobile (shown in MobileHeader instead) */}
        <div className="hidden md:block">
          <h1 className="text-title-2 font-semibold tracking-tight text-gray-900">
            Weekly insights
          </h1>
          <p className="mt-2 text-subhead text-gray-600 max-w-xl">
            A calm overview of how things are going online, focused on{" "}
            <span className="font-semibold">trends and strengths</span>, not
            single scary moments.
          </p>
        </div>

        {/* Mobile description - only shown on mobile */}
        <p className="md:hidden text-sm text-gray-600 leading-relaxed">
          A calm overview of how things are going online, focused on{" "}
          <span className="font-semibold">trends and strengths</span>, not
          single scary moments.
        </p>

        <ParentSummaryPanel data={data} />

        {/* Theme Trends Graph - Full width */}
        <div>
          <ThemeTrendsGraph />
        </div>

        {/* Calendar and Quick Stats Grid - mobile-first stacking */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2">
          <ActivityCalendar
            dayStatuses={primaryChild.dayStatuses}
            childName={primaryChild.name}
          />
          <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
            <h3 className="text-subhead font-semibold text-gray-900 mb-3">
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
    </ResponsiveLayout>
  );
}
