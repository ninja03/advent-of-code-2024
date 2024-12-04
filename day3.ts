import { TextLineStream } from 'jsr:@std/streams'

const stream = Deno.stdin.readable.pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream());

let x = 0;
let result = 0;
let num = "";
const dec = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
let state = "";

for await (const line of stream) {
  console.log(line);
  for (const c of line) {
    if (state == "" && c == "m") {
      state = "m";
    } else if (state == "m" && c == "u") {
      state = "u";
    } else if (state == "u" && c == "l") {
      state = "l";
    } else if (state == "l" && c == "(") {
      state = "(";
    } else if (state == "(" && dec.includes(c)) {
      state = "X";
      num = c;
    } else if (state == "X" && dec.includes(c)) {
      num += c;
    } else if (state == "X" && c == ",") {
      x = Number(num);
      state = ",";
    } else if (state == "," && dec.includes(c)) {
      state = "Y";
      num = c;
    } else if (state == "Y" && dec.includes(c)) {
      num += c;
    } else if (state == "Y" && c == ")") {
      const y = Number(num);
      result += x * y;
      state = "";
    } else {
      state = "";
    }
  }
}

console.log(result);
