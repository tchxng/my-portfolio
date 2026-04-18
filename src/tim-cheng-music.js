import './style.css'

// ── Footer: scale "Tim Cheng" to fill viewport width ─────────────────────────
const footerName = document.getElementById('footer-name')

function fitFooterName() {
  const padding   = 32
  const available = window.innerWidth - padding
  footerName.style.fontSize = '500px'
  footerName.style.fontSize = Math.floor(500 * available / footerName.scrollWidth) + 'px'
}

document.fonts.ready.then(() => {
  fitFooterName()
  window.addEventListener('resize', fitFooterName)
})

// ── Navbar: hide on scroll down, reveal on scroll up ─────────────────────────
const navbar = document.querySelector('header')
let lastScrollY = 0

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY
  const scrollingDown = currentScrollY > lastScrollY

  if (scrollingDown && currentScrollY > 80) {
    navbar.classList.add('nav-hidden')
  } else {
    navbar.classList.remove('nav-hidden')
  }

  lastScrollY = currentScrollY
}, { passive: true })

// ── Mobile menu toggle ────────────────────────────────────────────────────────
const toggle = document.getElementById('menu-toggle')
const menu   = document.getElementById('mobile-menu')
const lines  = toggle.querySelectorAll('span')

toggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open')
  toggle.setAttribute('aria-expanded', isOpen)

  if (isOpen) {
    lines[0].style.transform = 'translateY(8px) rotate(45deg)'
    lines[1].style.opacity   = '0'
    lines[2].style.transform = 'translateY(-8px) rotate(-45deg)'
  } else {
    lines[0].style.transform = ''
    lines[1].style.opacity   = ''
    lines[2].style.transform = ''
  }
})

menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggle.click())
})

// ── Case study sections: fade up on scroll ────────────────────────────────────
const caseSections = document.querySelectorAll('.case-section')

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      sectionObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.08 })

caseSections.forEach(section => {
  section.classList.add('stats-fade-up')
  sectionObserver.observe(section)
})
