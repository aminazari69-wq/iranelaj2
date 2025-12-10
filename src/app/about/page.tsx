import { getTranslations, getLocale } from 'next-intl/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Award, Users, Globe, Heart, Shield, Target } from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description: 'Learn about IranElaj and our mission to provide quality medical tourism services.',
}

export default async function AboutPage() {
  const t = await getTranslations()
  const locale = await getLocale()

  const values = [
    { icon: Heart, title: locale === 'ar' ? 'الرعاية' : locale === 'fa' ? 'مراقبت' : 'Care', desc: locale === 'ar' ? 'نضع صحة مرضانا في المقام الأول' : locale === 'fa' ? 'سلامت بیماران ما اولویت اول ماست' : 'Patient health is our top priority' },
    { icon: Shield, title: locale === 'ar' ? 'الثقة' : locale === 'fa' ? 'اعتماد' : 'Trust', desc: locale === 'ar' ? 'نبني علاقات طويلة الأمد مع مرضانا' : locale === 'fa' ? 'روابط بلندمدت با بیماران خود می‌سازیم' : 'Building long-term relationships with patients' },
    { icon: Target, title: locale === 'ar' ? 'الجودة' : locale === 'fa' ? 'کیفیت' : 'Quality', desc: locale === 'ar' ? 'نقدم أعلى معايير الخدمة الطبية' : locale === 'fa' ? 'بالاترین استانداردهای خدمات پزشکی را ارائه می‌دهیم' : 'Delivering highest medical service standards' },
    { icon: Globe, title: locale === 'ar' ? 'الشمولية' : locale === 'fa' ? 'جامعیت' : 'Inclusivity', desc: locale === 'ar' ? 'نرحب بالمرضى من جميع أنحاء العالم' : locale === 'fa' ? 'از بیماران سراسر جهان استقبال می‌کنیم' : 'Welcoming patients from around the world' },
  ]

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            {locale === 'ar' ? 'من نحن' : locale === 'fa' ? 'درباره ما' : 'About Us'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {locale === 'ar' 
              ? 'إيران علاج هي منصة رائدة للسياحة العلاجية، نربط المرضى من جميع أنحاء العالم بأفضل المرافق الطبية في إيران.'
              : locale === 'fa'
              ? 'ایران علاج یک پلتفرم پیشرو در گردشگری پزشکی است که بیماران سراسر جهان را به بهترین مراکز درمانی در ایران متصل می‌کند.'
              : 'IranElaj is a leading medical tourism platform connecting patients worldwide with the best medical facilities in Iran.'
            }
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: '5000+', label: locale === 'ar' ? 'مريض سعيد' : locale === 'fa' ? 'بیمار راضی' : 'Happy Patients' },
            { value: '150+', label: locale === 'ar' ? 'طبيب متخصص' : locale === 'fa' ? 'پزشک متخصص' : 'Expert Doctors' },
            { value: '50+', label: locale === 'ar' ? 'مستشفى شريك' : locale === 'fa' ? 'بیمارستان همکار' : 'Partner Hospitals' },
            { value: '15+', label: locale === 'ar' ? 'سنوات الخبرة' : locale === 'fa' ? 'سال تجربه' : 'Years Experience' },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-[#0099A8] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {locale === 'ar' ? 'مهمتنا' : locale === 'fa' ? 'مأموریت ما' : 'Our Mission'}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              {locale === 'ar'
                ? 'مهمتنا هي جعل الرعاية الصحية عالية الجودة في متناول الجميع. نؤمن بأن كل شخص يستحق الحصول على أفضل علاج ممكن، بغض النظر عن موقعه الجغرافي.'
                : locale === 'fa'
                ? 'مأموریت ما این است که مراقبت‌های بهداشتی با کیفیت بالا را در دسترس همه قرار دهیم. ما معتقدیم که هر فردی مستحق دریافت بهترین درمان ممکن است، بدون توجه به موقعیت جغرافیایی.'
                : 'Our mission is to make high-quality healthcare accessible to everyone. We believe that every person deserves the best possible treatment, regardless of their geographical location.'
              }
            </p>
            <p className="text-gray-600 leading-relaxed">
              {locale === 'ar'
                ? 'نقدم خدمات شاملة تغطي كل جانب من رحلتك العلاجية، من الاستشارة الأولى إلى المتابعة بعد العلاج.'
                : locale === 'fa'
                ? 'ما خدمات جامعی ارائه می‌دهیم که هر جنبه از سفر درمانی شما را پوشش می‌دهد، از مشاوره اولیه تا پیگیری پس از درمان.'
                : 'We provide comprehensive services covering every aspect of your medical journey, from initial consultation to post-treatment follow-up.'
              }
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#0099A8] to-[#026D73] rounded-2xl p-8 text-white">
            <Award className="w-16 h-16 mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">
              {locale === 'ar' ? 'لماذا إيران؟' : locale === 'fa' ? 'چرا ایران؟' : 'Why Iran?'}
            </h3>
            <ul className="space-y-3">
              {[
                locale === 'ar' ? 'أطباء مؤهلون تأهيلاً عالياً' : locale === 'fa' ? 'پزشکان بسیار ماهر' : 'Highly qualified doctors',
                locale === 'ar' ? 'مستشفيات معتمدة دولياً' : locale === 'fa' ? 'بیمارستان‌های دارای گواهی بین‌المللی' : 'Internationally accredited hospitals',
                locale === 'ar' ? 'توفير يصل إلى 70٪' : locale === 'fa' ? 'صرفه‌جویی تا 70٪' : 'Save up to 70%',
                locale === 'ar' ? 'لا قوائم انتظار' : locale === 'fa' ? 'بدون لیست انتظار' : 'No waiting lists',
                locale === 'ar' ? 'تقنيات طبية متقدمة' : locale === 'fa' ? 'تکنولوژی‌های پزشکی پیشرفته' : 'Advanced medical technology',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            {locale === 'ar' ? 'قيمنا' : locale === 'fa' ? 'ارزش‌های ما' : 'Our Values'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0099A8]/10 flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-[#0099A8]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-[#0099A8] to-[#026D73] text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              {locale === 'ar' ? 'هل أنت مستعد لبدء رحلتك؟' : locale === 'fa' ? 'آیا آماده شروع سفر خود هستید؟' : 'Ready to start your journey?'}
            </h3>
            <p className="mb-6 text-white/90">
              {locale === 'ar' ? 'تواصل معنا اليوم للحصول على استشارة مجانية' : locale === 'fa' ? 'همین امروز برای مشاوره رایگان با ما تماس بگیرید' : 'Contact us today for a free consultation'}
            </p>
            <Link href="/request">
              <Button size="lg" className="bg-white text-[#0099A8] hover:bg-white/90">
                {t('hero.cta')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
