# البدء السريع - Salla Sitemap Generator

## 1. الإعداد السريع

```bash
# انتقل إلى المجلد
cd sitemap-generator

# تثبيت المتطلبات (إذا لم تكن مثبتة)
npm install

# نسخ ملف البيئة
cp .env.example .env
```

## 2. تحديث إعدادات قاعدة البيانات

قم بتحرير ملف `.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SITE_URL=https://salla-ye.store
PORT=3000
```

## 3. الاختبار

```bash
# اختبار الإعداد
npm run test

# اختبار مع بيانات وهمية
npm run demo

# التحقق من الإعدادات
npm run validate
```

## 4. الاستخدام

### أ) تشغيل كخادم API

```bash
npm start
```

الروابط المتاحة:
- `http://localhost:3000/sitemap-main.xml`
- `http://localhost:3000/sitemap.xml`
- `http://localhost:3000/sitemap/store_123.xml`

### ب) إنشاء ملفات XML ثابتة

```bash
npm run generate
```

الملفات ستكون في مجلد `output/`

## 5. التكامل مع الموقع الرئيسي

### للاستضافة على cPanel:

1. انسخ الملفات من `output/` إلى `public_html/`
2. أو استخدم الخادم المنفصل واربطه بالدومين الفرعي

### للاستضافة على Vercel:

أضف في `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/sitemap-main.xml",
      "destination": "https://your-sitemap-server.com/sitemap-main.xml"
    }
  ]
}
```

## 6. إضافة إلى Google Search Console

1. اذهب إلى [Google Search Console](https://search.google.com/search-console)
2. اختر موقعك
3. اذهب إلى **Sitemaps**
4. أضف: `https://salla-ye.store/sitemap-main.xml`

## 7. الصيانة

```bash
# تنظيف الملفات المولدة
npm run clean

# إعادة توليد الملفات
npm run generate
```

## استكشاف الأخطاء

### خطأ في الاتصال:
```bash
# تحقق من الإعدادات
npm run validate
```

### خطأ في البيانات:
```bash
# اختبر مع بيانات وهمية
npm run demo
```

### مشاكل الخادم:
```bash
# تشغيل في وضع التطوير
npm run dev
```