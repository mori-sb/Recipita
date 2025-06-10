// components/LoadingScreen.tsx
import React, { useRef, useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean; // ロード中かどうかを制御するprops
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [owlImage, setOwlImage] = useState<HTMLImageElement | null>(null);

  // フクロウの描画状態とアニメーション用変数
  const owl = useRef({
    x: 0, // 初期X座標 (アニメーションで変化)
    y: 0, // 初期Y座標 (Canvasの高さに基づいて設定)
    vx: 2, // X方向の速度
    width: 96, // <<< ここを画像の元の縦横比に合わせて大きくする (例: 96px)
    height: 76, // <<< ここを画像の元の縦横比に合わせて大きくする (例: 76px)
    //     例: 元の画像が幅96px、高さ76pxなら、このまま
    //     もし画像が正方形に近いなら、widthとheightも近い値にする
  });

  // 画像のプリロード
  useEffect(() => {
    const img = new window.Image();
    img.src = "/images/recipita-owl.png"; // ここにフクロウ画像の正しいパスを設定してください
    img.onload = () => {
      // 画像がロードされた後に、実際の画像のサイズを元にowlのサイズを設定することもできます
      // ただし、アニメーションの滑らかさを保つために、固定値にした方が良い場合もあります。
      // もし画像の実際のサイズを使いたい場合は、以下のコメントアウトを外してください。
      // owl.current.width = img.naturalWidth;
      // owl.current.height = img.naturalHeight;
      setOwlImage(img);
    };
    img.onerror = (err) => {
      console.error("フクロウ画像のロードに失敗しました:", err);
    };
  }, []);

  // アニメーションの制御
  useEffect(() => {
    if (!isLoading || !owlImage) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvasのサイズを、メインコンテンツの幅に合わせる（max-w-smは384px）
    const mainContentWidth = Math.min(window.innerWidth, 384);
    const mainContentHeight = window.innerHeight;

    canvas.width = mainContentWidth;
    canvas.height = mainContentHeight;

    // フクロウの初期X座標をCanvasの中央に設定
    if (owl.current.x === 0 && owl.current.vx === 2) {
      // 中央から少し左にずらす (Canvasの幅に応じて調整)
      owl.current.x = canvas.width / 2 - owl.current.width / 2 - 50;
    }
    // フクロウのY座標をCanvasの中央より少し上に設定
    owl.current.y = canvas.height / 2 - owl.current.height / 2 - 50;

    const animate = () => {
      if (!ctx || !owlImage) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#eff6ff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      owl.current.x += owl.current.vx;

      // フクロウの移動範囲をCanvasの中央に制限
      const paddingX = 20; // 左右の余白
      const minX = paddingX;
      const maxX = canvas.width - owl.current.width - paddingX;

      if (owl.current.x >= maxX && owl.current.vx > 0) {
        owl.current.vx *= -1;
      } else if (owl.current.x <= minX && owl.current.vx < 0) {
        owl.current.vx *= -1;
      }

      const oscillation = Math.sin(Date.now() * 0.005) * 10;
      const currentY = owl.current.y + oscillation;

      ctx.save();
      if (owl.current.vx < 0) {
        ctx.translate(owl.current.x + owl.current.width, currentY);
        ctx.scale(-1, 1);
        ctx.drawImage(owlImage, 0, 0, owl.current.width, owl.current.height);
      } else {
        ctx.drawImage(
          owlImage,
          owl.current.x,
          currentY,
          owl.current.width,
          owl.current.height
        );
      }
      ctx.restore();

      ctx.fillStyle = "#2563eb";
      ctx.font = "24px Inter, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "レシートを読み取り中...",
        canvas.width / 2,
        canvas.height / 2 + 50
      );
      ctx.fillText(
        "しばらくお待ちください",
        canvas.width / 2,
        canvas.height / 2 + 80
      );

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoading, owlImage]);

  // ウィンドウリサイズ時のCanvasサイズ調整
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && isLoading) {
        const mainContentWidth = Math.min(window.innerWidth, 384);
        const mainContentHeight = window.innerHeight;
        canvas.width = mainContentWidth;
        canvas.height = mainContentHeight;
        owl.current.y = canvas.height / 2 - owl.current.height / 2 - 50;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50/90 backdrop-blur-sm">
      <canvas
        ref={canvasRef}
        className="block max-w-sm w-full h-full"
        style={{
          maxWidth: "384px", // Tailwindのmax-w-smに相当
          maxHeight: "100vh",
          margin: "auto",
        }}
      ></canvas>
    </div>
  );
};

export default LoadingScreen;
