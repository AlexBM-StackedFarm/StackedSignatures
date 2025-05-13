from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_signature():
    # Get form data
    name = request.form.get('name', '')
    job_title = request.form.get('job_title', '')
    password = request.form.get('password', '')

    # Check password
    if password != 'Lettuce2025':
        return jsonify({
            'error': 'Incorrect password. Please try again.'
        }), 401

    # Optional fields
    phone = request.form.get('phone', '')
    phone2 = request.form.get('phone2', '')

    # Generate the signature HTML
    signature_html = render_template(
        'signature.html',
        name=name,
        job_title=job_title,
        phone=phone,
        phone2=phone2
    )

    return jsonify({
        'signature_html': signature_html
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=os.environ.get('DEBUG', 'False').lower() == 'true')