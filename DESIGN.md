---
version: alpha
name: Bazaario
description: Design language of Bazaario, an Amazon-like marketplace with everything. Based on the mydealz DESIGN.md template (dense white-card feed, pill buttons, price with struck old price, discount badge). Palette changed to a dark header with an orange accent. One font family, two weights, 8px spacing grid.

colors:
  header: '#1b2433'
  on-header: '#ffffff'
  primary: '#ff9900'
  primary-strong: '#e08600'
  on-primary: '#111827'
  canvas: '#f3f5f7'
  surface: '#ffffff'
  ink: '#111827'
  body: '#5b6068'
  muted: '#a7a9ac'
  hairline: '#dfe1e4'
  sale: '#ce1736'
  sale-surface: '#fde8ec'
  success: '#197e25'
  success-surface: '#defde4'
  error: '#ce1736'
  warning-surface: '#faf9ca'
  warning-text: '#9f5c0c'
  star: '#ff9900'

typography:
  display:
    fontFamily: Mulish
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
  heading-lg:
    fontFamily: Mulish
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
  heading:
    fontFamily: Mulish
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.25
  lead:
    fontFamily: Mulish
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.4
  body:
    fontFamily: Mulish
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  ui:
    fontFamily: Mulish
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
  caption:
    fontFamily: Mulish
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3

shadow:
  hover: 0 2px 8px rgba(17, 24, 39, 0.12)

rounded:
  sm: 4px
  md: 8px
  full: 540px
  circle: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 40px

components:
  header:
    backgroundColor: '{colors.header}'
    textColor: '{colors.on-header}'
    typography: '{typography.ui}'
  footer:
    backgroundColor: '{colors.header}'
    textColor: '{colors.on-header}'
    typography: '{typography.caption}'
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.ui}'
    rounded: '{rounded.full}'
    padding: '0px 16px'
    height: 40px
  button-primary-hover:
    backgroundColor: '{colors.primary-strong}'
  button-outline:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.ui}'
    rounded: '{rounded.full}'
    borderColor: '{colors.hairline}'
    padding: '0px 16px'
    height: 40px
  button-cart:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.ui}'
    rounded: '{rounded.full}'
    borderColor: '{colors.primary-strong}'
    padding: '0px 16px'
    height: 32px
  button-disabled:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.muted}'
  text-input:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.md}'
    borderColor: '{colors.hairline}'
    padding: '9px 16px'
  search-pill:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.body}'
    typography: '{typography.body}'
    rounded: '{rounded.full}'
    padding: '9px 20px'
  product-card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderColor: '{colors.hairline}'
    rounded: '{rounded.md}'
    padding: '16px'
  product-card-hover:
    shadow: '{shadow.hover}'
  price:
    textColor: '{colors.ink}'
    typography: '{typography.heading-lg}'
  price-old:
    textColor: '{colors.muted}'
    typography: '{typography.body}'
    textDecoration: line-through
  discount-badge:
    backgroundColor: '{colors.sale-surface}'
    textColor: '{colors.sale}'
    typography: '{typography.ui}'
    rounded: '{rounded.sm}'
    padding: '4px 8px'
  badge-success:
    backgroundColor: '{colors.success-surface}'
    textColor: '{colors.success}'
    typography: '{typography.ui}'
    rounded: '{rounded.sm}'
    padding: '4px 8px'
  badge-neutral:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.body}'
    typography: '{typography.ui}'
    rounded: '{rounded.sm}'
    padding: '4px 8px'
  badge-highlight:
    backgroundColor: '{colors.header}'
    textColor: '{colors.on-header}'
    typography: '{typography.ui}'
    rounded: '{rounded.sm}'
    padding: '4px 8px'
  badge-deal:
    backgroundColor: '{colors.sale}'
    textColor: '{colors.on-header}'
    typography: '{typography.ui}'
    rounded: '{rounded.sm}'
    padding: '4px 8px'
  badge-save:
    backgroundColor: '{colors.success-surface}'
    textColor: '{colors.success}'
    typography: '{typography.ui}'
    rounded: '{rounded.sm}'
    borderColor: '{colors.success}'
    padding: '4px 8px'
  badge-plain:
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    padding: '4px 8px'
  rating:
    textColor: '{colors.star}'
    typography: '{typography.caption}'
  favorite-button:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.body}'
    rounded: '{rounded.circle}'
    borderColor: '{colors.hairline}'
    height: 36px
  favorite-button-active:
    textColor: '{colors.primary}'
  cart-item:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderColor: '{colors.hairline}'
    padding: '16px 0px'
  cart-summary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    borderColor: '{colors.hairline}'
    rounded: '{rounded.md}'
    padding: '24px'
  cart:
    backgroundColor: '{colors.surface}'
    borderColor: '{colors.hairline}'
    rounded: '{rounded.md}'
    padding: '24px'
---

# Bazaario design system

## Overview

Bazaario is an Amazon-like marketplace with everything. The feel is busy but clear: a dark header with search on top, a light gray page, and white product cards in a dense grid. Orange marks the main action (buy, add to cart). Red is only for sales and errors. Text on orange is dark, not white, to keep contrast.

Source: the mydealz template from getdesign.md (independent analysis, not official). We keep its structure (sections, 8px grid, pill buttons, price with struck old price, discount badge) and change the palette and the font.

## Colors

- **header** `#1b2433`: header and footer background, text on it is white.
- **primary** `#ff9900`: main buttons, active states. Label is `ink`. Hover is `primary-strong` `#e08600`.
- **canvas** `#f3f5f7`: page background. **surface** `#ffffff`: cards, inputs.
- **ink** `#111827`: main text and prices. **body** `#5b6068`: secondary text. **muted** `#a7a9ac`: old price, disabled, placeholders.
- **hairline** `#dfe1e4`: all 1px borders and dividers.
- **sale** `#ce1736` on **sale-surface** `#fde8ec`: discount badge only.
- **success** `#197e25` on **success-surface** `#defde4`: "in stock", "added" messages. **error** `#ce1736`: form and system errors.
- **star** `#ff9900`: filled rating stars.

## Typography

Font: **Mulish** (Google Fonts), weights 500 and 700 only. Fallback: `system-ui, sans-serif`.

| Token      | Size | Weight | Line height | Use                     |
| ---------- | ---- | ------ | ----------- | ----------------------- |
| display    | 48px | 700    | 1.1         | hero on Home            |
| heading-lg | 24px | 700    | 1.2         | page titles, price      |
| heading    | 20px | 700    | 1.25        | section titles          |
| lead       | 18px | 500    | 1.4         | intro text              |
| body       | 16px | 500    | 1.5         | normal text             |
| ui         | 14px | 700    | 1.3         | buttons, labels, badges |
| caption    | 12px | 500    | 1.3         | hints, rating count     |

## Layout

- 8px base grid. Spacing tokens: 2, 4, 8, 12, 16, 24, 40.
- Content width max 1280px, centered, side padding 16px (24px on desktop).
- Product grid: 2 columns on phone, 3 on tablet, 4 on desktop, gap 16px.
- Breakpoints: 640px, 1024px.

## Shapes

Radius tokens: sm 4px (badges), md 8px (cards, inputs), full 540px (buttons, search), circle (avatars, icon buttons). One flat style: no shadows by default. A card gets a light shadow only on hover (`--shadow-hover`).

## Components

Names match the components in `src/components/`.

- **Header**: `header` background, logo text "Bazaario" on the left, search pill in the center, links (Catalog, Favorites, Cart with count) on the right.
- **Footer**: `header` background, small text, links to About.
- **Button**: primary (orange), outline (white with hairline), cart (compact 32px orange pill with a darker orange border, only for "Add to cart"). States: hover, focus (2px outline in `primary`), disabled.
- **Input**: white, hairline border, 8px radius. Focus border is `primary`. Error border is `error` with a short message below.
- **ProductCard**: white card, 8px radius, 1px hairline, 16px padding. Square image (cropped to fill), title (2 lines max), Rating, Price (with old price), "Add to cart" button, FavoriteButton in the top right corner of the image. The image and the title are links when an `href` is given. Takes a `Product` and reports clicks by callbacks, the favorite state comes from the page. Light shadow on hover only.
- **Price**: current price in `heading-lg` `ink`. Old price in `muted`, struck through. Discount badge next to them if there is an old price.
- **Rating**: 5 stars, filled stars in `star`, empty in `hairline`, number and count in `caption` `body`.
- **FavoriteButton**: 36px round icon button with a 20px heart. Outline heart in `body` when not a favorite (turns `primary` on hover), filled heart in `primary` when it is. Controlled: it shows the `active` state it is given and only reports clicks. Not red, red is only for sale and errors.
- **QuantityStepper**: pill with hairline border, minus, count, plus, 32px high. Controlled: it shows the quantity it is given and only reports clicks. Minus is disabled at the minimum.
- **CartItem**: row with the product image, title, category, Rating and a "Remove" text button, then unit Price (with old price), QuantityStepper and row total. On desktop all in one line, on phone the numbers go to a second line.
- **CartList**: vertical list of CartItem.
- **Cart**: white card, 8px radius, 1px hairline, 24px padding. Title "Shopping cart", CartList. Empty state: "Your cart is empty".
- **CartSummary**: white card like Cart. Subtotal, promo code field with an "Apply" button, discount (green, with the code), total in `Price`. Invalid code shows the input error "Promo code not found", an applied code shows a success message.
- **Cart page**: Cart on the left, CartSummary on the right (below on phone). Empty cart: only the empty message and a "Browse catalog" button, no summary.
- **ReviewItem**: one review: author and date in a line, Rating (stars only), title, text. Separated by a hairline.
- **ReviewList**: title "Customer reviews", the average in `display` size with Rating, bars by stars (`star` fill on `hairline`), then ReviewItems. Empty state: "No reviews yet.".
- **ProductRow**: title and ProductCards. One line that scrolls sideways on phone, a grid on desktop.
- **Product page**: image and info (category, title, Rating, Price, description, "Add to cart" or stepper with FavoriteButton) side by side from 640px, then ReviewList and ProductRow "You may also like".
- **Badge**: discount (light red), success (green), neutral (gray), highlight (dark, e.g. "Bazaario's Choice"), deal (solid red, e.g. "Early Black Friday Deal"), save (green with 1px outline, e.g. "Save 5%"), plain (text only, e.g. "5K+ bought in past month").

## Do and Don't

- Do take every color, size and space from the tokens above.
- Do use orange for one main action per card or section.
- Do keep text on orange dark.
- Don't use red for anything except sale and errors.
- Don't add new colors, fonts or radii without changing this file first.
- Don't use shadows on cards at rest.

## Voice

Short, direct, friendly. "Add to cart", "Nothing found, try another word", "Your cart is empty". No exclamation marks in system messages.
