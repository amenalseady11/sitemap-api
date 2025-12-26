# النشر السريع على Vercel - محدث

## 🔧 إصلاح مشكلة @supabase/supabase-js

تم إنشاء نسخة CommonJS من API function لحل مشكلة ES modules مع Vercel.

## 1. الإعداد السريع

```bash
# تثبيت Vercel CLI
npm install -g vercel

# اختبار النسخة الجديدة
node test-cjs.cjs

# تسجيل الدخول
vercel login
```

## 2. النشر

```bash
# النشر التجريبي
vercel

# النشر للإنتاج
vercel --prod
```

## 3. إعداد متغيرات البيئة

في Vercel Dashboard → Settings → Environment Variables:

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key-here
SITE_URL = https://salla-ye.store
```

## 4. اختبار النشر

```bash
# اختبار الروابط
curl https://your-app.vercel.app/health
curl https://your-app.vercel.app/sitemap.xml
curl https://your-app.vercel.app/sitemap-main.xml
```

## 5. الروابط المتاحة

- **الصفحة الرئيسية**: `https://your-app.vercel.app/`
- **فحص الحالة**: `https://your-app.vercel.app/health`
- **Sitemap الرئيسي**: `https://your-app.vercel.app/sitemap.xml`
- **فهرس Sitemaps**: `https://your-app.vercel.app/sitemap-main.xml`
- **Sitemap متجر**: `https://your-app.vercel.app/sitemap/store_123.xml`

## 6. التكامل مع الموقع الرئيسي

أضف في `vercel.json` للموقع الرئيسي:

```json
{
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "https://your-sitemap-app.vercel.app/sitemap.xml"
    },
    {
      "source": "/sitemap-main.xml", 
      "destination": "https://your-sitemap-app.vercel.app/sitemap-main.xml"
    },
    {
      "source": "/sitemap/store_([^/]+).xml",
      "destination": "https://your-sitemap-app.vercel.app/sitemap/store_$1.xml"
    }
  ]
}
```

## 7. Google Search Console

أضف الرابط: `https://salla-ye.store/sitemap-main.xml`

## 🐛 استكشاف الأخطاء

### خطأ "Cannot find module '@supabase/supabase-js'":
- ✅ تم حل هذه المشكلة بإنشاء نسخة CommonJS
- الآن يستخدم `/sitemap.xml` → `/api/sitemap-cjs.xml`

### خطأ في Environment Variables:
```bash
vercel env ls
vercel env add SUPABASE_URL
```

### اختبار محلي:
```bash
vercel dev
# ثم اختبر: http://localhost:3000/sitemap.xml
```

---

**ملاحظة**: تأكد من تحديث متغيرات البيئة في Vercel Dashboard قبل النشر!