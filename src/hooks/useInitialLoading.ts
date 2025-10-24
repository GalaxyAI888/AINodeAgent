import { useState, useEffect } from "react";

export function useInitialLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 90) {
        progress = 90;
      }
      setLoadingProgress(Math.min(progress, 100));
    }, 200);

    // 检查所有关键资源是否加载完成
    const checkResourcesLoaded = () => {
      return new Promise<boolean>((resolve) => {
        // 检查 DOM 是否完全加载
        if (document.readyState !== "complete") {
          resolve(false);
          return;
        }

        // 检查关键图片是否加载完成
        const images = document.querySelectorAll("img");
        let loadedImages = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          resolve(true);
          return;
        }

        const checkImageLoad = () => {
          loadedImages++;
          if (loadedImages >= totalImages) {
            resolve(true);
          }
        };

        images.forEach((img) => {
          if (img.complete) {
            checkImageLoad();
          } else {
            img.addEventListener("load", checkImageLoad);
            img.addEventListener("error", checkImageLoad);
          }
        });

        // 超时保护
        setTimeout(() => resolve(true), 3000);
      });
    };

    // 模拟最小加载时间
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000));

    Promise.all([checkResourcesLoaded(), minLoadingTime]).then(() => {
      clearInterval(interval);
      setLoadingProgress(100);

      // 短暂延迟后隐藏 loading
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    });

    return () => clearInterval(interval);
  }, []);

  return { isLoading, loadingProgress };
}
