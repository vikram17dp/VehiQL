export const setializedCarData = (car,wishlisted)=>{
    return{
        ...car,
        price:car.price ? parseInt(car.price.toString()) : 0,
        createdAt:car.createdAt?.toISOString(),
        updatedAt:car.updatedAt?.toISOString(),
        wishlisted:wishlisted
    }
}