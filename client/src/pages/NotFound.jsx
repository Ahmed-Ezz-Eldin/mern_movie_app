import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      <h1 className="text-9xl font-black text-blue-500">404</h1>
      <p className="text-2xl mt-4 mb-8">This page is lost in space.</p>
      <Link to="/" className="border border-blue-500 text-blue-500 px-8 py-3 rounded-xl hover:bg-blue-500 hover:text-white transition-all">
        Go Home
      </Link>
    </div>
  );
}