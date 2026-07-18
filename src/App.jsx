import React, { useEffect, useMemo, useState } from 'react';

const DEFAULT_CENTER_FALLBACK = [18.4088, 76.5604];


import { Link } from 'react-scroll';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import { SectionShell } from './components/DashboardSections.jsx';

import './App.css';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function NavItem({ targetId, label }) {
  return (
    <Link
      activeClass=""
      to={targetId}
      spy
      smooth
      duration={450}
      offset={-72}
      isDynamic
      className="cursor-pointer rounded-xl px-3 py-2 text-sm font-extrabold text-indigo-950 transition hover:bg-white/30"
    >
      {label}
    </Link>
  );
}

function App() {
  const defaultCenter = useMemo(() => DEFAULT_CENTER_FALLBACK, []);


  const n8nWebhookUrl = 'http://localhost:5678/webhook-test/8c658250-0083-4ce3-8d8d-84cfca7729a0';

  const [latestAlert, setLatestAlert] = useState(null);

  const [formData, setFormData] = useState({
    disaster: '',
    location: '',
    latitude: '',
    longitude: '',
    status: 'Warning',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'location' && value && value.trim().length >= 3) {
  
        const query = encodeURIComponent(value);
        fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${query}`)
          .then((r) => r.json())
          .then((results) => {
            const first = results && results[0];
            if (first && first.lat && first.lon) {
              setFormData((p2) => ({
                ...p2,
                latitude: Number(first.lat),
                longitude: Number(first.lon),
              }));
            }
          })
          .catch((err) => console.warn('Geocoding failed', err));
      }

      return next;
    });
  };


  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };


  useEffect(() => {
    let isCancelled = false;

    const fetchLatestAlert = async () => {
      try {
        const res = await fetch(n8nWebhookUrl, { method: 'GET' });
        if (!res.ok) {
          console.error('n8n webhook fetch failed:', res.status, res.statusText);
          return;
        }

        const json = await res.json();
       
        if (json && typeof json === 'object' && 'disaster_type' in json) {
          if (!isCancelled) {
            setLatestAlert({
              disaster_type: json.disaster_type,
              status: json.status,
              cleaned_location: json.cleaned_location,
              latitude: json.latitude,
              longitude: json.longitude,
            });
          }
        }
      } catch (e) {
        if (!isCancelled) console.error('Failed to fetch latest alert', e);
      }
    };

    fetchLatestAlert();
    const intervalId = setInterval(fetchLatestAlert, 5000);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (!formData.disaster || !formData.location) {
      alert('Please enter Disaster Name and Location.');
      return;
    }

    const payload = {
      disaster_type: formData.disaster,
      cleaned_location: formData.location,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      status: formData.status,
      timestamp: new Date().toISOString(),
    };

    try {
  
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Signal intercepted successfully!');
        setLatestAlert(payload);
        setFormData({ disaster: '', location: '', latitude: '', longitude: '', status: 'Warning' });
      } else {
        alert('Transmission failed. Backend node unreachable.');
      }
    } catch (error) {
      alert('Error: Unable to connect to the CrisisCom Automation Node.');
    }
  };

  return (
    <div className="full-width-workspace">
      
      <header className="sticky top-0 z-50">
        <div className="border-b border-white/10 bg-white/20 backdrop-blur-md">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div
              className="mt-2 mb-1 flex items-center justify-between rounded-2xl border border-white/20 bg-white/20 px-3 py-2 shadow-lg backdrop-blur-md"
              role="navigation"
              aria-label="Disaster dashboard navigation"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow">
        
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-extrabold text-white/95">CrisisCom AI Network Node</div>
                  <div className="text-xs font-semibold text-white/70">Operational Disaster Management</div>
                </div>
              </div>

              <nav className="flex items-center gap-2">
                <NavItem targetId="emergency" label="Emergency Form" />
                <NavItem targetId="map" label="Live Map" />
                <NavItem targetId="logs" label="Logs" />
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-6 w-full max-w-7xl">
          <div className="hero-banner">
            <h1>CrisisCom AI Network Node</h1>
            <p>Strategic Multi-Media Response System & Geospatial Intelligence</p>
          </div>
        </div>
      </div>

      {/* Section 1: Emergency Form*/}
      <SectionShell id="emergency" title="Emergency Form">
        <div className="section-card max-w-3xl mx-auto">
          <h2 className="section-title">
           Emergency Signal Entry
          </h2>

          <div className="form-container-box">
            <form onSubmit={handleSubmit}>
              <div className="form-grid-row">
                <div className="input-group">
                  <span className="input-label">Disaster Name</span>
                  <input
                    type="text"
                    name="disaster"
                    placeholder="e.g. Flash Flood"
                    value={formData.disaster}
                    onChange={handleInputChange}
                    required
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Location Node</span>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Latur City"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="modern-input"
                  />
                </div>
              </div>

              <div className="form-grid-row">
                <div className="input-group">
                  <span className="input-label">Latitude</span>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    placeholder="Auto"
                    value={formData.latitude}
                    readOnly

                    onChange={handleInputChange}
                    required
                    className="modern-input"
                  />
                </div>

                <div className="input-group">
                  <span className="input-label">Longitude</span>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    placeholder="Auto"
                    value={formData.longitude}
                    readOnly

                    onChange={handleInputChange}
                    required
                    className="modern-input"
                  />
                </div>
              </div>

              <div className="form-action-row">
                <div className="input-group">
                  <span className="input-label">Severity</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="modern-input"
                  >
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <label className="btn-upload">
                  {selectedFile ? 'Change Photo' : 'Ingest Media'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {previewUrl && (
                <div className="preview-container">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}

              <button type="submit" className="btn-submit">
                TRANSMIT SIGNAL
              </button>
            </form>
          </div>
        </div>
      </SectionShell>

      {/* Section 2: Live Map (fixed height for rendering) */}
      <SectionShell id="map" title="Live Map">
        <div className="section-card map-card">
          <h2 className="section-title">
           Active Target Map Matrix
          </h2>

          <div className="map-container h-96 sm:h-[500px]">
            <MapContainer
              center={defaultCenter}
              zoom={8}
              scrollWheelZoom
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Single marker for the latest alert*/}
              {latestAlert &&
                typeof latestAlert.latitude === 'number' &&
                typeof latestAlert.longitude === 'number' && (
                  <Marker
                    position={[latestAlert.latitude, latestAlert.longitude]}
                  >
                    <Popup>
                      <div style={{ fontSize: '13px' }}>
                        <strong style={{ color: '#2563eb' }}>
                          {latestAlert.disaster_type}
                        </strong>
                        <br />
                        {latestAlert.cleaned_location}
                      </div>
                    </Popup>
                  </Marker>
                )}

            </MapContainer>

          </div>
        </div>
      </SectionShell>

      {/* Section 3: Logs */}
      <SectionShell id="logs" title="Logs">
        <div className="section-card logs-section">
          <h2 className="section-title">
            Ingested Telemetry Logs
          </h2>

          {/* Inject point for the single latest alert */}
          <div id="ingested-telemetry-alert" className="logs-scroller" style={{ maxHeight: 320 }}>
            {latestAlert ? (
              <div className="log-item">
                <div className="log-header">
                  <strong> {latestAlert.disaster_type}</strong>
                  <span className="badge">{latestAlert.status}</span>
                </div>
                <p>
                 <strong>Location:</strong> {latestAlert.cleaned_location}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </SectionShell>


      <footer className="pb-10 pt-6">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 text-left">
          <div className="text-xs font-semibold text-slate-600/90">
            CrisisCom Dashboard • Emergency telemetry dashboard UI
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

