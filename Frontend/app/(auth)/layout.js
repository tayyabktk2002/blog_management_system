export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
