import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Truck, Phone, Mail, Package } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen  py-5 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1  gap-8 mb-12">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                We create authentic pickles from age-old family recipes. Each
                jar is handcrafted with the freshest local ingredients and
                traditional spices, capturing the true taste of home.
              </p>
              <p className="text-gray-600 mb-4">
                We have proudly delivered{" "}
                <strong>500+ jars of tradition across India</strong> and our
                customers love the authentic flavour and homemade quality of our
                pickles.
              </p>
              <p className="text-gray-600">
                The perfect companion for your daily meals, adding a punch of
                flavour to rice, rotis, and more.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Package className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">500+ Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Successfully delivered across India
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Truck className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">India Post Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Safe delivery to your doorstep</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Customer Care</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">We help solve any problems</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Order?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/search"
              className="bg-pink-600 hover:bg-pink-700 p-2 px-4 rounded-md flex items-center justify-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              <span> Shop Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
