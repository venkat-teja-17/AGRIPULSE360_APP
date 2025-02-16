// Generate QR Code when page loads
document.addEventListener('DOMContentLoaded', () => {
    generateQRCode();
});

// Generate QR Code
function generateQRCode() {
    const referralLink = document.getElementById('referralLink').value;
    const qr = qrcode(0, 'M');
    qr.addData(referralLink);
    qr.make();
    
    document.getElementById('qrCode').innerHTML = qr.createImgTag(5);
}

// Copy referral link
function copyReferralLink() {
    const referralLink = document.getElementById('referralLink');
    referralLink.select();
    referralLink.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(referralLink.value)
        .then(() => {
            showToast('Referral link copied!');
        })
        .catch(err => {
            showToast('Failed to copy link', 'error');
            console.error('Failed to copy text: ', err);
        });
}

// Share functions for different platforms
function shareViaWhatsApp() {
    const referralLink = document.getElementById('referralLink').value;
    const text = encodeURIComponent(`Join me on AgroPulse360 - The ultimate farming companion! 🌱\n\nUse my referral link to get started:\n${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareViaTelegram() {
    const referralLink = document.getElementById('referralLink').value;
    const text = encodeURIComponent(`Join me on AgroPulse360 - The ultimate farming companion! 🌱\n\nUse my referral link to get started:\n${referralLink}`);
    window.open(`https://t.me/share/url?url=${referralLink}&text=${text}`, '_blank');
}

function shareViaFacebook() {
    const referralLink = document.getElementById('referralLink').value;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
}

function shareViaTwitter() {
    const referralLink = document.getElementById('referralLink').value;
    const text = encodeURIComponent(`Join me on AgroPulse360 - The ultimate farming companion! 🌱\n\nUse my referral link to get started:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
}

function shareViaEmail() {
    const referralLink = document.getElementById('referralLink').value;
    const subject = encodeURIComponent('Join me on AgroPulse360!');
    const body = encodeURIComponent(`Hey!\n\nI've been using AgroPulse360 for my farming needs and thought you might be interested. It's a great app that helps with crop management, weather monitoring, and more!\n\nUse my referral link to get started:\n${referralLink}\n\nBest regards`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Download QR Code
function downloadQR() {
    const qrImage = document.querySelector('#qrCode img');
    if (!qrImage) {
        showToast('QR Code not found', 'error');
        return;
    }

    // Create a temporary link
    const link = document.createElement('a');
    link.href = qrImage.src;
    link.download = 'AgroPulse360-QR.png';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('QR Code downloaded!');
}

// Show toast notification
function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 3000);
}

// Back button functionality
function goBack() {
    window.history.back();
}

// Update referral link with user's unique code (should be implemented with backend)
function updateReferralLink() {
    // This should be replaced with actual user's referral code from your backend
    const userId = 'USER123'; // Example user ID
    const baseUrl = 'https://agropulse360.com/refer';
    const referralLink = `${baseUrl}?code=${userId}`;
    
    document.getElementById('referralLink').value = referralLink;
    generateQRCode(); // Regenerate QR code with new link
}
