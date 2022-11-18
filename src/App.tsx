import React, { useEffect, useState, useRef } from "react";
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

    // //const string return function that return hex value from rgba array values
    // const rgbaToHEX = (rgba: number[]) => {
    //     return (
    //         "0x" +
    //         ((1 << 24) + (rgba[0] << 16) + (rgba[1] << 8) + rgba[2])
    //             .toString(16)
    //             .slice(1)
    //     );
    // };

    const rgbaToRGB = (rgba: number[]) => {
        return `{${rgba[0]}, ${rgba[1]}, ${rgba[2]}}`;
    };

    const textarea = useRef<HTMLTextAreaElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);

    const setTextAreaText = (text: string) => {
        if (textarea.current) {
            if(!image) return;
            const matrixText = "int " + image.imageFile.name.replace('.','_') + "[" + ((image.height) * (image.width)).toString() + "][3] = {" +  text + "};";
            textarea.current.value = matrixText;
        }
    };

    useEffect(() => {
        if (!canvas && !image) return;
        if (!canvas.current || !image) return;

        const img = new Image();
        img.src = URL.createObjectURL(image.imageFile);
        img.onload = () => {
            console.log("image loaded");
            if (!canvas.current) return;
            const ctx = canvas.current.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(
                    0,
                    0,
                    image.width,
                    image.height
                );
                const data = imageData.data;
                const pixelArray: number[][] = [];
                for (let i = 0; i < data.length; i += 4) {
                    pixelArray.push([
                        data[i],
                        data[i + 1],
                        data[i + 2],
                        data[i + 3],
                    ]);
                    setPixelArray(pixelArray);
                }
            }
        };
    }, [image]);

    useEffect(() => {
        if (!pixelArray) return;
        const data: string = pixelArray
            .map((pixel) => rgbaToRGB(pixel))
            .join(",\n");
        setTextAreaText(data);
    });

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
            <h1>png2matrix 1.0.0 | mfaseehuddin</h1>
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
                        ref={canvas}
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
                        img.onload = () => {
                            setImage({
                                image: img,
                                imageFile: e.target.files![0],
                                width: img.width,
                                height: img.height,
                            });
                        };
                    }
                }}
            />

            <div>
                <h3> Image Data </h3>
                <textarea
                    ref={textarea}
                    // value={pixelArray?.map((row) => {
                    //     return rgbaToRGB(row) + "\n";
                    //     return rgbaToRGB(row) + "\n";
                    // })}
                    style={{ height: "50vh", width: "50vw" }}
                ></textarea>
            </div>
        </div>
    );
}

export default App;
