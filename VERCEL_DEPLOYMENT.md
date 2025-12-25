# نشر Sitemap Generator على Vercel

## 1. الإعداد المحلي

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تثبيت المتطلبات
cd sitemap-generator
npm install

# تسجيل الدخول إلى Vercel
vercel login
```

## 2. إعداد متغيرات البيئة

### أ) عبر Vercel Dashboard:
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف المتغيرات التالية:

| Variable | Value | Environment |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |
| `SITE_URL` | `https://salla-ye.store` | Production, Preview, Development |

### ب) عبر Vercel CLI:
```bash
# إضافة متغيرات البيئة
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SITE_URL
```

## 3. النشر

### النشر الأول:
```bash
# النشر التجريبي
vercel

# النشر للإنتاج
vercel --prod
```

### النشر التلقائي:
```bash
# ربط المشروع بـ Git repository
vercel --prod

# كل push إلى main branch سيتم نشره تلقائياً
```

## 4. إعداد الدومين المخصص

### أ) دومين فرعي:
1. في Vercel Dashboard → **Settings** → **Domains**
2. أضف: `sitemap.salla-ye.store`
3. أضف CNAME record في DNS:
   ```
   sitemap.salla-ye.store → cname.vercel-dns.com
   ```

### ب) مسار فرعي:
في الموقع الرئيسي، أضف في `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/sitemap-main.xml",
      "destination": "https://sitemap.salla-ye.store/sitemap-main.xml"
    },
    {
      "source": "/sitemap.xml",
      "destination": "https://sitemap.salla-ye.store/sitemap.xml"
    },
    {
      "source": "/sitemap/store_([^/]+).xml",
      "destination": "https://sitemap.salla-ye.store/sitemap/store_$1.xml"
    }
  ]
}
```

## 5. اختبار النشر

```bash
# اختبار محلي
vercel dev

# اختبار الروابط بعد النشر
curl https://your-deployment-url.vercel.app/health
curl https://your-deployment-url.vercel.app/sitemap-main.xml
curl https://your-deployment-url.vercel.app/sitemap.xml
```

## 6. مراقبة الأداء

### أ) Vercel Analytics:
1. في Dashboard → **Analytics**
2. مراقبة استخدام Functions
3. مراقبة أوقات الاستجابة

### ب) Logs:
```bash
# عرض logs الحية
vercel logs --follow

# عرض logs لـ function معين
vercel logs --function=api/sitemap-main
```

## 7. تحسين الأداء

### أ) Caching:
- الـ headers في الكود تتضمن `Cache-Control`
- Vercel يقوم بـ caching تلقائي للاستجابات

### ب) Cold Start:
- Functions تبقى "warm" لمدة 5 دقائق
- يمكن استخدام cron job للحفاظ على Functions نشطة

### ج) Database Connection:
- استخدام connection pooling في Supabase
- تحسين queries للحصول على البيانات المطلوبة فقط

## 8. استكشاف الأخطاء

### خطأ في Environment Variables:
```bash
# التحقق من المتغيرات
vercel env ls

# إضافة متغير مفقود
vercel env add VARIABLE_NAME
```

### خطأ في Functions:
```bash
# عرض logs مفصلة
vercel logs --function=api/sitemap-main --since=1h

# اختبار محلي
vercel dev
```

### خطأ في الاتصال بقاعدة البيانات:
- تأكد من صحة `SUPABASE_URL` و `SUPABASE_ANON_KEY`
- تأكد من أن RLS policies تسمح بالقراءة

## 9. الصيانة

### تحديث الكود:
```bash
# تحديث وإعادة نشر
git push origin main
# أو
vercel --prod
```

### مراقبة الاستخدام:
- Vercel Free Plan: 100GB bandwidth/month
- Function executions: 100GB-hours/month
- مراقبة الاستخدام في Dashboard

## 10. النسخ الاحتياطي

### أ) تصدير الإعدادات:
```bash
# تصدير إعدادات المشروع
vercel env pull .env.local
```

### ب) نسخة احتياطية من الكود:
```bash
# Git repository كنسخة احتياطية
git push origin main
```

## الروابط المفيدة

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)