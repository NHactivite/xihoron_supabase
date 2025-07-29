import { getAllProduct } from "@/action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import flower from "../../utils/flower.jpg";
import yellow from "../../utils/home_section/yellow.webp";
import pink from "../../utils/home_section/pink1.webp";
import blue from "../../utils/home_section/blue.webp";
import red from "../../utils/home_section/red.webp";
import White from "../../utils/home_section/shopping.webp";
import f7 from "../../utils/home_section/f7.avif";
import p1 from "../../utils/home_section/price1.png";
import p2 from "../../utils/home_section/price2.png";
import p3 from "../../utils/home_section/price3.png";
import p4 from "../../utils/home_section/price4.png";
import spark1 from "../../utils/home_section/spark-1.svg";
import spark2 from "../../utils/home_section/spark-2.svg";
import ProductCard from "../product-card";
import Link from "next/link";
const Home = async () => {
  const res = await getAllProduct();
  const data = await res.json();
  const Products = data.products;
  const user = await currentUser();

  return (
    <div>
      <section>
        <div className="relative w-full h-[300px] ">
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
          <h1 className="lg:text-4xl text-lg">Explore Our Exquisite Range</h1>
          <Image
            src={spark2}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
        </div>
        <main className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 scrollbar-hide  min-h-36">
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

      <section className="flex flex-col  items-center lg:gap-16 gap-10 my-8 bg-gradient-to-r from-green-100 via-white to-teal-100 rounded-xl ">
        <div className="flex justify-center items-center  mt-6 ">
          <Image
            src={spark1}
            alt="spark"
            className="w-[50px] h-[50px] lg:m-3"
          />
          <h1 className="lg:text-4xl text-lg">Choose a Favourite Colour</h1>
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
              query: { search: "yellow" },
            }}
            className=" relative w-[100px] h-[100px] bg-yellow-300 rounded-full"
          >
            <Image
              src={yellow}
              alt="yellow"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  text-yellow-500 right-9 font-semibold">
              Yellow
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "pink" },
            }}
            className=" relative w-[100px] h-[100px] bg-pink-600 rounded-full"
          >
            <Image
              src={pink}
              alt="pink"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  text-pink-600 right-9 font-semibold">
              Pink
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "blue" },
            }}
            className="relative w-[100px] h-[100px] bg-blue-400 rounded-full "
          >
            <Image
              src={blue}
              alt="pink"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  text-blue-600 right-9 font-semibold">
              Blue
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "red" },
            }}
            className="relative w-[100px] h-[100px] bg-red-600 rounded-full"
          >
            <Image
              src={red}
              alt="pink"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  text-red-700 right-9 font-semibold">
              Red
            </span>
          </Link>
          <Link
            href={{
              pathname: "/search",
              query: { search: "white" },
            }}
            className="relative w-[100px] h-[100px] bg-gray-200 rounded-full"
          >
            <Image
              src={White}
              alt="pink"
              className="absolute -top-1 -left-1 w-[100] rounded-full object-cover"
            />
            <span className="absolute -bottom-9  text-gray-500 right-9 font-semibold">
              White
            </span>
          </Link>
          <Link
            href={"/search"}
            className="relative w-[100px] h-[100px] bg-amber-700 rounded-full"
          >
            <Image
              src={f7}
              alt="pink"
              className="absolute -top-1 -left-1 w-[100px] h-[100px] rounded-full object-cover"
            />
            <span className="absolute -bottom-9 text-gray-900  right-9 font-semibold">
              Mix
            </span>
          </Link>
        </div>
      </section>
      <section className="flex flex-col  items-center gap-1 min-h-80">
        <h1 className="lg:text-3xl text-xl font-bold ">
          Shop Flowers By Budget
        </h1>
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
