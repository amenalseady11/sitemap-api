# إصلاح مشكلة Vercel مع @supabase/supabase-js

## المشكلة
```
Cannot find module '@supabase/supabase-js'
Did you forget to add it to "dependencies" in `package.json`?
```

## السبب
مشكلة في التوافق بين ES modules و Vercel Serverless Functions مع مكتبة Supabase.

## الحل ✅

### 1. إنشاء نسخة CommonJS
تم إنشاء `api/sitemap-cjs.xml.js` باستخدام `require()` بدلاً من `import`.

### 2. إزالة dotenv
تم إزالة `dotenv` من المشروع لأن Vercel يدير متغيرات البيئة تلقائياً.

### 3. تحديث vercel.json
```json
{
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap-cjs.xml"
    }
  ]
}
```

### 4. اختبار الحل
```bash
# اختبار النسخة الجديدة
npm run test-cjs

# اختبار متغيرات البيئة
npm run validate-env

# النشر
vercel --prod
```

## الملفات المحدثة

- ✅ `api/sitemap-cjs.xml.js` - نسخة CommonJS تعمل مع Vercel
- ✅ `vercel.json` - محدث لاستخدام النسخة الجديدة
- ✅ `package.json` - إزالة dotenv وإضافة validate-env
- ✅ `test-cjs.cjs` - اختبار النسخة الجديدة
- ✅ `.env.example` - محدث مع تعليقات حول عدم استخدام dotenv
- ❌ `config.js` - تم حذفه (لم يعد مطلوباً)
- ✅ `DEPLOY_QUICK.md` - دليل محدث

## التحقق من النجاح

بعد النشر، اختبر:
```bash
curl https://your-app.vercel.app/sitemap.xml
```

يجب أن ترى XML صحيح بدلاً من رسالة خطأ.

## البدائل الأخرى (إذا لم يعمل الحل)

### البديل 1: استخدام fetch مباشرة
```javascript
// بدلاً من Supabase client
const response = await fetch(`${supabaseUrl}/rest/v1/stores`, {
  headers: {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`
  }
});
```

### البديل 2: إنشاء ملفات ثابتة
```bash
# توليد ملفات XML ثابتة
npm run generate

# رفعها على CDN أو استضافة ثابتة
```

### البديل 3: استخدام Edge Functions
```javascript
// في vercel.json
{
  "functions": {
    "api/sitemap.xml.js": {
      "runtime": "edge"
    }
  }
}
```

## الخلاصة

الحل الحالي يستخدم CommonJS مع Vercel Serverless Functions لتجنب مشاكل ES modules. هذا يضمن عمل المشروع بشكل موثوق على Vercel.