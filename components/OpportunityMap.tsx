'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Opportunity,
  BeneficiaryProfile,
  NSQFCourse,
  OpportunityMatchResult,
  OpportunityFilterState
} from '@/lib/types';
import {
  DISTRICT_CENTROIDS,
  OPPORTUNITIES_DATASET,
  DEMO_DATA_DISCLAIMER
} from '@/lib/opportunity-data';
import {
  matchOpportunities,
  filterOpportunities,
  getBeneficiaryCoordinates
} from '@/lib/opportunity-matcher';
import OpportunityCard from './OpportunityCard';
import OpportunityFilters from './OpportunityFilters';
import {
  MapPin,
  Sparkles,
  Compass,
  Layers,
  GraduationCap,
  Briefcase,
  Award,
  Filter,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface OpportunityMapProps {
  profile: BeneficiaryProfile;
  nsqfRecommendations?: NSQFCourse[];
  onSelectOpportunity?: (opp: OpportunityMatchResult) => void;
  onNavigateToRoadmap?: () => void;
}

export default function OpportunityMap({
  profile,
  nsqfRecommendations = [],
  onSelectOpportunity,
  onNavigateToRoadmap
}: OpportunityMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(profile.district || 'Theni');
  const [selectedState, setSelectedState] = useState<string>(profile.state || 'Tamil Nadu');

  // Filter state
  const [filters, setFilters] = useState<OpportunityFilterState>({
    type: 'all',
    radiusKm: 25,
    skill: 'all',
    careerGoal: 'all',
    searchQuery: ''
  });

  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Map DOM ref and Leaflet map instance ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const circleLayerRef = useRef<any>(null);

  // Derive current beneficiary coordinates based on selected district or profile
  const beneficiaryCoords = useMemo(() => {
    const currentProfile: BeneficiaryProfile = {
      ...profile,
      district: selectedDistrict,
      state: selectedState
    };
    return getBeneficiaryCoordinates(currentProfile);
  }, [profile, selectedDistrict, selectedState]);

  // Compute all scored opportunities
  const allScoredOpportunities = useMemo(() => {
    const activeProfile: BeneficiaryProfile = {
      ...profile,
      district: selectedDistrict,
      state: selectedState
    };
    return matchOpportunities(activeProfile, OPPORTUNITIES_DATASET, nsqfRecommendations);
  }, [profile, selectedDistrict, selectedState, nsqfRecommendations]);

  // Apply UI filters
  const filteredOpportunities = useMemo(() => {
    return filterOpportunities(allScoredOpportunities, filters);
  }, [allScoredOpportunities, filters]);

  // Selected opportunity object
  const selectedOpportunity = useMemo(() => {
    if (!selectedOpportunityId) return filteredOpportunities[0] || null;
    return (
      filteredOpportunities.find((o) => o.id === selectedOpportunityId) ||
      allScoredOpportunities.find((o) => o.id === selectedOpportunityId) ||
      null
    );
  }, [selectedOpportunityId, filteredOpportunities, allScoredOpportunities]);

  // Initialize Leaflet Map (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const initMap = async () => {
      try {
        const L = (await import('leaflet')).default;

        // Ensure Leaflet CSS is present in document head
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!mapContainerRef.current) return;

        // If map instance already exists, remove it before reinitializing
        if (leafletMapInstanceRef.current) {
          leafletMapInstanceRef.current.remove();
          leafletMapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [beneficiaryCoords.latitude, beneficiaryCoords.longitude],
          zoom: 11,
          zoomControl: true
        });

        // OpenStreetMap Tile Layer (Dark Matter / CartoDB Voyager styled tiles)
        const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
          maxZoom: 19,
          subdomains: 'abcd'
        });

        tileLayer.on('tileerror', () => {
          // Fallback to standard OSM if CartoCDN encounters rate limit
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
        });

        tileLayer.addTo(map);

        leafletMapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);

        if (isMounted) {
          setMapLoaded(true);
        }

        // Fix leaflet map tile gray clipping by invalidating size
        setTimeout(() => {
          if (leafletMapInstanceRef.current) {
            leafletMapInstanceRef.current.invalidateSize();
          }
        }, 200);

        setTimeout(() => {
          if (leafletMapInstanceRef.current) {
            leafletMapInstanceRef.current.invalidateSize();
          }
        }, 800);
      } catch (err) {
        console.error('Failed to initialize Leaflet map:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
    };
  }, [beneficiaryCoords.latitude, beneficiaryCoords.longitude]);

  // Update Map Markers and Radius Circle when filtered opportunities or radius changes
  useEffect(() => {
    if (!leafletMapInstanceRef.current || typeof window === 'undefined') return;

    const updateLayers = async () => {
      const L = (await import('leaflet')).default;
      const map = leafletMapInstanceRef.current;

      if (markersLayerRef.current) {
        markersLayerRef.current.clearLayers();
      }

      // 1. Add Beneficiary Home Marker (Radar Pin)
      const homeIconHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="size-8 rounded-full bg-emerald-500 text-slate-950 font-bold shadow-xl border-2 border-white flex items-center justify-center text-xs">
            📍
          </div>
        </div>
      `;

      const homeIcon = L.divIcon({
        className: 'custom-home-pin',
        html: homeIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const homeMarker = L.marker([beneficiaryCoords.latitude, beneficiaryCoords.longitude], {
        icon: homeIcon,
        zIndexOffset: 1000
      });

      homeMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <div style="font-weight: bold; color: #059669; font-size: 13px;">📍 Your Location (${profile.name || 'Beneficiary'})</div>
          <div style="font-size: 11px; color: #475569;">${selectedDistrict}, ${selectedState}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Goal: <strong>${profile.preferredLivelihood || 'Self-Employment'}</strong></div>
        </div>
      `);

      markersLayerRef.current.addLayer(homeMarker);

      // 2. Add Search Radius Circle
      if (circleLayerRef.current) {
        map.removeLayer(circleLayerRef.current);
      }

      circleLayerRef.current = L.circle([beneficiaryCoords.latitude, beneficiaryCoords.longitude], {
        radius: filters.radiusKm * 1000,
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6'
      }).addTo(map);

      // 3. Add Opportunity Markers
      filteredOpportunities.forEach((opp) => {
        let pinColor = '#3b82f6'; // blue (training)
        let pinEmoji = '🎓';
        if (opp.type === 'job') {
          pinColor = '#10b981'; // green (job)
          pinEmoji = '💼';
        } else if (opp.type === 'apprenticeship') {
          pinColor = '#f59e0b'; // amber (apprenticeship)
          pinEmoji = '⚡';
        } else if (opp.type === 'livelihood') {
          pinColor = '#a855f7'; // purple (livelihood)
          pinEmoji = '✨';
        }

        const isSelected = selectedOpportunityId === opp.id;

        const pinHtml = `
          <div class="relative group cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div style="background-color: ${pinColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" class="size-7 rounded-full text-white flex items-center justify-center text-xs font-bold border-2 border-slate-900">
              ${pinEmoji}
            </div>
            <div style="background-color: #0f172a; border-color: ${pinColor};" class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold text-white border shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              ${opp.matchScore}% Match (${opp.calculatedDistanceKm}km)
            </div>
          </div>
        `;

        const oppIcon = L.divIcon({
          className: 'custom-opp-pin',
          html: pinHtml,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([opp.latitude, opp.longitude], { icon: oppIcon });

        marker.on('click', () => {
          setSelectedOpportunityId(opp.id);
          if (onSelectOpportunity) onSelectOpportunity(opp);
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px; padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span style="background: rgba(16, 185, 129, 0.15); color: #059669; font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 9999px;">
                ${opp.matchScore}% Match
              </span>
              <span style="font-size: 11px; font-weight: bold; color: #b45309;">
                📍 ${opp.calculatedDistanceKm} km
              </span>
            </div>
            <div style="font-weight: bold; color: #0f172a; font-size: 12px; margin-bottom: 2px;">
              ${opp.name}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              ${opp.provider || opp.city}
            </div>
            <div style="font-size: 10px; color: #059669; font-weight: bold;">
              ${opp.estimatedMonthlyIncome ? `₹${opp.estimatedMonthlyIncome.toLocaleString()} / mo` : 'Certified PM-AJAY Pathway'}
            </div>
          </div>
        `);

        markersLayerRef.current.addLayer(marker);
      });

      // Adjust map view bounds to encompass center and opportunities
      if (filteredOpportunities.length > 0) {
        const bounds = L.latLngBounds([
          [beneficiaryCoords.latitude, beneficiaryCoords.longitude],
          ...filteredOpportunities.map((o) => [o.latitude, o.longitude] as [number, number])
        ]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      } else {
        map.setView([beneficiaryCoords.latitude, beneficiaryCoords.longitude], 11);
      }
    };

    updateLayers();
  }, [filteredOpportunities, beneficiaryCoords, filters.radiusKm, selectedOpportunityId, onSelectOpportunity, profile.name, profile.preferredLivelihood, selectedDistrict, selectedState]);

  // Quick District Switcher handler
  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const centroid = DISTRICT_CENTROIDS[dist];
    if (centroid) {
      setSelectedState(centroid.state);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <MapPin size={14} className="text-emerald-400" />
            <span>Interactive Opportunity Engine</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Opportunities Near You
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Find certified training centers, employment vacancies, apprenticeships, and PM-AJAY GIA self-employment pathways dynamically mapped to your location and skill baseline.
          </p>
        </div>

        {/* Quick Career Roadmap Link */}
        {onNavigateToRoadmap && (
          <button
            type="button"
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 hover:bg-emerald-950/60 px-4 py-2.5 text-xs font-bold text-emerald-300 transition-colors"
          >
            <Sparkles size={14} />
            <span>View Full Career Roadmap</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Location Bar & Quick Radius Selector */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <MapPin size={15} className="text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Active District & State</span>
              <span className="font-bold text-slate-100">
                {selectedDistrict}, {selectedState}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <Compass size={15} className="text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Search Radius</span>
              <span className="font-bold text-amber-300">{filters.radiusKm} km radius</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <Sparkles size={15} className="text-purple-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Career Goal</span>
              <span className="font-bold text-purple-300">{profile.preferredLivelihood || 'Self-Employment'}</span>
            </div>
          </div>
        </div>

        {/* Change District & Radius Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 px-2">Radius:</span>
            {[5, 10, 25, 50].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFilters({ ...filters, radiusKm: r })}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                  filters.radiusKm === r
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {r}km
              </button>
            ))}
          </div>

          {/* Quick District Selector Dropdown */}
          <select
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="rounded-2xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="Theni">Theni (TN - Demo Focus)</option>
            <option value="Madurai">Madurai (TN)</option>
            <option value="Dindigul">Dindigul (TN)</option>
            <option value="Coimbatore">Coimbatore (TN)</option>
            <option value="Tiruppur">Tiruppur (TN)</option>
            <option value="Chennai">Chennai (TN)</option>
            <option value="Salem">Salem (TN)</option>
            <option value="Erode">Erode (TN)</option>
            <option value="Vizianagaram">Vizianagaram (AP)</option>
            <option value="Vijayawada">Vijayawada (AP)</option>
            <option value="Guntur">Guntur (AP)</option>
            <option value="Tirupati">Tirupati (AP)</option>
            <option value="Bengaluru">Bengaluru (KA)</option>
            <option value="Mysuru">Mysuru (KA)</option>
            <option value="Kochi">Kochi (KL)</option>
            <option value="Thiruvananthapuram">Thiruvananthapuram (KL)</option>
            <option value="Sitapur">Sitapur (UP)</option>
            <option value="Gaya">Gaya (Bihar)</option>
            <option value="Solapur">Solapur (MH)</option>
          </select>
        </div>
      </div>

      {/* Main 3-Column / Responsive 2-Pane Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Filters (3 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <OpportunityFilters
            filters={filters}
            onChangeFilters={setFilters}
            totalResultsCount={filteredOpportunities.length}
          />

          {/* Category Legend Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers size={14} className="text-emerald-400" />
              <span>Map Marker Categories</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="size-3 rounded-full bg-blue-500" />
                <span>🔵 Training Center</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="size-3 rounded-full bg-emerald-500" />
                <span>🟢 Wage Job</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="size-3 rounded-full bg-amber-500" />
                <span>🟠 Apprenticeship</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="size-3 rounded-full bg-purple-500" />
                <span>🟣 Livelihood Unit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Interactive Map & Opportunity Cards (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Interactive Map Container */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200">
                  Interactive Spatial Map ({selectedDistrict} Centroid: {beneficiaryCoords.latitude}, {beneficiaryCoords.longitude})
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click any marker to inspect opportunity details & directions
              </span>
            </div>

            {/* Leaflet Map DOM Element */}
            <div
              ref={mapContainerRef}
              className="w-full h-[400px] sm:h-[460px] bg-slate-950 relative z-10"
              style={{ minHeight: '400px' }}
            />
          </div>

          {/* Top Opportunities Ranked List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-400" />
                  <span>Top Opportunities Near You</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ranked by 5-factor scoring (Skill 35% · Proximity 25% · Goal 15% · Eligibility 15% · NSQF 10%)
                </p>
              </div>

              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                {filteredOpportunities.length} Available
              </span>
            </div>

            {/* Empty State when no results found */}
            {filteredOpportunities.length === 0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-10 text-center space-y-4">
                <AlertTriangle size={36} className="mx-auto text-amber-400" />
                <div>
                  <h4 className="text-base font-bold text-slate-200">
                    No matching opportunities found within {filters.radiusKm} km radius
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Try increasing your search radius or clearing active skill/type filters to explore nearby regional opportunities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, radiusKm: 50, type: 'all', skill: 'all' })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md"
                >
                  <RotateCcw size={14} />
                  <span>Expand Radius to 50 km & Reset Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-1">
                {filteredOpportunities.map((opp, idx) => (
                  <div key={opp.id} className="relative">
                    <div className="absolute -left-3 top-6 size-6 rounded-full bg-slate-800 text-emerald-400 font-mono font-bold text-[11px] grid place-items-center border border-slate-700 z-10 shadow-md">
                      0{idx + 1}
                    </div>
                    <div className="pl-4">
                      <OpportunityCard
                        opportunity={opp}
                        isSelected={selectedOpportunityId === opp.id}
                        onSelect={() => setSelectedOpportunityId(opp.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
