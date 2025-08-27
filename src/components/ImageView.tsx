import React from 'react'
import { Image, ImageViewer, ImageProps } from 'tdesign-react'
import { BrowseIcon } from 'tdesign-icons-react'
import styled from 'styled-components'
import { getOrgImg, getThumbImg, IThumbImgProps } from 'services/basic'
import { randomStr } from 'utils/chart'
import EmptyImg from 'assets/image/empty-img.jpg'

interface ImageInfo {
  id: string
  mainImage: string
  thumbnail: string
}

export const enum ImgViewMode {
  LIST,
  VIEW,
}

interface IImageViewProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  fit?: ImageProps['fit']
  shape?: ImageProps['shape']
  imgs: string[] | string
  mode?: ImgViewMode
  /** 图片裁剪参数 */
  imgThumbConfigure?: IThumbImgProps
}

const ITrigger = styled.div`
  color: #fff;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  line-height: 1;
`

const ImgWrap = styled.div.attrs({
  className: 'flex',
})`
  flex-wrap: wrap;
  .t-image__error,
  .t-image__loading {
    .t-space-item:nth-child(2) {
      display: none;
    }
  }
`

const ListImage = styled(Image)`
  background-color: transparent;
  display: inline-block;
  width: var(--td-line-height-body-medium);
  height: var(--td-line-height-body-medium);
  padding: 1px;
  border-radius: 2px;
  overflow: hidden;
`

const ViewImage = styled(Image)`
  background-color: transparent;
  display: inline-block;
  width: 118px;
  height: 118px;
  padding: 4px;
  border-radius: 6px;
  overflow: hidden;
`

const ImageView = ({
  shape,
  imgs,
  size,
  fit = 'contain',
  mode = ImgViewMode.LIST,
  imgThumbConfigure = {},
}: IImageViewProps) => {
  const images = React.useMemo(() => {
    const list = imgs?.constructor === Array ? imgs : [imgs as string]
    const defaultImg = mode === ImgViewMode.LIST ? '' : EmptyImg

    return list.map((item: string) => item || defaultImg).filter((item) => !!item)
  }, [imgs, mode])

  const TImage: typeof Image = React.useMemo(() => (mode === ImgViewMode.LIST ? ListImage : ViewImage), [mode])

  const theImgs = React.useMemo(
    () =>
      images.reduce((imgSet: ImageInfo[], imgUrl) => {
        if (imgUrl) {
          let mainImage = imgUrl
          let thumbnail = imgUrl

          if (imgUrl !== EmptyImg) {
            if (imgUrl.indexOf('?') > -1) {
              mainImage = getOrgImg(imgUrl)
            } else {
              thumbnail = imgUrl + getThumbImg({ ...imgThumbConfigure, webp: /\.png(\?\S+|$)/i.test(imgUrl) === false })
            }
          }

          imgSet.push({
            id: randomStr(),
            mainImage,
            thumbnail,
          })
        }

        return imgSet
      }, []),
    [images],
  )

  return images.length && images[0] ? (
    <ImgWrap
      style={{
        justifyContent: mode === ImgViewMode.LIST ? 'space-around' : 'flex-start',
      }}
    >
      {theImgs.map((item, index) => {
        const trigger = ({ open }: { open: () => void }) => (
          <TImage
            key={item.id}
            shape={shape}
            src={item.thumbnail}
            overlayTrigger='hover'
            fit={fit}
            style={
              size
                ? {
                    height: `${size}px`,
                    width: `${size}px`,
                  }
                : undefined
            }
            overlayContent={
              item.thumbnail === EmptyImg ? null : (
                <ITrigger onClick={() => open()}>
                  <div style={{ margin: '2px auto' }}>
                    <BrowseIcon size='15px' name={'browse'} />
                  </div>
                </ITrigger>
              )
            }
          />
        )

        return (
          <ImageViewer
            key={index}
            closeOnOverlay
            title='预览单张图片'
            images={theImgs}
            trigger={trigger}
            defaultIndex={index}
          />
        )
      })}
    </ImgWrap>
  ) : null
}

ImageView.displayName = 'ImageView'

export default ImageView
