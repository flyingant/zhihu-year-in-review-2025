"use client";

import { useAuth } from "@/context/auth-context";

export default function DemoAfterAuth() {
  const { isAuthLoading, isAuthenticated, profile, login } = useAuth();
  if (isAuthLoading) return;
  if (!isAuthenticated) {
    return (
      <div className="mt-4 ml-4">
        <div className="text-center">Your are not logged in Zhihu before.</div>
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => login()}
          >
            Redirected to a page that requires login to access.
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-4 ml-4">
      <h1>If you can see here, it means you've already logged in.</h1>
      <div className="mt-4">Profile: </div>
      <div>{JSON.stringify(profile)}</div>
    </div>
  );
}
