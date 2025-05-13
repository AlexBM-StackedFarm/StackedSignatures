# Stacked Farm Email Signature Generator

A simple web application for generating consistent email signatures for Stacked Farm staff.

## Features

- Web-based email signature generation
- Copy-to-clipboard functionality
- Mobile responsive design
- Password protection
- Deployable to Cloudflare Pages or as Docker container

## Prerequisites

For local development:
- Node.js (optional)
- Python 3.11

For Docker deployment:
- Docker
- Docker Compose

## Quick Start (Docker)

1. Clone this repository
2. Navigate to the repository directory
3. Run the application with Docker Compose:

```bash
docker-compose up -d
```

4. Access the application in your browser at `http://localhost:5032`

## Quick Start (Local Development)

1. Clone this repository
2. Navigate to the repository directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the application:

```bash
python app/main.py
```

5. Access the application in your browser at `http://localhost:5000`

## Usage

1. Fill in your details in the form (name, job title, optional phone numbers)
2. Enter the password: `Lettuce2025`
3. Click "Generate Signature"
4. Preview your signature
5. Click "Copy to Clipboard"
6. Paste into Gmail settings:
   - In Gmail, go to Settings → See all settings → General → Signature
   - Create a new signature or edit an existing one
   - Paste your new signature and save changes

## Deployment Options

### Docker Deployment

For internal network deployment:

1. Modify the `docker-compose.yml` file to suit your environment
2. Start the container:

```bash
docker-compose up -d
```

3. Access the application at `http://[your-server-ip]:5032`

### Cloudflare Pages Deployment

To deploy to Cloudflare Pages:

1. Push this repository to GitHub at: `github.com/AlexBM-StackedFarm/StackedSignatures`
2. Log in to your Cloudflare dashboard
3. Go to Pages > Create a project > Connect to Git
4. Select the repository: `AlexBM-StackedFarm/StackedSignatures`
5. Set up your build settings:
   - Framework preset: None
   - Build command: `./build.sh`
   - Build output directory: `dist`
   - Environment variables: Add if needed
6. Deploy!

NOTE: The app uses Cloudflare Functions (in the `/functions` directory) to handle server-side logic like password verification.

## Customization

To modify the signature template, edit:

- `app/templates/signature.html` - HTML structure of the signature
- `app/static/css/styles.css` - Styling for the web interface
- `app/main.py` - Server-side code including password protection

## License

This project is proprietary and for internal use by Stacked Farm only.