"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Hotel, Plus, Edit, Trash2, Save, X, 
  Upload, MapPin, Star, DollarSign
} from 'lucide-react'

interface Hotel {
  id: string
  nameFa: string
  nameAr: string
  nameEn: string
  descFa: string
  descAr: string
  descEn: string
  address: string
  city: string
  stars: number
  priceRange: string
  amenities: string[]
  image: string
  images: string[]
  isActive: boolean
  createdAt: string
}

export default function HotelsManagement() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Hotel, 'id' | 'createdAt'>>({
    nameFa: '',
    nameAr: '',
    nameEn: '',
    descFa: '',
    descAr: '',
    descEn: '',
    address: '',
    city: '',
    stars: 4,
    priceRange: '',
    amenities: [],
    image: '',
    images: [],
    isActive: true
  })
  const [amenityInput, setAmenityInput] = useState('')
  const [imageInput, setImageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const res = await fetch('/api/hotels')
      if (res.ok) {
        const data = await res.json()
        setHotels(data)
      }
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stars' ? Number(value) : value
    }))
  }

  const handleAmenityAdd = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }))
      setAmenityInput('')
    }
  }

  const handleAmenityRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }))
  }

  const handleImageAdd = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }))
      setImageInput('')
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/hotels/${editingId}` : '/api/hotels'
      const method = editingId ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          id: editingId,
          amenities: formData.amenities,
          images: formData.images
        })
      })
      
      if (res.ok) {
        fetchHotels()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving hotel:', error)
    }
  }

  const handleEdit = (hotel: Hotel) => {
    setEditingId(hotel.id)
    setFormData({
      nameFa: hotel.nameFa,
      nameAr: hotel.nameAr,
      nameEn: hotel.nameEn,
      descFa: hotel.descFa || '',
      descAr: hotel.descAr || '',
      descEn: hotel.descEn || '',
      address: hotel.address || '',
      city: hotel.city || '',
      stars: hotel.stars || 4,
      priceRange: hotel.priceRange || '',
      amenities: hotel.amenities || [],
      image: hotel.image || '',
      images: hotel.images || [],
      isActive: hotel.isActive
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این هتل را حذف کنید؟')) return
    
    try {
      const res = await fetch(`/api/hotels/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchHotels()
      }
    } catch (error) {
      console.error('Error deleting hotel:', error)
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
      address: '',
      city: '',
      stars: 4,
      priceRange: '',
      amenities: [],
      image: '',
      images: [],
      isActive: true
    })
    setAmenityInput('')
    setImageInput('')
  }

  const filteredHotels = hotels.filter(hotel =>
    hotel.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-[#026D73] text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">مدیریت هتل‌ها</h1>
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
                      ویرایش هتل
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      افزودن هتل جدید
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
                    <Label htmlFor="address">آدرس</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stars">ستاره</Label>
                      <div className="relative">
                        <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-500" />
                        <Input
                          id="stars"
                          name="stars"
                          type="number"
                          min="1"
                          max="5"
                          value={formData.stars}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="priceRange">بازه قیمت</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="priceRange"
                          name="priceRange"
                          value={formData.priceRange}
                          onChange={handleInputChange}
                          className="pl-10"
                          placeholder="مثال: $50-$150"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="amenities">امکانات</Label>
                    <div className="flex gap-2">
                      <Input
                        value={amenityInput}
                        onChange={(e) => setAmenityInput(e.target.value)}
                        placeholder="اضافه کردن امکانات"
                      />
                      <Button type="button" onClick={handleAmenityAdd} variant="outline">
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.amenities.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="bg-[#0099A8] text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {amenity}
                          <button 
                            type="button" 
                            onClick={() => handleAmenityRemove(index)}
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
                    <Label htmlFor="image">تصویر اصلی</Label>
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
                  
                  <div>
                    <Label htmlFor="images">تصاویر بیشتر</Label>
                    <div className="flex gap-2">
                      <Input
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        placeholder="آدرس تصویر"
                      />
                      <Button type="button" onClick={handleImageAdd} variant="outline">
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.images.map((img, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          تصویر {index + 1}
                          <button 
                            type="button" 
                            onClick={() => handleImageRemove(index)}
                            className="text-gray-800 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
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
                      {editingId ? 'ذخیره تغییرات' : 'افزودن هتل'}
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
          
          {/* Hotels List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="w-5 h-5" />
                    لیست هتل‌ها
                  </CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="جستجوی هتل‌ها..."
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
                    <p>در حال بارگذاری هتل‌ها...</p>
                  </div>
                ) : filteredHotels.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'هتلی یافت نشد' : 'هیچ هتلی ثبت نشده است'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHotels.map((hotel) => (
                      <Card key={hotel.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {hotel.image ? (
                                <img 
                                  src={hotel.image} 
                                  alt={hotel.nameFa}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Hotel className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h3 className="font-bold text-lg truncate">
                                  {hotel.nameFa}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    hotel.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {hotel.isActive ? 'فعال' : 'غیرفعال'}
                                  </span>
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {hotel.stars}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{hotel.city}{hotel.address ? `, ${hotel.address}` : ''}</span>
                              </div>
                              
                              {hotel.priceRange && (
                                <p className="text-[#0099A8] font-semibold text-sm mt-1">
                                  {hotel.priceRange}
                                </p>
                              )}
                              
                              {hotel.amenities && hotel.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {hotel.amenities.slice(0, 3).map((amenity, index) => (
                                    <span 
                                      key={index} 
                                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {hotel.amenities.length > 3 && (
                                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                      +{hotel.amenities.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                                <span>ثبت: {new Date(hotel.createdAt).toLocaleDateString('fa-IR')}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleEdit(hotel)}
                                className="bg-[#0099A8] hover:bg-[#026D73]"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDelete(hotel.id)}
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