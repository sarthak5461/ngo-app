"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SiteShell from "@/components/site/site-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Search, X } from "lucide-react";
import { CATEGORY_LABEL, CATEGORY_COLOR } from "@/lib/content";

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const CATEGORIES = [
  { value: "services", label: "Services" },
  { value: "community", label: "Community" },
  { value: "education", label: "Education" },
  { value: "health", label: "Healthcare" },
  { value: "events", label: "Events" },
  { value: "environment", label: "Environment" },
  { value: "csr", label: "CSR" },
  { value: "news", label: "News" },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");

  const [years, setYears] = useState([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs(filters = {}, pageNumber = 1, append = false) {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams();

      if (filters.search?.trim()) {
        params.set("search", filters.search.trim());
      }

      if (filters.category) {
        params.set("category", filters.category);
      }

      if (filters.month) {
        params.set("month", filters.month);
      }

      if (filters.year) {
        params.set("year", filters.year);
      }

      params.set("page", pageNumber);
      params.set("limit", "9");

      const query = params.toString();

      const response = await fetch(`/api/blogs?${query}`);

      if (!response.ok) {
        throw new Error("Failed to load blogs");
      }

      const data = await response.json();

      const rows = data.rows || [];

      if (append) {
        setBlogs((prev) => [...prev, ...rows]);
      } else {
        setBlogs(rows);
      }

      setPage(pageNumber);

      setHasMore(data.pagination?.hasMore ?? false);

      // Build available years from returned blogs
      const blogsForYears = append ? [...blogs, ...rows] : rows;

      const availableYears = [
        ...new Set(
          blogsForYears
            .map((blog) => {
              const date = blog.publishedAt || blog.createdAt;
              return date ? new Date(date).getFullYear() : null;
            })
            .filter(Boolean),
        ),
      ].sort((a, b) => b - a);

      setYears(availableYears);
    } catch (error) {
      console.error("BLOGS PAGE ERROR:", error);

      if (!append) {
        setBlogs([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function handleSearch(e) {
    const value = e.target.value;

    setSearch(value);

    loadBlogs({
      search: value,
      month,
      year,
    });
  }

  function handleMonthChange(e) {
    const value = e.target.value;

    setMonth(value);

    loadBlogs(
      {
        search,
        month: value,
        year,
      },
      1,
      false,
    );
  }

  function handleYearChange(e) {
    const value = e.target.value;

    setYear(value);

    loadBlogs(
      {
        search,
        month,
        year: value,
      },
      1,
      false,
    );
  }

  function clearFilters() {
    setSearch("");
    setMonth("");
    setYear("");
    setCategory("");

    loadBlogs(
      {
        search: "",
        category: "",
        month: "",
        year: "",
      },
      1,
      false,
    );
  }

  const hasFilters = search || category || month || year;

  const featured = blogs.find((b) => b.featured) || blogs[0];

  const rest = blogs.filter((b) => b.id !== featured?.id);

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getReadingTime(html = "") {
    const text = html.replace(/<[^>]+>/g, "");

    const words = text.trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));
  }

  if (loading) {
    return (
      <SiteShell>
        <div className="container py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-52 bg-slate-200 rounded-xl" />
                <div className="h-5 bg-slate-200 rounded mt-4" />
                <div className="h-4 bg-slate-200 rounded mt-2" />
              </div>
            ))}
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      {/* Header */}
      <section className="pt-32 pb-10 gradient-trust text-white">
        <div className="container">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/20 mb-4 backdrop-blur-sm">
            Blog &amp; News
          </Badge>

          <h1 className="font-[Playfair_Display] text-5xl lg:text-6xl font-bold mb-4">
            Stories from the field.
          </h1>

          <p className="text-lg text-white/85 max-w-2xl">
            Programme updates, photo diaries, annual reports and honest
            reflections from our volunteers and staff.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[minmax(280px,1fr)_auto_190px_170px_minmax(220px,1.2fr)] gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loadBlogs(
                      {
                        search,
                        month,
                        year,
                      },
                      1,
                      false,
                    );
                  }
                }}
                placeholder="Search stories..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>

            <Button
              onClick={() =>
                loadBlogs(
                  {
                    search,
                    month,
                    year,
                  },
                  1,
                  false,
                )
              }
              className="h-11 gradient-trust text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>

            {/* Month */}
            <select
              value={month}
              onChange={handleMonthChange}
              className="h-11 px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">All Months</option>

              {MONTHS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {/* Year */}
            <select
              value={year}
              onChange={handleYearChange}
              className="h-11 px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            >
              <option value="">All Years</option>

              {years.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value;

                setCategory(value);

                loadBlogs(
                  {
                    search,
                    category: value,
                    month,
                    year,
                  },
                  1,
                  false,
                );
              }}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>

              {CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            {/* Clear */}
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="h-11">
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* No results */}
      {!blogs.length && (
        <section className="py-20 bg-slate-50">
          <div className="container text-center">
            <Search className="w-10 h-10 mx-auto mb-4 text-slate-300" />

            <h2 className="font-[Playfair_Display] text-2xl font-bold text-slate-900 mb-2">
              No stories found
            </h2>

            <p className="text-slate-600 mb-5">
              Try changing your search or date filters.
            </p>

            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured && (
        <section className="py-12 bg-slate-50">
          <div className="container">
            <Link
              href={`/blog/${featured?.pageHeader?.slug}`}
              className="group block"
            >
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-72 lg:h-auto min-h-[320px]">
                    <img
                      src={featured?.hero?.coverImage}
                      alt={featured?.hero?.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-500 text-slate-900 hover:bg-amber-500">
                        Featured
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-8 lg:p-10 flex flex-col justify-center">
                    <Badge variant="secondary" className="w-fit mb-4">
                      {featured?.hero?.category}
                    </Badge>

                    <h2 className="font-[Playfair_Display] text-3xl lg:text-4xl font-bold text-slate-900 mb-4 group-hover:text-blue-800 transition">
                      {featured?.hero?.title}
                    </h2>

                    <p className="text-slate-600 leading-relaxed mb-6">
                      {featured?.hero?.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featured.publishedAt || featured.createdAt)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getReadingTime(featured.readTime)} mins read
                      </span>
                    </div>

                    <span className="inline-flex items-center text-blue-800 font-semibold group-hover:translate-x-1 transition-transform">
                      Read story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      {rest.length > 0 && (
        <section className="py-12 bg-slate-50">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.pageHeader?.slug}`}
                  className="group"
                >
                  <Card className="border-0 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full bg-white">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={post.hero?.coverImage}
                        alt={post.hero?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <CardContent className="p-6">
                      <Badge
                        variant="secondary"
                        className={`mb-3 ${CATEGORY_COLOR[post.hero?.category]}`}
                      >
                        {CATEGORY_LABEL[post.hero?.category] ||
                          post.hero?.category}
                      </Badge>

                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-800 transition leading-snug">
                        {post.hero?.title}
                      </h3>

                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {post.hero?.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasMore && blogs.length > 0 && (
        <section className="py-10 bg-slate-50">
          <div className="container text-center">
            <Button
              onClick={() =>
                loadBlogs(
                  {
                    search,
                    month,
                    year,
                  },
                  page + 1,
                  true,
                )
              }
              disabled={loadingMore}
              variant="outline"
              className="px-8"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container">
          <h2 className="font-[Playfair_Display] text-3xl font-bold text-slate-900 mb-3">
            Want to write for us?
          </h2>

          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            If you have volunteered with us, been a beneficiary, or have a story
            from the field — we would love to publish it.
          </p>

          <Button asChild size="lg" className="gradient-trust text-white">
            <Link href="/#contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
