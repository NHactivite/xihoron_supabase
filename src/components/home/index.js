"use client";
import Image from "next/image";
import flower from "../../utils/flower.jpg";
import mango from "../../utils/home_section/mango.webp";
import lemon from "../../utils/home_section/lemon.webp";
import chilli from "../../utils/home_section/chilli.webp";
import amla from "../../utils/home_section/amla.webp";
import bambooShoot from "../../utils/home_section/bambooShoot.webp";
import mix from "../../utils/home_section/mix.webp";
import p1 from "../../utils/home_section/price1.png";
import p2 from "../../utils/home_section/price2.png";
import p3 from "../../utils/home_section/price3.png";
import p4 from "../../utils/home_section/price4.png";
import spark1 from "../../utils/home_section/spark-1.svg";
import spark2 from "../../utils/home_section/spark-2.svg";
import ProductCard from "../product-card";
import Link from "next/link";
const Home = ({topSell, Products, user ,latestProducts}) => {
  return (
    <div className="bg-gradient-to-r from-red-500 via-orange-500 to-orange-400">
      <section>
        <div className="relative w-full h-[200px]">
          <Image
            src={flower}
            alt="Flower"
            fill
            className="object-top object-cover"
            priority
          />
        </div>
        <div className="hidden lg:flex lg:relative lg:w-full lg:h-[300px] ">
          <Image
            src={flower}
            alt="Flower"
            fill
            className="object-cover "
            priority
          />
        </div>
        <div className="flex justify-center items-center lg:m-8 m-2">
          <Image
            src={spark1}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
          <h1 className="lg:text-4xl text-lg">Explore Our Range</h1>
          <Image
            src={spark2}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
        </div>
        <main className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 px-2 scrollbar-hide  min-h-36">
          {Products?.map((i, idx) => (
            <ProductCard
              key={idx}
              id={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              photos={i.photos[0].url}
              userId={user?.id}
            />
          ))}
        </main>
      </section>

      <section className="flex flex-col  items-center lg:gap-16 gap-10 my-8 bg-gradient-to-r from-red-400 via-orange-300 to-orange-200 rounded-xl ">
        <div className="flex justify-center items-center  mt-6 ">
          <Image
            src={spark1}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
          <h1 className="lg:text-4xl text-lg">Choose a Favourite Pickle</h1>
          <Image
            src={spark1}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
        </div>
        <div className="grid grid-cols-3 lg:gap-8 w-full place-items-center h-96 mb-6 ">
          <Link
            href={{
              pathname: "/search",
              query: { search: "mango" },
            }}
            className=" relative w-[100px] h-[100px] bg-yellow-500 rounded-full"
          >
            <Image
              src={mango}
              alt="mango"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  right-9 font-semibold">
              Mango
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "lemon" },
            }}
            className=" relative w-[100px] h-[100px] bg-green-700 rounded-full"
          >
            <Image
              src={lemon}
              alt="lemon"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9   right-9 font-semibold">
              Lemon
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "Amla" },
            }}
            className="relative w-[100px] h-[100px] bg-amber-900  rounded-full "
          >
            <Image
              src={amla}
              alt="amla Pickle"
              className="absolute -top-1 -left-1 w-[100]  rounded-full object-cover"
            />
            <span className="absolute -bottom-9   right-9 font-semibold">
              Amla
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "chilli" },
            }}
            className="relative w-[100px] h-[100px] bg-green-600 rounded-full"
          >
            <Image
              src={chilli}
              alt="chilli"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  right-9 font-semibold">
              Chilli
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "bambooShot" },
            }}
            className="relative w-[100px] h-[100px] rounded-full"
          >
            <Image
              src={bambooShoot}
              alt="bambooShoot"
             fill
              className="rounded-full object-cover"
            />
            <span className="absolute -bottom-9 font-semibold">
              BambooShoot
            </span>
          </Link>
          
          <Link
            href={"/search"}
            className="relative w-[100px] h-[100px] bg-amber-700 rounded-full"
          >
            <Image
              src={mix}
              alt="pink"
              className="absolute -top-1 -left-1 w-[100px] h-[100px] rounded-full object-cover"
            />
            <span className="absolute -bottom-9 text-gray-900  right-9 font-semibold">
              Mix
            </span>
          </Link>
        </div>
      </section>
      <section>
        <div className="flex justify-center items-center lg:m-8 m-2">
          <Image
            src={spark1}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
          <h1 className="lg:text-4xl text-lg">Latest Products</h1>
          <Image
            src={spark2}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
        </div>
        <main className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 px-2 scrollbar-hide  min-h-36">
          {latestProducts?.map((i, idx) => (
            <ProductCard
              key={idx}
              id={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              photos={i.photos[0].url}
              userId={user?.id}
            />
          ))}
        </main>
      </section>
      <section>
        <div className="flex justify-center items-center lg:m-8 m-2">
          <Image
            src={spark1}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
          <h1 className="lg:text-4xl text-lg">Top Sell</h1>
          <Image
            src={spark2}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
        </div>
        <main className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 px-2 scrollbar-hide  min-h-36">
          {topSell?.map((i, idx) => (
            <ProductCard
              key={idx}
              id={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              photos={i.photos[0].url}
              userId={user?.id}
            />
          ))}
        </main>
      </section>
      <section className="flex flex-col  items-center gap-1 min-h-80">
        <h1 className="lg:text-3xl text-xl font-bold ">Shop By Budget</h1>
        <div className="w-full lg:mt-16 m-5">
          <div className="flex justify-around flex-wrap gap-5">
            <Link
              href={{
                pathname: "/search",
                query: { maxPrice: "500" },
              }}
            >
              <Image
                src={p1}
                alt="price1"
                className="w-[200px] h-[100px] object-cover  rounded-md"
              />
            </Link>
            <Link
              href={{
                pathname: "/search",
                query: { maxPrice: "1000", minPrice: "500" },
              }}
            >
              <Image
                src={p2}
                alt="price2"
                className="w-[200px] h-[100px] object-cover rounded-md"
              />
            </Link>
            <Link
              href={{
                pathname: "/search",
                query: { maxPrice: "2000", minPrice: "1000" },
              }}
            >
              <Image
                src={p3}
                alt="price3"
                className="w-[200px] h-[100px] object-cover rounded-md"
              />
            </Link>
            <Link
              href={{
                pathname: "/search",
                query: { minPrice: "2000" },
              }}
            >
              <Image
                src={p4}
                alt="price4"
                className="w-[200px] h-[100px] object-cover rounded-md"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
