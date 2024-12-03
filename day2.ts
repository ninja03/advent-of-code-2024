import { TextLineStream } from 'jsr:@std/streams'

let safe = 0; // 安全の数
let prev = 0; // 前の数値
let sign = 0; // 増加か減少か

const stream = Deno.stdin.readable.pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream());
LOOP: for await (const line of stream) {
  if (line == "") continue;
  const cols = line.split(" ");

  for (let i = 0; i < cols.length; i++) {
    const num = Number(cols[i]);
    if (i === 1) {
      // 2番目の数字で増加か減少の行か決まる
      sign = num > prev ? 1 : -1;
    }
    if (i >= 1) {
      // 変化しないなら危険
      if (num === prev) continue LOOP;
      // 変化幅が3を超えるので危険
      if (Math.abs(num - prev) > 3) continue LOOP;
    }
    if (i >= 2) {
      // 変化しないなら危険
      if (num === prev) continue LOOP;
      // 増加の行なのに減少なら危険
      if (sign === 1 && num < prev) continue LOOP;
      // 減少の行なのに増加なら危険
      if (sign === -1 && num > prev) continue LOOP;
    }
    prev = num;
  }
  safe++;
}

console.log(safe);
