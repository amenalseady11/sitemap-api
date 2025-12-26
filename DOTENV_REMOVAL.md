# إزالة dotenv من المشروع

## السبب
`dotenv` غير مدعوم بشكل مثالي في Vercel Serverless Functions، وVercel يدير متغيرات البيئة تلقائياً.

## التغييرات المطبقة ✅

### 1. إزالة dotenv من package.json
```diff
- "dotenv": "^16.3.1",
```

### 2. حذف ملف config.js
- تم حذف الملف بالكامل
- تم نقل الإعدادات إلى الملفات التي تحتاجها

### 3. تحديث الملفات المتأثرة

#### `sitemap-builder.js`
- إزالة `import { supabase, config } from './config.js'`
- إضافة إعدادات محلية
- إنشاء Supabase client محلياً

#### `server.js`
- إزالة `import { config, validateConfig } from './config.js'`
- إضافة إعدادات محلية
- إضافة validation محلي لمتغيرات البيئة

#### `generate-sitemap.js`
- إزالة `import { validateConfig } from './config.js'`
- إضافة validation محلي

#### `test.js`
- إزالة `import { config } from './config.js'`
- استخدام `process.env` مباشرة

#### `test-vercel.js`
- إزالة `import dotenv from 'dotenv'`
- إزالة `dotenv.config()`

### 4. تحديث package.json scripts
```diff
- "validate": "node -e \"import('./config.js').then(({validateConfig}) => validateConfig())\""
+ "validate-env": "node -e \"console.log('Environment variables:'); console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing'); console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing'); console.log('SITE_URL:', process.env.SITE_URL || 'Using default');\""
```

### 5. تحديث ملفات البيئة
- `.env.example` - إضافة تعليق حول عدم استخدام dotenv
- `.env` - إضافة تعليق توضيحي

## الفوائد

### ✅ تحسين التوافق مع Vercel
- لا توجد مشاكل مع تحميل dotenv
- متغيرات البيئة تُدار من Vercel Dashboard

### ✅ تقليل حجم المشروع
- إزالة dependency غير ضروري
- تقليل bundle size

### ✅ تبسيط الكود
- لا حاجة لملف config منفصل
- كل ملف يدير إعداداته محلياً

## الاختبار

```bash
# اختبار الوظائف الأساسية
npm run test

# اختبار النسخة CommonJS
npm run test-cjs

# اختبار متغيرات البيئة
npm run validate-env
```

## النشر على Vercel

```bash
# النشر
vercel --prod

# تعيين متغيرات البيئة في Vercel Dashboard
# SUPABASE_URL
# SUPABASE_ANON_KEY
# SITE_URL
```

## النتيجة

المشروع الآن متوافق بالكامل مع Vercel ولا يعتمد على dotenv أو ملفات إعدادات خارجية.