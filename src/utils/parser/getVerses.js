import errors from "./errors"

const getVerses = (cv, strVerses) => {
  if (typeof strVerses === 'number') strVerses = strVerses.toString()
  const parts = strVerses.split('-')
  let from = parseInt(parts[0])
  let to = parseInt(parts[parts.length - 1])
  if (from > to) {
    const temp = from
    from = to
    to = temp
  }
  const versesInChapter = cv.book.versesPerChapter[cv.chapter - 1]
  if (from === 0 || to > versesInChapter) return errors.verse
  cv.from = from
  cv.to = to
  return cv
}

module.exports = getVerses