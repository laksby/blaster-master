import { FC, useEffect, useRef } from 'react';
import { initializeGame } from '../game';

export const IndexPage: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initializeGame(canvasRef.current);
    }
  }, []);

  return <canvas ref={canvasRef} />;
};

export default IndexPage;
