# שבילי קדם: קליינט React

ממשק המשתמש של מערכת **TourShuttle**: הזמנת מקומות בהסעות לסיורים במקומות הקדושים.
השרת (ASP.NET Core Web API) נמצא ב-repository נפרד: [TourShuttle](https://github.com/Yaffi-Tikochinsky/TourShuttle).

## מה אפשר לעשות
- **אורח:**
  - דף נחיתה.
  - חיפוש הסעות לפי העיר שלו ולפי היעד, עם סינון, מיון ועמודים.
  - דף הסעה עם המסלול וזמני האיסוף המשוערים.
- **לקוח:**
  - הזמנה: בחירת תחנה ומספר מקומות, אישור, ומסך הצלחה.
  - כשמישהו תפס את המקומות באותו רגע (409), הקליינט מציע את המקומות שנשארו.
  - "ההזמנות שלי", עם ביטול שמוצג מיד (optimistic) והחזרה למצב הקודם אם הביטול נכשל.
- **נהג:**
  - ההסעה הבאה וכל ההסעות לפי ימים.
  - רשימת נוסעים לפי תחנות: סימון מי עלה, חיוג בלחיצה, רענון כל דקה, והדפסה.
- **מנהל:**
  - ניהול הסעות: טבלה, טופס עם בונה מסלול, נעילת שדות כשיש הזמנות, וביטול הסעה.
  - יעדים, תחנות איסוף ונהגים.
  - הוספת יעד או תחנה בלי לצאת מטופס ההסעה.
- **לכולם:** מצב כהה, תמיכה בטלפון, נגישות (ניווט במקלדת, קוראי מסך, הפחתת תנועה), ומעברים רכים בין דפים.

## טכנולוגיות
- **React 19** + **TypeScript** + **Vite**
- **React Router 7**: ניווט, טעינה עצלה של דפים, ודפים מוגנים לפי תפקיד
- **TanStack Query**: הבאת נתונים מהשרת, cache ורענון
- **CSS Modules** עם design tokens משלנו (מצב בהיר וכהה)
- **Vitest** + **React Testing Library**: 72 בדיקות

### React בפרויקט (לפי נושאים)
- **Hooks:**
  - `useState` ו-`useReducer` (תהליך ההזמנה).
  - `useEffect` רק לסנכרון עם מה שמחוץ ל-React.
  - `useSyncExternalStore` (ה-session ומדיה).
  - `useId`, `useTransition`, `useDeferredValue`, `useOptimistic`.
  - `useActionState` עם form actions של React 19.
  - `use` לקריאת context.
- **Hooks משלנו:** `useFetch` (עם AbortController), `useInView`, `useLocalStorage`, `useCountUp`, `useNow`, `useMediaQuery`.
- **Context:** אימות, ערכת צבעים, והודעות קופצות.
- **TanStack Query:**
  - `useQuery` ו-`useMutation`.
  - invalidate אחרי שינוי.
  - prefetch במעבר עכבר.
  - `keepPreviousData` בזמן החלפת סינון.
- **React Router:**
  - נתיבים מקוננים ו-layout routes.
  - שומרי הרשאה.
  - פרמטרים ב-URL.
  - טעינה עצלה עם `lazy` ו-`Suspense`.
- **קומפוננטות:**
  - קומפוננטה פולימורפית (`as`).
  - `ref` כ-prop.
  - portal.
  - Error Boundary.
  - `<dialog>` מקורי.

## הרצה מקומית
1. להריץ את השרת (`dotnet run --project src/TourShuttle.API` ב-repository של השרת). הוא מאזין ב-`http://localhost:5282`.
2. בתיקייה הזו:
   ```bash
   npm install
   npm run dev
   ```
3. לפתוח את `http://localhost:5173`. בזמן פיתוח Vite מעביר את הבקשות ל-`/api` אל השרת המקומי, ולכן אין צורך ב-CORS.

## משתמשי הדגמה
בדף ההתחברות יש כפתורי כניסה מהירה:

| תפקיד | אימייל | סיסמה |
|---|---|---|
| לקוח | `customer1@tourshuttle.demo` | `Customer123!` |
| נהג | `driver1@tourshuttle.demo` | `Driver123!` |
| מנהל | `admin@tourshuttle.demo` | `Admin123!` |

## פקודות
| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | שרת פיתוח עם רענון מיידי |
| `npm test` | הרצת הבדיקות |
| `npm run lint` | בדיקת איכות קוד (oxlint) |
| `npm run typecheck` | בדיקת טיפוסים של TypeScript |
| `npm run build` | בנייה לפריסה (תיקיית `dist`) |

## משתני סביבה
| משתנה | משמעות |
|---|---|
| `VITE_API_URL` | כתובת השרת. ריק בפיתוח; בבנייה לפריסה: הכתובת של השרת ב-Render |

## פריסה ל-Render (Static Site)
הקליינט נבנה לקבצים סטטיים (`dist`) ומוגש כ-Static Site, בכתובת משלו. השרת מאשר את הכתובת הזו ב-CORS.

| הגדרה | ערך |
|---|---|
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| משתנה סביבה `VITE_API_URL` | הכתובת של השרת ב-Render, בלי `/` בסוף |
| Redirects/Rewrites | Source `/*`, Destination `/index.html`, Action `Rewrite` |

- **למה Rewrite:** הניתוב נעשה בדפדפן (React Router). בלי הכלל, רענון של `/tours/4` היה מחזיר 404, כי אין קובץ כזה בשרת.
- **גרסת Node:** נקבעת בקובץ `.node-version` (22). Vite 8 דורש לפחות Node 20.19.
- **`VITE_API_URL`** נכנס לקוד בזמן הבנייה. אחרי שינוי שלו צריך לבנות מחדש (Manual Deploy), לא רק להפעיל מחדש.
- **בצד השרת:** משתנה הסביבה `Cors__AllowedOrigins__0` צריך להכיל את הכתובת של הקליינט.
- **בתוכנית החינמית השרת נרדם** אחרי 15 דקות בלי פניות, והבקשה הראשונה אחר כך לוקחת עד דקה. אחרי 6 שניות של המתנה הקליינט מציג הודעה שמסבירה את זה.

## מבנה התיקיות
```
src/
  app/         providers, router, theme
  api/         HTTP client, types, one file per resource
  features/    auth, home, tours, bookings, driver, admin, system (each: pages, components, hooks)
  components/  ui (the component library), layout, feedback, art (the vector drawings), motion
  hooks/       generic hooks
  lib/         errors, session, helpers
  styles/      design tokens and global styles
```
