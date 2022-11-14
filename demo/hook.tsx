import React from 'react'
import Image, { StaticImageData } from 'next/image'

type loaderType = {
  image: string | StaticImageData
  width?: number
  height?: number
  quality?: number
  alt?: string
  layout?: 'fixed' | 'fill' | 'intrinsic' | 'responsive' | undefined
  className?: string
}

export function useImage({
  image,
  width,
  height,
  quality,
  alt,
  layout,
  className,
}: loaderType) {
  const optimization = () => {
    return typeof image === 'string'
      ? `${image}?w=${width}&q=${quality || 75}`
      : `${image.src}?w=${width}&q=${quality || 75}`
  }

  const ImageOptimized = () => {
    return (
      <>
        <Image
          className={className}
          loader={optimization}
          layout={layout}
          src={image}
          width={width}
          height={height ?? '100%'}
          alt={alt}
        />
      </>
    )
  }

  return { ImageOptimized }
}