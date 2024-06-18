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
def bubblesort(arr):
    """
    Last i elements are sorted.
    
    For each iteration, 
    compare each element with the next element, 
    swap if the current element is greater 
    than the next element.
    """
    n = len(arr)
    for i in range(n-1):
        # loop for n-1 times 
        # (since the last element will be in 
        # place after each iteration, everything 
        # will be in-place after n-1 iterations)
        swapped = False
        # if nothing is swapped in an iteration, 
        # then the array is already sorted, break early
        for j in range(n-i-1):
            # for each iteration, skip the last i 
            # elements, it is already in place
            if arr[j] > arr[j+1]:
                # swap if the current element is 
                # greater than the next element
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr
        `,
        insertion: `
def insertionsort(arr):
    """
    First i elements are sorted.
    
    For each iteration,
    - compare the current element with the 
    elements before it,
    - move the elements that are greater than 
    the current element to the right,
    - insert the current element to the right place.
    """
    n = len(arr)
    for i in range(1, n):
        # for elements arr[0...i-1], 
        # if it is greater than arr[i], 
        # move it to the right
        key = arr[i]
        
        j = i-1
        
        while j>=0 and arr[j]>key:
            arr[j+1] = arr[j]
            j -= 1
            
        arr[j+1] = key
        
    return arr
        `,
        selection: `
def selectionsort(arr):
    """
    First i elements are sorted.
    
    For each iteration,
    - find the minimum element in 
    the remaining unsorted array,
    - swap the found minimum element 
    with the current element.
    """
    n = len(arr)
    for i in range(n):
        # find min element in remaining 
        # unsorted array
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
                
        # swap the found min element with 
        # the current element
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        
    return arr
        `,
        quick: `
def quicksort(arr):
    """
    The pivot is always in the right place 
    after each iteration.
    
    Divide and conquer.
    Sort is in divide process.
    
    Pick a pivot element,
    partition the array into three parts:
    - elements less than the pivot
    - elements equal to the pivot
    - elements greater than the pivot
    Recursively sort the left and right parts.
    Merge the sorted parts.
    """
    pivot = arr[0]
    left = []
    middle = [pivot]
    right = []
    
    for i in range(1, len(arr)):
        if arr[i] < pivot:
            left.append(arr[i])
        elif arr[i] == pivot:
            middle.append(arr[i])
        else:
            right.append(arr[i])
            
    if len(left) > 1:
        left = quicksort(left)
    if len(right) > 1:
        right = quicksort(right)
        
    return left + middle + right
        `,
        merge: `
def mergesort(arr):
    """
    Divide and conquer.
    Sort is in merge process.
    
    - Split the array into two halves 
    until each half has only one element.
    - then merge the two halves by sorting them.
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = mergesort(arr[:mid])
    right = mergesort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            res.append(left[i])
            i += 1
        else:
            res.append(right[j])
            j += 1
            
    res += left[i:]
    res += right[j:]
    
    return res 
    
    
print(mergesort([64, 34, 25, 12, 22, 11, 90]))
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

