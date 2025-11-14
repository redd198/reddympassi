const OptimizedImage = ({ src, alt, className = "", priority = false, width, height }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
      style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
    />
  )
}

export default OptimizedImage
