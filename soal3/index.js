function getMinValues(arr, subsetLength) {
    let minValues = [];
    
    for (let i = 0; i <= arr.length - subsetLength; i++) {
        let subset = arr.slice(i, i + subsetLength);
        console.log(subset)
        let minValue = Math.min(...subset);
        minValues.push(minValue);
    }

    return minValues;
}

function getMaxValue(arr) {
    return Math.max(...arr);
}

const array = [8, 1, 6, 3, 66, 1, 8, 5];
const subsetLength = 3;
const result = getMinValues(array, subsetLength);
const maxValue = getMaxValue(result);

console.log("Array hasil subset :",result)
console.log("Nilai tersebar dalam array :",maxValue)