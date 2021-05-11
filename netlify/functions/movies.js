// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined || year == `` || genre == ``) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please give a year and genre.` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }
    // create for loop
    for (let i=0; i < moviesFromCsv.length; i++) {
      
      // create variable from CSV
      let movie = moviesFromCsv[i]

      // conditional about start years and genre
      if (movie.startYear == year && movie.genres.includes(genre)){
        let movieDetails = {
          title: movie.primaryTitle,
          year: movie.startYear,
          genres: movie.genres,
        }

        // conditional about empty results
        if (movie.genres != `\\N` && movie.runtimeMinutes != `\\N`) {
          returnValue.movies.push(movieDetails)
        }
        console.log(movieDetails)
      }
      returnValue.numResults = returnValue.movies.length
    } // end for loop

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}