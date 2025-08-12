import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACCOMMODATIONS, type Accommodation, type Amenity } from '../data/accommodations';
import './SearchResults.css';

// Helpers to work with URLSearchParams
const parseNumber = (val: string | null, fallback: number) => {
  const n = val ? Number(val) : NaN;
  return Number.isFinite(n) ? n : fallback;
};

const useQuery = () => new URLSearchParams(useLocation().search);

// Filter State Type
interface FilterState {
  starMin: number; // hotel stars >=
  priceMin: number;
  priceMax: number;
  amenities: Amenity[]; // must include all
  customerMin: number; // review rating >=
}

const ALL_AMENITIES: Amenity[] = ['WiFi', 'Pool', 'Parking', 'Gym', 'Breakfast', 'Spa', 'PetFriendly'];

const defaultFilters: FilterState = {
  starMin: 0,
  priceMin: 0,
  priceMax: 1000,
  amenities: [],
  customerMin: 0,
};

const toParams = (filters: FilterState) => {
  const p = new URLSearchParams();
  if (filters.starMin) p.set('starMin', String(filters.starMin));
  if (filters.priceMin) p.set('priceMin', String(filters.priceMin));
  if (filters.priceMax !== 1000) p.set('priceMax', String(filters.priceMax));
  if (filters.amenities.length) p.set('amenities', filters.amenities.join(','));
  if (filters.customerMin) p.set('customerMin', String(filters.customerMin));
  return p;
};

const fromParams = (p: URLSearchParams): FilterState => {
  const starMin = parseNumber(p.get('starMin'), defaultFilters.starMin);
  const priceMin = parseNumber(p.get('priceMin'), defaultFilters.priceMin);
  const priceMax = parseNumber(p.get('priceMax'), defaultFilters.priceMax);
  const amenities = (p.get('amenities') || '')
    .split(',')
    .map(a => a.trim())
    .filter(Boolean) as Amenity[];
  const customerMin = parseNumber(p.get('customerMin'), defaultFilters.customerMin);
  return { starMin, priceMin, priceMax, amenities, customerMin };
};

const matchesAllFilters = (item: Accommodation, f: FilterState) => {
  if (item.starRating < f.starMin) return false;
  if (item.pricePerNight < f.priceMin || item.pricePerNight > f.priceMax) return false;
  if (item.customerRating < f.customerMin) return false;
  if (f.amenities.length && !f.amenities.every(am => item.amenities.includes(am))) return false;
  return true;
};

const Stars: React.FC<{ value: number }> = ({ value }) => (
  <span aria-label={`Hotel star rating ${value}`}>{'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}</span>
);

const RatingPill: React.FC<{ value: number }> = ({ value }) => (
  <span className="rating-pill" title={`${value.toFixed(1)} / 5`}>{value.toFixed(1)}</span>
);

const ResultCard: React.FC<{ item: Accommodation } & React.HTMLAttributes<HTMLDivElement>> = ({ item, ...rest }) => (
  <div className="result-card" {...rest}>
    <div className="result-media" aria-hidden>
      <div className="img-placeholder">{item.city.slice(0,2).toUpperCase()}</div>
    </div>
    <div className="result-body">
      <div className="result-header">
        <h3 className="result-title">{item.name}</h3>
        <Stars value={item.starRating} />
      </div>
      <div className="result-meta">
        <div className="price">${item.pricePerNight}/night</div>
        <RatingPill value={item.customerRating} />
      </div>
      <div className="amenities">
        {item.amenities.map(a => (
          <span key={a} className="amenity-pill">{a}</span>
        ))}
      </div>
    </div>
  </div>
);

const useSyncedFilters = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const readStorage = (): FilterState | null => {
    try {
      const raw = localStorage.getItem('wf:search:filters');
      return raw ? JSON.parse(raw) as FilterState : null;
    } catch { return null; }
  };

  const writeStorage = (f: FilterState) => {
    try { localStorage.setItem('wf:search:filters', JSON.stringify(f)); } catch {}
  };

  const initial = (() => {
    const fromUrl = fromParams(query);
    const hasAny = Array.from(query.keys()).length > 0;
    if (hasAny) return fromUrl;
    return readStorage() || fromUrl;
  })();

  const [filters, setFilters] = useState<FilterState>(initial);

  // sync from URL on navigation
  useEffect(() => {
    const next = fromParams(query);
    const hasAny = Array.from(query.keys()).length > 0;
    if (hasAny) setFilters(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation().search]);

  // push to URL and storage on change
  useEffect(() => {
    const p = toParams(filters);
    const url = p.toString() ? `/search?${p}` : '/search';
    navigate(url, { replace: true });
    writeStorage(filters);
  }, [filters, navigate]);

  return [filters, setFilters] as const;
};

const SearchResults: React.FC = () => {
  const [filters, setFilters] = useSyncedFilters();

  const filtered = useMemo(() => ACCOMMODATIONS.filter(a => matchesAllFilters(a, filters)), [filters]);

  const clearAll = () => setFilters(defaultFilters);

  // Simple animation via CSS class toggle on list
  const [animateKey, setAnimateKey] = useState(0);
  useEffect(() => { setAnimateKey(k => k + 1); }, [filtered.length]);

  const total = ACCOMMODATIONS.length;
  const count = filtered.length;

  return (
    <div className="search-page" data-testid="search-results-page">
      <div className="container">
        <h2>Search Results</h2>
        <div className="results-header">
          <div className="results-count" data-testid="results-count">Showing {count} of {total} results</div>
          <button className="clear-filters" onClick={clearAll} disabled={JSON.stringify(filters)===JSON.stringify(defaultFilters)} data-testid="clear-filters">
            Clear All Filters
          </button>
        </div>
        <div className="layout">
          <aside className="filters" aria-label="Filters" data-testid="filters-panel">
            <section>
              <h4>Star Rating</h4>
              <div className="star-options">
                {[0,1,2,3,4,5].map(s => (
                  <label key={s} className={`chip ${filters.starMin===s ? 'active' : ''}`}>
                    <input type="radio" name="starMin" value={s} checked={filters.starMin===s} onChange={() => setFilters(f => ({...f, starMin: s}))} />
                    {s===0 ? 'Any' : `${s}+`}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h4>Price Range ($/night)</h4>
              <div className="price-range">
                <div className="row">
                  <label>
                    Min
                    <input type="number" min={0} max={filters.priceMax} value={filters.priceMin}
                      onChange={(e) => setFilters(f => ({...f, priceMin: Math.min(Number(e.target.value)||0, f.priceMax)}))}
                      data-testid="price-min"/>
                  </label>
                  <label>
                    Max
                    <input type="number" min={filters.priceMin} value={filters.priceMax}
                      onChange={(e) => setFilters(f => ({...f, priceMax: Math.max(Number(e.target.value)||0, f.priceMin)}))}
                      data-testid="price-max"/>
                  </label>
                </div>
              </div>
            </section>

            <section>
              <h4>Amenities</h4>
              <div className="amenities-options">
                {ALL_AMENITIES.map(a => (
                  <label key={a} className={`option ${filters.amenities.includes(a) ? 'selected' : ''}`}>
                    <input type="checkbox" checked={filters.amenities.includes(a)}
                      onChange={(e) => setFilters(f => ({
                        ...f,
                        amenities: e.target.checked ? [...f.amenities, a] : f.amenities.filter(x => x!==a)
                      }))}
                      />
                    {a}
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h4>Customer Rating</h4>
              <div className="rating-options">
                {[0,3.5,4.0,4.5].map(r => (
                  <label key={r} className={`chip ${filters.customerMin===r ? 'active' : ''}`}>
                    <input type="radio" name="customerMin" value={r} checked={filters.customerMin===r}
                      onChange={() => setFilters(f => ({...f, customerMin: r}))}
                    />
                    {r===0 ? 'Any' : `${r.toFixed(1)}+`}
                  </label>
                ))}
              </div>
            </section>
          </aside>

          <section className="results">
            <div key={animateKey} className="results-grid fade-in" data-testid="results-grid">
              {filtered.map(item => (
                <ResultCard key={item.id} item={item} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="no-results" data-testid="no-results">
                No results match the current filters. Try adjusting or
                <button className="link-button" onClick={clearAll}> clearing all filters</button>.
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
