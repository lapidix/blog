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
      onError={(e) => {
        const error = new Error('Image loading failed')
        const { captureException } = require('@sentry/nextjs')

        captureException(error, {
          fingerprint: ['image-loading-failed'],
          tags: {
            error_type: 'image_loading',
            component: 'Image',
          },
          contexts: {
            image: {
              src: typeof src === 'string' ? src : 'object',
              alt,
            },
          },
          level: 'warning',
        })
      }}
    />
  )
}

export default Image
