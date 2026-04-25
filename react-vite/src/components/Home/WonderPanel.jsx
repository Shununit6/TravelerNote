import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import SignupFormModal from '../SignupFormModal';

const norm = (s) => (s || '').toLowerCase();

function matchesPlan(plan, wonder) {
  return (
    norm(plan.city) === norm(wonder.city) ||
    norm(plan.country) === norm(wonder.country)
  );
}

function matchesPlace(place, wonder) {
  const haystack = `${norm(place.name)} ${norm(place.description)}`;
  return haystack.includes(norm(wonder.name)) || haystack.includes(norm(wonder.city));
}

function matchesStory(story, wonder) {
  const haystack = `${norm(story.title)} ${norm(story.description)}`;
  return haystack.includes(norm(wonder.name)) || haystack.includes(norm(wonder.city));
}

function WonderPanel({ wonder, onClose }) {
  const [tab, setTab] = useState('places');
  const sessionUser = useSelector((s) => s.session.user);
  const { setModalContent } = useModal();
  const plans = Object.values(useSelector((s) => s.plans || {}));
  const places = Object.values(useSelector((s) => s.places || {}));
  const stories = Object.values(useSelector((s) => s.stories || {}));

  const matchedPlans = plans.filter((p) => matchesPlan(p, wonder));
  const matchedPlaces = places.filter((p) => matchesPlace(p, wonder));
  const matchedStories = stories.filter((s) => matchesStory(s, wonder));

  const tabs = [
    { key: 'places', label: 'Places', items: matchedPlaces, newPath: '/places/new' },
    { key: 'stories', label: 'Stories', items: matchedStories, newPath: '/stories/new' },
    { key: 'plans', label: 'Plans', items: matchedPlans, newPath: '/plans/new' },
  ];
  const active = tabs.find((t) => t.key === tab);

  return (
    <aside className="wonder-panel">
      <button className="wonder-panel-close" onClick={onClose} aria-label="Close">×</button>
      <h2 className="wonder-panel-title">{wonder.name}</h2>
      <p className="wonder-panel-meta">{wonder.city}, {wonder.country}</p>
      <p className="wonder-panel-blurb">{wonder.blurb}</p>

      <div className="wonder-panel-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`wonder-panel-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="wonder-panel-count">{t.items.length}</span>
          </button>
        ))}
      </div>

      <div className="wonder-panel-body">
        {active.items.length === 0 ? (
          <div className="wonder-panel-empty">
            <p>No {active.label.toLowerCase()} here yet.</p>
            {sessionUser ? (
              <Link to={active.newPath} className="wonder-panel-cta">
                Add a {active.label.slice(0, -1)}
              </Link>
            ) : (
              <button
                type="button"
                className="wonder-panel-cta"
                onClick={() => setModalContent(<SignupFormModal />)}
              >
                Sign up to add a {active.label.slice(0, -1)}
              </button>
            )}
          </div>
        ) : (
          <ul className="wonder-panel-list">
            {active.items.slice(0, 5).map((item) => {
              if (active.key === 'plans') {
                return (
                  <li key={item.id}>
                    <Link to={`/plans/${item.id}`}>
                      <strong>{item.name}</strong>
                      <span>{item.city}, {item.country}</span>
                    </Link>
                  </li>
                );
              }
              if (active.key === 'places') {
                return (
                  <li key={item.id}>
                    <Link to={`/places/${item.id}`}>
                      <strong>{item.name}</strong>
                      <span>{item.type}</span>
                    </Link>
                  </li>
                );
              }
              return (
                <li key={item.id}>
                  <Link to={`/stories/${item.id}`}>
                    <strong>{item.title}</strong>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default WonderPanel;
