document.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const acceptButton = document.getElementById('acceptButton');
  
    agreeCheckbox.addEventListener('change', () => {
      acceptButton.disabled = !agreeCheckbox.checked;
    });
  
    acceptButton.addEventListener('click', () => {
      alert('Thank you for accepting the Terms and Conditions!');
      // Redirect to another page or close the modal
    });
  });
  