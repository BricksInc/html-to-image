/**
 * File copied from: https://github.com/RigoCorp/html-to-image/commit/c858cfd83a46a9e0a0156500211a07dca633a013
 * Not sure if Chrome has fixed this bugs or not
 */

/*
 * For Chromium-based browsers, we replace "font-kerning: auto" with
 * "font-kerning: normal".
 *
 * While rendering HTML in said browsers, "auto" enables kerning for all
 * glyphs, behaving like "normal". When rendering SVG, however, Chromium
 * instead uses a faster, mixed approach where kerning is enabled for pairs of
 * letters, but not for a letter and a space.
 *
 * Without this fix, the rendered width of some nodes might be wider than
 * calculated, resulting in broken layouts.
 *
 * For Firefox, this is not required as it treats "font-kerning" consistently
 * both when rendering HTML and when rendering SVG.
 */
function applyChromiumKerningFix(clonedNode: HTMLElement): void {
  if (clonedNode.style.fontKerning === 'auto') {
    clonedNode.style.fontKerning = 'normal'
  }
}

/*
 * In Chromium-based browsers, if a node has ellipsis text overflow configured
 * (this is, has both "overflow: hidden" and "text-overflow: ellipsis"), but
 * it doesn't really overflow, we'll disable it.
 *
 * Without this fix, rounding errors in the calculated node widths can cause
 * the ellipsis to be displayed in the generated SVG, even if the full text
 * was displayed in the original HTML.
 *
 * For Firefox this is not required, as it seems its calculations are more
 * accurate.
 */
function applyChromiumEllipsisFix(
  nativeNode: HTMLElement,
  clonedNode: HTMLElement,
): void {
  if (
    clonedNode.style.overflow === 'hidden' &&
    clonedNode.style.textOverflow === 'ellipsis' &&
    nativeNode.scrollWidth === nativeNode.clientWidth
  ) {
    clonedNode.style.textOverflow = 'clip'
  }
}

const isChrome = /\bChrome\//.test(window.navigator.userAgent)

export function applyCSSFixes(
  nativeNode: HTMLElement,
  clonedNode: HTMLElement,
): void {
  if (isChrome) {
    applyChromiumKerningFix(clonedNode)
    applyChromiumEllipsisFix(nativeNode, clonedNode)
  }
}
