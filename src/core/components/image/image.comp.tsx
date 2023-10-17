import { DetailedHTMLProps, ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import spinner from "assets/images/Spinner-1s-200px.svg";

/**
 * Image component defers loading of image. Initially it will load
 * {@link ImageProps.loadingSrc} image When image will be in user's view
 * then it will load actual image {@link ImageProps.src}
 * Image component works on the concept of [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
 * @param props Image props {@link ImageProps}
 * @returns Image component having feature of lazy loading of image
 */
export function Image(props: ImageProps) {
  const ref = useRef(null);
  const { src, loadingSrc, observerInit, ...rest } = props;
  const [intersected, setIntersected] = useState<boolean>(false);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !intersected) {
        ref.current && observer.unobserve(ref.current);
        setIntersected(true);
        setInView(true);
      }
    }, observerInit);
    ref.current && observer.observe(ref.current);
  }, []);

  return <img data-src={src} src={inView ? src : loadingSrc || spinner} ref={ref} {...rest} />;
}

export interface ImageProps
  extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  /**
   * src of image
   */
  src: any;
  /**
   * loading/placeholder image
   * this image will appear to client until src image will load
   */
  loadingSrc?: string;
  /**
   * Always define width and height of image
   * otherwise [CLS](https://web.dev/cls/) will impact
   */
  width?: string;
  /**
   * [IntersectionObserver options](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
   */
  observerInit?: IntersectionObserverInit;
}
