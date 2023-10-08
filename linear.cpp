#include <iostream>

// Function to perform linear search
int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;  // Element found, return its index
        }
    }
    return -1; // Element not found
}

int main() {
    int arr[] = {12, 34, 45, 67, 89, 123, 456};
    int size = sizeof(arr) / sizeof(arr[0]);
    int target = 89;

    int result = linearSearch(arr, size, target);

    if (result != -1) {
        std::cout << "Element found at index " << result << std::endl;
    } else {
        std::cout << "Element not found in the array." << std::endl;
    }

    return 0;
}
