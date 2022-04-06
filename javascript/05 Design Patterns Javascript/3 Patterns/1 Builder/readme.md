# 1 Builder (Creational)

## Overview

- Definition: **When piecewise object construction is complicated, provide an APY for doing succinctly**
- Some objects are simple and can be created in a single initializer call
- Other objects require a lot of ceremony to create
- Having an object with 10 initializer arguments is not productive
- Instead, opt for piecewise construction
- Builder provides an API for construction an object step-by-step
- It is just a separate component that helps you to build another object

## Summary

- A builder is a separated component for building an object
- Can either give builder an initializer or return it via a static function
- To make builder fluent, return self(this)
- Different facets of an object can be build with different builder working in tandem via a base class
