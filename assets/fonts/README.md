# Шрифты для генерации картинок

TTF-копии шрифтов приглашения. Нужны только при сборке: из них рисуются
картинки-превью ссылки (`app/(classic)/opengraph-image.tsx`,
`app/minimal/opengraph-image.tsx`, `app/editorial/…`). На сайт гостю они не отдаются — там
работают woff2 из `next/font` (см. `lib/fonts.ts` и `designs/*/fonts.ts`).

Генератор картинок не умеет вариативные шрифты, поэтому здесь статичные
начертания: нужный вес и оптический размер уже «зашиты» в файл.

Источник: Google Fonts. Лицензия всех файлов: SIL Open Font License 1.1,
она разрешает использование и распространение в составе продукта.

| Файл | Семейство | Где |
| --- | --- | --- |
| `CormorantGaramond-Medium.ttf` | Cormorant Garamond | классика |
| `GreatVibes-Regular.ttf` | Great Vibes | классика, romantic |
| `BadScript-Regular.ttf` | Bad Script | классика, romantic |
| `Forum-Regular.ttf` | Forum | классика, national |
| `Literata-ExtraLight.ttf` | Literata, вес 200, оптический размер 72 | минимализм |
| `Geist-Medium.ttf` | Geist, вес 500 | минимализм |
| `Playfair-BlackCondensed.ttf` | Playfair, вес 900, узкая ширина 87.5, оптический размер 144 | эдиториал: шапка, иконка |
| `Playfair-Display.ttf` | Playfair, вес 400, оптический размер 144 | эдиториал: имена |
| `SourceSerif4-SemiBold.ttf` | Source Serif 4, вес 600 | эдиториал: капители |
| `Onest-ExtraBold.ttf` | Onest, вес 800 | гротеск: цифры, имена, иконка |
| `Onest-SemiBold.ttf` | Onest, вес 600 | гротеск: подписи |
| `IBMPlexMono-Bold.ttf` | IBM Plex Mono, вес 700 | машинопись: шапка, имена, иконка |
| `IBMPlexMono-Medium.ttf` | IBM Plex Mono, вес 500 | машинопись: текст |
| `YesevaOne-Regular.ttf` | Yeseva One | максимализм: имена, дата |
| `Geologica-SemiBold.ttf` | Geologica, вес 600 | максимализм: подписи |
