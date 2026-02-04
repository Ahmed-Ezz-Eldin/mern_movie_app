import { useRouteError, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6">
      <h1 className="text-6xl font-black text-red-500 mb-4">Oops!</h1>
      <p className="text-xl mb-4">Sorry, an unexpected error has occurred.</p>
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-400 mb-6 italic">
        {error.statusText || error.message}
      </div>
      <Link to="/" className="bg-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-500 transition-all">
        Back to Safety
      </Link>
    </div>
  );
}