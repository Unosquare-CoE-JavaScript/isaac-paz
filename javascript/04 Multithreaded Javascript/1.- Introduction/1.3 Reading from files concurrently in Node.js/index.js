const fs = require("fs/promises");

async function getNum(filename) {
  return parseInt(await fs.readFile(filename, "utf8"), 10);
}

async function main() {
  try {
    const numberPromises = [1, 2, 3].map((i) => getNum(`${i}.txt`));
    const numbers = await Promise.all(numberPromises);
    console.log(numbers[0] + numbers[1] + numbers[2]);
  } catch (err) {
    console.error("Something went wrong:");
    console.error(err);
  }
}

main();
