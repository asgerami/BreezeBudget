import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";

export const Globe: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current) {
                width = canvasRef.current.offsetWidth;
            }
        };

        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 0,
            diffuse: 1.2,
            scale: 1,
            mapSamples: 16000,
            mapBrightness: 2,
            baseColor: [0.3, 0.3, 0.3], // Dark gray
            markerColor: [0.078, 0.722, 0.651], // Teal 500
            glowColor: [0.078, 0.722, 0.651],
            markers: [
                // US location marker
                { location: [37.7595, -122.4367], size: 0.1 }
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.005;
                state.width = width * 2;
                state.height = width * 2;
            }
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div style={{ width: '100%', maxWidth: 600, aspectRatio: 1, margin: 'auto', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', contain: 'layout paint size', opacity: 1 }}
                className="transition-opacity duration-1000 opacity-100"
            />
        </div>
    );
};
