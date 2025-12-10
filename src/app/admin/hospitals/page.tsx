"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Building2, Plus, Edit, Trash2, Save, X, 
  Upload, MapPin, Star
} from 'lucide-react'

interface Hospital {
  id: string
  nameFa: string
  nameAr: string
  nameEn: string
  location: string
  city: string
  specialties: string[]
  rating: number
  image: string
  descriptionFa: string
  descriptionAr: string
  descriptionEn: string
  phone: string
  website: string
  isActive: boolean
  createdAt: string
}

export default function HospitalsManagement() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Hospital, 'id' | 'createdAt'>>({
    nameFa: '',
    nameAr: '',
    nameEn: '',
    location: '',
    city: '',
    specialties: [],
    rating: 5.0,
    image: '',
    descriptionFa: '',
    descriptionAr: '',
    descriptionEn: '',
    phone: '',
    website: '',
    isActive: true
  })
  const [specialtyInput, setSpecialtyInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/hospitals')
      if (res.ok) {
        const data = await res.json()
        setHospitals(data)
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }))
  }

  const handleSpecialtyAdd = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialtyInput.trim()]
      }))
      setSpecialtyInput('')
    }
  }

  const handleSpecialtyRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/hospitals/${editingId}` : '/api/hospitals'
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editingId })
      })
      
      if (res.ok) {
        fetchHospitals()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving hospital:', error)
    }
  }

  const handleEdit = (hospital: Hospital) => {
    setEditingId(hospital.id)
    setFormData({
      nameFa: hospital.nameFa,
      nameAr: hospital.nameAr,
      nameEn: hospital.nameEn,
      location: hospital.location || '',
      city: hospital.city || '',
      specialties: hospital.specialties || [],
      rating: hospital.rating || 5.0,
      image: hospital.image || '',
      descriptionFa: hospital.descriptionFa || '',
      descriptionAr: hospital.descriptionAr || '',
      descriptionEn: hospital.descriptionEn || '',
      phone: hospital.phone || '',
      website: hospital.website || '',
      isActive: hospital.isActive
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این بیمارستان را حذف کنید؟')) return
    
    try {
      const res = await fetch(`/api/hospitals/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchHospitals()
      }
    } catch (error) {
      console.error('Error deleting hospital:', error)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      nameFa: '',
      nameAr: '',
      nameEn: '',
      location: '',
      city: '',
      specialties: [],
      rating: 5.0,
      image: '',
      descriptionFa: '',
      descriptionAr: '',
      descriptionEn: '',
      phone: '',
      website: '',
      isActive: true
    })
    setSpecialtyInput('')
  }

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-[#026D73] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">مدیریت بیمارستان‌ها</h1>
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
                      ویرایش بیمارستان
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      افزودن بیمارستان جدید
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
                    <Label htmlFor="city">شهر</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">آدرس</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialties">تخصص‌ها</Label>
                    <div className="flex gap-2">
                      <Input
                        value={specialtyInput}
                        onChange={(e) => setSpecialtyInput(e.target.value)}
                        placeholder="اضافه کردن تخصص"
                      />
                      <Button type="button" onClick={handleSpecialtyAdd} variant="outline">
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.specialties.map((specialty, index) => (
                        <span 
                          key={index} 
                          className="bg-[#0099A8] text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {specialty}
                          <button 
                            type="button" 
                            onClick={() => handleSpecialtyRemove(index)}
                            className="text-white hover:text-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                    
                    <div>
                      <Label htmlFor="phone">تلفن</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="website">وب‌سایت</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="descriptionFa">توضیحات (فارسی)</Label>
                    <textarea
                      id="descriptionFa"
                      name="descriptionFa"
                      value={formData.descriptionFa}
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
                      {editingId ? 'ذخیره تغییرات' : 'افزودن بیمارستان'}
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
          
          {/* Hospitals List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    لیست بیمارستان‌ها
                  </CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="جستجوی بیمارستان‌ها..."
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
                    <p>در حال بارگذاری بیمارستان‌ها...</p>
                  </div>
                ) : filteredHospitals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'بیمارستانی یافت نشد' : 'هیچ بیمارستانی ثبت نشده است'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHospitals.map((hospital) => (
                      <Card key={hospital.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {hospital.image ? (
                                <img 
                                  src={hospital.image} 
                                  alt={hospital.nameFa}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Building2 className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-bold text-lg truncate">
                                  {hospital.nameFa}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    hospital.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {hospital.isActive ? 'فعال' : 'غیرفعال'}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {hospital.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{hospital.city}{hospital.location ? `, ${hospital.location}` : ''}</span>
                              </div>
                              
                              {hospital.specialties && hospital.specialties.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hospital.specialties.slice(0, 3).map((specialty, index) => (
                                    <span 
                                      key={index} 
                                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {specialty}
                                    </span>
                                  ))}
                                  {hospital.specialties.length > 3 && (
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                      +{hospital.specialties.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <span>ثبت: {new Date(hospital.createdAt).toLocaleDateString('fa-IR')}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleEdit(hospital)}
                                className="bg-[#0099A8] hover:bg-[#026D73]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(hospital.id)}
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