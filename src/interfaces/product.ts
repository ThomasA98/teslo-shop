export interface IProduct {
    _id: string
    description: string
    images: string[]
    inStock: number
    price: number
    slug: string
    tags: string[]
    title: string
    sizes: ISize[]
    type: IType
    gender: IGender
    createdAt: string
    updatedAt: string
}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL'
export type IType = 'shirts'|'pants'|'hoodies'|'hats'
export type IGender =  'men'|'women'|'kid'|'unisex'