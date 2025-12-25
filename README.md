# Salla Sitemap Generator

مولد خرائط المواقع لمنصة سلة - يقوم بإنشاء sitemaps صحيحة ومتوافقة مع معايير Google.

## المميزات

- ✅ توليد sitemap رئيسي (sitemap index)
- ✅ توليد sitemap للموقع الأساسي
- ✅ توليد sitemaps منفصلة لكل متجر
- ✅ متوافق مع معايير Google و XML Schema
- ✅ دعم Supabase
- ✅ خوادم Express.js للـ API
- ✅ إنشاء ملفات XML ثابتة
- ✅ تحسين الأداء مع الـ caching

## التثبيت

```bash
# انتقل إلى مجلد المشروع
cd sitemap-generator

# تثبيت المتطلبات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تحرير ملف البيئة
nano .env
```

## الإعداد

قم بتحرير ملف `.env` وأضف المعلومات التالية:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Site Configuration
SITE_URL=https://salla-ye.store
PORT=3000
```

## الاستخدام

### 1. تشغيل الخادم (Server Mode)

```bash
# تشغيل الخادم
npm start

# أو للتطوير مع المراقبة
npm run dev
```

الخادم سيعمل على `http://localhost:3000` مع الروابط التالية:

- **Main Sitemap Index**: `/sitemap-main.xml`
- **Site Sitemap**: `/sitemap.xml`
- **Store Sitemap**: `/sitemap/store_{id}.xml`
- **Health Check**: `/health`

### 2. إنشاء ملفات XML ثابتة

```bash
# إنشاء جميع ملفات الـ sitemap
npm run generate
```

سيتم إنشاء الملفات في مجلد `output/`:
- `sitemap-main.xml` - الفهرس الرئيسي
- `sitemap.xml` - صفحات الموقع الأساسية
- `sitemap-store-{id}.xml` - خريطة كل متجر
- `generation-summary.json` - ملخص العملية

## هيكل الـ Sitemap

### 1. Main Sitemap Index (`/sitemap-main.xml`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://salla-ye.store/sitemap.xml</loc>
    <lastmod>2024-12-25</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://salla-ye.store/sitemap/store_123.xml</loc>
    <lastmod>2024-12-25</lastmod>
  </sitemap>
</sitemapindex>
```

### 2. Site Sitemap (`/sitemap.xml`)
يحتوي على:
- الصفحة الرئيسية
- صفحات ثابتة (login, register, pricing)
- صفحات المتاجر الرئيسية

### 3. Store Sitemaps (`/sitemap/store_{id}.xml`)
يحتوي على:
- صفحة المتجر الرئيسية
- جميع منتجات المتجر النشطة

## API Endpoints

| Endpoint | الوصف |
|----------|--------|
| `GET /` | معلومات الـ API |
| `GET /sitemap-main.xml` | الفهرس الرئيسي للـ sitemaps |
| `GET /sitemap.xml` | sitemap الموقع الأساسي |
| `GET /sitemap/store_{id}.xml` | sitemap متجر محدد |
| `GET /health` | فحص حالة الخادم |

## التكامل مع الموقع الرئيسي

### 1. استخدام الخادم المنفصل

```javascript
// في ملف vercel.json أو .htaccess
{
  "rewrites": [
    {
      "source": "/sitemap-main.xml",
      "destination": "http://your-sitemap-server.com/sitemap-main.xml"
    }
  ]
}
```

### 2. استخدام الملفات الثابتة

```bash
# نسخ الملفات المولدة إلى الموقع الرئيسي
cp output/*.xml ../public/
```

## Google Search Console

1. اذهب إلى [Google Search Console](https://search.google.com/search-console)
2. أضف الموقع إذا لم يكن مضافاً
3. اذهب إلى **Sitemaps** في القائمة الجانبية
4. أضف الرابط: `https://salla-ye.store/sitemap-main.xml`

## المراقبة والصيانة

### فحص الأخطاء
```bash
# فحص حالة الخادم
curl http://localhost:3000/health

# فحص sitemap معين
curl http://localhost:3000/sitemap.xml
```

### التحديث التلقائي
يمكنك إعداد cron job لتحديث الـ sitemaps دورياً:

```bash
# كل ساعة
0 * * * * cd /path/to/sitemap-generator && npm run generate

# كل يوم في الساعة 2 صباحاً
0 2 * * * cd /path/to/sitemap-generator && npm run generate
```

## استكشاف الأخطاء

### خطأ في الاتصال بـ Supabase
- تأكد من صحة `SUPABASE_URL` و `SUPABASE_ANON_KEY`
- تأكد من أن الجداول موجودة: `stores`, `products`

### خطأ في تنسيق XML
- تأكد من أن البيانات لا تحتوي على رموز XML خاصة
- الأداة تقوم بـ escape تلقائي للرموز الخاصة

### مشاكل الأداء
- استخدم الـ caching في الخادم
- قم بتحديد حد أقصى لعدد المنتجات في كل sitemap (50,000 URL)

## الدعم

للمساعدة أو الإبلاغ عن مشاكل، يرجى إنشاء issue في المستودع.# sitemap-api
