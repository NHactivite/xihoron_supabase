import { Instagram, Facebook, Youtube } from "lucide-react"
import Link from "next/link"
import whatsapp from "../../utils/home_section/whatsapp.gif"
import Image from "next/image"
export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Flower Store</h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Explore beautiful flowers arrangements, personalized gifts, decadent cakes, dry fruits, & floral hampers
              on www.bloomsflora.com.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">P</span>
                </div>
              </Link>
              <Link href="#" className="text-white hover:text-gray-300 transition-colors">
                <Youtube className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  FAQ's
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  My Account
                </Link>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mb-4">More Info</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Florist Login
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Customer Review
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Delivery Cities
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  International Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Cities</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Mumbai
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Pune
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Delhi
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Bangalore
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Agra
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Chennai
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Flowers Delivery Ahmedabad
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col items-start lg:items-end">
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-white rounded px-2 py-1">
                <span className="text-blue-600 font-bold text-xs">VISA</span>
              </div>
              <div className="bg-white rounded px-2 py-1">
                <span className="text-blue-600 font-bold text-xs">G Pay</span>
              </div>
              <div className="bg-blue-600 rounded px-2 py-1">
                <span className="text-white font-bold text-xs">PayPal</span>
              </div>
              <div className="bg-blue-400 rounded px-2 py-1">
                <span className="text-white font-bold text-xs">Paytm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <p className="text-gray-400 text-xs text-center leading-relaxed">
            ©2025 www.bloomsflora.com. All rights reserved. Use of this website constitutes acceptance of our Terms of
            Service and Policy and Cookie Statement. The material on this site may not be reproduced, distributed,
            transmitted, cached, or otherwise used.
          </p>
        </div>
      </div>

      <div className="fixed right-4 bottom-4 z-50">
       
          <Image src={whatsapp} alt="whatsapp" className="rounded-full"/>
       
      </div>
    </footer>
  )
}