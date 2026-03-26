import './Home.css';

export default function Home({ onStart }) {
  return (
    <div className="home">
      <div className="home__card">
        <h1 className="home__title">Kids Typing Practice</h1>
        <p className="home__subtitle">
          Learn finger positions first. Start with the home row — short patterns, not long sentences.
        </p>
        <button type="button" className="btn btn--primary home__start" onClick={onStart}>
          Start
        </button>
      </div>
    </div>
  );
}
