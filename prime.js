const a = 8;

let count=0;
for (i = 2; i < a; i++) {
    if (a % i == 0) {
        count+=1;
        console.log(count);
        break;
    }
}
if (count === 1) {
    alert("not prime number")
} else {
    alert("prime number")
}