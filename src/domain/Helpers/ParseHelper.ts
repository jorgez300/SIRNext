export const StringToNumber = (value:string) : number =>{

    let result : number = Number(value.replace(/,/g, '.'));

    if (isNaN(result)){
        result = 0;
    }

    return result;

}