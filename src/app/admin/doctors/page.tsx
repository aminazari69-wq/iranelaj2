"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, Plus, Edit, Trash2, Save, X, 
  Upload, Image as ImageIcon
} from 'lucide-react'

interface Doctor {
  id: string
  nameFa: string
  nameAr: string
  nameEn: string
  specialty: string
  bioFa: string
  bioAr: string
  bioEn: string
  image: string
  hospital: string
  experience: number
  rating: number
  isActive: boolean
  createdAt: string
}

export default function DoctorsManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Doctor, 'id' | 'createdAt'>>({
    nameFa: '',
    nameAr: '',
    nameEn: '',
    specialty: '',
    bioFa: '',
    bioAr: '',
    bioEn: '',
    image: '',
    hospital: '',
    experience: 0,
    rating: 5.0,
    isActive: true
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors')
      if (res.ok) {
        const data = await res.json()
        setDoctors(data)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'rating' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/doctors/${editingId}` : '/api/doctors'
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingId })
      })
      
      if (res.ok) {
        fetchDoctors()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving doctor:', error)
    }
  }

  const handleEdit = (doctor: Doctor) => {
    setEditingId(doctor.id)
    setFormData({
      nameFa: doctor.nameFa,
      nameAr: doctor.nameAr,
      nameEn: doctor.nameEn,
      specialty: doctor.specialty,
      bioFa: doctor.bioFa || '',
      bioAr: doctor.bioAr || '',
      bioEn: doctor.bioEn || '',
      image: doctor.image || '',
      hospital: doctor.hospital || '',
      experience: doctor.experience || 0,
      rating: doctor.rating || 5.0,
      isActive: doctor.isActive
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این پزشک را حذف کنید؟')) return
    
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchDoctors()
      }
    } catch (error) {
      console.error('Error deleting doctor:', error)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      nameFa: '',
      nameAr: '',
      nameEn: '',
      specialty: '',
      bioFa: '',
      bioAr: '',
      bioEn: '',
      image: '',
      hospital: '',
      experience: 0,
      rating: 5.0,
      isActive: true
    })
  }

  const filteredDoctors = doctors.filter(doctor =>
    doctor.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-[#026D73] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">مدیریت پزشکان</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {editingId ? (
                    <>
                      <Edit className="w-5 h-5" />
                      ویرایش پزشک
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      افزودن پزشک جدید
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nameFa">نام (فارسی)</Label>
                    <Input
                      id="nameFa"
                      name="nameFa"
                      value={formData.nameFa}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nameAr">الاسم (العربية)</Label>
                    <Input
                      id="nameAr"
                      name="nameAr"
                      value={formData.nameAr}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nameEn">Name (English)</Label>
                    <Input
                      id="nameEn"
                      name="nameEn"
                      value={formData.nameEn}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialty">تخصص</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hospital">بیمارستان</Label>
                    <Input
                      id="hospital"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">تجربه (سال)</Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        value={formData.experience}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="rating">امتیاز</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bioFa">بیوگرافی (فارسی)</Label>
                    <textarea
                      id="bioFa"
                      name="bioFa"
                      value={formData.bioFa}
                      onChange={handleInputChange as any}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0099A8]"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">آدرس تصویر</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                      />
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-[#0099A8] focus:ring-[#0099A8]"
                    />
                    <Label htmlFor="isActive">فعال</Label>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      <Save className="w-4 h-4 ml-2" />
                      {editingId ? 'ذخیره تغییرات' : 'افزودن پزشک'}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={resetForm}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Doctors List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    لیست پزشکان
                  </CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="جستجوی پزشکان..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="spinner mx-auto mb-4"></div>
                    <p>در حال بارگذاری پزشکان...</p>
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'پزشکی یافت نشد' : 'هیچ پزشکی ثبت نشده است'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredDoctors.map((doctor) => (
                      <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {doctor.image ? (
                                <img 
                                  src={doctor.image} 
                                  alt={doctor.nameFa}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-bold text-lg truncate">
                                  {doctor.nameFa}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    doctor.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {doctor.isActive ? 'فعال' : 'غیرفعال'}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {doctor.rating.toFixed(1)} ⭐
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mt-1">
                                تخصص: {doctor.specialty}
                              </p>
                              
                              {doctor.hospital && (
                                <p className="text-gray-500 text-sm">
                                  بیمارستان: {doctor.hospital}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <span>تجربه: {doctor.experience} سال</span>
                                <span>•</span>
                                <span>ثبت: {new Date(doctor.createdAt).toLocaleDateString('fa-IR')}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleEdit(doctor)}
                                className="bg-[#0099A8] hover:bg-[#026D73]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(doctor.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}