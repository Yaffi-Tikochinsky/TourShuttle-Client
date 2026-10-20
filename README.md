# שבילי קדם: קליינט React

ממשק המשתמש של מערכת **TourShuttle**: הזמנת מקומות בהסעות לסיורים במקומות הקדושים.
השרת (ASP.NET Core Web API) נמצא ב-repository נפרד: `TourShuttle`.

## טכנולוגיות
- **React 19** + **TypeScript** + **Vite**
- **React Router 7**: ניווט, טעינה עצלה של דפים, ודפים מוגנים לפי תפקיד
- **TanStack Query**: הבאת נתונים מהשרת, cache ורענון
- **CSS Modules** עם design tokens משלנו (מצב בהיר וכהה)
- **Vitest** + **React Testing Library**

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

## מבנה התיקיות
```
src/
  app/         providers, router, theme
  api/         HTTP client, types, one file per resource
  features/    auth, home (and later: tours, bookings, driver, admin)
  components/  ui (the component library), layout, feedback
  hooks/       generic hooks
  lib/         errors, session, helpers
  styles/      design tokens and global styles
```
