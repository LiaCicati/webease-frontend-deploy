import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen  p-6 text-center">
      <h1 className="text-3xl text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg max-w-md mb-6">
        You do not have the necessary permissions to view this page. If you
        believe this is an error, please contact the administrator.
      </p>
      <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
        Return Home
      </Link>
    </div>
  );
};

export default Unauthorized;
