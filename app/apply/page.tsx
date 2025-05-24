"use client"

import { TenantForm } from "@/components/tenant-form"
import { useRouter } from "next/navigation"

export default function ApplyPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/apply/success")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Apply for Rental</h1>
          <p className="text-xl text-gray-600">Complete your tenant application</p>
        </div>
        <TenantForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
