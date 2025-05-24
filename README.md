# RAVE Audio Transfer App

React Native app for real-time audio timbre transfer using RAVE neural network models.

## Features

- **Server Connection**: Connect to Python Flask server
- **Audio Recording**: Record and manage audio clips
- **Audio Transformation**: Apply 5 RAVE models (Jazz, Darbouka, Speech, Cats, Dogs)

## Setup

### Mobile App
```bash
npm install
expo start
```

### Python Server
```bash
cd server
pip install -r requirements.txt
python server.py
```

## Usage

1. Start Python server (note IP/Port)
2. Open mobile app via Expo Go
3. Connect to server in Home tab
4. Record audio in Record tab
5. Transform audio in RAVE tab

## Tech Stack

- **Frontend**: React Native, Expo, Redux
- **Backend**: Flask, PyTorch, ONNX
- **AI**: RAVE (Variational AutoEncoder)

## API Endpoints

- `GET /` - Connection test
- `POST /upload` - Upload audio file
- `GET /download` - Download transformed audio
- `GET /getmodels` - List available models
- `GET /selectModel/<name>` - Select model

## Credits

RAVE model by Antoine Caillon (IRCAM)