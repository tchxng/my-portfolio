import './style.css'

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

// Close mobile menu when a link is clicked
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => toggle.click())
})
