import NextImage, { ImageProps as NextImageProps } from 'next/image'

type ImageProps = NextImageProps & {
  //
}

const Image = ({
  quality = 85,
  priority = false,
  loading = 'lazy',
  src,
  alt,
  ...rest
}: ImageProps) => {
  const useFill = !rest.width && !rest.height

  return (
    <NextImage
      src={src}
      alt={alt}
      quality={quality}
      priority={priority}
      loading={loading}
      sizes={rest.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      {...rest}
      {...(useFill && { fill: true, style: { objectFit: 'cover', ...rest.style } })}
    />
  )
}

export default Image
