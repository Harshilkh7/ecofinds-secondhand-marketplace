import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiSliders } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Demo products fallback
const demoProducts = [
  {
    id: "demo-1",
    title: "Vintage Camera",
    description: "Classic film camera, works perfectly.",
    price: 1200,
    category: "electronics",
    imageUrl:
      "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-2",
    title: "Stylish Jacket",
    description: "Warm winter jacket, barely used.",
    price: 800,
    category: "fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "demo-3",
    title: "Wooden Bookshelf",
    description: "Solid oak, 5-tier bookshelf.",
    price: 1500,
    category: "home",
    imageUrl:
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const query = useQuery();

  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const typingRef = useRef(null);

  const heroImages = [
    "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1473187983305-f615310e7daa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
  ];
  const [currentHero, setCurrentHero] = useState(0);

  // Hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (sort) params.sort = sort;

        const { data } = await api.get("/products", { params });

        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(demoProducts);
        }
      } catch (err) {
        console.error("API failed, using demo data", err);
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, sort]);
  console.log(products);
  

  // Local filtering for demo data
  const filterProducts = (productsList) => {
    return productsList
      .filter((p) => {
        const matchesCategory = category ? p.category === category : true;
        const matchesSearch = search
          ? p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
          : true;
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "low-high") return a.price - b.price;
        if (sort === "high-low") return b.price - a.price;
        return 0;
      });
  };

  // GSAP animations + typewriter
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
      );
    }
    if (categoriesRef.current) {
      gsap.from(categoriesRef.current, {
        scrollTrigger: { trigger: categoriesRef.current, start: "top 90%" },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }

    const phrases = [
      "Buy and sell pre-loved items.",
      "Save money.",
      "Save the planet.",
      "Join the community.",
    ];
    let phraseIndex = 0;
    let letterIndex = 0;

    const type = () => {
      if (typingRef.current) {
        typingRef.current.innerText = phrases[phraseIndex].slice(0, letterIndex);
        letterIndex++;
        if (letterIndex <= phrases[phraseIndex].length) {
          setTimeout(type, 60);
        } else {
          setTimeout(() => {
            letterIndex = 0;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            type();
          }, 1200);
        }
      }
    };

    type();
  }, []);

  // Loader
  const Loader = () => (
    <div className="flex justify-center items-center py-20">
      <div className="relative w-16 h-16 animate-spin-slow">
        <div className="absolute w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full"></div>
        <div className="absolute w-12 h-12 border-4 border-t-transparent border-blue-400 rounded-full top-2 left-2 animate-spin-reverse"></div>
        <div className="absolute w-8 h-8 border-4 border-t-transparent border-blue-300 rounded-full top-4 left-4 animate-spin-slow"></div>
      </div>
      <style jsx>{`
        @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 1.5s linear infinite; }
      `}</style>
    </div>
  );

  const NoProducts = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-20 opacity-80"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
        alt="No items"
        className="w-28 mx-auto mb-6 opacity-70 animate-bounce"
      />
      <p className="text-xl font-semibold">No products found</p>
      <p className="text-gray-500 mt-1">Try changing filters or adding new items.</p>
    </motion.div>
  );

  return (
    <div className="space-y-16 relative">
      {/* Hero Banner */}
      <section
        ref={heroRef}
        className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden rounded-b-3xl shadow-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentHero}
            src={heroImages[currentHero]}
            alt="Eco Marketplace"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-teal-800/70"></div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 text-center max-w-3xl px-6"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              Give Products a <span className="text-yellow-300">Second Life</span>
            </h1>
            <p ref={typingRef} className="mt-4 text-lg md:text-xl text-white/90 min-h-[2.5rem]"></p>
            <div className="flex bg-white/80 backdrop-blur-md rounded-full overflow-hidden shadow-xl max-w-xl mx-auto mt-8">
              <input
                value={search}
                placeholder="Search for electronics, fashion, books..."
                className="flex-1 px-5 py-3 text-gray-700 outline-none bg-transparent"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="px-6 text-green-700 hover:bg-green-100 transition">
                <FiSearch size={22} />
              </button>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-6 flex gap-3 justify-center w-full z-20">
          {heroImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-3 w-3 rounded-full transition-all ${
                idx === currentHero
                  ? "bg-yellow-300 scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white"
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <motion.div
  ref={categoriesRef}
  className="sticky top-0  bg-gray-900/95 backdrop-blur-md border-y border-gray-700 
       flex gap-4 overflow-x-auto px-4 py-4 hide-scrollbar justify-center shadow-md"
>
  {["All", "Electronics", "Fashion", "Books", "Home", "Sports"].map((c) => {
    const active = category === c.toLowerCase() || (c === "All" && category === "");
    return (
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        key={c}
        onClick={() => setCategory(c === "All" ? "" : c.toLowerCase())}
        className={`px-6 py-2 rounded-full border font-semibold whitespace-nowrap transition-all duration-300
          ${
            active
              ? "bg-gradient-to-r from-green-500 to-green-700 text-white border-green-600 shadow-lg shadow-green-700/50"
              : "bg-gray-700 text-gray-100 border-gray-600 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-500/50"
          }`}
      >
        {c}
      </motion.button>
    );
  })}
</motion.div>


      {/* Sorting */}
      <div className="flex justify-end max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 bg-gray-800 dark:bg-gray-800 px-3 py-1 rounded-full shadow">
          <FiSliders />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="outline-none bg-gray-800 text-white"
          >
            <option value="latest">Latest</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-6xl mx-auto px-4">
        {loading ? (
          <Loader />
        ) : filterProducts(products).length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filterProducts(products).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <NoProducts />
        )}
      </section>
    </div>
  );
}
