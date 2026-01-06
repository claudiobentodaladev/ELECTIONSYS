export const joinedArray = (array_) => {
    let ids = [];
    array_.map(({ id }, index) => {
        ids.push(id)
    })
    return ids.join(",")
}