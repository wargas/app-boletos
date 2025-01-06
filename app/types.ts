export interface ResponseSearch {
    sum: Sum
    meta: Meta
    data: Boleto[]
  }
  
  export interface Sum {
    value: number
  }
  
  export interface Meta {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: any
    previousPageUrl: any
  }
  
  export interface Boleto {
    id: number
    description: string
    value: number
    due: string
    userId: number
    createdAt: string
    updatedAt: string
  }
  