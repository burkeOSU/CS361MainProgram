import Navigation from "./Navigation";

function PageTitle({ title, onClick }) {
  return (
    <>
      <header>
        <h1>Mood.e</h1>
      </header>

      <h2>
        <div className="PageTitle">{title}</div>
        <Navigation onClick={onClick} />
      </h2>
    </>
  );
}

export default PageTitle;