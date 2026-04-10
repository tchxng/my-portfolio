import './style.css'

// ── Hero: word-by-word entrance ──────────────────────────────────────────────
// Split on <br> first to preserve the line break, then animate each word
const heading = document.getElementById('hero-heading')
let wordIndex = 0
heading.innerHTML = heading.innerHTML
  .split(/<br\s*\/?>/)
  .map(line => {
    const words = line.trim().split(/\s+/)
    return words
      .map(word => `<span class="hero-word" style="animation-delay:${(wordIndex++) * 0.07}s">${word}</span>`)
      .join(' ')
  })
  .join('<br>')

// ── Hero: scroll-driven effects ──────────────────────────────────────────────
const heroVideo   = document.getElementById('hero-video')
const heroContent = document.getElementById('hero-content')
const heroSection = document.getElementById('hero')
const decoSvgs = heroSection.querySelectorAll('.deco-svg')

window.addEventListener('scroll', () => {
  const heroHeight = heroSection.offsetHeight
  // progress: 0 at top of hero, 1 when stats section has fully covered it
  const progress = Math.min(window.scrollY / heroHeight, 1)

  // Fade + blur the heading
  heroContent.style.opacity = 1 - progress * 1.8
  heroContent.style.filter  = `blur(${progress * 12}px)`

  // Fade out satellite and saturn SVGs (slower than heading)
  decoSvgs.forEach(svg => {
    svg.style.opacity = Math.max(0, 1 - progress * 1.2)
  })

  // Speed up the starfield video as you scroll
  if (heroVideo) heroVideo.playbackRate = 1 + progress * 5

}, { passive: true })

// Navbar: hide on scroll down, reveal with dark bg on scroll up
const navbar = document.querySelector('header')
let lastScrollY = 0

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY
  const scrollingDown = currentScrollY > lastScrollY

  // Add dark background once user has scrolled away from the top
  navbar.classList.toggle('nav-scrolled', currentScrollY > 50)

  // Hide when scrolling down past 80px, show when scrolling up
  if (scrollingDown && currentScrollY > 80) {
    navbar.classList.add('nav-hidden')
  } else {
    navbar.classList.remove('nav-hidden')
  }

  lastScrollY = currentScrollY
}, { passive: true })

// Mobile menu toggle
const toggle = document.getElementById('menu-toggle')
const menu = document.getElementById('mobile-menu')
const lines = toggle.querySelectorAll('span')

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open')
  toggle.setAttribute('aria-expanded', isOpen)

  // Animate hamburger → X
  if (isOpen) {
    lines[0].style.transform = 'translateY(8px) rotate(45deg)'
    lines[1].style.opacity = '0'
    lines[2].style.transform = 'translateY(-8px) rotate(-45deg)'
  } else {
    lines[0].style.transform = ''
    lines[1].style.opacity = ''
    lines[2].style.transform = ''
  }
})

// ── Stats section: scroll-triggered animations ───────────────────────────────
function countUp(el, target, suffix, duration = 1800) {
  const start = performance.now()
  const update = (now) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(eased * target) + suffix
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

const statsHeader = document.getElementById('stats-header')
const statCards = document.querySelectorAll('.stat-card')
let statsAnimated = false

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || statsAnimated) return
    statsAnimated = true

    // Fade up the header
    statsHeader.classList.add('is-visible')

    // Slide in each stat card with stagger, then count up
    statCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('is-visible')
        const numEl = card.querySelector('.stat-number')
        const target = parseInt(card.dataset.target)
        const suffix = card.dataset.suffix || ''
        countUp(numEl, target, suffix)
      }, 300 + i * 250)
    })
  })
}, { threshold: 0.2 })

statsObserver.observe(document.getElementById('stats'))

// ── Projects section: fade-up header + project cards ─────────────────────────
const projectsHeader = document.getElementById('projects-header')
const projectCards = document.querySelectorAll('.project-card')
let projectsAnimated = false

const projectsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || projectsAnimated) return
    projectsAnimated = true

    projectsHeader.classList.add('is-visible')

    projectCards.forEach((card, i) => {
      setTimeout(() => {
        card.classList.add('is-visible')
      }, 300 + i * 200)
    })
  })
}, { threshold: 0.15 })

projectsObserver.observe(document.getElementById('projects'))

// ── About section ─────────────────────────────────────────────────────────────
const expCards = document.querySelectorAll('.exp-card')
let aboutAnimated = false

const aboutObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || aboutAnimated) return
    aboutAnimated = true

    // Header fades up first
    document.getElementById('about-header').classList.add('is-visible')

    // Photo fades first, then text+buttons together
    setTimeout(() => document.getElementById('about-photo').classList.add('is-visible'), 0)
    setTimeout(() => document.getElementById('about-text').classList.add('is-visible'), 220)

    // Cards stagger after
    expCards.forEach((card, i) => {
      setTimeout(() => card.classList.add('is-visible'), 400 + i * 180)
    })
  })
}, { threshold: 0.1 })

aboutObserver.observe(document.getElementById('about'))

// ── Project card hover: pan+zoom with flicker-free hover-off ─────────────────
document.querySelectorAll('.project-card').forEach(card => {
  const hoverImg = card.querySelector('.project-img-hover')

  card.addEventListener('mouseenter', () => {
    // Clear any frozen transform from previous hover-off
    hoverImg.style.transform = ''
    hoverImg.classList.add('is-panning')
  })

  card.addEventListener('mouseleave', () => {
    // Freeze current transform so image holds position while fading out
    hoverImg.style.transform = getComputedStyle(hoverImg).transform
    hoverImg.classList.remove('is-panning')
    // Clean up inline style after fade completes
    hoverImg.addEventListener('transitionend', () => {
      hoverImg.style.transform = ''
    }, { once: true })
  })
})

// ── Gallery: fade-up header + staggered image reveal ─────────────────────────
const galleryHeader   = document.getElementById('gallery-header')
const galleryImgItems = document.querySelectorAll('.gallery-item')
let galleryHeaderShown = false

const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || galleryHeaderShown) return
    galleryHeaderShown = true
    galleryHeader.classList.add('is-visible')
    galleryImgItems.forEach((item, i) => {
      setTimeout(() => item.classList.add('is-visible'), 300 + i * 80)
    })
  })
}, { threshold: 0.15 })

galleryObserver.observe(document.getElementById('gallery'))

// ── Gallery hover: smooth pan+zoom with fade-back on mouse leave ──────────────
galleryImgItems.forEach(item => {
  const img = item.querySelector('.gallery-img')

  item.addEventListener('mouseenter', () => {
    img.classList.remove('is-resetting')
    img.classList.add('is-panning')
  })

  item.addEventListener('mouseleave', () => {
    img.classList.remove('is-panning')
    img.classList.add('is-resetting')
    img.addEventListener('transitionend', () => {
      img.classList.remove('is-resetting')
    }, { once: true })
  })
})

// ── Lightbox ──────────────────────────────────────────────────────────────────
const lightbox      = document.getElementById('lightbox')
const lightboxImg   = document.getElementById('lightbox-img')
const lightboxClose = document.getElementById('lightbox-close')
const lightboxPrev  = document.getElementById('lightbox-prev')
const lightboxNext  = document.getElementById('lightbox-next')
const galleryItems  = [...document.querySelectorAll('.gallery-item')]
let currentIndex    = 0
let isZoomed        = false
let dragState       = { active: false, startY: 0, transY: 0, didDrag: false }
const ZOOM_SCALE    = 3.5

function clampTransY(transY) {
  if (!isZoomed) return 0
  // How much extra height the scaled image has vs viewport
  const imgH      = lightboxImg.offsetHeight
  const viewH     = window.innerHeight
  const scaledH   = imgH * ZOOM_SCALE
  const maxShift  = Math.max(0, (scaledH - viewH) / 2 / ZOOM_SCALE)
  return Math.max(-maxShift, Math.min(maxShift, transY))
}

function applyTransform() {
  lightboxImg.style.transform = isZoomed
    ? `scale(${ZOOM_SCALE}) translateY(${dragState.transY}px)`
    : 'scale(1) translateY(0)'
}

function resetTransform() {
  isZoomed = false
  dragState.transY = 0
  applyTransform()
  lightboxImg.classList.remove('is-zoomed', 'is-dragging')
}

function openLightbox(index) {
  currentIndex = index
  const img = galleryItems[index].querySelector('img')
  lightboxImg.src = img.src
  lightboxImg.alt = img.alt
  resetTransform()
  lightbox.classList.remove('opacity-0', 'pointer-events-none')
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightbox.classList.add('opacity-0', 'pointer-events-none')
  document.body.style.overflow = ''
  resetTransform()
}

function showPrev() { openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length) }
function showNext() { openLightbox((currentIndex + 1) % galleryItems.length) }

// Click to zoom/unzoom
lightboxImg.addEventListener('click', e => {
  if (dragState.didDrag) return
  e.stopPropagation()
  isZoomed = !isZoomed
  dragState.transY = 0
  applyTransform()
  lightboxImg.classList.toggle('is-zoomed', isZoomed)
})

// Vertical-only drag when zoomed
lightboxImg.addEventListener('pointerdown', e => {
  if (!isZoomed) return
  e.preventDefault()
  dragState.active  = true
  dragState.didDrag = false
  dragState.startY  = e.clientY - dragState.transY * ZOOM_SCALE
  lightboxImg.classList.add('is-dragging')
  lightboxImg.setPointerCapture(e.pointerId)
})

lightboxImg.addEventListener('pointermove', e => {
  if (!dragState.active) return
  dragState.didDrag = true
  const rawTransY = (e.clientY - dragState.startY) / ZOOM_SCALE
  dragState.transY = clampTransY(rawTransY)
  applyTransform()
})

lightboxImg.addEventListener('pointerup', () => {
  dragState.active = false
  lightboxImg.classList.remove('is-dragging')
  setTimeout(() => { dragState.didDrag = false }, 0)
})

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)))
lightboxClose.addEventListener('click', closeLightbox)
lightboxPrev.addEventListener('click', showPrev)
lightboxNext.addEventListener('click', showNext)
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox() })
document.addEventListener('keydown', e => {
  if (lightbox.classList.contains('opacity-0')) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') showPrev()
  if (e.key === 'ArrowRight') showNext()
})

// Close mobile menu when a link is clicked
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggle.click())
})
