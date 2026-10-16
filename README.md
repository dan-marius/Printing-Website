# proto3d.eu: static bilingual site

Romanian is the default (`/`), English lives at `/en/`. No server, no database.

## What's in the folder
| File | Purpose |
|---|---|
| `config.js` | **Prices, products, extras, phone, WhatsApp, email (also receives form messages).** Edit this first. |
| `build.js` | Generates `index.html`, `en/index.html`, `sitemap.xml`, `robots.txt`. Page texts (RO/EN) are at the top. |
| `calc.js`, `app.js` | Calculator logic, WhatsApp/call links, contact form. |
| `style.css` | Look and feel. |
| `assets/` | Put photos here as `gallery-1.jpg` ... `gallery-6.jpg`, then run `node build.js`. |

## 1. Fill in your details
1. Open `config.js` and replace the placeholders: phone, WhatsApp number (digits only), email, prices.
2. The contact form is delivered by https://formsubmit.co to `email`. The first time a message is sent, FormSubmit emails you an activation link: click it once, and from then on messages arrive normally.
3. Rebuild the pages (needs Node.js, https://nodejs.org): `node build.js`

Prices and contact links are read from `config.js` in the browser, so price changes work even without rebuilding. Rebuild when you change page texts, gallery photos, or want the no-JavaScript links updated.

## 2. Preview locally
`npx serve .` then open the address it prints (opening the files directly won't load the `/style.css` paths).

## 3. Push to GitHub
```
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOU/proto3d-site.git
git push -u origin main
```

## 4. Deploy on Cloudflare Pages (free)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
2. Framework preset: **None**. Build command: *(leave empty)*. Build output directory: `/` (or leave empty).
3. Deploy. You get `proto3d-site.pages.dev` to test.
4. In the project: **Custom domains → Set up a domain → `proto3d.eu`**. Also add `www.proto3d.eu` and redirect it to the root.
5. Before that, delete the old parking **A** and **www CNAME** records in the DNS tab if they are still there.

## 5. Email for hello@proto3d.eu (free)
Cloudflare dashboard → **Email → Email Routing**, create `hello@proto3d.eu` forwarding to your Gmail. Remove the old Namecheap `eforward` MX/SPF records first, so there is only one set.

## Test checklist
- [ ] Call button dials your number (phone)
- [ ] WhatsApp button opens a chat with the prefilled message
- [ ] Calculator: design hours, products, extras and minimum order give the expected total
- [ ] "Send via the form" fills the message box; the form delivers an email to you
- [ ] RO ↔ EN switch works from both pages
