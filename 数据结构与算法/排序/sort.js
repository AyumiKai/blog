/**
 * 冒泡排序
 * @param {*} arr 
 */
const bubbleSort = (arr) => {
    if (arr.length <= 1) return
    for (let i = 0; i < arr.length; i++) {
        let hasChange = false
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                const temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                hasChange = true
            }
        }
        if (!hasChange) break
    }
    console.log(arr)
}

/**
 * 插入排序
 * @param {*} arr 
 */
const insertionSort = (arr) => {
    if (arr.length <= 1) return
    for (let i = 1; i < arr.length; i++) {
        const temp = arr[i]
        let j = i - 1
        for (j; j >= 0; j--) {
            if (arr[j] > temp) {
                arr[j + 1] = arr[j]
            } else {
                break
            }
        }
        arr[j + 1] = temp
    }
    console.log(arr)
}

/**
 * 选择排序
 * @param {*} arr 
 */
const selectionSort = (arr) => {
    if (arr.length <= 1) return
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        const temp = arr[i]
        arr[i] = arr[minIndex]
        arr[minIndex] = temp
    }
    console.log(arr)
}
