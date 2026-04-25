import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import wonders from '../../data/wonders.json';
import { getAllPlans } from '../../redux/plans';
import { getAllPlaces } from '../../redux/places';
import { getAllStories } from '../../redux/stories';
import { useModal } from '../../context/Modal';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import GlobeErrorBoundary from './GlobeErrorBoundary';
import WonderPanel from './WonderPanel';
import './HomePixel.css';

const Globe = lazy(() => import('react-globe.gl'));

const PALETTE = ['#ff5e7e', '#ffd24a', '#3ec1ff', '#7be36a', '#c084ff', '#ff9b54'];
const colorFor = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

function HomePixel() {
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
      const el = document.getElementById('home-pixel-stage');
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

  // Force pixelated texture filtering after the globe material loads.
  useEffect(() => {
    let cancelled = false;
    const apply = () => {
      if (cancelled) return;
      const g = globeRef.current;
      const material = g?.globeMaterial?.();
      const map = material?.map;
      if (!map) return setTimeout(apply, 200);
      // Downscale to give chunky pixel look, then nearest-filter on output.
      const img = map.image;
      if (img && img.width) {
        const scale = 8;
        const c = document.createElement('canvas');
        c.width = Math.max(64, Math.floor(img.width / scale));
        c.height = Math.max(32, Math.floor(img.height / scale));
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, c.width, c.height);
        const tex = new THREE.CanvasTexture(c);
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.colorSpace = THREE.SRGBColorSpace;
        material.map = tex;
        material.needsUpdate = true;
      } else {
        setTimeout(apply, 200);
      }
    };
    const t = setTimeout(apply, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [size]);

  const handleClick = (point) => {
    setSelected(point);
    const g = globeRef.current;
    if (g && point) {
      g.pointOfView({ lat: point.lat, lng: point.lng, altitude: 1.6 }, 1000);
    }
  };

  return (
    <div className="home-pixel">
      <div className="home-pixel-overlay">
        <h1>WHERE TO NEXT?</h1>
        <p>SPIN. CLICK. EXPLORE.</p>
        <div className="home-pixel-actions">
          {sessionUser ? (
            <>
              <Link to="/plans/new" className="home-pixel-btn home-pixel-btn-primary">
                NEW PLAN
              </Link>
              <Link to="/plans/current" className="home-pixel-btn home-pixel-btn-secondary">
                MY PLANS
              </Link>
            </>
          ) : (
            <>
              <button type="button" className="home-pixel-btn home-pixel-btn-primary" onClick={openSignup}>
                JOIN
              </button>
              <button type="button" className="home-pixel-btn home-pixel-btn-secondary" onClick={openLogin}>
                LOG IN
              </button>
            </>
          )}
        </div>
        <Link to="/" className="home-pixel-back">← back to cute</Link>
      </div>

      <div id="home-pixel-stage" className="home-pixel-stage">
        <GlobeErrorBoundary>
          <Suspense fallback={<div className="home-pixel-loading">LOADING…</div>}>
            {size.w > 0 && (
              <Globe
                ref={globeRef}
                width={size.w}
                height={size.h}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
                backgroundColor="rgba(0,0,0,0)"
                htmlElementsData={wonders}
                htmlLat="lat"
                htmlLng="lng"
                htmlAltitude={0.01}
                htmlElement={(d) => {
                  const el = document.createElement('div');
                  el.className = 'pixel-marker' + (hoveredId === d.id ? ' is-hovered' : '');
                  el.style.background = colorFor(d.id);
                  el.title = `${d.name} — ${d.city}, ${d.country}`;
                  el.addEventListener('click', () => handleClick(d));
                  el.addEventListener('mouseenter', () => setHoveredId(d.id));
                  el.addEventListener('mouseleave', () => setHoveredId(null));
                  return el;
                }}
                atmosphereColor="#ff66aa"
                atmosphereAltitude={0.08}
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

export default HomePixel;
