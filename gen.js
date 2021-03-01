const fs = require('fs');

const source = process.argv[2];
const contents = fs.readFileSync(source, { encoding: "utf-8" });
const lines = contents.split("\n").map(line => line.trim());
let words = [];
lines.forEach(line => words = [ ...words, ...line.trim().split(" ")]);
const places = [];
words.forEach(word => word.split("").forEach((char, index) => {
    const thisChar = char.toLowerCase();
    const nextChar = word[index + 1]?.toLowerCase();

    if(!places[index]) {
        places[index] = {};
    }

    if(!places[index][thisChar]) {
        places[index][thisChar] = {};
    }

    if(places[index][thisChar][nextChar]) {
        places[index][thisChar][nextChar]++;
    }
    else {
        places[index][thisChar][nextChar] = 1;
    }
}));

const generate = () => {
    let prev;
    
    while(!places[0][prev]) {
        prev = String.fromCharCode("a".charCodeAt(0) + Math.floor(Math.random() * 26));
    }

    let result = prev;

    for(let i = 1; i < places.length; ++i) {
        const prevObj = places[i-1][prev];
        const sum = Object.values(prevObj).reduce(((sum, curr) => sum + curr), 0);
        const rnd = Math.floor(Math.random() * sum);
        let next;
        const entries = Object.entries(prevObj);
        for( let j = 0, accumulator = 0; j < entries.length; ++j) {
            accumulator += entries[j][1];
            if( accumulator > rnd ) {
                next = entries[j][0];
                break;
            }
        }
        if(next !== "undefined") {
            result += next;
            prev = next;
        }
        else {
            break;
        }
    }
    console.log(result);
};

for(let i = 0; i < 20; ++i) {
    generate();
}