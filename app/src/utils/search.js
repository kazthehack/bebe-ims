import Fuse from 'fuse.js'
import { get, uniqBy } from 'lodash'

const DEFAULT_FUZZY_OPTIONS = {
  shouldSort: true,
  includeScore: true,
  threshold: 0.4,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
}

const normalize = value => `${value || ''}`.toLowerCase().trim()

const search = (term = '', fieldSearchDefinitions = [], dataSource = [], fuzzyOptions = {}) => {
  const normalizedTerm = normalize(term)
  if (!normalizedTerm) {
    return dataSource
  }

  const exactFields = fieldSearchDefinitions
    .filter(def => def.searchType === 'exact')
    .map(def => def.fieldName)

  const fuzzyFields = fieldSearchDefinitions
    .filter(def => def.searchType !== 'exact')
    .map(def => def.fieldName)

  const exactMatches = dataSource.filter((row) => (
    exactFields.some(field => normalize(get(row, field)) === normalizedTerm)
  ))

  let fuzzyMatches = []
  if (fuzzyFields.length) {
    const fuse = new Fuse(dataSource, {
      ...DEFAULT_FUZZY_OPTIONS,
      ...fuzzyOptions,
      keys: fuzzyFields,
    })

    fuzzyMatches = fuse.search(term).map(result => (result && result.item ? result.item : result))
  }

  return uniqBy([...exactMatches, ...fuzzyMatches], item => get(item, 'id', JSON.stringify(item)))
}

export default search
