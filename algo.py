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
