import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import wonders from '../../data/wonders.json';
import { getAllPlans } from '../../redux/plans';
import { getAllPlaces } from '../../redux/places';
import { getAllStories } from '../../redux/stories';
import GlobeErrorBoundary from './GlobeErrorBoundary';
import WonderPanel from './WonderPanel';
import './Home.css';

const Globe = lazy(() => import('react-globe.gl'));

function Home() {
  const dispatch = useDispatch();
  const globeRef = useRef();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState(null);

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
      controls.autoRotate = !selected;
      controls.autoRotateSpeed = 0.6;
      controls.enableZoom = true;
    }
  }, [selected, size]);

  const points = useMemo(
    () => wonders.map((w) => ({ ...w, size: 0.7, color: '#ff6b6b' })),
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
      </div>

      <div id="home-globe-stage" className="home-globe-stage">
        <GlobeErrorBoundary>
          <Suspense fallback={<div className="home-globe-loading">Loading globe…</div>}>
            {size.w > 0 && (
              <Globe
                ref={globeRef}
                width={size.w}
                height={size.h}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="rgba(0,0,0,0)"
                pointsData={points}
                pointLat="lat"
                pointLng="lng"
                pointColor="color"
                pointAltitude={0.02}
                pointRadius="size"
                pointLabel={(d) => `
                  <div style="background:rgba(20,20,30,0.92);color:#fff;padding:8px 12px;border-radius:6px;font-family:sans-serif;max-width:220px;">
                    <strong>${d.name}</strong><br/>
                    <span style="opacity:0.75;font-size:12px;">${d.city}, ${d.country}</span>
                  </div>
                `}
                onPointClick={handleClick}
                atmosphereColor="#88c0ff"
                atmosphereAltitude={0.18}
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
