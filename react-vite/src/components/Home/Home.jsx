import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import wonders from '../../data/wonders.json';
import { getAllPlans } from '../../redux/plans';
import { getAllPlaces } from '../../redux/places';
import { getAllStories } from '../../redux/stories';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import GlobeErrorBoundary from './GlobeErrorBoundary';
import WonderPanel from './WonderPanel';
import './Home.css';

const Globe = lazy(() => import('react-globe.gl'));

function Home() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((s) => s.session.user);
  const { setModalContent } = useModal();
  const globeRef = useRef();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const openSignup = () => setModalContent(<SignupFormModal />);
  const openLogin = () => setModalContent(<LoginFormModal />);

  useEffect(() => {
    dispatch(getAllPlans());
    dispatch(getAllPlaces());
    dispatch(getAllStories());
  }, [dispatch]);

  useEffect(() => {
    const update = () => {
      const el = document.getElementById('home-globe-stage');
      if (el) setSize({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls?.();
    if (controls) {
      controls.autoRotate = !selected && !hoveredId;
      controls.autoRotateSpeed = 0.25;
      controls.enableZoom = true;
    }
  }, [selected, hoveredId, size]);

  const points = useMemo(() => wonders.map((w) => ({ ...w })), []);

  const ringColorFn = useMemo(
    () => () => (t) => `rgba(255, 173, 199, ${1 - t})`,
    [],
  );

  const handleClick = (point) => {
    setSelected(point);
    const g = globeRef.current;
    if (g && point) {
      g.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.6 }, 1000);
    }
  };

  return (
    <div className="home-globe">
      <div className="home-globe-overlay">
        <h1>Where to next?</h1>
        <p>Spin the globe. Click a wonder. Plan, share, and tell its story.</p>
        <div className="home-hero-actions">
          {sessionUser ? (
            <>
              <Link to="/plans/new" className="home-hero-cta home-hero-cta-primary">
                Start a new plan
              </Link>
              <Link to="/plans/current" className="home-hero-cta home-hero-cta-secondary">
                View my plans
              </Link>
            </>
          ) : (
            <>
              <button type="button" className="home-hero-cta home-hero-cta-primary" onClick={openSignup}>
                Join Traveler Note
              </button>
              <button type="button" className="home-hero-cta home-hero-cta-secondary" onClick={openLogin}>
                Log in
              </button>
            </>
          )}
        </div>
        {/* <Link to="/preview/pixel" className="home-hero-preview-link">
          ✨ try the pixel-art version
        </Link> */}
      </div>

      <div id="home-globe-stage" className="home-globe-stage">
        <GlobeErrorBoundary>
          <Suspense fallback={<div className="home-globe-loading">Loading globe…</div>}>
            {size.w > 0 && (
              <Globe
                ref={globeRef}
                width={size.w}
                height={size.h}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                backgroundColor="rgba(0,0,0,0)"
                htmlElementsData={selected ? [] : points}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.01}
                htmlElement={(d) => {
                  const el = document.createElement('div');
                  el.className = 'wonder-marker' + (hoveredId === d.id ? ' is-hovered' : '');
                  el.innerHTML = `<span class="wonder-marker-emoji">${d.emoji || '📍'}</span>`;
                  el.title = `${d.name} — ${d.city}, ${d.country}`;
                  el.style.cursor = 'pointer';
                  el.addEventListener('click', () => handleClick(d));
                  el.addEventListener('mouseenter', () => setHoveredId(d.id));
                  el.addEventListener('mouseleave', () => setHoveredId(null));
                  return el;
                }}
                ringsData={points}
                ringLat="lat"
                ringLng="lng"
                ringMaxRadius={2.2}
                ringPropagationSpeed={1.2}
                ringRepeatPeriod={2200}
                ringColor={ringColorFn}
                ringAltitude={0.005}
                atmosphereColor="#ffd6e8"
                atmosphereAltitude={0.22}
              />
            )}
          </Suspense>
        </GlobeErrorBoundary>
      </div>

      {selected && (
        <WonderPanel wonder={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default Home;
