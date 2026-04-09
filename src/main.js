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

// Close mobile menu when a link is clicked
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggle.click())
})
