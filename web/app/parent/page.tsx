import ParentDashboard from '../../components/ParentDashboard'
import ResponsiveLayout from '../../components/ResponsiveLayout'

export const dynamic = 'force-dynamic'

export default function ParentPage() {
  // In a real app we would read the logged‑in user from a session/cookie.
  // For this MVP we hard‑code parent_01.
  const parentId = 'parent_01'

  return (
    <ResponsiveLayout
      mobileHeader={{
        title: 'Chat',
      }}
      showMobileNav={true}
      applyPadding={false}
    >
      <ParentDashboard parentId={parentId} />
    </ResponsiveLayout>
  )
}
