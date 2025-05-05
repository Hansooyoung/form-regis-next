import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our App</h1>
        <Link href="/register">
      <h1>Create New Account</h1>
        </Link>
      </div>
    </div>
  );
}
