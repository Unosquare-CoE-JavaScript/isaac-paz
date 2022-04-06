# Factories

- Object creation logic becomes too convoluted
- initializer is not descriptive
  - Name is always \_\_init\_\_
  - Cannot overload with same sets of arguments with different names
  - can turn into 'optional parameter hell'
- Wholesale object creation (non-piecewise, unlike Builder) can be outsourced to
  - A separated method (Factory Method)
  - That may exist is a separated class (Factory)
  - Can create hierarchy of factories with Abstract Factory
- Factory: A component responsible solely for the wholesale **(not piecewise)** creation of object
