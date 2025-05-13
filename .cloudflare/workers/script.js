// This file serves as the main entry point for all functions

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle specific API routes
  if (path.includes('/generate') && request.method === 'POST') {
    return handleGenerateRequest(request);
  }

  // Default response for functions route
  if (path.includes('/functions/')) {
    return new Response("Stacked Farm Email Signature Generator API", {
      headers: { "content-type": "text/plain" }
    });
  }

  // For any other route, pass to the Pages asset - let Pages handle static content
  try {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    } else {
      // Fallback for when ASSETS binding is not available
      return new Response("Stacked Farm Email Signature Generator", {
        headers: { "content-type": "text/html" }
      });
    }
  } catch (e) {
    console.error("Error fetching assets:", e);
    return new Response("Something went wrong. Please try again later.", {
      status: 500,
      headers: { "content-type": "text/plain" }
    });
  }
}

async function handleGenerateRequest(request) {
  const formData = await request.formData();
  
  const name = formData.get('name') || '';
  const job_title = formData.get('job_title') || '';
  const phone = formData.get('phone') || '';
  const phone2 = formData.get('phone2') || '';
  const password = formData.get('password') || '';
  
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
    );
  }
  
  // Generate the signature HTML
  const signatureHtml = generateSignatureHtml(name, job_title, phone, phone2);
  
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
  );
}

function generateSignatureHtml(name, job_title, phone, phone2) {
  const phoneFormatted = phone ? 
    `<a href="tel:${phone.replace(/\s/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '')}" style="color:rgb(0,0,0)" target="_blank">${phone}</a>` : '';
  
  const phone2Formatted = phone2 ? 
    `<a href="tel:${phone2.replace(/\s/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '')}" style="color:rgb(0,0,0)" target="_blank">${phone2}</a>` : '';
  
  const separator = phone && phone2 ? '&nbsp;&nbsp;|&nbsp;&nbsp;' : '';
  
  const phoneHtml = (phone || phone2) ? 
    `<tr>
      <td valign="top" style="padding:0px 0px 7px;vertical-align:top">
        <p style="padding:0px;vertical-align:top;color:rgb(0,0,0);line-height:normal;font-size:12px;letter-spacing:0.2px;margin:0px!important">
          ${phoneFormatted}${separator}${phone2Formatted}
        </p>
      </td>
    </tr>` : '';
  
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
                            <td valign="top" style="padding:0px 0px 7px;vertical-align:top">
                                <p style="padding:0px;vertical-align:top;color:rgb(0,0,0);line-height:normal;font-size:12px;letter-spacing:0.2px;margin:0px!important">
                                    Offices: <a href="https://maps.app.goo.gl/1X7Fk11UJCHmtrqE7" style="color:rgb(0,0,0)" target="_blank">Australia</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://www.google.com/maps/place/223+S+Beverly+Dr,+Beverly+Hills,+CA+90212,+USA/@34.0642184,-118.3993565,1627m/data=!3m2!1e3!4b1!4m6!3m5!1s0x80c2bbfbf078a93f:0x61e9574a012d1ec7!8m2!3d34.0642184!4d-118.3993565!16s%2Fg%2F11k3r4mq1s!5m1!1e3?entry=ttu&g_ep=EgoyMDI1MDQyMC4wIKXMDSoASAFQAw%3D%3D" style="color:rgb(0,0,0)" target="_blank">USA</a>
                                </p>
                            </td>
                        </tr>
                        ${phoneHtml}
                        <tr>
                            <td valign="top" style="padding:0px 0px 12px;vertical-align:top">
                                <table cellpadding="0" cellspacing="0" border="0" style="color:rgb(0,0,0);font-size:8px;background:none;border-collapse:collapse;border-spacing:0px;border:0px;margin:0px;padding:0px;width:274px;max-width:288px">
                                    <tbody>
                                        <tr>
                                            <td style="padding:0px 20px 0px 0px;vertical-align:top;width:101px">
                                                <a href="https://stackedfarm.com/" style="color:rgb(77,77,77);font-size:10px;letter-spacing:0.2px" target="_blank">stackedfarm.com</a>
                                            </td>
                                            <td style="padding:0px 20px 0px 0px;vertical-align:top;width:63px">
                                                <a href="https://www.linkedin.com/company/stackedfarm/" style="color:rgb(77,77,77);font-size:10px;letter-spacing:0.2px" target="_blank">LinkedIn</a>
                                            </td>
                                            <td style="padding:0px;vertical-align:top">
                                                <a href="https://www.instagram.com/stackedfarm/" style="color:rgb(77,77,77);font-size:10px;letter-spacing:0.2px" target="_blank">Instagram</a>
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
</table>`;
}

// Export for Cloudflare Workers
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};