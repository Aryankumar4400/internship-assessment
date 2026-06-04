function secondLargest(arr) {
    let largest = -Infinity;
    let secondLargest = -Infinity;

    for (let num of arr) {
        if (num > largest) {
            secondLargest = largest;
            largest = num;
        } else if (num > secondLargest && num !== largest) {
            secondLargest = num;
        }
    }

    return secondLargest === -Infinity ? -1 : secondLargest;
}

console.log(secondLargest([12, 35, 1, 10, 34, 1]));
console.log(secondLargest([10, 10, 10]));

/*
Expected Output:
34
-1
*/