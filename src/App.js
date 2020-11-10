import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import './App.css';


    // https://www.adorama.com/alc/wp-content/uploads/2018/02/BBBURGER8-1024x683-825x465.jpg
    // https://www.thestatesman.com/wp-content/uploads/2017/08/1493458748-beauty-face-517.jpg

const app = new Clarifai.App({
    // apiKey: 'YOUR_API_KEY' 
    apiKey: '779905e99d8b4c4a9c724186a7429ce8'
});

const particlesOptions = {
    particles: {
        number: {
            value: 105,
            density: {
                enable: true,
                value_area: 800 
            }
        }

    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {}
        }
    }

    calculateFacelocation = (data) => {
        const  clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col*width,
            topRow: clarifaiFace.top_row*height,
            rightCol: width - (clarifaiFace.right_col*width),
            bottomRow: height - (clarifaiFace.bottom_row*height)
        }
    }

    displayFaceBox =(box) => {
        this.setState({ box: box });
    }

    onInputChange = (event) => {
        this.setState({ input: event.target.value});
    } 

    onButtonSubmit = () => {
        this.setState({ imageUrl: this.state.input});
        app.models.predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
            .then((response) => this.displayFaceBox(this.calculateFacelocation(response)))
            .catch(err => console.log(err));
    }

    render() {
        return (
        <div className="App">
            <Particles className='particles' params={particlesOptions} />
            <Navigation />
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} /> 
        </div>
        );
    }
}

export default App;
