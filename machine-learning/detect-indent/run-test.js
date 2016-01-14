var fs = require("fs"),
    path = require("path");

var algos = {
  gcd: require("./algos/gcd"),
  compare_lines: require("./algos/comparelines"),
  min: require("./algos/min"),
  neuralnet: require("./algos/neuralnet")
};

var dir = "files";
var langs = ["HTML", "CSS", "JavaScript", "Ruby", "Python"];

printAlgoResults();
printStats();

function printAlgoResults() {
  var results = getAlgoResults();

  var totals = {};
  for (var type in results) {
    console.log(type + ":");
    for (var algo in results[type]) {
      var count = results[type][algo];
      console.log(" ", algo.slice(0, 3) + ":", count);
      totals[algo] = (totals[algo] || 0) + count;
    }
  }
}

function getAlgoResults() {
  var allResults = {};
  var algoResults = {};
  var total = 0;
  for (var i in langs) {
    var counts = {};
    var lang = langs[i];
    var files = fs.readdirSync(path.join(dir, lang));
    total += files.length;

    for (var j in files) {
      var file = path.join(dir, lang, files[j]);
      var hits = detectInFile(file);

      for (var name in algos) {
        if (hits[name] == true) {
          counts[name] = (counts[name] || 0) + 1;
          algoResults[name] = (algoResults[name] || 0) + 1;
        }
      }
    }
    console.log("counts: ", counts, "total: ", files.length);
    for (var name in counts) {
      counts[name] /= files.length;
    }
    allResults[lang] = counts;
  }

  for (var name in algos) {
    algoResults[name] /= total;
  }

  return {
    byLanguage: allResults,
    overall: algoResults
  };
}

function detectInFile(file) {
  var contents = fs.readFileSync(file, { encoding: "utf-8"});
  var lines = contents.split("\n");

  console.log("detecting in ", file);

  var expected = getIndent(file);
  var results = {};
  for (var name in algos) {
    var algo = algos[name];
    var actual = algo(lines);
    results[name] = (actual == expected);
    if (actual != expected) {
      console.log(" algo:", name.slice(0,3) , "actual:", actual, "expected:", expected);
    }
  }
  return results;
}

function printStats() {
  var stats = getStats();
  for (var lang in stats) {
    console.log(lang);
    var count = stats[lang];
    for (var width in count) {
      console.log(" " + width + ": " + count[width]);
    }
  }
}

function getStats() {
  var counts = {};
  for (var i in langs) {
    var lang = langs[i];
    counts[lang] = {};

    var files = fs.readdirSync(path.join(dir, lang));
    for (var j in files) {
      var indent = getIndent(files[j]);
      counts[lang][indent] = (counts[lang][indent] || 0) + 1;
    }
  }
  return counts;
}

function getIndent(filename) {
  if (/-tabs\./.test(filename)) {
    return "tabs";
  }

  var matches = filename.match(/-(\d)\./);
  if (!matches) {
    return 0;
  }
  var spaces = parseInt(matches[1] || "0");
  return spaces || null;
}