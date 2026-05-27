# Golef Site

## Структура проекту

```
galef-site/
├── public/                    # Статичні файли (копіюються без обробки)
├── src/
│   ├── assets/
│   │   ├── fonts/            # Шрифти (Mont)
│   │   ├── icons/            # SVG іконки
│   │   └── images/           # Зображення
│   ├── js/
│   │   ├── modules/          # JS модулі
│   │   │   ├── accordion.js
│   │   │   ├── mobile-menu.js
│   │   │   └── modal.js
│   │   └── main.js           # Головний JS файл
│   ├── scss/
│   │   ├── abstracts/        # Змінні, міксіни
│   │   │   ├── _variables.scss
│   │   │   ├── _mixins.scss
│   │   │   └── _index.scss
│   │   ├── base/             # Reset, типографіка, базові стилі
│   │   │   ├── _reset.scss
│   │   │   ├── _typography.scss
│   │   │   ├── _base.scss
│   │   │   └── _index.scss
│   │   ├── layout/           # Header, footer, grid
│   │   │   ├── _grid.scss
│   │   │   ├── _header.scss
│   │   │   ├── _footer.scss
│   │   │   └── _index.scss
│   │   ├── pages/            # Стилі для окремих сторінок
│   │   └── main.scss         # Головний SCSS файл
│   ├── pages/                # HTML сторінки
│   │   ├── catalog.html
│   │   ├── product.html
│   │   ├── checkout.html
│   │   ├── order-success.html
│   │   ├── search.html
│   │   ├── wishlist.html
│   │   ├── sales.html
│   │   ├── text-page.html
│   │   ├── 404.html
│   │   └── ui-kit.html
│   └── index.html            # Головна сторінка
├── package.json
└── vite.config.js
```

## Команди

```bash
# Встановлення залежностей
npm install

# Запуск dev сервера
npm run dev

# Збірка для продакшену
npm run build

# Перегляд збірки
npm run preview
```

## Кольори (з _variables.scss)

### Primitives
- Blue: 0-900
- Neutral: 50-1000
- Green: 300-500
- Yellow: 400-500
- Red: 500-700

### Tokens
- Surface: primary, secondary, contrast, invert
- Brand: primary, secondary, contrast
- Button: primary, secondary (з hover/pressed станами)
- Text: primary, secondary, contrast, link, positive, invert
- Border: primary, brand, error, invert, secondary
- Icon: primary, invert, secondary

## Брейкпоінти

- xs: 320px
- sm: 576px
- md: 768px
- lg: 1024px
- xl: 1280px
- xxl: 1440px
- xxxl: 1600px

## Типографіка

Шрифт: Mont (Montserrat як fallback)

- h1: 48px / Bold / 120%
- h2: 40px / Bold / 120%
- h3: 36px / Bold / 120%
- h4: 32px / Bold / 120%
- h5: 24px / Bold / 120%
- body: 16px / Regular / 120%
- caption: 14px
