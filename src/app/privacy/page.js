import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Shield } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen  py-5 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">How we protect and use your information</p>
        </div>

        {/* Main Privacy Content */}
        <Card className="mb-6 bg-transparent">
          <CardHeader>
            <CardTitle>Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              When you order our beautiful wool flower bouquets, we collect basic information like your name, phone
              number, email address, and delivery address. This information is necessary to process your order and
              deliver your handcrafted flowers to your doorstep. We also collect details about what products you order
              and when you place your orders to provide better service.
            </p>

            <p className="text-gray-600">
              We use your information only for legitimate business purposes. This includes processing your orders,
              arranging delivery through India Post, sending you order confirmations and updates, and providing customer
              support when you need help. Our customer care team may contact you to resolve any delivery issues or
              answer questions about your wool flower bouquets. We may also send you promotional offers about new
              products, but only if you agree to receive them.
            </p>

            <p className="text-gray-600">
              We share your information only with trusted partners who help us serve you better. Your name and delivery
              address are shared with India Post so they can deliver your orders safely to your home. We also share
              payment information with secure payment processors to handle your transactions safely. We never sell your
              personal information to other companies or use it for purposes other than serving your orders and
              providing customer support.
            </p>

            <p className="text-gray-600">
              You have full control over your information. You can ask us to show you what information we have about
              you, request corrections if something is wrong, or ask us to delete your information completely. If you
              don't want to receive promotional emails, you can unsubscribe anytime by clicking the link in our emails
              or contacting our customer care team. We respect your choices and will honor your requests promptly.
            </p>

            <p className="text-gray-600">
              We take security seriously and use appropriate measures to protect your personal information from
              unauthorized access or misuse. Our website uses secure connections, and we regularly review our security
              practices to keep your data safe. We may update this privacy policy occasionally to reflect changes in our
              practices or legal requirements, and we will notify you of any significant changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have any questions about this privacy policy or how we handle your information, please don't
              hesitate to contact us. Our customer care team is ready to help with any privacy concerns or questions you
              may have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">privacy@woolflowers.com</span>
              </div>
             
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Last updated: January 2025</p>
        </div>
      </div>
    </div>
  )
}
