class HotDrink {
  consume() {}
}

class Tea extends HotDrink {
  consume() {
    console.log(`this tea is nice with lemon!`);
  }
}

class Coffee extends HotDrink {
  consume() {
    console.log(`this coffee is delicious!`);
  }
}

class HotDrinkFactory {}
