// Global variables
let currentDate = new Date();
let selectedDate = null;
let selectedTimeSlot = null;
let availableSlots = {};

// Sample data for available time slots
const sampleSlots = {
    'software-engineering': {
        'morning': ['9:00 AM', '10:00 AM', '11:00 AM'],
        'afternoon': ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
        'evening': ['5:00 PM', '6:00 PM', '7:00 PM']
    },
    'product-management': {
        'morning': ['9:30 AM', '10:30 AM', '11:30 AM'],
        'afternoon': ['12:30 PM', '2:30 PM', '3:30 PM'],
        'evening': ['5:30 PM', '6:30 PM']
    },
    'data-science': {
        'morning': ['9:00 AM', '10:30 AM'],
        'afternoon': ['1:30 PM', '3:00 PM', '4:30 PM'],
        'evening': ['6:00 PM', '7:30 PM']
    },
    'marketing': {
        'morning': ['10:00 AM', '11:00 AM'],
        'afternoon': ['2:00 PM', '3:00 PM'],
        'evening': ['5:00 PM', '6:00 PM']
    },
    'sales': {
        'morning': ['9:30 AM', '10:30 AM'],
        'afternoon': ['1:00 PM', '2:30 PM', '4:00 PM'],
        'evening': ['5:30 PM', '7:00 PM']
    },
    'finance': {
        'morning': ['9:00 AM', '11:00 AM'],
        'afternoon': ['1:30 PM', '3:30 PM'],
        'evening': ['6:00 PM']
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCalendar();
    initializeFilters();
    generateCalendar();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Calendar functionality
function initializeCalendar() {
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });
    }
}

// Generate calendar
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const monthHeader = document.getElementById('current-month');
    
    if (!calendar || !monthHeader) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month header
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthHeader.textContent = `${monthNames[month]} ${year}`;

    // Clear calendar
    calendar.innerHTML = '';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        dayHeader.style.background = '#f7fafc';
        dayHeader.style.color = '#4a5568';
        calendar.appendChild(dayHeader);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day disabled';
        calendar.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const dayDate = new Date(year, month, day);
        
        // Disable past dates
        if (dayDate < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(dayDate, dayElement));
        }

        calendar.appendChild(dayElement);
    }
}

// Select date functionality
function selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });

    // Add selection to clicked day
    element.classList.add('selected');
    selectedDate = date;

    // Generate time slots for selected date
    generateTimeSlots();
}

// Generate time slots based on filters
function generateTimeSlots() {
    const slotsContainer = document.getElementById('slots-container');
    if (!slotsContainer || !selectedDate) return;

    const specialization = document.getElementById('specialization').value;
    const timeSlot = document.getElementById('time-slot').value;
    const duration = document.getElementById('duration').value;

    slotsContainer.innerHTML = '';

    // Get available slots based on specialization
    let slots = [];
    if (specialization && sampleSlots[specialization]) {
        if (timeSlot && sampleSlots[specialization][timeSlot]) {
            slots = sampleSlots[specialization][timeSlot];
        } else {
            // Get all slots for the specialization
            Object.values(sampleSlots[specialization]).forEach(timeSlots => {
                slots = slots.concat(timeSlots);
            });
        }
    } else {
        // Get all available slots
        Object.values(sampleSlots).forEach(spec => {
            Object.values(spec).forEach(timeSlots => {
                slots = slots.concat(timeSlots);
            });
        });
        // Remove duplicates
        slots = [...new Set(slots)];
    }

    // Sort slots
    slots.sort((a, b) => {
        const timeA = convertTo24Hour(a);
        const timeB = convertTo24Hour(b);
        return timeA.localeCompare(timeB);
    });

    // Create slot elements
    slots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.className = 'time-slot';
        slotElement.textContent = `${slot} (${duration}min)`;
        slotElement.addEventListener('click', () => selectTimeSlot(slot, slotElement));
        slotsContainer.appendChild(slotElement);
    });

    if (slots.length === 0) {
        slotsContainer.innerHTML = '<p>No available slots for the selected filters.</p>';
    }
}

// Select time slot
function selectTimeSlot(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Add selection to clicked slot
    element.classList.add('selected');
    selectedTimeSlot = time;

    // Show booking confirmation
    showBookingConfirmation();
}

// Show booking confirmation
function showBookingConfirmation() {
    if (!selectedDate || !selectedTimeSlot) return;

    const specialization = document.getElementById('specialization').value || 'General';
    const duration = document.getElementById('duration').value;
    
    const dateStr = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const confirmationMessage = `
        <div style="background: #e6fffa; border: 2px solid #00b894; border-radius: 8px; padding: 1rem; margin-top: 1rem;">
            <h4 style="color: #00b894; margin-bottom: 0.5rem;">Booking Summary</h4>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${selectedTimeSlot}</p>
            <p><strong>Duration:</strong> ${duration} minutes</p>
            <p><strong>Specialization:</strong> ${specialization.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            <button class="btn-primary" onclick="confirmBooking()" style="margin-top: 1rem;">Confirm Booking</button>
        </div>
    `;

    const slotsContainer = document.getElementById('slots-container');
    slotsContainer.innerHTML += confirmationMessage;
}

// Confirm booking
function confirmBooking() {
    alert('Booking confirmed! You will receive a confirmation email shortly with the meeting details.');
    
    // Reset selections
    selectedDate = null;
    selectedTimeSlot = null;
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    document.getElementById('slots-container').innerHTML = '<p>Select a date to view available time slots</p>';
}

// Initialize filters
function initializeFilters() {
    const specializationFilter = document.getElementById('specialization');
    const timeSlotFilter = document.getElementById('time-slot');
    const durationFilter = document.getElementById('duration');

    if (specializationFilter) {
        specializationFilter.addEventListener('change', () => {
            if (selectedDate) generateTimeSlots();
        });
    }

    if (timeSlotFilter) {
        timeSlotFilter.addEventListener('change', () => {
            if (selectedDate) generateTimeSlots();
        });
    }

    if (durationFilter) {
        durationFilter.addEventListener('change', () => {
            if (selectedDate) generateTimeSlots();
        });
    }
}

// Apply filters function (called by button)
function applyFilters() {
    if (selectedDate) {
        generateTimeSlots();
    } else {
        alert('Please select a date first to view available time slots.');
    }
}

// Utility function to convert 12-hour to 24-hour format for sorting
function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeScrollAnimations);

// Form validation for contact forms (if added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function for showing notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : '#e74c3c'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add loading states for better UX
function showLoading(element) {
    const originalText = element.textContent;
    element.textContent = 'Loading...';
    element.disabled = true;
    
    return () => {
        element.textContent = originalText;
        element.disabled = false;
    };
}