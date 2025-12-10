"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, Plus, Edit, Trash2, Save, X, 
  Upload, Tag, Clock, DollarSign
} from 'lucide-react'

interface Package {
  id: string
  nameFa: string
  nameAr: string
  nameEn: string
  descFa: string
  descAr: string
  descEn: string
  type: 'treatment' | 'travel_accommodation'
  price: number
  duration: string
  includes: string[]
  image: string
  specialty: string
  isActive: boolean
  createdAt: string
}

export default function PackagesManagement() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Package, 'id' | 'createdAt'>>({
    nameFa: '',
    nameAr: '',
    nameEn: '',
    descFa: '',
    descAr: '',
    descEn: '',
    type: 'treatment',
    price: 0,
    duration: '',
    includes: [],
    image: '',
    specialty: '',
    isActive: true
  })
  const [includeInput, setIncludeInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages')
      if (res.ok) {
        const data = await res.json()
        setPackages(data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as 'treatment' | 'travel_accommodation'
    }))
  }

  const handleIncludeAdd = () => {
    if (includeInput.trim() && !formData.includes.includes(includeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        includes: [...prev.includes, includeInput.trim()]
      }))
      setIncludeInput('')
    }
  }

  const handleIncludeRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/packages/${editingId}` : '/api/packages'
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          id: editingId,
          includes: formData.includes
        })
      })
      
      if (res.ok) {
        fetchPackages()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  const handleEdit = (pkg: Package) => {
    setEditingId(pkg.id)
    setFormData({
      nameFa: pkg.nameFa,
      nameAr: pkg.nameAr,
      nameEn: pkg.nameEn,
      descFa: pkg.descFa || '',
      descAr: pkg.descAr || '',
      descEn: pkg.descEn || '',
      type: pkg.type,
      price: pkg.price || 0,
      duration: pkg.duration || '',
      includes: pkg.includes || [],
      image: pkg.image || '',
      specialty: pkg.specialty || '',
      isActive: pkg.isActive
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این بسته را حذف کنید؟')) return
    
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPackages()
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      nameFa: '',
      nameAr: '',
      nameEn: '',
      descFa: '',
      descAr: '',
      descEn: '',
      type: 'treatment',
      price: 0,
      duration: '',
      includes: [],
      image: '',
      specialty: '',
      isActive: true
    })
    setIncludeInput('')
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-[#026D73] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">مدیریت بسته‌ها</h1>
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
                      ویرایش بسته
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      افزودن بسته جدید
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
                    <Label htmlFor="type">نوع بسته</Label>
                    <Select value={formData.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="treatment">درمان</SelectItem>
                        <SelectItem value="travel_accommodation">اقامت و سفر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="specialty">تخصص</Label>
                    <Input
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">قیمت (دلار)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="duration">مدت زمان</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="duration"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="مثال: 7 روز"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="includes">موارد شامل</Label>
                    <div className="flex gap-2">
                      <Input
                        value={includeInput}
                        onChange={(e) => setIncludeInput(e.target.value)}
                        placeholder="اضافه کردن مورد"
                      />
                      <Button type="button" onClick={handleIncludeAdd} variant="outline">
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.includes.map((item, index) => (
                        <span 
                          key={index} 
                          className="bg-[#0099A8] text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {item}
                          <button 
                            type="button" 
                            onClick={() => handleIncludeRemove(index)}
                            className="text-white hover:text-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="descFa">توضیحات (فارسی)</Label>
                    <textarea
                      id="descFa"
                      name="descFa"
                      value={formData.descFa}
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
                      {editingId ? 'ذخیره تغییرات' : 'افزودن بسته'}
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
          
          {/* Packages List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    لیست بسته‌ها
                  </CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="جستجوی بسته‌ها..."
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
                    <p>در حال بارگذاری بسته‌ها...</p>
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'بسته‌ای یافت نشد' : 'هیچ بسته‌ای ثبت نشده است'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPackages.map((pkg) => (
                      <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {pkg.image ? (
                                <img 
                                  src={pkg.image} 
                                  alt={pkg.nameFa}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-bold text-lg truncate">
                                  {pkg.nameFa}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    pkg.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {pkg.isActive ? 'فعال' : 'غیرفعال'}
                                  </span>
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {pkg.type === 'treatment' ? 'درمان' : 'اقامت'}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {pkg.descFa}
                              </p>
                              
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                {pkg.price > 0 && (
                                  <span className="font-semibold text-[#0099A8]">
                                    ${pkg.price.toLocaleString()}
                                  </span>
                                )}
                                {pkg.duration && (
                                  <span className="text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {pkg.duration}
                                  </span>
                                )}
                              </div>
                              
                              {pkg.specialty && (
                                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                                  <Tag className="w-4 h-4" />
                                  <span>{pkg.specialty}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <span>ثبت: {new Date(pkg.createdAt).toLocaleDateString('fa-IR')}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleEdit(pkg)}
                                className="bg-[#0099A8] hover:bg-[#026D73]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(pkg.id)}
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