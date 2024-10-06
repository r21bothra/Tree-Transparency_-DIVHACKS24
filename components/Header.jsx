export default function Header({ title }) {
  return (
    <header className="shadow bg-base-200">
      <div className="container py-6 mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-base-content">
          {title}
        </h1>
      </div>
    </header>
  );
}
