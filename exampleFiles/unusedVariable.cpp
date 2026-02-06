#include <iostream>
#include <vector>
#include "usedHeader.h"

#include "test.h"


int main() {
    int usedVar = 42;
    int unusedVar = 0;

    std::vector<int> numbers = {1, 2, 3, 4, 5};

    constexpr int cUsedConstantFromHeader = USED_CONSTANT;

    for (int num : numbers) {
        std::cout << "Number: " << num << std::endl;
    }

    std::cout << "Used variable value: " << usedVar << std::endl;

    return 0;
}
