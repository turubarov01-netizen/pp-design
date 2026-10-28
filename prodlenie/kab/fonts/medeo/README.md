# Шрифты Medeo

Открытое семейство для латиницы и кириллицы от студии DNF для prtner.ai. Версия 1.0.0-rc.3 из npm-пакета `medeo-font`. Лицензия SIL OFL 1.1 (`LICENSE.txt`): можно использовать бесплатно, в том числе в коммерческом продукте.

| Шрифт | Файл | Для чего |
|-------|------|----------|
| Medeo Sans | `MedeoSansVariable.woff2`, `-Italic.woff2` | Текст и интерфейс. Вес 100–900, оптический размер браузер ставит сам |
| Medeo Mono | `MedeoMonoVariable.woff2`, `-Italic.woff2` | Цены, таблицы, служебные подписи |
| Medeo Pixel | `MedeoPixelVariable.woff` | Крупные цифры-события: таймер, проценты, выигрыш. Форма точки задаётся осью `ELSH` (классы `.medeo-pixel-*`) |

## Лицензия и доказательства

Копия пакета, снимки страницы автора, контрольные суммы и ссылки на Web Archive на дату скачивания (26.10.2026) лежат в `licenses/medeo-font/PROVENANCE.md`.

## Статус

Файлы лежат в репозитории, но к платформе **пока не подключены**. Кабинет (`src/components/kabinet/kabinet.css`) объявляет Inter, но этот шрифт нигде не загружается, поэтому пользователи видят системный шрифт устройства (SF Pro, Segoe UI, Roboto). Остальная платформа на Figtree (`tailwind.config.ts`, `index.html`). Первым Medeo использует онбординг Альянса.

## Как подключить

```html
<link rel="stylesheet" href="/fonts/medeo/medeo.css">
```

Затем в `tailwind.config.ts` поставить `'Medeo Sans'` первым в `fontFamily.sans`, а для цифр использовать `var(--font-medeo-mono)` и `var(--font-medeo-pixel)`. Для заголовков советуют `letter-spacing` от -0.01em до -0.03em, для текста 0.
