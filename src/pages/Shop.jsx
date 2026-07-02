import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, X } from 'lucide-react';

export default function Shop({ onPageChange, filterParams }) {
  const { products } = useContext(AppContext);

  // States
  const [searchQuery, setSearchQuery] = useState(filterParams?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(filterParams?.category || 'All');
  const [selectedGender, setSelectedGender] = useState(filterParams?.gender || 'All');
  const [selectedMovement, setSelectedMovement] = useState('All');
  const [selectedStrap, setSelectedStrap] = useState('All');
  const [priceRange, setPriceRange] = useState(6000); // Max boundary
  const [sortOption, setSortOption] = useState('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Listen to outer navigation category/gender updates
  useEffect(() => {
    if (filterParams?.category) {
      setSelectedCategory(filterParams.category);
      setSelectedGender('All');
    } else if (filterParams?.gender) {
      setSelectedGender(filterParams.gender);
      setSelectedCategory('All');
    } else if (filterParams?.search !== undefined) {
      setSearchQuery(filterParams.search);
    }
  }, [filterParams]);

  // Extract unique attribute lists for filters
  const movements = ['All', ...new Set(products.map(p => p.specs.movement))];
  const straps = ['All', ...new Set(products.map(p => p.specs.strap))];
  const categories = ['All', 'Chronomaster', 'Defy', 'Heritage', 'Elite'];

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGender('All');
    setSelectedMovement('All');
    setSelectedStrap('All');
    setPriceRange(6000);
    setSortOption('featured');
  };

  // Filter products logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery.trim() === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesMovement = selectedMovement === 'All' || product.specs.movement === selectedMovement;
    const matchesStrap = selectedStrap === 'All' || product.specs.strap === selectedStrap;
    const matchesPrice = product.price <= priceRange;
    const matchesGender = selectedGender === 'All' || 
      product.gender === selectedGender || 
      product.gender === 'unisex';

    return matchesSearch && matchesCategory && matchesMovement && matchesStrap && matchesPrice && matchesGender;
  });

  // Sort products logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default: // Featured / Normal sorting
        return Number(a.id) - Number(b.id);
    }
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-luxury-text/10 pb-6">
        <h1 className="font-serif text-3xl font-bold uppercase text-luxury-text tracking-widest">Zenith Catalogue</h1>
        <p className="text-luxury-muted text-xs mt-1">Discover precision Swiss timepieces engineered for ultimate endurance.</p>
      </div>

      {/* Main Grid: Filters & Products */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Filters Panel (Desktop Sidebar) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
          <div className="flex items-center justify-between border-b border-luxury-text/10 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-text flex items-center space-x-2">
              <SlidersHorizontal size={14} className="text-luxury-gold-dark" />
              <span>Filters</span>
            </h2>
            <button
              onClick={resetFilters}
              className="text-[10px] text-luxury-muted hover:text-luxury-gold-dark transition flex items-center space-x-1 uppercase font-semibold cursor-pointer"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Sub-Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Search within</h4>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-luxury-text text-xs px-3 py-2 pl-8 border border-luxury-text/10 rounded focus:outline-none focus:border-luxury-gold-dark"
              />
              <Search size={12} className="absolute left-2.5 top-3 text-luxury-muted" />
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Gender</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-luxury-muted">
              {[
                { key: 'All', label: 'All Timepieces' },
                { key: 'men', label: "Men's Watches" },
                { key: 'women', label: "Women's Watches" }
              ].map((g) => (
                <button
                  key={g.key}
                  onClick={() => setSelectedGender(g.key)}
                  className={`text-left hover:text-luxury-text transition cursor-pointer ${
                    selectedGender === g.key ? 'text-luxury-gold-dark font-bold' : ''
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Collection</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-luxury-muted">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left hover:text-luxury-text transition cursor-pointer ${
                    selectedCategory === cat ? 'text-luxury-gold-dark font-bold' : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Max Price</h4>
              <span className="text-xs text-luxury-gold-dark font-semibold">${priceRange.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-luxury-gold-dark cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-luxury-muted/70">
              <span>$1,000</span>
              <span>$6,000</span>
            </div>
          </div>

          {/* Movements Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Movement</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-luxury-muted">
              {movements.map((move) => (
                <button
                  key={move}
                  onClick={() => setSelectedMovement(move)}
                  className={`text-left hover:text-luxury-text transition truncate cursor-pointer ${
                    selectedMovement === move ? 'text-luxury-gold-dark font-bold' : ''
                  }`}
                  title={move}
                >
                  {move}
                </button>
              ))}
            </div>
          </div>

          {/* Straps Filter */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Bracelet/Strap</h4>
            <div className="flex flex-col space-y-1.5 text-xs text-luxury-muted">
              {straps.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStrap(st)}
                  className={`text-left hover:text-luxury-text transition truncate cursor-pointer ${
                    selectedStrap === st ? 'text-luxury-gold-dark font-bold' : ''
                  }`}
                  title={st}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filters Trigger & Sorting Section */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border border-luxury-text/10 px-6 py-4 rounded-md shadow-sm">
            
            {/* Left Mobile Toggle */}
            <button
              onClick={() => setShowFiltersMobile(true)}
              className="lg:hidden flex items-center space-x-2 text-xs font-bold tracking-widest uppercase border border-luxury-text/10 px-4 py-2 hover:border-luxury-gold-dark transition cursor-pointer text-luxury-text"
            >
              <SlidersHorizontal size={14} />
              <span>Filters ({filteredProducts.length})</span>
            </button>

            {/* Results Count (Desktop) */}
            <span className="hidden lg:inline text-xs text-luxury-muted">
              Showing <span className="text-luxury-text font-bold">{sortedProducts.length}</span> timepieces
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 text-xs w-full sm:w-auto justify-end">
              <span className="text-luxury-muted uppercase tracking-wider text-[10px] font-bold">Sort By:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white text-luxury-text border border-luxury-text/10 rounded px-3 py-1.5 focus:outline-none focus:border-luxury-gold-dark text-xs cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Catalog grid */}
          {sortedProducts.length === 0 ? (
            <div className="border border-dashed border-luxury-text/20 rounded-md p-16 text-center space-y-4">
              <p className="text-luxury-muted text-sm">No luxury watches match your current filter selections.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-luxury-gold-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-luxury-gold transition cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onPageChange={onPageChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filters Overlay */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFiltersMobile(false)} />
          
          <div className="relative w-80 max-w-sm bg-white border-r border-luxury-text/10 h-full p-6 overflow-y-auto space-y-6 flex flex-col z-10">
            <div className="flex justify-between items-center border-b border-luxury-text/10 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-luxury-text">Refine Catalog</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="text-luxury-muted hover:text-luxury-text cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div className="flex-1 space-y-6">
              {/* Mobile Search */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Search</h4>
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-luxury-bg text-luxury-text text-xs px-3 py-2 border border-luxury-text/10 rounded"
                />
              </div>

              {/* Mobile Gender Filter */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Gender</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'All', label: 'All' },
                    { key: 'men', label: "Men" },
                    { key: 'women', label: "Women" }
                  ].map((g) => (
                    <button
                      key={g.key}
                      onClick={() => setSelectedGender(g.key)}
                      className={`text-xs px-3 py-1.5 rounded border transition cursor-pointer ${
                        selectedGender === g.key 
                          ? 'border-luxury-gold-dark bg-luxury-gold-dark text-white font-bold' 
                          : 'border-luxury-text/10 text-luxury-muted hover:text-luxury-text'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Collection</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded border transition cursor-pointer ${
                        selectedCategory === cat 
                          ? 'border-luxury-gold-dark bg-luxury-gold-dark text-white font-bold' 
                          : 'border-luxury-text/10 text-luxury-muted hover:text-luxury-text'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Price Limit</h4>
                  <span className="text-xs text-luxury-gold-dark font-bold">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-luxury-gold-dark cursor-pointer"
                />
              </div>

              {/* Mobile Movements */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Movement</h4>
                <div className="flex flex-col space-y-2">
                  {movements.map((move) => (
                    <button
                      key={move}
                      onClick={() => setSelectedMovement(move)}
                      className={`text-left text-xs transition cursor-pointer ${
                        selectedMovement === move ? 'text-luxury-gold-dark font-bold' : 'text-luxury-muted hover:text-luxury-text'
                      }`}
                    >
                      {move}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Straps */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-luxury-text uppercase tracking-widest">Strap Material</h4>
                <div className="flex flex-col space-y-2">
                  {straps.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStrap(st)}
                      className={`text-left text-xs transition cursor-pointer ${
                        selectedStrap === st ? 'text-luxury-gold-dark font-bold' : 'text-luxury-muted hover:text-luxury-text'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-luxury-text/10">
              <button
                onClick={resetFilters}
                className="py-2.5 border border-luxury-text/10 text-luxury-text font-semibold text-xs tracking-wider uppercase hover:bg-luxury-bg transition cursor-pointer"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFiltersMobile(false)}
                className="py-2.5 bg-luxury-gold-dark text-white font-bold text-xs tracking-wider uppercase hover:bg-luxury-gold transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
