import React, { useState, useEffect } from "react";
import "aframe";
import { useNavigate } from "react-router-dom";

const VRView = () => {
  const [selectedImage, setSelectedImage] = useState("#a");
  const navigate = useNavigate();

  useEffect(() => {
    const sky = document.querySelector("#sky");
    sky.addEventListener("loaded", () => {
      sky.setAttribute("src", selectedImage);
    });

    // Cleanup previous sky image before setting new one
    return () => {
      sky.removeEventListener("loaded", () => {});
    };
  }, [selectedImage]);

  const changeSky = (imageId) => {
    const sky = document.querySelector("#sky");
    sky.setAttribute("src", ""); // Clear current image
    setTimeout(() => {
      setSelectedImage(imageId);
    }, 100); // Small delay before setting new image
  };

  return (
    <div>
      <a-scene>
        <a-assets>
          <img id="a" src="http://localhost:8000/media/images/a.jpeg" />
          <img id="d" src="http://localhost:8000/media/images/b.jpeg" />
          <img id="e" src="http://localhost:8000/media/images/e.jpeg" />
          <img id="f" src="http://localhost:8000/media/images/d.jpeg" />
        </a-assets>

        <a-sky id="sky" src={selectedImage} rotation="0 -90 0"></a-sky>

        <a-entity position="0 0 1.5">
          <a-camera></a-camera>
        </a-entity>
      </a-scene>

      <div className="dropdown-container">
        <label htmlFor="panorama-select">Choose a panorama:</label>
        <select
          id="panorama-select"
          value={selectedImage}
          onChange={(e) => changeSky(e.target.value)}
        >
          <option value="#a">Taj Mahal</option>
          <option value="#d">Kerala Hills</option>
          <option value="#e">Kashmir</option>
          <option value="#f">Kokan Forest</option>
        </select>
      </div>

      <button className="exit-button" onClick={() => navigate("/")}>
        Exit VR
      </button>

      <div className="text-overlay">
        Choose an image from the dropdown to explore it in 360 degrees.
      </div>

      <style>{`
        .text-overlay {
          position: absolute;
          border-radius: 20px;
          bottom: 30px;
          left: 30px;
          right: 30px;
          background-color: rgba(255, 255, 255, 0.8);
          color: black;
          padding: 10px;
          text-align: center;
          font-size: 16px;
          box-sizing: border-box;
          width: calc(100% - 60px);
          margin: 0 auto;
        }

        .dropdown-container {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(255, 255, 255, 0.9);
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        select {
          padding: 5px;
          font-size: 16px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }

        .exit-button {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid #ccc;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .exit-button:hover {
          background-color: rgba(240, 240, 240, 0.9);
        }
      `}</style>
    </div>
  );
};

export default VRView;
