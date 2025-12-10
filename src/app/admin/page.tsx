"use client"

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, Users, Building2, Package, Hotel, 
  MessageSquare, TrendingUp, Clock, CheckCircle,
  AlertCircle, XCircle, Plane, ExternalLink
} from 'lucide-react'

interface MedicalRequest {
  id: string
  condition: string
  specialties: string
  status: string
  createdAt: string
  user: {
    id: string
    fullName: string
    whatsapp: string
    email?: string
  }
  files: { id: string; fileName: string; filePath: string }[]
}

interface Stats {
  total: number
  new: number
  underReview: number
  approved: number
  completed: number
}

const statusColors: Record<string, 'info' | 'warning' | 'success' | 'error' | 'secondary'> = {
  new: 'info',
  under_review: 'warning',
  need_documents: 'warning',
  approved: 'success',
  rejected: 'error',
  travel_planning: 'info',
  completed: 'secondary',
}

// Persian translations for the admin panel
const persianTranslations = {
  dashboardTitle: "داشبورد مدیریت ایران‌علاج",
  totalRequests: "مجموع درخواست‌ها",
  newRequests: "درخواست‌های جدید",
  underReview: "در حال بررسی",
  approved: "تایید شده",
  completed: "تکمیل شده",
  medicalRequests: "درخواست‌های پزشکی",
  filterByStatus: "فیلتر بر اساس وضعیت",
  allRequests: "همه درخواست‌ها",
  needDocuments: "نیاز به مدارک",
  rejected: "رد شده",
  travelPlanning: "برنامه‌ریزی سفر",
  patient: "بیمار",
  specialty: "تخصص",
  status: "وضعیت",
  date: "تاریخ",
  actions: "عملیات",
  noRequests: "درخواستی یافت نشد",
  manageDoctors: "مدیریت پزشکان",
  manageHospitals: "مدیریت بیمارستان‌ها",
  managePackages: "مدیریت پکیج‌ها",
  manageHotels: "مدیریت هتل‌ها",
  loading: "در حال بارگذاری...",
  statuses: {
    new: "جدید",
    under_review: "در حال بررسی",
    need_documents: "نیاز به مدارک",
    approved: "تایید شده",
    rejected: "رد شده",
    travel_planning: "برنامه‌ریزی سفر",
    completed: "تکمیل شده"
  }
}

export default function AdminDashboard() {
  const t = useTranslations()
  const [requests, setRequests] = useState<MedicalRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<MedicalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, underReview: 0, approved: 0, completed: 0 })

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredRequests(requests)
    } else {
      setFilteredRequests(requests.filter(r => r.status === statusFilter))
    }
  }, [statusFilter, requests])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests')
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
        
        // Calculate stats
        setStats({
          total: data.length,
          new: data.filter((r: MedicalRequest) => r.status === 'new').length,
          underReview: data.filter((r: MedicalRequest) => r.status === 'under_review').length,
          approved: data.filter((r: MedicalRequest) => r.status === 'approved').length,
          completed: data.filter((r: MedicalRequest) => r.status === 'completed').length,
        })
      }
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const openWhatsApp = (phone: string, name: string) => {
    const message = encodeURIComponent(`سلام ${name}، این تیم ایران‌علاج است.`)
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank')
  }

  // Use Persian translations throughout the component
  const tr = persianTranslations

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-[#026D73] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">{tr.dashboardTitle}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-gray-500">{tr.totalRequests}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.new}</div>
                  <div className="text-xs text-gray-500">{tr.newRequests}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.underReview}</div>
                  <div className="text-xs text-gray-500">{tr.underReview}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.approved}</div>
                  <div className="text-xs text-gray-500">{tr.approved}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <div className="text-xs text-gray-500">{tr.completed}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{tr.medicalRequests}</CardTitle>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={tr.filterByStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tr.allRequests}</SelectItem>
                <SelectItem value="new">{tr.statuses.new}</SelectItem>
                <SelectItem value="under_review">{tr.statuses.under_review}</SelectItem>
                <SelectItem value="need_documents">{tr.statuses.need_documents}</SelectItem>
                <SelectItem value="approved">{tr.statuses.approved}</SelectItem>
                <SelectItem value="rejected">{tr.statuses.rejected}</SelectItem>
                <SelectItem value="travel_planning">{tr.statuses.travel_planning}</SelectItem>
                <SelectItem value="completed">{tr.statuses.completed}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto"></div>
                <p className="mt-2">{tr.loading}</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {tr.noRequests}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">{tr.patient}</th>
                      <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">{tr.specialty}</th>
                      <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">{tr.status}</th>
                      <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">{tr.date}</th>
                      <th className="text-start py-3 px-2 text-sm font-medium text-gray-500">{tr.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <div className="font-medium">{request.user.fullName}</div>
                            <div className="text-sm text-gray-500">{request.user.whatsapp}</div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm">{JSON.parse(request.specialties).join(', ')}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Select 
                            value={request.status} 
                            onValueChange={(v) => updateStatus(request.id, v)}
                          >
                            <SelectTrigger className="w-36 h-8">
                              <Badge variant={statusColors[request.status]}>
                                {tr.statuses[request.status as keyof typeof tr.statuses] || request.status.replace('_', ' ')}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">{tr.statuses.new}</SelectItem>
                              <SelectItem value="under_review">{tr.statuses.under_review}</SelectItem>
                              <SelectItem value="need_documents">{tr.statuses.need_documents}</SelectItem>
                              <SelectItem value="approved">{tr.statuses.approved}</SelectItem>
                              <SelectItem value="rejected">{tr.statuses.rejected}</SelectItem>
                              <SelectItem value="travel_planning">{tr.statuses.travel_planning}</SelectItem>
                              <SelectItem value="completed">{tr.statuses.completed}</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="whatsapp" 
                              size="sm"
                              onClick={() => openWhatsApp(request.user.whatsapp, request.user.fullName)}
                            >
                              واتساپ
                            </Button>
                            <Link href={`/admin/requests/${request.id}`}>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Link href="/admin/doctors">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="w-8 h-8 text-[#0099A8]" />
                <span className="font-medium">{tr.manageDoctors}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/hospitals">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#0099A8]" />
                <span className="font-medium">{tr.manageHospitals}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/packages">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Package className="w-8 h-8 text-[#0099A8]" />
                <span className="font-medium">{tr.managePackages}</span>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/hotels">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <Hotel className="w-8 h-8 text-[#0099A8]" />
                <span className="font-medium">{tr.manageHotels}</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}