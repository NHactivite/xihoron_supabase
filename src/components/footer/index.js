import { Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 lg:py-12 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-4">Xihorn V1.0.0</h2>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
               Experience Xihoron, the annual fest hosted by the Computer Science Department of Sibsagar University, celebrating creativity, technology, and innovation through a series of exciting events, competitions, and showcases. 
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/n.i.k_.h.i.l?igsh=NmMzMTJqczVjbWtw" className="text-white hover:text-gray-300 transition-colors">
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
  <h3 className="text-lg font-semibold mb-4">Sponsors</h3>
  <ul className="space-y-3">
    <li>
      <Link href="https://www.tcs.com" target="_blank" className="text-gray-300 hover:text-white transition-colors text-sm">
        Tata Consultancy Services
      </Link>
    </li>
    <li>
      <Link href="https://www.infosys.com" target="_blank" className="text-gray-300 hover:text-white transition-colors text-sm">
        Infosys
      </Link>
    </li>
    <li>
      <Link href="https://www.techvariable.com" target="_blank" className="text-gray-300 hover:text-white transition-colors text-sm">
        TechVariable
      </Link>
    </li>
    <li>
      <Link href="https://www.wipro.com" target="_blank" className="text-gray-300 hover:text-white transition-colors text-sm">
        Wipro
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
            ©2025 https://xihoron.vercel.app/ All rights reserved. Use of this website constitutes acceptance of our Terms of
            Service and Policy and Cookie Statement. The material on this site may not be reproduced, distributed,
            transmitted, cached, or otherwise used.
          </p>
        </div>
      </div>

    </footer>
  )
}