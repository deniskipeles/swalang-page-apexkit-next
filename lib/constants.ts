import { FileSystemNode } from './types';

export const SWALANG_API_URL = process.env.NEXT_PUBLIC_SWALANG_API_URL || 'http://localhost:8080';
export const APEX_HUB_TOKEN = 'swalang_apexkit_session';

export const initialFileSystem: FileSystemNode[] = [
  {
    id: '12',
    name: 'main.sw',
    type: 'file',
    content: '# Swalang Playground - Standard Entrypoint\nprint("Habari, Dunia! Karibu kwenye Swalang Sandbox.")\n\n# Interactive Input Demo\njina = input("Tafadhali andika jina lako: ")\nprint(f"Hujambo, {jina}! Umefanikiwa kuendesha Swalang.")\n'
  },
  {
    id: '13',
    name: 'oop_demo.sw',
    type: 'file',
    content: '# Swalang Object-Oriented Programming (OOP) Demo\nclass Mshiriki:\n    def __init__(self, jina, jukumu):\n        self.jina = jina\n        self.jukumu = jukumu\n\n    def salimia(self):\n        return f"Hujambo! Mimi ni {self.jina}, nina jukumu la {self.jukumu}."\n\n# Instantiating and executing class methods\nmsanidi = Mshiriki("Amani", "Kujenga Mifumo")\nprint(msanidi.salimia())\n'
  },
  {
    id: '14',
    name: 'factorial.sw',
    type: 'file',
    content: '# Swalang Math: Recursive Factorial\ndef factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)\n\nfor i in range(1, 7):\n    print(f"Factorial ya {i} ni: {factorial(i)}")\n'
  },
  {
    id: '15',
    name: 'fibonacci.sw',
    type: 'file',
    content: '# Swalang Algorithms: Fibonacci Series\ndef fibonacci(limit):\n    a = 0\n    b = 1\n    print("Fibonacci Series:")\n    while a < limit:\n        print(a)\n        temp = a\n        a = b\n        b = temp + b\n\nfibonacci(100)\n'
  }
];