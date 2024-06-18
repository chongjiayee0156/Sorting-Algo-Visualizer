const canvas = document.getElementById('canvas');
const computedStyle = window.getComputedStyle(canvas);
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
const ctx = canvas.getContext('2d');
const arrayInput = document.getElementById('arrayInput');
const submitArrayBtn = document.getElementById('submitArrayBtn');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const clearBtn = document.getElementById('clearBtn');
const speedSelect = document.getElementById('speedSelect');
const pauseBtn = document.getElementById('pauseBtn');
const algorithmSelect = document.getElementById('algoSelect');
let array = [5,2,3,10,1];
let working_array = [];

const barSpacing = 10;

function drawArray(arr) {
    let barWidth = arr.length > 0 ? (canvasWidth - (arr.length - 1) * barSpacing) / arr.length : 0;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    console.log('arr:', arr);
    // Find the maximum value in the array
    const maxValue = Math.max(...arr);
    console.log('maxValue:', maxValue);
    
    var upscale = 0;
    // Determine the scaling factor based on maxValue and canvasHeight
    let scaleFactor = 0;
    if (maxValue < canvasHeight/2) {
        console.log('maxValue < canvasHeight/2');
        console.log('canvasHeight:', canvasHeight);
        scaleFactor = Math.ceil((canvasHeight/2) / maxValue);
        upscale = 1;
        console.log('scaleFactor:', scaleFactor);

    } else if (maxValue > canvasHeight) {
        scaleFactor = Math.ceil(maxValue / canvasHeight);
        upscale = -1;
    }

    arr.forEach((value, index) => {
        const x = index * (barWidth + barSpacing);
        const y = canvas.height - value * scaleFactor;
        console.log('canvasHeight:', canvasHeight);
        console.log('value:', value);
        console.log('y:', y);
        console.log('scaleFactor:', scaleFactor);
        console.log('canvas.height:', canvas.height);
        var barHeight = value * scaleFactor;
        // Draw bar
        ctx.fillStyle = 'lightgreen';    
        ctx.fillRect(x, y, barWidth, value * scaleFactor);
        
        // Draw text label
        ctx.fillStyle = 'lightgreen';
        ctx.font = `bold 2vh Arial`;
        ctx.textAlign = 'center';
        // ctx.textBaseline = 'top'; // Align text to the top
        // ctx.fillText(value.toString(), x + barWidth / 2, y + 20); // Adjusted vertical position
        ctx.textBaseline = 'bottom'; // Align text to the bottom
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5); // Adjusted vertical position above the bar
    });

}

let interval; // Global variable to hold interval ID
let paused = false; // Flag to track pause state

function bubbleSort(arr, intervalDuration) {
    let len = arr.length;
    let i = len - 1;
    let j = 0;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    paused = false; // Reset paused state
    interval = setInterval(() => {
        if (!paused) {
            if (i > 0) {
                if (j < i) {
                    if (arr[j] > arr[j + 1]) {
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        drawArray(arr);
                    }
                    j++;
                } else {
                    i--;
                    j = 0;
                }
            } else {
                clearInterval(interval);
                startBtn.disabled = false; // Enable start button when sorting is done
                pauseBtn.disabled = true; // Disable pause button when sorting is done
            }
        }
    }, intervalDuration);
}

function insertionSort(arr, intervalDuration) {
    let len = arr.length;
    let i = 1;
    let j = 0;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    paused = false; // Reset paused state

    interval = setInterval(() => {
        if (!paused) {
            if (i < len) {
                if (j >= 0 && arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    drawArray(arr);
                    j--;
                } else {
                    i++;
                    j = i - 1;
                }
            } else {
                clearInterval(interval);
                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        }
    }, intervalDuration);
}

function selectionSort(arr, intervalDuration) {
    let len = arr.length;
    let i = 0;
    let j = 0;
    let minIdx = 0;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    paused = false; // Reset paused state

    interval = setInterval(() => {
        if (!paused) {
            if (i < len - 1) {
                if (j < len) {
                    if (arr[j] < arr[minIdx]) {
                        minIdx = j;
                    }
                    j++;
                } else {
                    if (minIdx !== i) {
                        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                        drawArray(arr);
                    }
                    i++;
                    j = i + 1;
                    minIdx = i;
                }
            } else {
                clearInterval(interval);
                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        }
    }, intervalDuration);
}


async function mergeSort(arr, start, end, intervalDuration) {
    if (start >= end) {
        return;
    }

    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid, intervalDuration);
    await mergeSort(arr, mid + 1, end, intervalDuration);
    if (!paused) {
        await merge(arr, start, mid, end, intervalDuration);
        drawArray(arr); // Visualize after merging
    }
}

async function merge(arr, start, mid, end, intervalDuration) {
    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);

    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            arr[k++] = left[i++];
        } else {
            arr[k++] = right[j++];
        }
    }

    while (i < left.length) {
        arr[k++] = left[i++];
    }

    while (j < right.length) {
        arr[k++] = right[j++];
    }

    if (!paused) {
        await new Promise(resolve => setTimeout(resolve, intervalDuration)); // Delay for visualization
    }
}

function startMergeSort(arr, intervalDuration) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    paused = false; // Reset paused state

    mergeSort(arr, 0, arr.length - 1, intervalDuration).then(() => {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    });
}


async function quickSort(arr, start, end, intervalDuration) {
    if (start >= end) {
        return;
    }

    const index = await partition(arr, start, end, intervalDuration);
    await quickSort(arr, start, index - 1, intervalDuration);
    await quickSort(arr, index + 1, end, intervalDuration);
    if (!paused) {
        drawArray(arr); // Visualize after partitioning
    }
}

async function partition(arr, start, end, intervalDuration) {
    const pivotValue = arr[end];
    let pivotIndex = start;

    for (let i = start; i < end; i++) {
        if (arr[i] < pivotValue) {
            [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
            pivotIndex++;
        }
    }

    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
    if (!paused) {
        drawArray(arr); // Visualize after swapping
        await new Promise(resolve => setTimeout(resolve, intervalDuration)); // Delay for visualization
    }
    return pivotIndex;
}

function startQuickSort(arr, intervalDuration) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    paused = false; // Reset paused state

    quickSort(arr, 0, arr.length - 1, intervalDuration).then(() => {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    });
}




submitArrayBtn.addEventListener('click', () => {
    const input = arrayInput.value.trim();
    const placeholder = arrayInput.placeholder.trim();

    if (input === "") {
        array = placeholder.split(',').map(Number);
        arrayInput.value = placeholder;
    } else {
        array = input.split(',').map(Number);
    }

    working_array = array.slice();
    drawArray(working_array);
    startBtn.disabled = false;
});

startBtn.addEventListener('click', () => {
    var speed = speedSelect.value;
    if (speed === "1"){
        intervalDuration = 1000;
    }else if (speed === "2"){
        intervalDuration = 500;
    }
    else if (speed === "3"){
        intervalDuration = 100;
    }

    working_array = array.slice();

    var algo = algorithmSelect.value;
    if (algo === "bubble"){
        bubbleSort(working_array, intervalDuration);
    }else if (algo === "insertion"){
        insertionSort(working_array, intervalDuration);
    }else if (algo === "selection"){
        selectionSort(working_array, intervalDuration);
    }else if (algo === "merge"){
        startMergeSort(working_array, intervalDuration);
    }else if (algo === "quick"){
        startQuickSort(working_array, intervalDuration);
    }
    startBtn.disabled = true;
});

// Event listener for pause/resume button
pauseBtn.addEventListener('click', () => {
    if (!paused) {
        clearInterval(interval); // Pause sorting by clearing the interval
        paused = true;
        pauseBtn.textContent = "Resume"; // Change button text to indicate resume action
    } else {
        // Resume sorting
        paused = false;
        bubbleSort(working_array, intervalDuration); // Restart sorting with current state
        pauseBtn.textContent = "Pause"; // Change button text back to "Pause"
    }
});

resetBtn.addEventListener('click', () => {
    working_array = array.slice();
    drawArray(working_array);
    startBtn.disabled = false;
});

clearBtn.addEventListener('click', () => {
    arrayInput.value = '';
    array = [];
    working_array = [];
    drawArray(array);
    startBtn.disabled = true;
});

// Initial draw with empty array
drawArray(array);

document.addEventListener('DOMContentLoaded', () => {
    const algoSelect = document.getElementById('algoSelect');
    const codeBlock = document.getElementById('codeBlock');
    const codeName = document.getElementById('code_name');
    const visualizerName = document.getElementById('visualizerName');
    const timeComplexity = document.getElementById('timeComp');
    const spaceComplexity = document.getElementById('spaceComp');
    const time = document.getElementById('time');
    const space = document.getElementById('space');

    const algorithmCodes = {
        bubble: `
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", arr)
    bubble_sort(arr)
    print("Sorted array:", arr)
        `,
        insertion: `
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", arr)
    insertion_sort(arr)
    print("Sorted array:", arr)
        `,
        selection: `
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", arr)
    selection_sort(arr)
    print("Sorted array:", arr)
        `,
        quick: `
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", arr)
    arr = quick_sort(arr)
    print("Sorted array:", arr)
        `,
        merge: `
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L = arr[:mid]
        R = arr[mid:]

        merge_sort(L)
        merge_sort(R)

        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1

        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1

        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1

if __name__ == "__main__":
    arr = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", arr)
    merge_sort(arr)
    print("Sorted array:", arr)
        `
    };

    const complexity = {
        bubble: {
            time: "O(n^2)",
            space: "O(1)"
        },
        insertion: {
            time: "O(n^2)",
            space: "O(1)"
        },
        selection: {
            time: "O(n^2)",
            space: "O(1)"
        },
        quick: {
            time: "O(n log n)",
            space: "O(log n) - auxiliary space for recursive stack"
        },
        merge: {
            time: "O(n log n)",
            space: "O(n) - auxiliary space for merging arrays"
        }
    };

    function updateCodeBlock() {
        const selectedAlgo = algoSelect.value;
        codeBlock.textContent = algorithmCodes[selectedAlgo];
        Prism.highlightElement(codeBlock);
        time.textContent = selectedAlgo.charAt(0).toUpperCase() + selectedAlgo.slice(1, selectedAlgo.length)+" Sort Time Complexity";
        space.textContent = selectedAlgo.charAt(0).toUpperCase() + selectedAlgo.slice(1, selectedAlgo.length)+" Sort Space Complexity";
        timeComplexity.textContent = complexity[selectedAlgo].time;
        spaceComplexity.textContent = complexity[selectedAlgo].space;
        codeName.textContent = selectedAlgo.charAt(0).toUpperCase() + selectedAlgo.slice(1, selectedAlgo.length)+" Sort Code";
        visualizerName.textContent = selectedAlgo.charAt(0).toUpperCase() + selectedAlgo.slice(1, selectedAlgo.length)+" Sort Visualizer";
    }

    algoSelect.addEventListener('change', updateCodeBlock);

    // Initialize the code block with the default selection
    updateCodeBlock();
});

