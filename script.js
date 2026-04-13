// Navbar functionality
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const themeToggle = document.getElementById('themeToggle');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Hide on scroll navbar functionality + Parallax effect
let lastScrollTop = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show navbar based on scroll direction
            if (currentScroll > 100) {
                if (currentScroll > lastScrollTop) {
                    // Scrolling DOWN - hide navbar
                    navbarElement.classList.add('hide');
                    navbarElement.classList.remove('show');
                } else {
                    // Scrolling UP - show navbar
                    navbarElement.classList.remove('hide');
                    navbarElement.classList.add('show');
                }
            } else {
                // Near top of page - always show
                navbarElement.classList.remove('hide');
                navbarElement.classList.add('show');
            }
            

            
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            ticking = false;
        });
        ticking = true;
    }
});

function setTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('njvcf_theme', theme);
}

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(nextTheme);
});

// Scroll indicator functionality
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

const navbarElement = document.querySelector('.navbar');
const dashboardSection = document.getElementById('dashboard');
const dashboardSidebar = document.getElementById('dashboardSidebar');
const dashboardMenuBtn = document.getElementById('dashboardMenuBtn');
const dashboardNavLinks = document.querySelectorAll('.dashboard-nav-link');
const dashboardPanels = document.querySelectorAll('.dashboard-panel');
const logoutBtn = document.getElementById('logoutBtn');
let isLoggedIn = false;

function formatUserName(raw) {
    let name = raw.trim();
    if (name.includes('@')) {
        name = name.split('@')[0];
    }
    name = name.replace(/\./g, ' ').replace(/_/g, ' ');
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function setDashboardVisibility(show) {
    isLoggedIn = show;
    // Hide ALL public content - dashboard ONLY
    const allPublicSections = ['home', 'campus-news', 'about', 'events', 'gallery', 'login'];
    allPublicSections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = show ? 'none' : '';
    });
    // Hide footer too
    const footer = document.getElementById('footer');
    if (footer) footer.style.display = show ? 'none' : '';
    // Hide scroll indicator if exists
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) scrollIndicator.style.display = show ? 'none' : 'block';

    if (navbarElement && show) {
        navbarElement.style.display = 'none'; // Hide navbar only in dashboard
    }

    if (dashboardSection) {
        dashboardSection.style.display = show ? 'block' : 'none';
    }

    if (!show) {
        loginForm.style.display = 'block';
        loginSuccess.style.display = 'none';
        loginForm.reset();
        setActivePanel('overview');
        hideSidebarDrawer();
        if (navbarElement) {
            navbarElement.style.display = 'flex';
        }
    }
}

function setUserProfile(name) {
    const displayName = formatUserName(name);
    const profileName = document.getElementById('profileName');
    const welcomeName = document.getElementById('welcomeName');
    const profileCourse = document.getElementById('profileCourse');
    const profileId = document.getElementById('profileId');

    if (profileName) profileName.textContent = displayName;
    if (welcomeName) welcomeName.textContent = displayName;
    if (profileCourse) profileCourse.textContent = 'BS Information Technology';
    if (profileId) profileId.textContent = 'Student ID: 20260001';
}

function setActivePanel(panel) {
    dashboardPanels.forEach(card => {
        card.classList.toggle('active', card.id === `${panel}Panel`);
    });
    dashboardNavLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.panel === panel);
    });
}

function hideSidebarDrawer() {
    if (dashboardSidebar) {
        dashboardSidebar.classList.remove('open');
    }
}

function toggleSidebarDrawer() {
    if (dashboardSidebar) {
        dashboardSidebar.classList.toggle('open');
    }
}

if (dashboardMenuBtn) {
    dashboardMenuBtn.addEventListener('click', toggleSidebarDrawer);
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('njvcf_user');
        setDashboardVisibility(false);
        updateNavbar(false);
        if (navbarElement) {
            navbarElement.style.display = 'flex';
        }
        window.dispatchEvent(new Event('resize'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

dashboardNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        setActivePanel(link.dataset.panel);
        if (window.innerWidth <= 768) {
            hideSidebarDrawer();
        }
    });
});

// Album data with photos for each album
const albums = {
    1: {
        name: 'Academic Events',
        photos: [
            'women1.jpg',
            'women2.jpg',
            'women3.jpg',
            'women4.jpg',
            'women7.jpg',

        ]
    },
    2: {
        name: 'Intramurals & Sports Fest',
        photos: [
            'intrams1.jpg',
            'intrams2.jpg',
            'intrams3.jpg',
            'intrams4.jpg',
            'intrams5.jpg'
        ]
    },
    3: {
        name: 'Graduation Day',
        photos: [
            'grad1.jpg',
            'grad2.jpg',
            'grad3.jpg',
            'grad4.jpg',
            'grad5.jpg',
        ]
    },
    4: {
        name: 'Acquaintance Party',
        photos: [
            'acq1.jpg',
            'acq2.jpg',
            'acq3.jpg',
            'acq4.jpg',
            'acq5.jpg'
        ]
    }
};

let currentAlbum = null;
let currentPhotoIndex = 0;

// Album modal functionality
function openAlbum(albumId) {
    currentAlbum = albumId;
    currentPhotoIndex = 0;
    const modal = document.getElementById('albumModal');
    const photosContainer = document.querySelector('.album-photos-container');
    const thumbnailsContainer = document.getElementById('albumThumbnails');
    
    const photos = albums[albumId].photos;
    document.getElementById('totalCount').textContent = photos.length;
    
    // Show first photo
    showPhoto(0);
    
    // Generate thumbnails
    thumbnailsContainer.innerHTML = '';
    photos.forEach((photo, index) => {
        const thumb = document.createElement('img');
        thumb.src = photo;
        thumb.className = 'album-thumbnail' + (index === 0 ? ' active' : '');
        thumb.addEventListener('click', () => showPhoto(index));
        thumbnailsContainer.appendChild(thumb);
    });
    
    modal.classList.add('active');
}

function closeAlbum() {
    const modal = document.getElementById('albumModal');
    modal.classList.remove('active');
    currentAlbum = null;
}

function showPhoto(index) {
    if (!currentAlbum) return;
    const photos = albums[currentAlbum].photos;
    currentPhotoIndex = (index + photos.length) % photos.length;
    
    document.getElementById('albumPhoto').src = photos[currentPhotoIndex];
    document.getElementById('photoCount').textContent = currentPhotoIndex + 1;
    
    // Update active thumbnail
    document.querySelectorAll('.album-thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentPhotoIndex);
    });
}

function nextPhoto() {
    if (currentAlbum) showPhoto(currentPhotoIndex + 1);
}

function prevPhoto() {
    if (currentAlbum) showPhoto(currentPhotoIndex - 1);
}

// Album event listeners
document.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', () => {
        openAlbum(parseInt(card.dataset.album));
    });
});

document.querySelector('.album-modal-close').addEventListener('click', closeAlbum);
document.querySelector('.album-next').addEventListener('click', nextPhoto);
document.querySelector('.album-prev').addEventListener('click', prevPhoto);

document.getElementById('albumModal').addEventListener('click', (e) => {
    if (e.target.id === 'albumModal') closeAlbum();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('albumModal').classList.contains('active')) return;
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'Escape') closeAlbum();
});

// Smooth scrolling for nav links with navbar offset and accessibility
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just '#'
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
                block: 'start'
            });
            
            // Set focus for accessibility
            target.focus({ preventScroll: true });
            
            // Announce to screen readers
            if (target.id) {
                const srAnnounce = document.createElement('div');
                srAnnounce.className = 'sr-only';
                srAnnounce.textContent = `Navigated to ${target.id}`;
                document.body.appendChild(srAnnounce);
                setTimeout(() => srAnnounce.remove(), 1000);
            }
        }
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Reveal animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            // Stop observing after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all reveal elements (including animation variants)
document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right, .reveal-scale').forEach(el => {
    observer.observe(el);
});

// Login form functionality
const loginForm = document.getElementById('loginForm');
const loginSuccess = document.getElementById('loginSuccess');
const forgotPassword = document.getElementById('forgotPassword');
const registerLink = document.querySelector('.register-link');
const dashboardBtn = document.getElementById('dashboardBtn');
const rememberCheck = document.getElementById('remember');

// Simple validation function
function validateLogin(username, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!username || username.trim().length === 0) {
        return { valid: false, message: 'Username or email is required' };
    }
    
    if (!password || password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    if (username.includes('@') && !emailRegex.test(username)) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    // Demo credentials (remove in production)
    if (username === 'student@example.com' && password === 'password123') {
        return { valid: true, message: 'Student login successful' };
    }
    
    return { valid: true, message: 'Login successful' };
}

// Handle form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const validation = validateLogin(username, password);
    
    if (validation.valid) {
        // Store in localStorage if remember me is checked
        if (rememberCheck.checked) {
            localStorage.setItem('njvcf_user', JSON.stringify({
                username: username,
                loggedIn: true,
                timestamp: Date.now()
            }));
        }

        const displayName = username === 'student@example.com' ? 'Lara Jean' : username;

        // Reveal dashboard and hide public pages
        setUserProfile(displayName);
        setDashboardVisibility(true);
        setActivePanel('overview');
        updateNavbar(true, displayName);
        
    } else {
        alert('Error: ' + validation.message);
    }
});

// Update navbar on successful login
function updateNavbar(isLoggedIn, username) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = `Welcome, ${formatUserName(username)}`;
            loginBtn.href = '#';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                setDashboardVisibility(false);
                updateNavbar(false);
            };
        } else {
            loginBtn.textContent = 'Log In';
            loginBtn.href = '#login';
            loginBtn.onclick = null;
        }
    }
}

// Forgot password handler
forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset link sent to your email! (Demo)');
});

// Register link handler
registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Registration coming soon! (Demo)');
});

// Dashboard button
dashboardBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const displayName = username === 'student@example.com' ? 'Lara Jean' : (username || 'Student');
    setUserProfile(displayName);
    setDashboardVisibility(true);
});

// Logout function
function logout() {
    localStorage.removeItem('njvcf_user');
    setDashboardVisibility(false);
    updateNavbar(false);
}

// Check for existing login on page load
// BULLETIN BOARD FUNCTIONALITY - Add before window.load
// Announcement data array - Easy to add new announcements here
const announcements = [
    {id:1, title:"🚨 CLASS SUSPENSION - Typhoon Signal #2", category:"urgent", date:"2026-12-05", details:"All classes suspended today due to Typhoon Signal #2. Remain safe. Normal operations resume tomorrow.", contact:"Registrar Office (075) 123-4567", isNew:true},
    {id:2, title:"📚 ONLINE CLASS SCHEDULE", category:"academic", date:"2026-12-04", details:"Mon - Wed will be face to face and Thu - Sat will be Online", contact:"Ms. Reyes - Registrar", isNew:true},
    {id:3, title:"🎄 Campus Party Dec 21, 5PM Gym", category:"social", date:"2026-12-06", details:"Festive attire. Games, food, performances. Santa hats welcome!", contact:"Student Council", isNew:true},
    {id:4, title:"🏆 Sports Fest Registration Due Dec 10", category:"social", date:"2026-12-07", details:"Basketball, volleyball, badminton. Team registration open now!", contact:"PE Department", isNew:false},
    {id:5, title:"💻 Semi Final Exam Schedule Posted Online", category:"academic", date:"2026-12-08", details:"APRIL 18, 20, 21", contact:"Academic Dean", isNew:false}
];

function renderBulletinGrid(annList = announcements) {
    const grid = document.getElementById('bulletinGrid');
    if (!grid) return;
    
    grid.innerHTML = annList.map(ann => {
        const isUrgent = ann.category === 'urgent';
        const newBadge = ann.isNew ? '<span class="new-badge">NEW</span>' : '';
        return `
            <div class="bulletin-card ${isUrgent ? 'urgent' : ''}" data-id="${ann.id}">
                ${newBadge}
                <span class="bulletin-tag tag-${ann.category}">[${ann.category.toUpperCase()}]</span>
                <h3>${ann.title}</h3>
                <p>${ann.details.substring(0, 100)}...</p>
                <div class="bulletin-date">${ann.date}</div>
            </div>
        `;
    }).join('');
    
    // Modal click listeners
    document.querySelectorAll('.bulletin-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const id = parseInt(card.dataset.id);
            openBulletinModal(id);
        });
    });
}

async function simFetchAnnouncements() {
    const grid = document.getElementById('bulletinGrid');
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Loading campus news...</p></div>';
    
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API
    
    renderBulletinGrid();
}

function openBulletinModal(id) {
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;
    
    document.getElementById('modalTitle').textContent = ann.title;
    document.getElementById('modalCategory').innerHTML = `<span class="bulletin-tag tag-${ann.category}">[${ann.category.toUpperCase()}]</span>`;
    document.getElementById('modalDate').textContent = ann.date;
    document.getElementById('modalContent').textContent = ann.details;
    document.getElementById('modalContact').innerHTML = `<strong>Contact:</strong> ${ann.contact}`;
    document.getElementById('bulletinModal').classList.add('active');
}

function closeBulletinModal() {
    document.getElementById('bulletinModal').classList.remove('active');
}

async function filterBulletin(category) {
    const grid = document.getElementById('bulletinGrid');
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div><p>Loading announcements...</p></div>';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const filtered = category === 'all' ? announcements : announcements.filter(a => a.category === category);
    renderBulletinGrid(filtered);
    
    // Active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
}

// BULLETIN INIT with loading
document.addEventListener('DOMContentLoaded', async () => {
    // Filter buttons
    document.querySelectorAll('.filter-btn')?.forEach(btn => {
        btn.addEventListener('click', () => filterBulletin(btn.dataset.category));
    });
    
    // Modal close
    const closeBtn = document.querySelector('.bulletin-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeBulletinModal);
    
    const modal = document.getElementById('bulletinModal');
    if (modal) modal.addEventListener('click', e => e.target.id === 'bulletinModal' && closeBulletinModal());
    
    // Initial load with spinner
    await simFetchAnnouncements();
});

// Check for existing login on page load
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('njvcf_theme') || 'light';
    setTheme(savedTheme);

    // Initialize hero quotes rotator
    const quotes = document.querySelectorAll('.hero-quotes .quote');
    let currentQuote = 0;
    
    function showNextQuote() {
        quotes[currentQuote].classList.remove('active');
        currentQuote = (currentQuote + 1) % quotes.length;
        quotes[currentQuote].classList.add('active');
    }
    
    if (quotes.length > 0) {
        quotes.forEach((quote, index) => {
            if (index !== 0) quote.classList.remove('active');
        });
        setInterval(showNextQuote, 6000);
    }
    
    // Check for existing login
    const userData = localStorage.getItem('njvcf_user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (Date.now() - user.timestamp < 30 * 24 * 60 * 60 * 1000) { // 30 days
                setUserProfile(user.username);
                setDashboardVisibility(true);
                setActivePanel('overview');
                updateNavbar(true, user.username);
            }
        } catch (e) {
            localStorage.removeItem('njvcf_user');
        }
    }
});
