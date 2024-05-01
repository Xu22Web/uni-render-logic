/**
 * 创建id
 *
 * @param length 长度
 * @returns
 */
export const createRandomId = (length: number): string => {
  const id = Math.random()
    .toString(16)
    .slice(2, length + 2)
  const restLength = length - id.length
  if (!restLength) {
    return id
  }
  return `${id}${createRandomId(restLength)}`
}
