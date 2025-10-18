// Simple localStorage-based database for booking management
class BookingDatabase {
    constructor() {
        this.bookingsKey = 'easyinterview_bookings';
        this.slotsKey = 'easyinterview_slots';
        this.initializeSlots();
    }

    // Initialize available slots if not exists
    initializeSlots() {
        if (!localStorage.getItem(this.slotsKey)) {
            const defaultSlots = {
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
            localStorage.setItem(this.slotsKey, JSON.stringify(defaultSlots));
        }
    }

    // Get all bookings
    getBookings() {
        const bookings = localStorage.getItem(this.bookingsKey);
        return bookings ? JSON.parse(bookings) : [];
    }

    // Get available slots for a specific date
    getAvailableSlots(date, specialization = null, timeSlot = null) {
        const dateStr = this.formatDate(date);
        const bookings = this.getBookings();
        const slots = JSON.parse(localStorage.getItem(this.slotsKey));
        
        // Get booked slots for this date
        const bookedSlots = bookings
            .filter(booking => booking.date === dateStr)
            .map(booking => booking.time);

        let availableSlots = [];

        if (specialization && slots[specialization]) {
            if (timeSlot && slots[specialization][timeSlot]) {
                availableSlots = slots[specialization][timeSlot];
            } else {
                // Get all slots for the specialization
                Object.values(slots[specialization]).forEach(timeSlots => {
                    availableSlots = availableSlots.concat(timeSlots);
                });
            }
        } else {
            // Get all available slots
            Object.values(slots).forEach(spec => {
                Object.values(spec).forEach(timeSlots => {
                    availableSlots = availableSlots.concat(timeSlots);
                });
            });
            // Remove duplicates
            availableSlots = [...new Set(availableSlots)];
        }

        // Filter out booked slots
        return availableSlots.filter(slot => !bookedSlots.includes(slot));
    }

    // Check if a specific slot is available
    isSlotAvailable(date, time) {
        const dateStr = this.formatDate(date);
        const bookings = this.getBookings();
        
        return !bookings.some(booking => 
            booking.date === dateStr && booking.time === time
        );
    }

    // Add a new booking
    addBooking(bookingData) {
        const bookings = this.getBookings();
        const newBooking = {
            id: this.generateId(),
            date: bookingData.date,
            time: bookingData.time,
            duration: bookingData.duration,
            specialization: bookingData.specialization,
            tg_name: bookingData.tg_name,
            full_name: bookingData.full_name,
            phone: bookingData.phone,
            about: bookingData.about,
            resume_name: bookingData.resume_name,
            created_at: new Date().toISOString(),
            status: 'confirmed'
        };

        bookings.push(newBooking);
        localStorage.setItem(this.bookingsKey, JSON.stringify(bookings));
        return newBooking;
    }

    // Cancel a booking
    cancelBooking(bookingId) {
        const bookings = this.getBookings();
        const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem(this.bookingsKey, JSON.stringify(updatedBookings));
        return true;
    }

    // Get booking by ID
    getBooking(bookingId) {
        const bookings = this.getBookings();
        return bookings.find(booking => booking.id === bookingId);
    }

    // Get bookings for a specific date
    getBookingsForDate(date) {
        const dateStr = this.formatDate(date);
        const bookings = this.getBookings();
        return bookings.filter(booking => booking.date === dateStr);
    }

    // Format date to string
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Clear all data (for testing)
    clearAll() {
        localStorage.removeItem(this.bookingsKey);
        localStorage.removeItem(this.slotsKey);
        this.initializeSlots();
    }

    // Export bookings (for admin purposes)
    exportBookings() {
        return {
            bookings: this.getBookings(),
            slots: JSON.parse(localStorage.getItem(this.slotsKey)),
            exported_at: new Date().toISOString()
        };
    }

    // Get statistics
    getStats() {
        const bookings = this.getBookings();
        const today = new Date();
        const thisMonth = bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            return bookingDate.getMonth() === today.getMonth() && 
                   bookingDate.getFullYear() === today.getFullYear();
        });

        return {
            total_bookings: bookings.length,
            this_month: thisMonth.length,
            specializations: this.getSpecializationStats(bookings),
            popular_times: this.getPopularTimes(bookings)
        };
    }

    // Get specialization statistics
    getSpecializationStats(bookings) {
        const stats = {};
        bookings.forEach(booking => {
            const spec = booking.specialization || 'general';
            stats[spec] = (stats[spec] || 0) + 1;
        });
        return stats;
    }

    // Get popular time statistics
    getPopularTimes(bookings) {
        const stats = {};
        bookings.forEach(booking => {
            stats[booking.time] = (stats[booking.time] || 0) + 1;
        });
        return Object.entries(stats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([time, count]) => ({ time, count }));
    }
}

// Initialize database
const bookingDB = new BookingDatabase();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BookingDatabase;
}