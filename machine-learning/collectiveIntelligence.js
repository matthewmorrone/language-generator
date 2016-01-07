var self = this

// recommendations

exports.critics=
{
'Lisa Rose': {'Lady in the Water': 2.5, 'Snakes on a Plane': 3.5,'Just My Luck': 3.0, 'Superman Returns': 3.5, 'You, Me and Dupree': 2.5, 'The Night Listener': 3.0},
'Gene Seymour': {'Lady in the Water': 3.0, 'Snakes on a Plane': 3.5, 'Just My Luck': 1.5, 'Superman Returns': 5.0, 'The Night Listener': 3.0, 'You, Me and Dupree': 3.5},
'Michael Phillips': {'Lady in the Water': 2.5, 'Snakes on a Plane': 3.0,'Superman Returns': 3.5, 'The Night Listener': 4.0},
'Claudia Puig': {'Snakes on a Plane': 3.5, 'Just My Luck': 3.0, 'The Night Listener': 4.5, 'Superman Returns': 4.0, 'You, Me and Dupree': 2.5},
'Mick LaSalle': {'Lady in the Water': 3.0, 'Snakes on a Plane': 4.0, 'Just My Luck': 2.0, 'Superman Returns': 3.0, 'The Night Listener': 3.0,'You, Me and Dupree': 2.0},
'Jack Matthews': {'Lady in the Water': 3.0, 'Snakes on a Plane': 4.0,'The Night Listener': 3.0, 'Superman Returns': 5.0, 'You, Me and Dupree': 3.5},
'Toby': {'Snakes on a Plane':4.5,'You, Me and Dupree':1.0,'Superman Returns':4.0}
}

self.euclidean_distance = function(prefs, person1, person2)
{
	var shared_items = []
	var sum_of_squares = 0.0
	for(item in prefs[person1])
	{
		if(item in prefs[person2])
		{
			shared_items.push(item)
		}
	}

	if(shared_items.length == 0) {return 0;}

	for(item in prefs[person1])
	{
		if(item in prefs[person2])
		{
			sum_of_squares += Math.pow(prefs[person1][item]-prefs[person2][item], 2)
		}
	}

	return 1/(1+sum_of_squares)
}

self.pearsons_distance = function(prefs, person1, person2)
{
	var shared_items = []
	var sum_of_squares = 0.0
	for(item in prefs[person1])
	{
		if(item in prefs[person2])
		{
			shared_items.push(item)
		}
	}

	if(shared_items.length == 0)
	{
		return 0
	}
	var n    = shared_items.length
	var sum1 = 0.0
	var sum2 = 0.0
	var sumsq1 = 0.0
	var sumsq2 = 0.0
	var sumP = 0.0
	for(var i = 0; i < shared_items.length; i++)
	{
		var item = shared_items[i]
		sum1 += prefs[person1][item]
		sumsq1 += Math.pow(prefs[person1][item], 2)

		sum2 += prefs[person2][item]
		sumsq2 += Math.pow(prefs[person2][item], 2)

		sumP += prefs[person1][item] * prefs[person2][item]
	}
	var num = parseFloat(sumP-(sum1*sum2)/n)
	var den = Math.sqrt((sumsq1-Math.pow(sum1, 2)/n) * (sumsq2-Math.pow(sum2, 2)/n))
	if(den == 0){ return 0; }
	var r = parseFloat(num/den)
	return r
}

self.invertPrefs = function(prefs)
{
	var result = {}
	for(person in prefs)
	{
		for(item in prefs[person])
		{
			if(!result[item]) result[item] = {}
			result[item][person] = prefs[person][item]
		}
	}
	return result
}

self.topMatches = function(prefs, _person)
{
	var scores = []

	for(person in prefs)
	{
		if(person === _person) {continue}

		//var r = self.euclidean_distance(prefs, person, _person)
		var r = self.pearsons_distance(prefs, person, _person)
		scores.push([r, person])

	}

	scores.sort()
	return scores.reverse()
}

self.readMovieLense = function(movies, ratings)
{
	var movies = {}
	fs.readFile(movies,'ascii', function(er, data)
	{
		var lines = data.split("\n")
		for(var i=0; i< lines.length;i++)
		{
			var line = lines[i]
			var parts = line.split("::")
			var id = parts[0]
			var title = parts[1]
			var genre = parts[2]

			movies[id] = title
			console.log(id + "| " + title)
		}
	})

	fs.readFile(ratings,'ascii', function(er, data)
	{
		var lines = data.split("\n")
		for(var i = 0; i < lines.length; i++)
		{
			var line = lines[i];
			console.log(line)
		}
	})


}
self.calculateSimilarItems = function(prefs, limit)
{
	var result = {}
	var itemPrefs = invertPrefs(prefs)
	var count = 0

	for(item in itemPrefs)
	{
		count++
		if(count % 100)
		{
			console.log("At: " + count)
		}
	}
}

self.getRecommendations = function(prefs, _person)
{
	var totals = {}
	var simSums = {}
	for(person in prefs)
	{
		if(_person == person) {continue}
		//var sim = self.pearsons_distance(prefs, person, _person)
		var sim = self.euclidean_distance(prefs, person, _person)
		if(sim <= 0) {continue}

		for(item in prefs[person])
		{
			if(!(item in prefs[_person]) || prefs[_person][item] == 0)
			{
				totals[item] = 0.0
				totals[item] += prefs[person][item]*sim
				simSums[item] = 0.0
				simSums[item] += sim
			}
		}
	}

	var rankings = []
	for(item in totals)
	{
		var total = totals[item]
		rankings.push([(total)/simSums[item], item])
	}

	rankings.sort()
	return rankings.reverse()
}

console.log("Euclidean Distance: " + self.euclidean_distance(self.critics, 'Lisa Rose', 'Gene Seymour'))
console.log("Pearsons Distance: " + self.pearsons_distance(self.critics, 'Lisa Rose', 'Gene Seymour'))
console.log(JSON.stringify(self.invertPrefs(self.critics), null, 3))
console.log(JSON.stringify(self.topMatches(self.critics, "Toby")))
console.log(JSON.stringify(self.getRecommendations(self.critics, "Toby")))
console.log(JSON.stringify(self.topMatches(self.invertPrefs(self.critics), "Superman Returns"))); // movies similar to this one
console.log(JSON.stringify(self.getRecommendations(self.invertPrefs(self.critics), "Just My Luck"))); // critics who like movies like this
// exports.readMovieLense("/Users/scott/Downloads/ml-10M100K/movies.dat", "/Users/scott/Downloads/ml-10M100K/ratings.dat");
