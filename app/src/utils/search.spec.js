import smartSearch from 'utils/search'

// many tests compare ID's at the end, so don't change these IDs
const testData = [
  {
    name: 'absence demento',
    id: 'ABC123BABUNME',
  },
  {
    name: 'daiquiri memento',
    id: 'ABC124BABUNME',
  },
  {
    name: 'playwright memento',
    id: 'ASDF234FSD',
    idecoy: 'ABC123BABUNME',
  },
  {
    name: 'lightning possession prophecy',
    id: 'DFGKJ23487D',
  },
]

describe('Exact Search Function', () => {
  const results = smartSearch(
    'ABC123BABUNME',
    [
      {
        fieldName: 'name',
        searchType: 'fuzzy',
      },
      {
        fieldName: 'id',
        searchType: 'exact',
      },
    ],
    testData,
  )
  it('It should find exact searches and sort them above fuzzy searches', () => {
    expect(results[0].id).toBe('ABC123BABUNME')
  })
  it('Should not fuzzy match a field that is set to exact match', () => {
    expect(results.length).toBe(1)
  })
  it('Should not exact match fields not specified to be searched e.g. idecoy in this case', () => {
    expect(results[0].idecoy).toBe(undefined)
  })
})

describe('Fuzzy Search Function', () => {
  const results2 = smartSearch(
    'momento', // misspell memento
    [
      {
        fieldName: 'name',
        searchType: 'fuzzy',
      },
    ],
    testData,
  )
  it('Should find both items with memento in their name, and they should be sorted by match threshold', () => {
    expect(results2[0].id).toBe('ABC124BABUNME')
    expect(results2[1].id).toBe('ASDF234FSD')
    expect(results2[2].id).toBe('ABC123BABUNME')
    expect(results2.length).toBe(3) // nothing extra included
  })
})
