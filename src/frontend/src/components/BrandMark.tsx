type BrandMarkProps = {
  className?: string;
  alt?: string;
};

export default function BrandMark({
  className = "h-5 w-auto",
  alt = "Apex Architects logo",
}: BrandMarkProps) {
  return (
    <img
      src="/brand/apex-logo.png"
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
    />
  );
}
