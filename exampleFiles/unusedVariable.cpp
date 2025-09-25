#include <iostream>
#include <vector>

int main() {
    int usedVar = 42;
    int unusedVar = 0;

    std::vector<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        std::cout << "Number: " << num << std::endl;
    }

    std::cout << "Used variable value: " << usedVar << std::endl;

    return 0;
}
