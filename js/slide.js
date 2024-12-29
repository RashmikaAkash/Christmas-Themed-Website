const testimonials = document.querySelectorAll('.testimonial');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');
let currentIndex = 0;

// Function to update the active testimonial
function updateActive(index) {
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.toggle('active', i === index);
    });
}

// Event listeners for arrows
leftArrow.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    updateActive(currentIndex);
});

rightArrow.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    updateActive(currentIndex);
});

// Initialize the first testimonial as active
updateActive(currentIndex);

// Ensure arrows are animated smoothly on page load
document.addEventListener('DOMContentLoaded', () => {
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');
    leftArrow.style.animationDelay = '0.2s';
    rightArrow.style.animationDelay = '0.2s';
});
