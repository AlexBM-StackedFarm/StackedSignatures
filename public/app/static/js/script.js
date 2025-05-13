document.addEventListener('DOMContentLoaded', function() {
    const signatureForm = document.getElementById('signatureForm');
    const signaturePreview = document.getElementById('signaturePreview');
    const signatureDisplay = document.getElementById('signatureDisplay');
    const copyButton = document.getElementById('copyButton');
    const copyMessage = document.getElementById('copyMessage');
    const passwordError = document.getElementById('passwordError');

    signatureForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide any previous error messages
        passwordError.classList.add('hidden');

        const formData = new FormData(signatureForm);

        fetch('/functions/generate', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Server error');
                });
            }
            return response.json();
        })
        .then(data => {
            signatureDisplay.innerHTML = data.signature_html;
            signaturePreview.classList.remove('hidden');
            window.scrollTo({
                top: signaturePreview.offsetTop,
                behavior: 'smooth'
            });
        })
        .catch(error => {
            console.error('Error generating signature:', error);
            if (error.message.includes('Incorrect password')) {
                passwordError.classList.remove('hidden');
            } else {
                alert('An error occurred while generating your signature. Please try again.');
            }
        });
    });

    copyButton.addEventListener('click', function() {
        // Create a range and select the signature content
        const range = document.createRange();
        range.selectNode(signatureDisplay);
        
        // Clear any current selection
        window.getSelection().removeAllRanges();
        
        // Select the signature
        window.getSelection().addRange(range);
        
        // Execute copy command
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyMessage.classList.remove('hidden');
                setTimeout(() => {
                    copyMessage.classList.add('hidden');
                }, 3000);
            } else {
                alert('Failed to copy signature. Please try selecting and copying manually.');
            }
        } catch (err) {
            console.error('Error copying text:', err);
            alert('Failed to copy signature. Please try selecting and copying manually.');
        }
        
        // Clear the selection
        window.getSelection().removeAllRanges();
    });
});