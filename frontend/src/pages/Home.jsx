import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiHeart,
  FiShield,
  FiTruck,
} from "react-icons/fi";

import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />

      <main className="bg-white text-black">

        {/* ================= HERO ================= */}
        <section className="relative overflow-hidden bg-[#FAF9F5]">
          <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

            {/* Hero Content */}
            <div className="max-w-2xl">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8E3D5] bg-white px-4 py-2 text-sm font-medium text-[#A88416] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#C9A227]" />
                Authentic Godavari Taste
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Traditional Taste,
                <span className="block text-[#C9A227]">
                  Made With Love.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
                Discover authentic homemade foods inspired by the
                rich flavors and traditions of the Godavari region.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#A88416] hover:shadow-md"
                >
                  Shop Now
                  <FiArrowRight />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-lg border border-[#D8D2C0] bg-white px-6 py-3.5 text-sm font-semibold text-gray-800 transition-all duration-200 hover:border-[#C9A227] hover:text-[#A88416]"
                >
                  Explore Foods
                </Link>

              </div>

              {/* Trust Points */}
              <div className="mt-10 grid gap-4 sm:grid-cols-3">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                    <FiCheck />
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    Authentic Taste
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                    <FiShield />
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    Quality Foods
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2DF] text-[#A88416]">
                    <FiTruck />
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    Fresh Delivery
                  </span>
                </div>

              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">

              <div className="relative mx-auto aspect-square max-w-[520px] overflow-hidden rounded-[2rem] border border-[#E8E3D5] bg-white p-3 shadow-xl">

                <div className="flex h-full items-center justify-center rounded-[1.5rem] bg-[#F7F2DF]">

                  {/* Temporary visual area */}
                  <div className="px-8 text-center">

                    <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-[#C9A227] bg-white shadow-sm">
                      <span className="text-4xl">🍱</span>
                    </div>

                    <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#A88416]">
                      Godavari Foods
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                      Taste of Tradition
                    </h2>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-600">
                      Homemade flavors inspired by the heart
                      of the Godavari region.
                    </p>

                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 left-4 rounded-xl border border-[#E8E3D5] bg-white px-4 py-3 shadow-lg sm:left-0">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F2DF] text-[#C9A227]">
                    <FiHeart />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Made with
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                      Care & Tradition
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="bg-white py-20 sm:py-24">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                Explore Our Collection
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Our Categories
              </h2>

              <p className="mt-4 text-gray-600">
                Explore traditional favorites prepared with
                authentic ingredients and timeless recipes.
              </p>

            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {/* Snacks */}
              <Link
                to="/products"
                className="group rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7F2DF] text-2xl">
                  🍘
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  Traditional Snacks
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Authentic homemade snacks inspired by
                  traditional Godavari recipes.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#A88416]">
                  Explore Snacks
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Pickles */}
              <Link
                to="/products"
                className="group rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7F2DF] text-2xl">
                  🫙
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  Traditional Pickles
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Rich, flavorful pickles prepared with
                  carefully selected ingredients.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#A88416]">
                  Explore Pickles
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Sweets */}
              <Link
                to="/products"
                className="group rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#F7F2DF] text-2xl">
                  🍬
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  Traditional Sweets
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Delicious traditional sweets made for
                  celebrations and everyday moments.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#A88416]">
                  Explore Sweets
                  <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* ================= WHY US ================= */}
        <section className="bg-[#FAF9F5] py-20 sm:py-24">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              <div>

                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
                  Why Godavari Foods
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                  Bringing the taste of tradition to your home.
                </h2>

                <p className="mt-5 leading-7 text-gray-600">
                  We believe traditional food is more than just
                  something you eat. It carries memories,
                  culture and the flavors of home.
                </p>

                <Link
                  to="/products"
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-[#A88416] transition-colors duration-200 hover:text-[#80640F]"
                >
                  Discover our foods
                  <FiArrowRight />
                </Link>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                  <FiHeart className="text-2xl text-[#C9A227]" />

                  <h3 className="mt-5 font-bold text-gray-900">
                    Made With Care
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Every product is prepared with attention
                    to taste and quality.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                  <FiShield className="text-2xl text-[#C9A227]" />

                  <h3 className="mt-5 font-bold text-gray-900">
                    Quality Ingredients
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Carefully selected ingredients for
                    authentic flavors.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                  <FiTruck className="text-2xl text-[#C9A227]" />

                  <h3 className="mt-5 font-bold text-gray-900">
                    Fresh Delivery
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    We make it easy to enjoy your favorite
                    foods wherever you are.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#E8E3D5] bg-white p-6 shadow-sm">
                  <FiCheck className="text-2xl text-[#C9A227]" />

                  <h3 className="mt-5 font-bold text-gray-900">
                    Authentic Recipes
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Inspired by the traditional flavors of
                    the Godavari region.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8">

          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#E8E3D5] bg-[#F7F2DF] px-6 py-14 text-center sm:px-12">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A88416]">
              Taste Something Special
            </p>

            <h2 className="mt-4 text-3xl font-bold text-gray-950 sm:text-4xl">
              Bring authentic Godavari flavors home.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Explore our collection of traditional foods and
              discover flavors made with care.
            </p>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#C9A227] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#A88416] hover:shadow-md"
            >
              Shop Our Collection
              <FiArrowRight />
            </Link>

          </div>
        </section>

      </main>
    </>
  );
};

export default Home;