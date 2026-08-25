"use client";

import {
  forwardRef,
  useEffect,
  useState,
  type ImgHTMLAttributes,
} from "react";
import { FALLBACK_STILL, stillSrc } from "@/lib/utils";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export const SafeImage = forwardRef<HTMLImageElement, Props>(
  function SafeImage({ src, alt = "", onError, ...rest }, ref) {
    const requested = typeof src === "string" ? src : "";
    const [current, setCurrent] = useState(() => stillSrc(requested));

    useEffect(() => {
      setCurrent(stillSrc(requested));
    }, [requested]);

    return (
      <img
        ref={ref}
        {...rest}
        src={current}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={(event) => {
          if (current !== FALLBACK_STILL) setCurrent(FALLBACK_STILL);
          onError?.(event);
        }}
      />
    );
  },
);
