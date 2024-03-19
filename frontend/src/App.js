
import * as React from 'react';
import { render } from 'react-dom';
import { useEffect, useState } from "react";
import Map, { Marker, Popup } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import { Room, Star } from "@material-ui/icons";

import "./app.css"

import axios from "axios"
import Register from './components/Register';
import Login from './components/Login';


const MAPBOX_TOKEN = 'pk.eyJ1Ijoicm9oYm9hbTc5IiwiYSI6ImNsM2VpbHB6NTAwYXczYm1scHAxOTFsaWEifQ.RvVeH9-pp9HwW6TsQG-DPQ'; // Set your mapbox token here

function App() {
  const myStorage = window.localStorage;
  const [currentuser, setCurrentUser] = useState(null);
  const [pins, setPins] = React.useState([]);
  const [showPopup, setShowPopup] = React.useState(true);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setshowRegister] = useState(false);
  const [showLogin, setshowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    longitude: 52,
    latitude: 13,
    zoom: 4,
  })

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error)
      }
    };
    getPins()
  }, [])

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  }

  const handleAddClick = (e) => {
    const {lat, lng: long} = e.lngLat;
    setNewPlace({lat, long});
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    const newPin = {
      username: currentuser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long,
    }

    try {
      const res = await axios.post("/pins", newPin)
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error)
    }
  }


  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <div>
      <Map
        initialViewState={{
          latitude: 52,
          longitude: 13,
          zoom: 4
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        onDblClick = {handleAddClick}
        // onClick = {handleAddClick}
      >
        {pins.map(p => (
          <>
            <Marker 
              longitude={p.long} 
              latitude={p.lat} 
              color="red" 
              offsetLeft={-visualViewport.zoom * 5}
              offsetTop={-visualViewport.zoom * 10}
              >
            <Room
              style={{ fontsize: visualViewport.zoom * 10, color: 
                p.username===currentuser ?"tomato" : "slateblue", 
                cursor: "pointer",
              }} 
              onClick = {() => handleMarkerClick(p._id)}
              />
            </Marker>

            {p._id === currentPlaceId && (
              <Popup
              // key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className='stars'>
                  {Array(p.rating).fill(<Star className='star'/>)}
                </div>
                <label>Information</label>
                <span className='username'>Created by <b>{p.username}</b></span>
                {/* <span className='date'>1 hour ago</span> */}
              </div>
            </Popup>
          )}
        </>
        ))}
        {newPlace && (
          <>
          <Popup
          // key={p._id}
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder="Enter a Title" 
                onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea placeholder='Say someting about this place.'
                onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className='submitButton' type='submit'>Add Pin</button>
              </form>
            </div>
          </Popup>
          </>
      )}
      {currentuser ? (
        <button className ="button logout" onClick={handleLogout}>Log Out</button>
        ) : (
          <div className='buttons'>
          <button className ="button login" onClick={() => setshowLogin(true)}>Login</button>
          <button className ="button register" onClick={() => setshowRegister(true)}>Register</button>
        </div>
        )}
        {showRegister && <Register setshowRegister={setshowRegister} />}
        {showLogin && <Login setshowLogin={setshowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      </Map>
    </div>
  );
}

export default App;

render(<App />, document.body.appendChild(document.createElement('div')));
