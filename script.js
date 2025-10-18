// Global variables
let currentDate = new Date();
let selectedDate = null;
let selectedTimeSlot = null;
let selectedBookingData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCalendar();
    initializeFilters();
    initializeBookingForm();
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

// Generate time slots based on filters and database availability
function generateTimeSlots() {
    const slotsContainer = document.getElementById('slots-container');
    if (!slotsContainer || !selectedDate) return;

    const specialization = document.getElementById('specialization').value;
    const timeSlot = document.getElementById('time-slot').value;
    const duration = document.getElementById('duration').value;

    slotsContainer.innerHTML = '';

    // Get available slots from database
    let slots = bookingDB.getAvailableSlots(selectedDate, specialization || null, timeSlot || null);

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
        slotsContainer.innerHTML = `<p>${t('msg_no_slots')}</p>`;
    }
}

// Select time slot
function selectTimeSlot(time, element) {
    // Check if slot is still available
    if (!bookingDB.isSlotAvailable(selectedDate, time)) {
        showNotification('This slot is no longer available. Please select another time.', 'error');
        generateTimeSlots(); // Refresh slots
        return;
    }

    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Add selection to clicked slot
    element.classList.add('selected');
    selectedTimeSlot = time;

    // Prepare booking data
    const specialization = document.getElementById('specialization').value || 'general';
    const duration = document.getElementById('duration').value;
    
    selectedBookingData = {
        date: bookingDB.formatDate(selectedDate),
        time: selectedTimeSlot,
        duration: duration,
        specialization: specialization
    };

    // Show booking modal
    showBookingModal();
}

// Show booking modal
function showBookingModal() {
    if (!selectedBookingData) return;

    const modal = document.getElementById('booking-modal');
    const dateStr = selectedDate.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Update modal content
    document.getElementById('modal-date').textContent = dateStr;
    document.getElementById('modal-time').textContent = selectedBookingData.time;
    document.getElementById('modal-duration').textContent = `${selectedBookingData.duration} ${currentLanguage === 'ru' ? 'минут' : 'minutes'}`;
    document.getElementById('modal-specialization').textContent = getSpecializationName(selectedBookingData.specialization);

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    document.getElementById('booking-form').reset();
}

// Get specialization name for display
function getSpecializationName(spec) {
    const names = {
        'general': currentLanguage === 'ru' ? 'Общее' : 'General',
        'software-engineering': currentLanguage === 'ru' ? 'Разработка ПО' : 'Software Engineering',
        'product-management': currentLanguage === 'ru' ? 'Продакт-менеджмент' : 'Product Management',
        'data-science': 'Data Science',
        'marketing': currentLanguage === 'ru' ? 'Маркетинг' : 'Marketing',
        'sales': currentLanguage === 'ru' ? 'Продажи' : 'Sales',
        'finance': currentLanguage === 'ru' ? 'Финансы' : 'Finance'
    };
    return names[spec] || spec;
}

// Initialize booking form
function initializeBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBookingSubmission();
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('booking-modal');
        if (e.target === modal) {
            closeBookingModal();
        }
    });
}

// Handle booking form submission
function handleBookingSubmission() {
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    // Validate form
    if (!validateBookingForm(formData)) {
        return;
    }

    // Check if slot is still available
    if (!bookingDB.isSlotAvailable(selectedDate, selectedBookingData.time)) {
        showNotification(currentLanguage === 'ru' ? 
            'Этот слот больше недоступен. Пожалуйста, выберите другое время.' : 
            'This slot is no longer available. Please select another time.', 'error');
        closeBookingModal();
        generateTimeSlots();
        return;
    }

    // Prepare booking data
    const bookingData = {
        ...selectedBookingData,
        tg_name: formData.get('tg_name'),
        full_name: formData.get('full_name'),
        phone: formData.get('phone'),
        about: formData.get('about'),
        resume_name: formData.get('resume').name
    };

    try {
        // Save booking to database
        const booking = bookingDB.addBooking(bookingData);
        
        // Show success message
        showNotification(t('msg_booking_success'), 'success');
        
        // Close modal and reset
        closeBookingModal();
        resetBookingState();
        
        // Refresh time slots
        generateTimeSlots();
        
        // Log booking for admin (in real app, this would be sent to server)
        console.log('New booking created:', booking);
        
    } catch (error) {
        console.error('Booking error:', error);
        showNotification(currentLanguage === 'ru' ? 
            'Произошла ошибка при бронировании. Пожалуйста, попробуйте еще раз.' : 
            'An error occurred while booking. Please try again.', 'error');
    }
}

// Validate booking form
function validateBookingForm(formData) {
    const tgName = formData.get('tg_name');
    const fullName = formData.get('full_name');
    const phone = formData.get('phone');
    const about = formData.get('about');
    const resume = formData.get('resume');

    // Validate Telegram username
    if (!tgName || !tgName.startsWith('@')) {
        showNotification(currentLanguage === 'ru' ? 
            'Пожалуйста, введите корректное имя пользователя Telegram (начинающееся с @)' : 
            'Please enter a valid Telegram username (starting with @)', 'error');
        return false;
    }

    // Validate full name
    if (!fullName || fullName.trim().length < 2) {
        showNotification(currentLanguage === 'ru' ? 
            'Пожалуйста, введите ваше полное имя' : 
            'Please enter your full name', 'error');
        return false;
    }

    // Validate phone
    if (!phone || phone.length < 10) {
        showNotification(currentLanguage === 'ru' ? 
            'Пожалуйста, введите корректный номер телефона' : 
            'Please enter a valid phone number', 'error');
        return false;
    }

    // Validate about section
    if (!about || about.trim().length < 20) {
        showNotification(currentLanguage === 'ru' ? 
            'Пожалуйста, расскажите больше о себе (минимум 20 символов)' : 
            'Please tell us more about yourself (minimum 20 characters)', 'error');
        return false;
    }

    // Validate resume file
    if (!resume || resume.size === 0) {
        showNotification(currentLanguage === 'ru' ? 
            'Пожалуйста, загрузите ваше резюме в формате PDF' : 
            'Please upload your resume in PDF format', 'error');
        return false;
    }

    if (resume.type !== 'application/pdf') {
        showNotification(currentLanguage === 'ru' ? 
            'Резюме должно быть в формате PDF' : 
            'Resume must be in PDF format', 'error');
        return false;
    }

    if (resume.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification(currentLanguage === 'ru' ? 
            'Размер файла резюме не должен превышать 5MB' : 
            'Resume file size must not exceed 5MB', 'error');
        return false;
    }

    return true;
}

// Reset booking state
function resetBookingState() {
    selectedDate = null;
    selectedTimeSlot = null;
    selectedBookingData = null;
    
    // Clear calendar selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Clear time slot selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Reset slots container
    const slotsContainer = document.getElementById('slots-container');
    if (slotsContainer) {
        slotsContainer.innerHTML = `<p>${t('booking_select_date')}</p>`;
    }
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
        showNotification(t('msg_select_date'), 'info');
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

// Utility function for showing notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
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

// Admin functions (for testing and management)
function getBookingStats() {
    return bookingDB.getStats();
}

function exportBookings() {
    const data = bookingDB.exportBookings();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `easyinterview_bookings_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function clearAllBookings() {
    if (confirm('Are you sure you want to clear all bookings? This cannot be undone.')) {
        bookingDB.clearAll();
        generateTimeSlots();
        showNotification('All bookings cleared', 'info');
    }
}

// Make admin functions available in console
window.adminFunctions = {
    getStats: getBookingStats,
    exportBookings: exportBookings,
    clearAll: clearAllBookings,
    getBookings: () => bookingDB.getBookings()
};