// Wait for jsPDF to be available
window.jsPDF = window.jspdf.jsPDF;

// ==================== PROFILE PICTURE LOADER ====================
function loadProfilePicture() {
    const profileImage = document.getElementById('profileImage');
    const initialsPlaceholder = document.getElementById('initialsPlaceholder');
    
    if (!profileImage) return;
    
    // Your actual GitHub image URL
    const imageUrl = 'https://raw.githubusercontent.com/MervinSwaswa/portfolio/main/WhatsApp%20Image%202026-01-02%20at%2011.59.32.jpeg';
    
    console.log('Loading profile picture from:', imageUrl);
    
    // Set the image source
    profileImage.src = imageUrl;
    
    // Hide initials placeholder
    if (initialsPlaceholder) {
        initialsPlaceholder.style.display = 'none';
    }
    
    // Handle successful image load
    profileImage.onload = function() {
        console.log('✅ Profile picture loaded successfully');
        profileImage.style.opacity = '1';
        
        // Ensure the image is visible
        profileImage.style.display = 'block';
        if (initialsPlaceholder) {
            initialsPlaceholder.style.display = 'none';
        }
    };
    
    // Handle image error
    profileImage.onerror = function() {
        console.log('❌ Failed to load profile picture, showing fallback');
        
        // Hide the broken image
        profileImage.style.display = 'none';
        
        // Show initials placeholder
        if (initialsPlaceholder) {
            initialsPlaceholder.style.display = 'flex';
            initialsPlaceholder.style.alignItems = 'center';
            initialsPlaceholder.style.justifyContent = 'center';
            initialsPlaceholder.style.width = '100%';
            initialsPlaceholder.style.height = '100%';
            initialsPlaceholder.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
            initialsPlaceholder.style.color = 'white';
            initialsPlaceholder.style.fontSize = '120px';
            initialsPlaceholder.style.fontWeight = 'bold';
            initialsPlaceholder.style.fontFamily = "'Poppins', sans-serif";
            initialsPlaceholder.style.borderRadius = '50%';
            initialsPlaceholder.style.position = 'absolute';
            initialsPlaceholder.style.top = '0';
            initialsPlaceholder.style.left = '0';
        }
    };
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip download button and WhatsApp links
        if (href === '#downloadCV' || href.includes('wa.me') || href.includes('mailto:') || href.includes('tel:')) return;
        
        e.preventDefault();
        const targetId = href;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            // Skip hidden cards that haven't been loaded yet
            if (card.classList.contains('hidden') && !card.classList.contains('loaded')) {
                return;
            }
            
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Load More Projects Functionality
const loadMoreBtn = document.getElementById('loadMoreBtn');
const hiddenProjects = document.querySelectorAll('.project-card.hidden');
let projectsLoaded = 0;
const projectsPerLoad = 3;

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Show loading state
        const originalText = loadMoreBtn.innerHTML;
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Load projects after a short delay for better UX
        setTimeout(() => {
            // Load projects
            const projectsToLoad = Math.min(projectsPerLoad, hiddenProjects.length - projectsLoaded);
            
            for (let i = projectsLoaded; i < projectsLoaded + projectsToLoad; i++) {
                if (hiddenProjects[i]) {
                    hiddenProjects[i].classList.remove('hidden');
                    hiddenProjects[i].classList.add('loaded', 'fade-in');
                    
                    // Force reflow to trigger animation
                    hiddenProjects[i].offsetHeight;
                    
                    // Show based on current filter
                    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                    const cardCategory = hiddenProjects[i].getAttribute('data-category');
                    
                    if (activeFilter === 'all' || activeFilter === cardCategory) {
                        hiddenProjects[i].style.display = 'block';
                    } else {
                        hiddenProjects[i].style.display = 'none';
                    }
                }
            }
            
            projectsLoaded += projectsToLoad;
            
            // Update button text or hide if all projects loaded
            if (projectsLoaded >= hiddenProjects.length) {
                loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Projects Loaded';
                loadMoreBtn.style.opacity = '0.7';
                loadMoreBtn.style.cursor = 'default';
                loadMoreBtn.disabled = true;
            } else {
                loadMoreBtn.innerHTML = originalText;
                loadMoreBtn.disabled = false;
            }
        }, 500); // Small delay for better UX
    });
}

// Animate skill bars when in viewport
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.8) && 
                         (rect.bottom >= window.innerHeight * 0.2);
        
        if (isVisible && !bar.classList.contains('animated')) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
            bar.classList.add('animated');
        }
    });
}

// Animate skill bars on scroll
window.addEventListener('scroll', animateSkillBars);

// Animate skill bars on initial load if already in view
setTimeout(animateSkillBars, 100);

// Download PDF CV with Complete Information
document.getElementById('downloadCV').addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Show loading state
    const originalText = this.innerHTML;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating CV...';
    this.style.pointerEvents = 'none';
    
    try {
        // Create a new jsPDF instance
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Set document properties
        doc.setProperties({
            title: 'Mervin Swaswa - ICT Professional CV',
            subject: 'Professional CV - ICT Specialist',
            author: 'Mervin Swaswa',
            keywords: 'cv, resume, ICT professional, software developer, data analyst, Zambia',
            creator: 'Mervin Swaswa Portfolio'
        });
        
        // Colors
        const primaryColor = [99, 102, 241];
        const secondaryColor = [30, 58, 138];
        const lightBg = [246, 248, 252];
        const darkText = [30, 41, 59];
        const grayText = [100, 116, 139];
        
        // Add background color
        doc.setFillColor(...lightBg);
        doc.rect(0, 0, 210, 297, 'F');
        
        // ==================== HEADER SECTION ====================
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 35, 'F');

        // Name and Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('MERVIN SWASWA', 105, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('ICT Professional | Software Developer | Data Analyst', 105, 22, { align: 'center' });

        // Contact Information
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        
        // First line of contact info
        doc.text('Location: Zimba Main Post, Zimba, Zambia', 20, 30);
        doc.text('Phone: +260 974 000 337', 105, 30, { align: 'center' });
        doc.text('WhatsApp: +260 974 000 337', 190, 30, { align: 'right' });

        // Second line of contact info
        doc.text('Email: marvinswaswa@gmail.com', 20, 35);

        // Add decorative line
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(15, 45, 195, 45);
        
        // ==================== PROFESSIONAL SUMMARY ====================
        let currentY = 55;
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL SUMMARY', 15, currentY);
        doc.setDrawColor(...secondaryColor);
        doc.line(15, currentY + 1, 60, currentY + 1);
        
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const summaryText = `A highly motivated and detail-oriented Information and Communication Technology (ICT) professional with over 10 years of proven experience in software development, data analysis, electoral operations, health information systems, and public sector ICT support. Demonstrated success working with government agencies, health institutions, and national electoral bodies in roles requiring integrity, precision, and professionalism.
        
Currently pursuing a Bachelor of Science in Computer Science at the University of the People (UoPeople) and a Bachelor's in Information Technology at Kopaline University, combining strong academic development with deep hands-on expertise. Committed to innovation, accountability, and national service.`;
        
        const splitSummary = doc.splitTextToSize(summaryText, 180);
        doc.text(splitSummary, 15, currentY + 10);
        currentY += (splitSummary.length * 5) + 15;
        
        // ==================== CORE COMPETENCIES ====================
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CORE COMPETENCIES', 15, currentY);
        doc.setDrawColor(...secondaryColor);
        doc.line(15, currentY + 1, 60, currentY + 1);
        
        doc.setTextColor(...darkText);
        doc.setFontSize(9);
        
        const competencies = [
            '• ICT Infrastructure Setup & Support (LAN/WAN, VPN, Firewalls)',
            '• Biometric Voter Registration & Electoral Operations',
            '• Data Analysis, Reporting & Visualization (SQL, Power BI, Tableau)',
            '• SmartCare & Health Information Systems (Ministry of Health)',
            '• Web & Software Development (Java, C#, PHP, .NET, HTML)',
            '• Public Sector Administration & Records Management',
            '• Technical Training & End-User Support'
        ];
        
        competencies.forEach((comp, index) => {
            doc.text(comp, 20, currentY + 10 + (index * 5));
        });
        
        // ==================== EDUCATION ====================
        const educationY = currentY + 45;
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('EDUCATION', 15, educationY);
        doc.line(15, educationY + 1, 45, educationY + 1);
        
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Bachelor of Science in Computer Science (In Progress)', 15, educationY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text('University of the People (UoPeople) – Remote', 15, educationY + 15);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Bachelor of Information Technology (In Progress)', 15, educationY + 25);
        doc.setFont('helvetica', 'normal');
        doc.text('Kopaline University – Zambia', 15, educationY + 30);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Foundation Diploma in Management of Information Systems', 15, educationY + 40);
        doc.setFont('helvetica', 'normal');
        doc.text('British Computer Society (BCS), UK – 2014–2015', 15, educationY + 45);
        
        const diplomaModules = [
            '• e-Technology',
            '• Practical Use of Software', 
            '• Organizational Practice'
        ];
        
        diplomaModules.forEach((module, index) => {
            doc.text(module, 20, educationY + 55 + (index * 5));
        });
        
        // ==================== PROFESSIONAL EXPERIENCE ====================
        doc.addPage();
        currentY = 20;
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL EXPERIENCE', 15, currentY);
        doc.line(15, currentY + 1, 70, currentY + 1);
        
        currentY += 15;
        
        // Ministry of Health
        doc.setTextColor(...darkText);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Ministry of Health – Zimba Mission Hospital', 15, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Medical Records Clerk | 2021 – Present', 15, currentY + 5);
        
        const mohResponsibilities = [
            '• Manage electronic patient records using SmartCare system',
            '• Maintain and troubleshoot ICT infrastructure for healthcare delivery',
            '• Generate and analyze patient data for reporting and planning'
        ];
        
        mohResponsibilities.forEach((resp, index) => {
            doc.text(resp, 20, currentY + 15 + (index * 5));
        });
        
        currentY += 35;
        
        // Zambia Statistical Agency
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Zambia Statistical Agency (ZamStats)', 15, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Zonal Census Coordinator | 2021', 15, currentY + 5);
        
        const zamstatsResponsibilities = [
            '• Oversaw district-level census operations in Zimba',
            '• Trained and managed over 50 field enumerators',
            '• Ensured compliance with national statistical methodologies'
        ];
        
        zamstatsResponsibilities.forEach((resp, index) => {
            doc.text(resp, 20, currentY + 15 + (index * 5));
        });
        
        currentY += 30;
        
        // Electoral Commission of Zambia
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Electoral Commission of Zambia (ECZ)', 15, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Field Staff – Multiple Roles | 2006 – 2021', 15, currentY + 5);
        
        const eczResponsibilities = [
            '• Assistant Registration Officer Field (AROF): Captured biometric voter data',
            '• Polling Assistant: Managed polling logistics and supported voters',
            '• Inspection Officer: Conducted voter register inspections',
            '• Delivered high-integrity electoral services in multiple elections'
        ];
        
        eczResponsibilities.forEach((resp, index) => {
            doc.text(resp, 20, currentY + 15 + (index * 5));
        });
        
        currentY += 35;
        
        // Shoprite Zambia
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Shoprite Zambia – Livingstone Branch', 15, currentY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Receiving Admin Clerk & Data Capture Clerk | 2005 – 2010', 15, currentY + 5);
        
        const shopriteResponsibilities = [
            '• Processed inventory and reconciled stock records',
            '• Trained staff on data capture procedures and tools'
        ];
        
        shopriteResponsibilities.forEach((resp, index) => {
            doc.text(resp, 20, currentY + 15 + (index * 5));
        });
        
        // ==================== TECHNICAL SKILLS ====================
        doc.addPage();
        currentY = 20;
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('TECHNICAL SKILLS', 15, currentY);
        doc.line(15, currentY + 1, 55, currentY + 1);
        
        currentY += 10;
        
        // Skills columns
        const leftColumnX = 20;
        const rightColumnX = 110;
        
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Programming Languages:', leftColumnX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text('React, Node JS, TypeScript, JavaScript, JSON, Java, C#, PHP', leftColumnX, currentY + 5);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Databases:', leftColumnX, currentY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text('SQL, Oracle, PostgreSQL, MySQL, Microsoft Access, SQL Server', leftColumnX, currentY + 20);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Operating Systems:', leftColumnX, currentY + 30);
        doc.setFont('helvetica', 'normal');
        doc.text('SmartCare, Windows Server, Linux, macOS', leftColumnX, currentY + 35);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Networking:', leftColumnX, currentY + 45);
        doc.setFont('helvetica', 'normal');
        doc.text('TCP/IP, LAN/WAN, VPN, Firewalls', leftColumnX, currentY + 50);
        
        // Right column
        doc.setFont('helvetica', 'bold');
        doc.text('Data Analysis Tools:', rightColumnX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text('Power BI, Tableau, Excel (Advanced), Python', rightColumnX, currentY + 5);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Other Software:', rightColumnX, currentY + 15);
        doc.setFont('helvetica', 'normal');
        doc.text('Microsoft Word, PowerPoint, Publisher, .NET Framework', rightColumnX, currentY + 20);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Methodologies:', rightColumnX, currentY + 30);
        doc.setFont('helvetica', 'normal');
        doc.text('Agile, Waterfall, SDLC', rightColumnX, currentY + 35);
        
        doc.setFont('helvetica', 'bold');
        doc.text('Cloud Platforms:', rightColumnX, currentY + 45);
        doc.setFont('helvetica', 'normal');
        doc.text('AWS, Azure (Basic Knowledge)', rightColumnX, currentY + 50);
        
        // ==================== CERTIFICATIONS & AWARDS ====================
        currentY += 65;
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICATIONS & AWARDS', 15, currentY);
        doc.line(15, currentY + 1, 80, currentY + 1);
        
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const certifications = [
            '• Certificate of Service – ECZ (AROF & Polling Assistant)',
            '• Labour Day Award – Excellence in Innovation',
            '• SQL for Data Science – Online Credential',
            '• Fundamentals of Data Analysis – Online Program',
            '• British Computer Society (BCS) Foundation Diploma',
            '• Networking Academy (Cisco Networking Academy) Introduction to Cybersecurity',
            '• ICT Infrastructure Management Certificate'
        ];
        
        certifications.forEach((cert, index) => {
            doc.text(cert, 20, currentY + 10 + (index * 5));
        });
        
        // ==================== PROFESSIONAL MEMBERSHIPS ====================
        currentY += 45;
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL MEMBERSHIPS', 15, currentY);
        doc.line(15, currentY + 1, 80, currentY + 1);
        
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        doc.text('• Affiliate Member – ICT Association of Zambia (ICTAZ)', 20, currentY + 10);
        doc.text('• Member – British Computer Society (BCS), The Chartered Institute for IT', 20, currentY + 15);
        
        // ==================== REFERENCES ====================
        currentY += 35;
        
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('REFERENCES', 15, currentY);
        doc.line(15, currentY + 1, 50, currentY + 1);
        
        doc.setTextColor(...darkText);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        const references = [
            { name: 'Robson Mulamfu', position: 'District Commissioner – Zimba', phone: '0977 114 275' },
            { name: 'Muchanga Maimpa', position: 'HR Officer – Zimba Mission Hospital', phone: '0979 869 775' },
            { name: 'John Nkhosi', position: 'Lecturer – LIBES', phone: '0977 691 859' },
            { name: 'Mr. Edgar Phiri', position: 'Central Statistics Office', phone: '0977 639 368' },
            { name: 'Mr. Malaya', position: 'Shoprite Zambia', phone: '0977 441 195' }
        ];
        
        references.forEach((ref, index) => {
            const refY = currentY + 10 + (index * 20);
            doc.setFont('helvetica', 'bold');
            doc.text(ref.name, 20, refY);
            doc.setFont('helvetica', 'normal');
            doc.text(ref.position, 20, refY + 5);
            doc.text(ref.phone, 20, refY + 10);
        });
        
        // ==================== FOOTER ====================
        doc.setFillColor(...primaryColor);
        doc.rect(0, 280, 210, 17, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('© 2026 Mervin Swaswa | ICT Professional | Full Stack Developer | Data Analyst', 105, 286, { align: 'center' });
        doc.text('Phone: +260 974 000 337 | Email: marvinswaswa@gmail.com | Location: Zimba, Zambia', 105, 290, { align: 'center' });
        
        // Add page numbers
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(...grayText);
            doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: 'right' });
        }
        
        // Save the PDF
        doc.save('Mervin_Swaswa_ICT_Professional_CV.pdf');
        
        // Show success message
        alert('The CV has been downloaded successfully!');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('There was an error generating the CV. Please try again.');
    } finally {
        // Restore button state
        this.innerHTML = originalText;
        this.style.pointerEvents = 'auto';
    }
});

// ==================== Rating System (Local Storage Version) ====================
function initializeStarRating() {
    const stars = document.querySelectorAll('.stars-input .star');
    const ratingInput = document.getElementById('ratingValue');
    const ratingText = document.querySelector('.rating-text');
    
    if (!stars.length || !ratingInput || !ratingText) {
        console.log('Star rating elements not found');
        return;
    }
    
    // Rating descriptions
    const ratingDescriptions = [
        'Poor - Needs improvement',
        'Fair - Below average', 
        'Good - Meets expectations',
        'Very Good - Exceeds expectations',
        'Excellent - Outstanding work'
    ];
    
    let currentRating = 0;
    
    // Function to update star display
    function updateStars() {
        stars.forEach(star => {
            const value = parseInt(star.getAttribute('data-value'));
            const icon = star.querySelector('i');
            
            // Remove all classes first
            star.classList.remove('active');
            icon.classList.remove('fas', 'far');
            
            // Set appropriate classes
            if (value <= currentRating) {
                star.classList.add('active');
                icon.classList.add('fas');
                icon.classList.remove('far');
            } else {
                icon.classList.add('far');
                icon.classList.remove('fas');
            }
        });
        
        // Update rating text
        if (currentRating > 0) {
            ratingText.textContent = ratingDescriptions[currentRating - 1] || `Rated ${currentRating} star${currentRating > 1 ? 's' : ''}`;
            ratingText.style.color = '#ffc107';
            ratingText.style.fontWeight = '600';
        } else {
            ratingText.textContent = 'Click stars to rate';
            ratingText.style.color = '';
            ratingText.style.fontWeight = '';
        }
    }
    
    // Click event for stars
    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const value = parseInt(star.getAttribute('data-value'));
            currentRating = value;
            ratingInput.value = value;
            
            updateStars();
            
            // Visual feedback
            star.style.animation = 'starClick 0.3s ease';
            setTimeout(() => {
                star.style.animation = '';
            }, 300);
        });
        
        // Hover effects
        star.addEventListener('mouseenter', () => {
            const value = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                const sValue = parseInt(s.getAttribute('data-value'));
                const icon = s.querySelector('i');
                if (sValue <= value) {
                    icon.style.color = '#ffc107';
                    icon.style.opacity = '0.8';
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                const icon = s.querySelector('i');
                icon.style.opacity = '1';
                updateStars();
            });
        });
    });
    
    // Handle form reset
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('reset', () => {
            setTimeout(() => {
                currentRating = 0;
                ratingInput.value = 0;
                updateStars();
            }, 10);
        });
    }
}

// Review Form Submission (Local Storage Version)
function initializeReviewForm() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;
    
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('reviewerName').value.trim();
        const role = document.getElementById('reviewerRole').value.trim();
        const rating = parseInt(document.getElementById('ratingValue').value);
        const title = document.getElementById('reviewTitle').value.trim();
        const text = document.getElementById('reviewText').value.trim();
        
        // Validation
        if (!validateReviewForm(name, rating, text)) {
            return;
        }
        
        // Create review object
        const review = {
            id: Date.now(),
            name: name,
            role: role || 'Client',
            rating: rating,
            title: title || 'Great Experience',
            text: text,
            date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            }),
            timestamp: Date.now()
        };
        
        // Save to localStorage
        saveReviewToLocal(review);
        
        // Add to UI
        addReviewToUI(review);
        
        // Update statistics
        updateRatingStats();
        
        // Show success message
        showSuccessMessage('Thank you for your review!');
        
        // Reset form
        setTimeout(() => {
            reviewForm.reset();
            resetStarRating();
        }, 1500);
    });
}

function validateReviewForm(name, rating, text) {
    if (!name || name.length < 2) {
        alert('Please enter your name (at least 2 characters).');
        return false;
    }
    
    if (!rating || rating < 1) {
        alert('Please select a rating by clicking the stars.');
        return false;
    }
    
    if (!text || text.length < 10) {
        alert('Please write a review (at least 10 characters).');
        return false;
    }
    
    return true;
}

function saveReviewToLocal(review) {
    try {
        let reviews = JSON.parse(localStorage.getItem('mervinReviews')) || [];
        reviews.unshift(review);
        localStorage.setItem('mervinReviews', JSON.stringify(reviews));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadReviewsFromLocal() {
    try {
        const reviews = JSON.parse(localStorage.getItem('mervinReviews')) || [];
        // Add sample reviews if none exist
        if (reviews.length === 0) {
            const sampleReviews = [
                {
                    id: 1,
                    name: "John Nkhosi",
                    role: "Lecturer - LIBES",
                    rating: 5,
                    title: "Excellent ICT Support",
                    text: "Mervin provided exceptional ICT infrastructure setup for our institution. His professionalism and technical expertise are remarkable.",
                    date: "2 weeks ago",
                    timestamp: Date.now() - (14 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 2,
                    name: "Muchanga Maimpa",
                    role: "HR Officer - Zimba Mission Hospital",
                    rating: 5,
                    title: "Reliable Health Systems Expert",
                    text: "Mervin's work on our SmartCare system implementation was outstanding. He consistently delivers high-quality work on time.",
                    date: "1 month ago",
                    timestamp: Date.now() - (30 * 24 * 60 * 60 * 1000)
                },
                {
                    id: 3,
                    name: "Robson Mulamfu",
                    role: "District Commissioner - Zimba",
                    rating: 4,
                    title: "Excellent Public Sector ICT Work",
                    text: "Mervin handled our district's data management system with great competence. Highly recommended for government projects.",
                    date: "2 months ago",
                    timestamp: Date.now() - (60 * 24 * 60 * 60 * 1000)
                }
            ];
            localStorage.setItem('mervinReviews', JSON.stringify(sampleReviews));
            updateReviewsUI(sampleReviews);
            updateRatingStats(sampleReviews);
        } else {
            updateReviewsUI(reviews);
            updateRatingStats(reviews);
        }
        return reviews;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}

function addReviewToUI(review) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;
    
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    
    // Create stars HTML
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += i <= review.rating 
            ? '<i class="fas fa-star"></i>' 
            : '<i class="far fa-star"></i>';
    }
    
    // Format date
    const timeAgo = getTimeAgo(review.timestamp);
    
    reviewCard.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <div class="reviewer-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <h4 class="reviewer-name">${escapeHTML(review.name)}</h4>
                    <p class="reviewer-role">${escapeHTML(review.role)}</p>
                </div>
            </div>
            <div class="review-rating">
                <div class="stars" data-rating="${review.rating}">
                    ${starsHTML}
                </div>
                <span class="review-date">${timeAgo}</span>
            </div>
        </div>
        <h5 class="review-title">${escapeHTML(review.title)}</h5>
        <p class="review-text">${escapeHTML(review.text)}</p>
    `;
    
    // Insert at the beginning
    reviewsGrid.insertBefore(reviewCard, reviewsGrid.firstChild);
}

function updateReviewsUI(reviews) {
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (!reviewsGrid) return;
    
    // Clear existing reviews
    reviewsGrid.innerHTML = '';
    
    // Sort by timestamp (newest first)
    const sortedReviews = [...reviews].sort((a, b) => b.timestamp - a.timestamp);
    
    // Add reviews to UI
    sortedReviews.forEach(review => {
        addReviewToUI(review);
    });
}

function updateRatingStats(reviews = null) {
    const allReviews = reviews || JSON.parse(localStorage.getItem('mervinReviews')) || [];
    
    if (allReviews.length === 0) {
        // Set default values if no reviews
        const ratingNumber = document.querySelector('.rating-number');
        const reviewCount = document.querySelector('.review-count');
        if (ratingNumber) ratingNumber.textContent = '4.8';
        if (reviewCount) reviewCount.textContent = '24';
        return;
    }
    
    // Calculate average rating
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    // Calculate distribution
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(review => {
        distribution[review.rating]++;
    });
    
    // Update UI
    updateRatingUI(averageRating, allReviews.length, distribution);
}

function updateRatingUI(average, count, distribution) {
    // Update average rating
    const ratingNumber = document.querySelector('.rating-number');
    const reviewCount = document.querySelector('.review-count');
    
    if (ratingNumber) ratingNumber.textContent = average.toFixed(1);
    if (reviewCount) reviewCount.textContent = count;
    
    // Update stars display
    const starsContainer = document.querySelector('.rating-stars-large .stars');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        const fullStars = Math.floor(average);
        const hasHalfStar = average % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= fullStars) {
                star.className = 'fas fa-star';
            } else if (i === fullStars + 1 && hasHalfStar) {
                star.className = 'fas fa-star-half-alt';
            } else {
                star.className = 'far fa-star';
            }
            starsContainer.appendChild(star);
        }
    }
    
    // Update distribution bars
    for (let stars = 5; stars >= 1; stars--) {
        const percent = (distribution[stars] / count) * 100 || 0;
        const fill = document.querySelector(`.distribution-item:nth-child(${6-stars}) .distribution-fill`);
        const percentSpan = document.querySelector(`.distribution-item:nth-child(${6-stars}) .distribution-percent`);
        
        if (fill) {
            fill.style.width = `${percent}%`;
            fill.style.transition = 'width 1s ease-in-out';
        }
        if (percentSpan) {
            percentSpan.textContent = `${Math.round(percent)}%`;
        }
    }
}

function resetStarRating() {
    const stars = document.querySelectorAll('.stars-input .star');
    const ratingInput = document.getElementById('ratingValue');
    const ratingText = document.querySelector('.rating-text');
    
    if (ratingInput) ratingInput.value = '0';
    if (ratingText) {
        ratingText.textContent = 'Click stars to rate';
        ratingText.style.color = '';
        ratingText.style.fontWeight = '';
    }
    
    stars.forEach(star => {
        star.classList.remove('active');
        const icon = star.querySelector('i');
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.style.color = '';
    });
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        // Remove existing success messages
        const existingMessages = reviewForm.querySelectorAll('.success-message');
        existingMessages.forEach(msg => msg.remove());
        
        reviewForm.appendChild(successDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 7) {
        return `${days} day${days === 1 ? '' : 's'} ago`;
    } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} month${months === 1 ? '' : 's'} ago`;
    } else {
        const years = Math.floor(days / 365);
        return `${years} year${years === 1 ? '' : 's'} ago`;
    }
}

// ==================== WhatsApp Inquiry Form ====================
function initializeWhatsAppForm() {
    const form = document.getElementById('projectInquiryForm');
    if (!form) {
        console.error('WhatsApp form not found!');
        return;
    }

    console.log('WhatsApp form found, initializing...');

    // Remove any existing event listeners first
    const formClone = form.cloneNode(true);
    form.parentNode.replaceChild(formClone, form);

    // Get the new form reference
    const newForm = document.getElementById('projectInquiryForm');

    // Add new form submission handler
    newForm.addEventListener('submit', handleWhatsAppFormSubmit);

    // Add input validation for phone number
    const phoneInput = document.getElementById('clientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove all non-digit characters except +
            let value = e.target.value.replace(/[^\d+]/g, '');
            
            // Ensure it starts with +
            if (!value.startsWith('+')) {
                value = '+' + value.replace(/[^\d]/g, '');
            }
            
            // Limit to 13 characters (max for +260XXXXXXXXX)
            if (value.length > 13) {
                value = value.substring(0, 13);
            }
            
            e.target.value = value;
        });
    }

    console.log('WhatsApp form initialized successfully');
}

function handleWhatsAppFormSubmit(e) {
    e.preventDefault();
    console.log('Form submitted - handleWhatsAppFormSubmit called');
    
    // Validate form
    if (!validateWhatsAppForm()) {
        return;
    }
    
    // Get form data
    const formData = getWhatsAppFormData();
    console.log('Form data collected:', formData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing WhatsApp Message...';
    submitBtn.disabled = true;
    
    try {
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppMessage(formData);
        console.log('WhatsApp message created');
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Create WhatsApp URL - Use the phone number from form or default
        const phoneNumber = formData.phone || '260974000337';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        console.log('Opening WhatsApp URL:', whatsappUrl);
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
        
        // Save inquiry to localStorage
        saveInquiry(formData);
        
        // Show success message
        showInquiryFormMessage('✅ Your inquiry has been prepared! WhatsApp is opening with your message. Please click send to complete the process.', 'success');
        
        // Reset form after 2 seconds
        setTimeout(() => {
            const form = document.getElementById('projectInquiryForm');
            if (form) {
                form.reset();
            }
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                const messageDiv = document.getElementById('formMessage');
                if (messageDiv) {
                    messageDiv.style.display = 'none';
                }
            }, 5000);
        }, 2000);
        
    } catch (error) {
        console.error('Error processing form:', error);
        showInquiryFormMessage('❌ There was an error preparing your message. Please try again.', 'error');
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function validateWhatsAppForm() {
    const name = document.getElementById('clientName');
    const phone = document.getElementById('clientPhone');
    const budget = document.getElementById('projectBudget');
    const projectType = document.getElementById('projectType');
    const timeline = document.getElementById('projectTimeline');
    const details = document.getElementById('projectDetails');
    const terms = document.getElementById('termsAgree');
    
    console.log('Validating form fields...');
    
    // Clear any previous messages
    const messageDiv = document.getElementById('formMessage');
    if (messageDiv) {
        messageDiv.style.display = 'none';
    }
    
    // Basic validation
    if (!name || !name.value || name.value.trim().length < 2) {
        showInquiryFormMessage('Please enter your full name (at least 2 characters).', 'error');
        name?.focus();
        return false;
    }
    
    // Phone validation - accept full international format (+260XXXXXXXXX)
    const phoneValue = phone?.value?.trim() || '';
    console.log('Phone value:', phoneValue);
    
    if (!phoneValue) {
        showInquiryFormMessage('Please enter your WhatsApp number with country code (e.g., +260974000337).', 'error');
        phone?.focus();
        return false;
    }
    
    // Validate phone format: + followed by 9-13 digits (including country code)
    const phoneRegex = /^\+[1-9]\d{9,12}$/;
    if (!phoneRegex.test(phoneValue)) {
        showInquiryFormMessage('Please enter a valid WhatsApp number with country code (e.g., +260974000337).', 'error');
        phone?.focus();
        return false;
    }
    
    if (!budget || !budget.value) {
        showInquiryFormMessage('Please select a budget range.', 'error');
        budget?.focus();
        return false;
    }
    
    if (!projectType || !projectType.value) {
        showInquiryFormMessage('Please select a project type.', 'error');
        projectType?.focus();
        return false;
    }
    
    if (!timeline || !timeline.value) {
        showInquiryFormMessage('Please select a project timeline.', 'error');
        timeline?.focus();
        return false;
    }
    
    if (!details || !details.value || details.value.trim().length < 10) {
        showInquiryFormMessage('Please provide more details about your project (at least 10 characters).', 'error');
        details?.focus();
        return false;
    }
    
    if (!terms || !terms.checked) {
        showInquiryFormMessage('Please agree to be contacted via WhatsApp.', 'error');
        return false;
    }
    
    console.log('Form validation passed');
    return true;
}

function getWhatsAppFormData() {
    const phoneInput = document.getElementById('clientPhone');
    let phoneValue = phoneInput.value.trim();
    
    // Remove any non-digit characters except +
    phoneValue = phoneValue.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!phoneValue.startsWith('+')) {
        phoneValue = '+' + phoneValue;
    }
    
    // If no phone number provided, use the default number
    if (!phoneValue || phoneValue === '+') {
        phoneValue = '+260974000337';
    }
    
    return {
        name: document.getElementById('clientName').value.trim(),
        phone: phoneValue, // Full international number like +260974000337
        email: document.getElementById('clientEmail').value.trim(),
        budget: document.getElementById('projectBudget').value,
        budgetText: getBudgetText(document.getElementById('projectBudget').value),
        projectType: document.getElementById('projectType').value,
        projectTypeText: getProjectTypeText(document.getElementById('projectType').value),
        timeline: document.getElementById('projectTimeline').value,
        timelineText: getTimelineText(document.getElementById('projectTimeline').value),
        details: document.getElementById('projectDetails').value.trim(),
        howFound: document.getElementById('howFound').value,
        howFoundText: getHowFoundText(document.getElementById('howFound').value),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
}

function createWhatsAppMessage(data) {
    let message = `*NEW PROJECT INQUIRY*\n\n`;
    message += `*Client Information:*\n`;
    message += `*Name:* ${data.name}\n`;
    message += `*Phone:* ${data.phone}\n`;
    if (data.email) {
        message += `*Email:* ${data.email}\n`;
    }
    
    message += `\n*Project Budget:*\n`;
    message += `${data.budgetText}\n`;
    
    message += `\n*Project Type:*\n`;
    message += `${data.projectTypeText}\n`;
    
    message += `\n*Timeline:*\n`;
    message += `${data.timelineText}\n`;
    
    if (data.howFoundText) {
        message += `\n*How They Found Me:*\n`;
        message += `${data.howFoundText}\n`;
    }
    
    message += `\n*Project Details:*\n`;
    message += `${data.details}\n`;
    
    message += `\n*Inquiry Submitted:*\n`;
    message += `${data.date}\n`;
    
    message += `\n---\n`;
    message += `_This inquiry was submitted through my portfolio website._`;
    
    return message;
}

// Helper functions for text conversion
function getBudgetText(value) {
    const budgetMap = {
        'under-2000': 'Under K2,000',
        '2000-5000': 'K2,000 - K5,000',
        '5000-10000': 'K5,000 - K10,000',
        '10000-15000': 'K10,000 - K15,000',
        '15000-plus': 'K15,000+',
        'negotiable': 'Budget to be negotiated',
        'not-sure': 'Not sure yet'
    };
    return budgetMap[value] || value;
}

function getProjectTypeText(value) {
    const typeMap = {
        'web-app': 'Web Application',
        'mobile-app': 'Mobile Application',
        'website': 'Website Development',
        'ecommerce': 'E-commerce Platform',
        'cms': 'Content Management System',
        'data-analysis': 'Data Analysis & Visualization',
        'database': 'Database Development',
        'ict-infrastructure': 'ICT Infrastructure Setup',
        'health-system': 'Health Information System',
        'government': 'Government/Public Sector System',
        'other': 'Other'
    };
    return typeMap[value] || value;
}

function getTimelineText(value) {
    const timelineMap = {
        'urgent': 'Urgent (Within 2 weeks)',
        '1-month': '1 Month',
        '1-3-months': '1-3 Months',
        '3-6-months': '3-6 Months',
        '6-plus-months': '6+ Months',
        'flexible': 'Flexible/Timeline to be discussed'
    };
    return timelineMap[value] || value;
}

function getHowFoundText(value) {
    const foundMap = {
        'portfolio': 'Portfolio Website',
        'referral': 'Referral',
        'linkedin': 'LinkedIn',
        'google': 'Google Search',
        'social-media': 'Social Media',
        'previous-client': 'Previous Client',
        'other': 'Other'
    };
    return foundMap[value] || '';
}

// Save inquiry to localStorage
function saveInquiry(data) {
    try {
        let inquiries = JSON.parse(localStorage.getItem('projectInquiries')) || [];
        
        // Remove sensitive data before saving
        const safeData = {
            ...data,
            phone: '***' + data.phone.slice(-4), // Mask phone number
            email: data.email ? '***' + data.email.split('@')[0].slice(-3) + '@' + data.email.split('@')[1] : '',
            timestamp: new Date().toISOString()
        };
        
        inquiries.push(safeData);
        localStorage.setItem('projectInquiries', JSON.stringify(inquiries));
        console.log('Inquiry saved to localStorage:', safeData);
        return true;
    } catch (error) {
        console.error('Error saving inquiry:', error);
        return false;
    }
}

// Show form message for inquiry form
function showInquiryFormMessage(text, type = 'success') {
    let messageDiv = document.getElementById('formMessage');
    
    // Create message div if it doesn't exist
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'formMessage';
        messageDiv.className = 'form-message';
        
        const form = document.getElementById('projectInquiryForm');
        if (form) {
            form.appendChild(messageDiv);
        } else {
            console.error('Form not found for message display');
            return;
        }
    }
    
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = type === 'success' 
        ? `<i class="fas fa-check-circle"></i> ${text}`
        : `<i class="fas fa-exclamation-circle"></i> ${text}`;
    
    messageDiv.style.display = 'block';
    messageDiv.style.animation = 'fadeIn 0.3s ease';
    
    // Scroll to message
    setTimeout(() => {
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Auto-hide error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Load profile picture
    loadProfilePicture();
    
    // Initialize WhatsApp form
    initializeWhatsAppForm();
    
    // Initialize other features
    initializeStarRating();
    initializeReviewForm();
    loadReviewsFromLocal();
    
    // Animate skill bars on load
    setTimeout(animateSkillBars, 500);
    
    // Add floating animation to profile picture
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        setInterval(() => {
            profileContainer.classList.toggle('floating');
        }, 6000);
    }
    
    // Initialize active nav link
    updateActiveNavLink();
    
    console.log('All initialization complete');
});

// Add a test function you can run from console
window.testWhatsAppForm = function() {
    console.log('Testing WhatsApp form...');
    
    // Fill form with test data
    document.getElementById('clientName').value = 'Test User';
    document.getElementById('clientPhone').value = '+260974000337';
    document.getElementById('clientEmail').value = 'test@example.com';
    document.getElementById('projectBudget').value = 'negotiable';
    document.getElementById('projectType').value = 'web-app';
    document.getElementById('projectTimeline').value = 'flexible';
    document.getElementById('projectDetails').value = 'This is a test project inquiry to check if the form is working properly.';
    document.getElementById('howFound').value = 'portfolio';
    document.getElementById('termsAgree').checked = true;
    
    console.log('Form filled with test data');
    console.log('Try clicking the submit button now...');
};
