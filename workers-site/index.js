/**
 * Handle incoming requests
 */
async function handleRequest(event) {
  try {
    // Get URL and path
    const url = new URL(event.request.url)
    const path = url.pathname

    // Handle API routes
    if (path.includes('/generate') && event.request.method === 'POST') {
      return handleGenerateRequest(event.request)
    }

    // Basic static file handling - simplified version that doesn't require KV
    try {
      // For a simple fallback, we'll serve the signature form directly
      return new Response(generateHtmlPage(), {
        status: 200,
        headers: {
          "Content-Type": "text/html",
          "X-XSS-Protection": "1; mode=block",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Cache-Control": "public, max-age=3600"
        }
      })
    } catch (e) {
      // If asset isn't found, return a simple fallback
      return new Response("Stacked Farm Email Signature Generator", {
        status: 200,
        headers: { "Content-Type": "text/html" }
      })
    }
  } catch (e) {
    // Return a standard error response
    return new Response("An error occurred: " + e.message, {
      status: 500,
    })
  }
}

async function handleGenerateRequest(request) {
  const formData = await request.formData()
  
  const name = formData.get('name') || ''
  const job_title = formData.get('job_title') || ''
  const phone = formData.get('phone') || ''
  const phone2 = formData.get('phone2') || ''
  const password = formData.get('password') || ''
  
  // Check password
  if (password !== 'Lettuce2025') {
    return new Response(
      JSON.stringify({ error: 'Incorrect password. Please try again.' }),
      {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
  
  // Generate the signature HTML
  const signatureHtml = generateSignatureHtml(name, job_title, phone, phone2)
  
  return new Response(
    JSON.stringify({ signature_html: signatureHtml }),
    {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  )
}

function generateHtmlPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stacked Farm Email Signature Generator</title>
  <style>
    :root {
      --primary-color: #324F35;
      --secondary-color: #333;
      --background-color: #f8f8f8;
      --border-color: #ddd;
      --text-color: #333;
      --success-color: #324F35;
      --error-color: #f44336;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--background-color);
      padding: 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    header {
      background-color: var(--primary-color);
      color: white;
      text-align: center;
      padding: 2rem;
    }

    header h1 {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    main {
      padding: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .required {
      color: var(--error-color);
    }

    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-family: inherit;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      transition: background-color 0.2s, transform 0.1s;
    }

    button:active {
      transform: translateY(1px);
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: white;
    }

    .btn-primary:hover {
      background-color: #43a047;
    }

    .btn-secondary {
      background-color: #f5f5f5;
      color: var(--text-color);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover {
      background-color: #e8e8e8;
    }

    .signature-preview {
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
    }

    .preview-container {
      margin: 1.5rem 0;
      padding: 1.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      background-color: white;
    }

    .copy-instructions {
      background-color: #f5f5f5;
      padding: 1.5rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }

    .copy-instructions p {
      margin-bottom: 0.5rem;
    }

    .copy-instructions button {
      margin-top: 1rem;
    }

    .copy-message {
      margin-top: 0.5rem;
      color: var(--success-color);
      font-weight: 500;
    }

    footer {
      text-align: center;
      padding: 1.5rem;
      color: #666;
      border-top: 1px solid var(--border-color);
    }

    .hidden {
      display: none;
    }

    .error-message {
      color: var(--error-color);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
  <div class="container">
    <header>
      <h1>Stacked Farm Email Signature Generator</h1>
      <p>Fill in your details below to generate your email signature</p>
    </header>

    <main>
      <form id="signatureForm">
        <div class="form-group">
          <label for="name">Full Name <span class="required">*</span></label>
          <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
          <label for="job_title">Job Title <span class="required">*</span></label>
          <input type="text" id="job_title" name="job_title" required>
        </div>

        <div class="form-group">
          <label for="phone">Primary Phone Number</label>
          <input type="text" id="phone" name="phone" placeholder="Optional">
        </div>

        <div class="form-group">
          <label for="phone2">Secondary Phone Number</label>
          <input type="text" id="phone2" name="phone2" placeholder="Optional">
        </div>
	<div>
	</div>
	<br><br><br>
        <div class="form-group">
          <label for="password">Password (Enter password to generate email signature)<span class="required">*</span></label>
          <input type="password" id="password" name="password" required>
          <p id="passwordError" class="error-message hidden">Incorrect password. Please try again.</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Generate Signature</button>
          <button type="reset" class="btn-secondary">Reset</button>
        </div>
      </form>

      <div class="signature-preview hidden" id="signaturePreview">
        <h2>Your Email Signature</h2>
        <div class="preview-container">
          <div id="signatureDisplay"></div>
        </div>
        <div class="copy-instructions">
          <p>1. Click the "Copy to Clipboard" button below</p>
          <p>2. In Gmail, go to Settings → See all settings → General → Signature</p>
          <p>3. Create a new signature or edit an existing one</p>
          <p>4. Paste your new signature and save changes</p>
          <button id="copyButton" class="btn-primary">Copy to Clipboard</button>
          <p id="copyMessage" class="copy-message hidden">Signature copied to clipboard!</p>
        </div>
      </div>
    </main>

    <footer>
      <p>&copy; 2025 Stacked Farm. All rights reserved.</p>
    </footer>
  </div>

  <script>
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

        fetch('/generate', {
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
  </script>
</body>
</html>`;
}

function generateSignatureHtml(name, job_title, phone, phone2) {
  const phoneFormatted = phone ?
    `<a href="tel:${phone.replace(/\s/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '')}" style="color:rgb(0,0,0)" target="_blank">${phone}</a>` : ''

  const phone2Formatted = phone2 ?
    `<a href="tel:${phone2.replace(/\s/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '')}" style="color:rgb(0,0,0)" target="_blank">${phone2}</a>` : ''
  
  const separator = phone && phone2 ? '&nbsp;&nbsp;|&nbsp;&nbsp;' : ''
  
  const phoneHtml = (phone || phone2) ? 
    `<tr>
      <td valign="top" style="padding:0px 0px 7px;vertical-align:top">
        <p style="padding:0px;vertical-align:top;color:rgb(0,0,0);line-height:normal;font-size:12px;letter-spacing:0.2px;margin:0px!important">
          ${phoneFormatted}${separator}${phone2Formatted}
        </p>
      </td>
    </tr>` : ''
  
  return `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0px;color:rgb(74,74,74);font-family:BlinkMacSystemFont,-apple-system,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Fira Sans','Droid Sans','Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;background:none;border:0px;margin:0px;padding:0px;width:410px;max-width:410px">
    <tbody>
        <tr>
            <td colspan="1" style="padding:0px;vertical-align:top;width:109px;max-width:109px">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0px;background:none;border:0px;margin:0px;padding:0px;width:109px;max-width:109px">
                    <tbody>
                        <tr>
                            <td style="padding:0px;vertical-align:top">
                                <img height="105" width="109" src="https://images.prismic.io/stacked-farm/Z_huGOvxEdbNO4lm_email-signature_v3.gif?auto=format,compress" alt="Stacked Farm" style="max-width:109px;height:auto;width:109px;max-height:105px">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td style="padding:0px 0px 0px 24px;vertical-align:top">
                <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border-spacing:0px;background:none;border:0px;margin:0px;padding:0px;width:274px;max-width:274px">
                    <tbody>
                        <tr>
                            <td colspan="2" style="padding:0px 0px 13px;vertical-align:top">
                                <p style="padding:0px;color:rgb(0,0,0);line-height:18px;letter-spacing:0.648px;margin:0px!important">${name}</p>
                                <p style="padding:0px;color:rgb(0,0,0);font-size:14px;line-height:14px;letter-spacing:0.573px;margin:0px!important">${job_title}</p>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" style="padding:0px 0px 3px;vertical-align:top">
                                <p style="padding:0px;vertical-align:top;color:rgb(0,0,0);line-height:normal;font-size:12px;letter-spacing:0.2px;margin:0px!important">
                                    Offices: <a href="https://maps.app.goo.gl/1X7Fk11UJCHmtrqE7" style="color:rgb(0,0,0)" target="_blank">Australia</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://www.google.com/maps/place/223+S+Beverly+Dr,+Beverly+Hills,+CA+90212,+USA/@34.0642184,-118.3993565,1627m/data=!3m2!1e3!4b1!4m6!3m5!1s0x80c2bbfbf078a93f:0x61e9574a012d1ec7!8m2!3d34.0642184!4d-118.3993565!16s%2Fg%2F11k3r4mq1s!5m1!1e3?entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D" style="color:rgb(0,0,0)" target="_blank">USA</a>
                                </p>
                            </td>
                        </tr>
                        ${phoneHtml}
                        <tr>
                            <td valign="top" style="padding:0px 0px 5px;vertical-align:top">
                                <table cellpadding="0" cellspacing="0" border="0" style="color:rgb(0,0,0);font-size:8px;background:none;border-collapse:collapse;border-spacing:0px;border:0px;margin:0px;padding:0px;width:274px;max-width:288px">
                                    <tbody>
                                        <tr>
                                            <td style="padding:0px 32px 0px 0px;vertical-align:top;width:101px">
                                                <a href="https://stackedfarm.com/" style="color:rgb(77,77,77);font-size:10px;letter-spacing:0.2px;padding-top:3px;display:inline-block;" target="_blank">stackedfarm.com</a>&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td style="padding:0px 32px 0px 0px;vertical-align:top;width:61px">
                                                <a href="https://www.linkedin.com/company/stackedfarm/" style="color:rgb(77,77,77);font-size:10px;letter-spacing:0.2px;padding-top:3px;display:inline-block;" target="_blank">LinkedIn</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                            <td style="padding:0px;vertical-align:top">
                                                <a href="https://www.instagram.com/stackedfarm/" style="color:rgb(77,77,77);font-size:10px;letter-spacing:0.2px;padding-top:3px;display:inline-block;" target="_blank">Instagram</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
