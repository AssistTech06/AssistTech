/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav-link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav-link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SCROLL SECTIONS ACTIVE LINK & MAGIC LINE ====================*/
const sections = document.querySelectorAll('section[id]')
const navIndicator = document.querySelector('.nav-indicator');

function scrollActive(){
    const scrollY = window.pageYOffset
    let currentSectionId = '';

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 120; // Increased offset to trigger earlier
        const sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            currentSectionId = sectionId;
        }
    })

    // Update active class on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    let activeLinkElement = null;

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').includes(currentSectionId) && currentSectionId !== '') {
            link.classList.add('active-link');
            activeLinkElement = link;
        }
    });

    // Move Magic Line
    moveIndicator(activeLinkElement);
}

function moveIndicator(element) {
    if (element && !element.classList.contains('btn-contact')) {
        // Calculate position relative to nav-list
        // Since nav-link is inside an li, we need to consider that structure or just get offset relative to page?
        // Actually, nav-list is relative. nav-indicator is absolute inside nav-list.
        // We need the element's position relative to nav-list.
        
        // The element is the <a> tag. Its parent is <li>.
        // The <a> tag might have padding.
        
        // Let's get the <a> position relative to the viewport
        const rect = element.getBoundingClientRect();
        const navListRect = document.querySelector('.nav-list').getBoundingClientRect();
        
        const left = rect.left - navListRect.left;
        const width = rect.width;

        navIndicator.style.width = `${width}px`;
        navIndicator.style.transform = `translateX(${left}px)`;
        navIndicator.style.opacity = '1';
    } else {
        // Hide if no active link or if active link is the button
        navIndicator.style.opacity = '0';
        navIndicator.style.width = '0';
    }
}

// Initial check
window.addEventListener('load', scrollActive);
window.addEventListener('resize', scrollActive); // Recalculate on resize
window.addEventListener('scroll', scrollActive);


/*==================== GSAP ANIMATIONS ====================*/
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Animations
const initAnimations = () => {
    try {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP not loaded. Revealing all elements.');
            document.querySelectorAll('.reveal').forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        // 1. Hero Section Animation (Timeline)
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        
        tl.fromTo(".hero-title", 
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.2, delay: 0.2 }
        )
        .fromTo(".hero-subtitle", 
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1 }, 
            "-=0.8"
        )
        .fromTo(".btn-primary.reveal", 
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1 }, 
            "-=0.8"
        )
        .fromTo(".hero-image", 
            { scale: 0.9, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 1.5, ease: "power2.out" }, 
            "-=1"
        );

        // 2. Generic Scroll Reveals (Batching for better performance)
        const sections = document.querySelectorAll('section:not(.hero)');

        sections.forEach(section => {
            const elems = section.querySelectorAll('.reveal');
            
            if(elems.length > 0) {
                gsap.fromTo(elems, 
                    { y: 50, autoAlpha: 0 },
                    {
                        y: 0, 
                        autoAlpha: 1, 
                        duration: 1, 
                        stagger: 0.1, 
                        ease: "power3.out", 
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            toggleActions: "play none none reverse" 
                        }
                    }
                );
            }
        });

        // 3. Service Cards Special Animation
        const serviceCards = document.querySelectorAll('.service-card');
        if(serviceCards.length > 0) {
            gsap.fromTo(serviceCards,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".services-grid",
                        start: "top 85%",
                    }
                }
            );
        }
        
        // 4. Feature Items Special Animation (Why Us)
        const featureItems = document.querySelectorAll('.feature-item');
        if(featureItems.length > 0) {
             gsap.fromTo(featureItems,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".features-grid",
                        start: "top 90%",
                    }
                }
            );
        }
    } catch (error) {
        console.error("GSAP Animation Error:", error);
        // Fallback: show everything
        document.querySelectorAll('.reveal').forEach(el => {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
};

// Run animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
}

/*==================== TYPEWRITER EFFECT ====================*/
const textToType = "Assistance, maintenance et dépannage informatique pour particuliers et petites entreprises.";
const typewriterElement = document.getElementById('typewriter');
let typeIndex = 0;

function typeWriter() {
    if (!typewriterElement) return; // Safety check
    
    if (typeIndex < textToType.length) {
        typewriterElement.innerHTML += textToType.charAt(typeIndex);
        typewriterElement.classList.add('typewriter-text');
        typeIndex++;
        setTimeout(typeWriter, 30); // Typing speed
    }
}

window.addEventListener('load', () => {
    setTimeout(typeWriter, 500); 
});

/*==================== FORCE SCROLL TO TOP ON LOAD ====================*/
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

/*==================== CONTACT FORM HANDLING ====================*/
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        // Formspree / Static Form Handling
        // Remplacer 'https://formspree.io/f/VOTRE_ID_FORMSPREE' par votre propre URL Formspree
        // Créer un compte gratuit sur https://formspree.io/
        const formAction = contactForm.getAttribute('action'); 
        
        // Check if user has updated the URL
        if(formAction.includes('VOTRE_ID_FORMSPREE')) {
            formMessage.style.display = 'block';
            formMessage.textContent = "Pour que le formulaire fonctionne sur GitHub Pages, créez un compte sur formspree.io et remplacez l'URL dans index.html.";
            formMessage.style.backgroundColor = '#dbeafe'; // Blue
            formMessage.style.color = '#1e40af'; // Dark Blue
            
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            return;
        }

        fetch(formAction, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        throw new Error(data.errors.map(error => error["message"]).join(", "));
                    } else {
                        throw new Error("Une erreur est survenue.");
                    }
                });
            }
        })
        .then(data => {
            formMessage.style.display = 'block';
            formMessage.textContent = "Merci ! Votre message a bien été envoyé.";
            formMessage.style.backgroundColor = '#dcfce7'; // Light green
            formMessage.style.color = '#166534'; // Dark green
            contactForm.reset();
        })
        .catch(error => {
            formMessage.style.display = 'block';
            formMessage.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
            console.error(error);
            formMessage.style.backgroundColor = '#fee2e2';
            formMessage.style.color = '#991b1b';
        })
        .finally(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 8000);
        });
    });
}
/*==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Optional: update URL hash without jumping
            history.pushState(null, null, this.getAttribute('href'));
        }
    });
});
