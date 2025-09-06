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

export default function Home() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("latest");
    const [loading, setLoading] = useState(true);
    const query = useQuery();
    const search = query.get("search") || "";

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

    // Hero Carousel
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
                setProducts(data.products || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [search, category, sort]);

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

        // Typewriter effect
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

    // Skeleton loader for products
    const ProductSkeleton = () => (
        <div className="border rounded-lg p-4 animate-pulse bg-gray-200 dark:bg-gray-700">
            <div className="h-48 bg-gray-300 rounded mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    );

    // Skeleton loader for hero
    const HeroSkeleton = () => (
        <div className="w-full h-[500px] md:h-[600px] rounded-b-3xl shadow-2xl animate-pulse bg-gray-300"></div>
    );

    return (
        <div className="space-y-16 relative">
            {/* Hero Banner */}
            {loading ? (
                <HeroSkeleton />
            ) : (
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
                                    defaultValue={search}
                                    placeholder="Search for electronics, fashion, books..."
                                    className="flex-1 px-5 py-3 text-gray-700 outline-none bg-transparent"
                                    onKeyDown={(e) =>
                                        e.key === "Enter" &&
                                        (window.location.href = `/?search=${encodeURIComponent(
                                            e.target.value
                                        )}`)
                                    }
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
                                className={`h-3 w-3 rounded-full transition-all ${idx === currentHero
                                        ? "bg-yellow-300 scale-125 shadow-lg"
                                        : "bg-white/50 hover:bg-white"
                                    }`}
                            ></div>
                        ))}
                    </div>
                </section>
            )}

            {/* Categories Carousel */}
            <motion.div
                ref={categoriesRef}
                className="flex gap-4 overflow-x-auto pb-2 px-4 hide-scrollbar justify-center relative z-10"
            >
                {["All", "Electronics", "Fashion", "Books", "Home", "Sports"].map((c) => {
                    const active = category === c.toLowerCase() || (c === "All" && category === "");
                    return (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            key={c}
                            onClick={() => setCategory(c === "All" ? "" : c.toLowerCase())}
                            className={`px-6 py-3 rounded-full border-2 font-semibold whitespace-nowrap transition shadow-md ${active
                                    ? "bg-green-600 text-white border-green-600 shadow-lg"
                                    : "bg-white/70 backdrop-blur-md text-gray-800 hover:bg-green-50"
                                }`}
                        >
                            {c}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* Sorting */}
            <div className="flex justify-end max-w-6xl mx-auto px-4">
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow">
                    <FiSliders />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="outline-none bg-transparent"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {products.map((p, i) => (
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
                )}
            </section>
        </div>
    );
}
