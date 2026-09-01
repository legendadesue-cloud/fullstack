interface ImageCardProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageCard({
  src,
  alt,
  width,
  height,
  className,
}: ImageCardProps) {
  return (
    <div>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    </div>
  );
}