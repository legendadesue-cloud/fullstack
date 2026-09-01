"use client";

import { useEffect,useRef } from "react";

export default function ApiDocs() {
  const redocContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let mounted = true;

    if (mounted && redocContainerRef.current) {
      script = document.createElement("script");
      script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js";
      script.async = true;

      script.onload = () => {
        // @ts-ignore
        window.Redoc.init(
          "http://localhost:4000/swagger.json",
          {},
          redocContainerRef.current
        );
      }
    }

    document.body.appendChild(script);

    return () => {
      mounted = false;
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div ref={redocContainerRef}  />;
}