import React, {useRef, useEffect, useState} from "react";

const Whiteboard = ({socket}) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        
        canvas.width = window.innerWidth * 2;
        canvas.height = window.innerHeight * 2;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;

        const context = canvas.getContext('2d');
        context.scale(2,2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;

        contextRef.current = context;
        console.log("Canvas initialized.")
    }, []);

    const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        const context = contextRef.current;
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({nativeEvent}) => {
        if (!isDrawing) return;
        const {offsetX,offsetY} = nativeEvent;
        const context = contextRef.current;

        context.lineTo(offsetX,offsetY);
        context.stroke();

        socket.emit('drawing', {
            x: offsetX,
            y: offsetY,
            color: context.strokeStyle,
            width: context.innerWidth
        });
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    useEffect(() => {
        const context = contextRef.current;

        const drawRemotePoint = (data) => {
            context.lineTo(data.x, data.y);
            context.stroke();
        };

        const startRemoteDrawing = (data) => {
            context.beginPath();
            context.moveTo(data.x, data.y);
        }

        socket.on('drawing', drawRemotePoint)

        return () => {
            socket.off('drawing', drawRemotePoint)
        };
    }, [socket]);

    return (
        <canvas
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onMouseMove={draw}
            ref={canvasRef}
        />
    );
};

export default Whiteboard;