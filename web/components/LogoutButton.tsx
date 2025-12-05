"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-footnote text-gray-500 hover:text-gray-700 underline transition-colors"
    >
      Log out
    </button>
  );
}
