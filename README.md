# Salla Sitemap Generator

مولد خرائط المواقع لمنصة سلة - يقوم بإنشاء sitemaps صحيحة ومتوافقة مع معايير Google.

## المميزات

- ✅ توليد sitemap رئيسي (sitemap index)
- ✅ توليد sitemap للموقع الأساسي
- ✅ توليد sitemaps منفصلة لكل متجر
- ✅ متوافق مع معايير Google و XML Schema
- ✅ دعم Supabase
- ✅ Vercel Serverless Functions
- ✅ تحسين الأداء مع الـ caching
- ✅ معالجة الأخطاء مع fallback sitemaps

## النشر السريع على Vercel

### 1. النشر بنقرة واحدة
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/sitemap-generator)

### 2. النشر اليدوي
```bash
# استنساخ المشروع
git clone https://github.com/your-username/sitemap-generator
cd sitemap-generator

# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### 3. إعداد متغيرات البيئة
في Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | `your-anon-key-here` |
| `SITE_URL` | `https://salla-ye.store` |

## الاستخدام

بعد النشر، ستكون الروابط التالية متاحة:

- **Main Sitemap Index**: `https://your-app.vercel.app/sitemap-main.xml`
- **Site Sitemap**: `https://your-app.vercel.app/sitemap.xml`
- **Store Sitemap**: `https://your-app.vercel.app/sitemap/store_{id}.xml`
- **Health Check**: `https://your-app.vercel.app/health`

## التكامل مع الموقع الرئيسي

### استخدام دومين فرعي:
```
sitemap.salla-ye.store → your-vercel-app.vercel.app
```

### استخدام rewrites في الموقع الرئيسي:
```json
{
  "rewrites": [
    {
      "source": "/sitemap-main.xml",
      "destination": "https://your-sitemap-app.vercel.app/sitemap-main.xml"
    }
  ]
}
```

## التطوير المحلي

```bash
# تثبيت المتطلبات
npm install

# تشغيل محلي مع Vercel
vercel dev

# أو تشغيل Express server
npm start
```

## هيكل المشروع

```
sitemap-generator/
├── api/                    # Vercel Serverless Functions
│   ├── index.js           # معلومات API
│   ├── health.js          # فحص الحالة
│   ├── sitemap-main.js    # الفهرس الرئيسي
│   ├── sitemap.js         # sitemap الموقع
│   └── sitemap-store.js   # sitemap المتاجر
├── lib/                   # مكتبات مشتركة
│   └── sitemap-builder.js # محرك توليد XML
├── vercel.json           # إعدادات Vercel
├── package.json          # متطلبات المشروع
└── README.md            # هذا الملف
```

## API Endpoints

| Endpoint | الوصف | Cache |
|----------|--------|-------|
| `GET /` | معلومات الـ API | - |
| `GET /health` | فحص حالة الخدمة | - |
| `GET /sitemap-main.xml` | الفهرس الرئيسي للـ sitemaps | 1 hour |
| `GET /sitemap.xml` | sitemap الموقع الأساسي | 1 hour |
| `GET /sitemap/store_{id}.xml` | sitemap متجر محدد | 30 min |

## Google Search Console

1. اذهب إلى [Google Search Console](https://search.google.com/search-console)
2. أضف الموقع إذا لم يكن مضافاً
3. اذهب إلى **Sitemaps** في القائمة الجانبية
4. أضف الرابط: `https://salla-ye.store/sitemap-main.xml`

## المراقبة والصيانة

### مراقبة الأداء:
```bash
# عرض logs
vercel logs --follow

# مراقبة function معين
vercel logs --function=api/sitemap-main
```

### تحديث الكود:
```bash
# تحديث وإعادة نشر
git push origin main
# أو
vercel --prod
```

## استكشاف الأخطاء

### خطأ في الاتصال بـ Supabase:
- تأكد من صحة `SUPABASE_URL` و `SUPABASE_ANON_KEY`
- تأكد من أن الجداول موجودة: `stores`, `products`

### خطأ في Environment Variables:
```bash
vercel env ls
vercel env add VARIABLE_NAME
```

### مشاكل الأداء:
- Vercel تقوم بـ caching تلقائي
- Functions تبقى warm لمدة 5 دقائق
- استخدم connection pooling في Supabase

## الحدود والقيود

### Vercel Free Plan:
- 100GB bandwidth/month
- 100GB-hours function executions/month
- 10 second function timeout

### تحسينات للإنتاج:
- استخدم Vercel Pro للحصول على حدود أعلى
- تحسين queries لتقليل وقت التنفيذ
- استخدام caching strategies

## الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- إنشاء issue في المستودع# sitemap-api
