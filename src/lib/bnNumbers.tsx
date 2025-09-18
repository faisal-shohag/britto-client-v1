const bnNumbers = {
  1: "১",
  2: "২",
  3: "৩",
  4: "৪",
  5: "৫",
  6: "৬",
  7: "৭",
  8: "৮",
  9: "৯",
  0: "০",
};

export const bnNumber = (bnNum) => {
  // Convert the input number to a string to allow iteration over each digit
  const numStr = bnNum.toString();

  // Map each digit in the string to its corresponding Bengali numeral
  let bnStr = numStr
    .split("") // Split the number into individual digits
    .map((digit) => bnNumbers[digit] || digit) // Convert each digit to Bengali, keep non-numeric as is
    .join(""); // Join the converted digits back into a string

  // Add leading '০' if the number is less than 10
  if (parseInt(bnNum) < 10) {
    bnStr = "০" + bnStr;
  }

  return bnStr;
};