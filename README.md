# MockInterview Pro - Professional Mock Interview Website

A professional mock interview booking platform inspired by Greenhouse.com design, built with HTML, CSS, and JavaScript.

## Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Interactive Calendar**: Book interviews with date and time selection
- **Filter System**: Filter by specialization, time preference, and duration
- **Multiple Pages**: Home, Pricing, About, and Reviews pages
- **Professional UI**: Clean, modern design inspired by Greenhouse.com
- **Booking System**: Complete booking flow with confirmation

## Pages

1. **Home (index.html)**: Landing page with hero section, features, booking calendar, and testimonials
2. **Pricing (pricing.html)**: Detailed pricing plans, packages, and specialization pricing
3. **About (about.html)**: Company information, mission, team, and process
4. **Reviews (reviews.html)**: Customer testimonials, success stories, and statistics

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Inter)

## File Structure

```
/
├── index.html          # Main landing page
├── pricing.html        # Pricing page
├── about.html          # About page
├── reviews.html        # Reviews page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Key Features

### Calendar Booking System
- Interactive calendar with month navigation
- Date selection with visual feedback
- Time slot generation based on filters
- Booking confirmation with summary

### Filter System
- Specialization filter (Software Engineering, Product Management, etc.)
- Time preference filter (Morning, Afternoon, Evening)
- Duration selection (30, 45, 60, 90 minutes)

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Hamburger menu for mobile navigation
- Flexible grid layouts

## Deployment

### GitHub Pages (Recommended)

This website is ready for GitHub Pages deployment. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for detailed instructions.

**Quick Steps:**
1. Create a new public repository on GitHub
2. Upload all project files to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Other Static Hosting Services

This website is also optimized for:

1. **Netlify**: Simply drag and drop the entire folder
2. **Vercel**: Connect your Git repository
3. **AWS S3**: Upload files to an S3 bucket with static website hosting
4. **Traditional Web Hosting**: Upload all files to your web server's public directory

### GitHub Pages Benefits
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Custom domain support
- ✅ Automatic deployments from Git
- ✅ Global CDN

### Local Development

1. Clone or download the files
2. Open `index.html` in a web browser
3. For development with live reload, use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Colors
The main brand color is defined in CSS variables. To change the theme:
```css
:root {
  --primary-color: #00b894;
  --primary-dark: #00a085;
}
```

### Content
- Update company information in HTML files
- Modify pricing in `pricing.html`
- Change team information in `about.html`
- Update testimonials in `reviews.html` and `index.html`

### Booking System
The booking system uses sample data. To integrate with a real backend:
1. Replace the `sampleSlots` object in `script.js`
2. Implement API calls for availability checking
3. Add real booking confirmation functionality

## Performance Optimizations

- Optimized images (placeholder system for easy replacement)
- Minified CSS and JavaScript ready
- Efficient CSS Grid and Flexbox layouts
- Lazy loading ready for images
- SEO-friendly HTML structure

## SEO Features

- Semantic HTML structure
- Meta tags for social sharing
- Proper heading hierarchy
- Alt text ready for images
- Clean URL structure

## Future Enhancements

- Backend integration for real booking system
- Payment processing integration
- User authentication system
- Email notifications
- Calendar integration (Google Calendar, Outlook)
- Video call integration
- Admin dashboard for managing bookings

## License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## Support

For questions or support, please contact the development team.