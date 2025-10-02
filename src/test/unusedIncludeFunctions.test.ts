import * as assert from 'assert';
import { extractCppSymbols } from '../unusedIncludeChecker/unusedIncludeFunctions';


suite('Unused Include Tests', () => {
    test('extractCppSymbols', () => {
        const code =
            `
            #ifndef TEST_SYMBOLS_H
            #define TEST_SYMBOLS_H

            // --- Macros ---
            #define PI 3.14159
            #define SQUARE(x) ((x) * (x))

            // --- Includes ---
            #include <iostream>
            #include <string>

            // --- Namespace ---
            namespace MyNamespace {

            // --- Enums ---
            enum Color {
                Red,
                Green,
                Blue
            };

            enum class ErrorCode : int {
                None = 0,
                NotFound = 1,
                Invalid = 2
            };

            // --- Struct ---
            struct Point {
                int x;
                int y;
                void move(int dx, int dy);
            };

            // --- Class ---
            class Shape {
            public:
                Shape();
                virtual ~Shape();

                virtual double area() const = 0;
                static int instanceCount;

            protected:
                std::string name;
            };

            // --- Typedef / using ---
            typedef unsigned int uint32;
            using String = std::string;

            // --- Functions ---
            inline void printHello() {
                std::cout << "Hello" << std::endl;
            }

            int add(int a, int b);

            } // namespace MyNamespace

            // --- Global variables ---
            extern int g_counter;

            // --- Global function ---
            void globalFunction();

            // --- Templates ---
            template<typename T>
            class Container {
            public:
                void add(const T& item);
                T get(int index) const;
            };

            // --- Template function ---
            template<typename T>
            T maximum(T a, T b) {
                return (a > b) ? a : c;
            }

            #endif // TEST_SYMBOLS_H
            `
            ;

        const result = Array.from(extractCppSymbols(code));

        assert.deepStrictEqual(result.sort(), [
            "TEST_SYMBOLS_H",
            "PI",
            "SQUARE",
            "MyNamespace",
            "Color",
            "ErrorCode",
            "Point",
            "Shape",
            "instanceCount",
            "name",
            "x",
            "y",
            "move",
            "uint32",
            "String",
            "printHello",
            "g_counter",
            "globalFunction",
            "Container",
            "add",
            "get",
            "maximum"
        ].sort()
        );
    });
});
