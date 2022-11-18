import React, { useState } from "react";
import "./App.css";

function App() {
    // state for uploading image in localStorage
    interface Image {
        imageFile: File;
        image: HTMLImageElement;
        width: number;
        height: number;
    }

    const [image, setImage] = useState<Image | null>(null);
    //useState for 2d Array
    const [pixelArray, setPixelArray] = useState<number[][] | null>(null);

    // const getImageData = () => {
    //     //read pixel data from image
    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");
    //     const img = new Image();
    //     img.src = URL.createObjectURL(image?.image);
    //     img.onload = () => {
    //         canvas.width = img.width;
    //         canvas.height = img.height;
    //         ctx?.drawImage(img, 0, 0);
    //         const data = ctx?.getImageData(0, 0, img.width, img.height);
    //         console.log(data);
    //     }

    // }

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {image && image.imageFile.type === "image/png" && (
                <>
                    {/* //display image as img */}
                    <img
                        src={image.image.src}
                        alt="uploaded"
                        style={{ width: "200px", height: "200px" }}
                    />
                    {/* // display image in a canvas */}
                    <canvas
                        id="canvas"
                        //draw image on canvas
                        ref={(canvas) => {
                            const ctx = canvas?.getContext("2d");
                            const img = new Image();
                            img.src = URL.createObjectURL(image.imageFile);
                            img.onload = () => {
                                ctx?.drawImage(img, 0, 0);
                                const data = ctx?.getImageData(
                                    0,
                                    0,
                                    img.width,
                                    img.height
                                );
                                console.log(data);
                                //how is this data stored? -> in a Uint8ClampedArray, what is the format? -> RGBA, so it is RBGA for each pixel in order?-> yes
                                const dataArr = [];
                                if (data) {
                                    console.log(data.data.length);
                                    for (let x = 0; x < data.data.length; x += 4) {
                                        const rowArr = [data.data[x], data.data[x + 1], data.data[x + 2], data.data[x + 3]];
                                        dataArr.push(rowArr);
                                    }
                                    setPixelArray(dataArr);
                                    console.log(dataArr.length);
                                    console.log(dataArr);
                                }
                            };
                        }}
                    />
                </>
            )}

            {/* ask user to upload png image */}

            <input
                type="file"
                //accept jpg and bmp
                accept="image/png"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onChange={(e) => {
                    if (e.target.files) {
                        const img = new Image();
                        img.src = URL.createObjectURL(e.target.files[0]);
                        setImage({
                            imageFile: e.target.files[0],
                            image: img,
                            width: img.width,
                            height: img.height,
                        });
                    }
                }}
            />

            <div>
                <h3> Image Data </h3>
                <textarea 
                value={pixelArray?.toString()}
                style={{ height: "50vh", width: "50vw" }}></textarea>
            </div>
        </div>
    );
}

export default App;
