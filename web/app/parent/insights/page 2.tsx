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
      <div className="space-y-6 md:space-y-8">
        <div className="hidden md:block">
          <h1 className="text-title-2 font-semibold tracking-tight text-gray-900">
            Weekly insights
          </h1>
          <p className="mt-3 text-subhead text-gray-600 max-w-2xl">
            A calm overview of how things are going online, focused on{" "}
            <span className="font-semibold">trends and strengths</span>, not
            single scary moments.
          </p>
        </div>

        <p className="md:hidden text-sm text-gray-600 leading-relaxed">
          A calm overview of how things are going online, focused on{" "}
          <span className="font-semibold">trends and strengths</span>, not
          single scary moments.
        </p>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-subhead font-semibold text-gray-900 mb-4">
            This Week at a Glance
          </h2>
          <p className="text-subhead text-gray-800 leading-relaxed">{data.weeklySummary}</p>
        </div>
      </div>
    </ResponsiveLayout>
  );
}

