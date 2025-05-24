"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  MoreHorizontal,
  Eye,
  Mail,
  Calendar,
  Download,
  Star,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useTenantProfiles } from "@/hooks/use-tenant-profiles"

type SortField = keyof any //(typeof tenants)[0]
type SortDirection = "asc" | "desc"

export default function TenantsTablePage() {
  const { tenants, loading, error, updateTenantStatus, sendSchedulingLink, isSupabaseConfigured } = useTenantProfiles()
  const [sortField, setSortField] = useState<SortField>("score")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [professionFilter, setProfessionFilter] = useState("all")
  const [selectedTenants, setSelectedTenants] = useState<number[]>([])
  const router = useRouter()

  // Sorting function
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort tenants
  const filteredAndSortedTenants = (tenants || [])
    .filter((tenant) => {
      const matchesSearch =
        `${tenant.first_name} ${tenant.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || tenant.application_status === statusFilter
      const matchesProfession = professionFilter === "all" || tenant.profession === professionFilter

      return matchesSearch && matchesStatus && matchesProfession
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Interview Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Pending Documents":
        return "bg-orange-100 text-orange-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 font-semibold"
    if (score >= 80) return "text-blue-600 font-semibold"
    if (score >= 70) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tenant Profiles Table</h1>
                <p className="text-gray-600">Comprehensive view of all tenant applications</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Link href="/tenants">
                <Button variant="outline" size="sm">
                  Card View
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="Search tenants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Pending Documents">Pending Documents</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="profession">Profession</Label>
                  <Select value={professionFilter} onValueChange={setProfessionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All professions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Professions</SelectItem>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Marketing Manager">Marketing Manager</SelectItem>
                      <SelectItem value="Master's Student">Student</SelectItem>
                      <SelectItem value="Graphic Designer">Graphic Designer</SelectItem>
                      <SelectItem value="Civil Servant">Civil Servant</SelectItem>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setProfessionFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedTenants.length} of {tenants?.length || 0} tenants
              {selectedTenants.length > 0 && ` • ${selectedTenants.length} selected`}
            </p>
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input
                          type="checkbox"
                          className="rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTenants(filteredAndSortedTenants.map((t) => t.id))
                            } else {
                              setSelectedTenants([])
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("name")} className="h-auto p-0 font-semibold">
                          Tenant <SortIcon field="name" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("score")}
                          className="h-auto p-0 font-semibold"
                        >
                          Score <SortIcon field="score" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("profession")}
                          className="h-auto p-0 font-semibold"
                        >
                          Profession <SortIcon field="profession" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("monthly_income")}
                          className="h-auto p-0 font-semibold"
                        >
                          Income <SortIcon field="monthly_income" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => handleSort("age")} className="h-auto p-0 font-semibold">
                          Age <SortIcon field="age" />
                        </Button>
                      </TableHead>
                      <TableHead>Guarantor</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("stayDuration")}
                          className="h-auto p-0 font-semibold"
                        >
                          Stay Duration <SortIcon field="stayDuration" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("application_status")}
                          className="h-auto p-0 font-semibold"
                        >
                          Status <SortIcon field="application_status" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort("application_date")}
                          className="h-auto p-0 font-semibold"
                        >
                          Applied <SortIcon field="application_date" />
                        </Button>
                      </TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTenants.map((tenant) => (
                      <TableRow key={tenant.id} className="hover:bg-gray-50">
                        <TableCell>
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedTenants.includes(tenant.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTenants([...selectedTenants, tenant.id])
                              } else {
                                setSelectedTenants(selectedTenants.filter((id) => id !== tenant.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={tenant.avatar || "/placeholder.svg"}
                                alt={`${tenant.first_name} ${tenant.last_name}`}
                              />
                              <AvatarFallback>
                                {`${tenant.first_name} ${tenant.last_name}`
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{`${tenant.first_name} ${tenant.last_name}`}</div>
                              <div className="text-sm text-gray-500">{tenant.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={getScoreColor(tenant.score)}>{tenant.score}%</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(tenant.score / 20)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tenant.profession}</div>
                            <div className="text-sm text-gray-500">{tenant.company}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-green-600">{tenant.monthly_income?.toLocaleString()}€</div>
                          <div className="text-sm text-gray-500">{tenant.employment_type}</div>
                        </TableCell>
                        <TableCell>{tenant.age}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {tenant.guarantor_type}
                            {tenant.guarantor_income && (
                              <div className="text-gray-500">{tenant.guarantor_income.toLocaleString()}€/month</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{tenant.stayDuration}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tenant.application_status)}>
                            {tenant.application_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(tenant.application_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={tenant.documentsComplete ? "default" : "destructive"}>
                            {tenant.documentsComplete ? "Complete" : "Incomplete"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/tenants/${tenant.id}`)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="mr-2 h-4 w-4" />
                                Schedule Interview
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedTenants.length > 0 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedTenants.length} tenant{selectedTenants.length > 1 ? "s" : ""} selected
                </span>
                <Button size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Bulk Email
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Interviews
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Selected
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedTenants([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
