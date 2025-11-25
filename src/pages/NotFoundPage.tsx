import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="card space-y-4 text-center">
      <h2 className="text-3xl font-semibold text-slate-900">404</h2>
      <p className="text-slate-700">The page you are looking for does not exist. Try the links below.</p>
      <div className="flex justify-center gap-3">
        <Link to="/" className="button-secondary">
          Home
        </Link>
        <Link to="/corpus" className="button-primary">
          Corpus
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
