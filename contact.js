// JavaScript for form submission and social media links
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent.`);
        document.getElementById('contactForm').reset();
    } else {
        alert('Please fill out all fields.');
    }
});

// Add your social media links here
const socialLinks = {
    facebook: "https://facebook.com/yourprofile",
    twitter: "https://twitter.com/yourprofile",
    instagram: "https://instagram.com/yourprofile",
    linkedin: "https://linkedin.com/in/yourprofile",
    youtube: "https://youtube.com/yourprofile",
    whatsapp: "https://wa.me/yourphonenumber"
};

// Assign links to social media buttons
Object.keys(socialLinks).forEach((platform) => {
    const linkElement = document.getElementById(platform);
    if (linkElement) {
        linkElement.href = socialLinks[platform];
    }
});