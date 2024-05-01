/**
 * 绘制元素
 *
 * @param ele
 * @param options
 */
export const drawElement = (
  ele: HTMLVideoElement,
  options: { width: number; height: number }
) => {
  const { width, height } = options
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = width
  canvas.height = height
  ctx.drawImage(ele, 0, 0, width, height)
  const data = canvas.toDataURL('image/png')
  return data
}

/**
 * 保留两位小数
 *
 * @param value
 * @returns
 */
export const toFixed = (value: number) => value.toFixed(2)
