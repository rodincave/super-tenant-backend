"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Mail, Calendar } from "lucide-react"
import Link from "next/link"

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Application Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-lg">
              Thank you for your rental application. We've received your information and will review it shortly.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-blue-800 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  We'll review your application within 24-48 hours
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  If selected, we'll send you a scheduling link for a viewing
                </li>
                <li className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  You'll receive updates via email about your application status
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Link href="/apply">
                <Button>Submit Another Application</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
